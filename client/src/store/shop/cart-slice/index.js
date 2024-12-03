import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Middleware for syncing guest cart with localStorage
const syncGuestCartToLocalStorage = (cartItems) => {
  try {
    localStorage.setItem("guestCart", JSON.stringify(cartItems));
  } catch (e) {
    console.error("Error syncing guest cart to localStorage", e);
  }
};

const initialState = {
  cartItems: (() => {
    try {
      const savedCart = localStorage.getItem("guestCart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error("Error parsing guestCart from localStorage", e);
      return [];
    }
  })(),
  isLoading: false,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, flavor = "default", quantity }, { rejectWithValue }) => {
    try {
      // Determine if the user is logged in or a guest
      const guestId = localStorage.getItem("guestId"); // Assuming you store guestId in localStorage

      // Ensure userId or guestId is passed
      if (!userId && !guestId) {
        throw new Error("No userId or guestId available");
      }

      // Send the appropriate userId or guestId
      const response = await axios.post(
        "http://localhost:5000/api/shop/cart/add",
        {
          userId: userId || null,  // If userId exists, send it, otherwise null
          guestId: guestId || null, // If guestId exists, send it, otherwise null
          productId,
          quantity,
          flavor,
        }
      );

      // Handle guest cart syncing if no userId (if you're handling it for guest)
      if (!userId) {
        const updatedCart = response.data.data.map((item) => ({
          ...item,
          flavor: item.flavor || flavor,
        }));
        syncGuestCartToLocalStorage(updatedCart);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error adding to cart");
    }
  }
);


export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, { rejectWithValue }) => {
    if (!userId) {
      return rejectWithValue("User ID is missing");
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/cart/get/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching cart");
    }
  }
);

export const fetchGuestCartItems = createAsyncThunk(
  "cart/fetchGuestCartItems",
  async () => {
    try {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      return guestCart;
    } catch (e) {
      console.error("Error fetching guest cart from localStorage", e);
      return [];
    }
  } 
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId, flavor }, { rejectWithValue }) => {
    try {
      let updatedCart;
      if (userId) {
        const response = await axios.delete(
          `http://localhost:5000/api/shop/cart/${userId}/${productId}/${flavor}`
        );
        updatedCart = response.data.data;
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        updatedCart = guestCart.filter(
          (item) => item.productId !== productId || item.flavor !== flavor
        );
        syncGuestCartToLocalStorage(updatedCart);
      }
      return updatedCart;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting item");
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity, flavor }, { rejectWithValue }) => {
    try {
      if (userId) {
        const response = await axios.put(
          "http://localhost:5000/api/shop/cart/update-cart",
          { userId, productId, quantity, flavor }
        );
        return response.data;
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const updatedCart = guestCart.map((item) =>
          item.productId === productId && item.flavor === flavor
            ? { ...item, quantity }
            : item
        );
        syncGuestCartToLocalStorage(updatedCart);
        return { data: updatedCart };
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating quantity");
    }
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("guestCart");
    },
    resetGuestCart: (state) => {
      state.cartItems = [];
      localStorage.setItem("guestCart", JSON.stringify([]));
    },
    setCartItems: (state, action) => {
      state.cartItems = action.payload.items; // Update cart items state
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
        if (!action.meta.arg.userId) {
          syncGuestCartToLocalStorage(action.payload.data);
        }
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchGuestCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGuestCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchGuestCartItems.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearCart, resetGuestCart } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
