import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CircularProgress } from "@mui/material";
import axios from "axios";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [isPaymentStart, setIsPaymentStart] = useState(false);

  const dispatch = useDispatch();
  const { toast } = useToast();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        ) + shippingCost
      : 0;

  async function handleCheckout() {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (!currentSelectedAddress) {
      toast({
        title: "Please select an address to proceed.",
        variant: "destructive",
      });
      return;
    }
    if (shippingCost === 0) {
      toast({
        title: "Please select a shipping method.",
        variant: "destructive",
      });
      return;
    }

    setIsPaymentStart(true);

    const orderData = {
      userId: user?.id,
      cartItems: cartItems.items.map((item) => ({
        productId: item?.productId,
        title: item?.title,
        image: item?.image,
        price: item?.salePrice > 0 ? item?.salePrice : item?.price,
        quantity: item?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        postcode: currentSelectedAddress?.postcode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
        email: user?.email,
      },
      orderStatus: "pending",
      paymentMethod: "invoice",
      shippingCost: shippingCost,
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    };

    try {
      const response = await axios.post(
        `http://localhost:5000/api/create-order`,
        orderData
      );

      setIsPaymentStart(false);

      if (response.data.success) {
        toast({
          title: "Order placed! Invoice sent via email.",
          variant: "success",
          style: {
            backgroundColor: "#28a745",
            color: "white",
          },
        });
      } else {
        toast({
          title: "Order failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setIsPaymentStart(false);
      toast({
        title: "An error occurred. Please try again.",
        variant: "destructive",
      });
      console.error("Error in handleCheckout:", error.response || error.message || error);
    }
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/daynaexaz/image/upload/v1728893288/blue-smokebg_cegir0.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent cartItem={item} />
              ))
            : null}

          {/* Shipping Options */}
          <div className="flex flex-col gap-2 mb-4">
            <label className="flex items-center text-white">
              <input
                type="radio"
                value="130"
                checked={shippingCost === 140}
                onChange={() => setShippingCost(140)}
                className="mr-2"
              />
              Overnight Courier <span className="ml-2 font-bold">R140</span>
            </label>
            <label className="flex items-center text-white">
              <input
                type="radio"
                value="90"
                checked={shippingCost === 100}
                onChange={() => setShippingCost(100)}
                className="mr-2"
              />
              Economy Road <span className="ml-2 font-bold">R100</span>
            </label>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold text-white">Total</span>
              <span className="font-bold text-white">R{totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button
              onClick={handleCheckout}
              disabled={isPaymentStart || shippingCost === 0}
              className="w-full button-white-border"
            >
              {isPaymentStart ? (
                <CircularProgress color="success" size={24} />
              ) : (
                "Checkout & Generate Invoice"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
