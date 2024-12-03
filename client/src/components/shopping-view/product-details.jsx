import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import PropTypes from "prop-types";



function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [flavor, setFlavor] = useState(productDetails?.flavor?.[0] || "");

  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { toast } = useToast();
  function handleFlavorChange(flavor) {
    setFlavor(flavor);
  }
  


 

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    const getCartItems = cartItems.items || [];
    
    // If no flavor is selected, show an error
    if (!flavor) {
      toast({ title: "Please select a flavor before adding to cart", variant: "destructive" });
      return;
    }
  
    const indexOfCurrentItem = getCartItems.findIndex(
      (item) => item.productId === getCurrentProductId && item.flavor === flavor
    );
  
    if (indexOfCurrentItem > -1) {
      const getQuantity = getCartItems[indexOfCurrentItem].quantity;
      if (getQuantity + 1 > getTotalStock) {
        toast({
          title: `Only ${getTotalStock - getQuantity} quantity can be added for this item`,
          variant: "destructive",
        });
        return;
      }
    }
  
    if (user?.id) {
      // For logged-in users
      dispatch(
        addToCart({
          userId: user.id,
          productId: getCurrentProductId,
          quantity: 1,
          flavor: flavor,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user.id));  // Fetch updated cart items after successful addition
          toast({ title: "Product added to cart" });
        } else {
          toast({ title: "Failed to add product to cart", variant: "destructive" });
        }
      }).catch(() => {
        toast({ title: "Error adding product to cart", variant: "destructive" });
      });
    } else {
      // For guest users
      const guestCartItems = JSON.parse(localStorage.getItem("guestCart")) || [];
      const guestItemIndex = guestCartItems.findIndex(
        (item) => item.productId === getCurrentProductId && item.flavor === flavor
      );
  
      if (guestItemIndex > -1) {
        // Update the quantity if the item already exists
        guestCartItems[guestItemIndex].quantity += 1;
      } else {
        // Add new product to guest cart
        guestCartItems.push({
          productId: getCurrentProductId,
          quantity: 1,
          flavor: flavor,
        });
      }
  
      localStorage.setItem("guestCart", JSON.stringify(guestCartItems));
  
      // Fetch updated cart from localStorage before dispatching Redux
      const updatedGuestCartItems = JSON.parse(localStorage.getItem("guestCart")) || [];
  
      // Synchronize Redux state with updated localStorage
      dispatch(fetchCartItems()); // Assuming this function updates the Redux state from localStorage data
  
      toast({ title: "Product added to cart" });
  
      // Optionally, verify cart contents
      if (updatedGuestCartItems.some(item => item.productId === getCurrentProductId && item.flavor === flavor)) {
        console.log("Product successfully added to guest cart:", updatedGuestCartItems);
      } else {
        console.error("Failed to add product to guest cart:", updatedGuestCartItems);
      }
    }
  }
  
  
  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
    setFlavor("");
  }
  function handleAddReview() {
    // Check if the user is logged in
    if (!user?.id) {
      toast({ title: " You must be logged in to add a review." });
      return; 
    }
  
    // Check if the product was delivered
    if (!productDetails?.isDelivered) {
      toast({ title: "Error: Product not delivered. Unable to add review." });
      return; 
    }
  
    // Proceed to add review if the user is logged in and product was delivered
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user.id,
        userName: user.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({ title: "Review added successfully!" });
      } else {
        // Handle error case from addReview
        toast({ title: "Error adding review." });
      }
    });
  }
  
  
  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  useEffect(() => {
    console.log("Selected Flavor:", flavor);
    console.log("Product Details:", productDetails);
  }, [flavor, productDetails]);
  

  const averageReview =
    reviews?.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

      console.log('productDetails: ', productDetails)
  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent
  className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]"
  style={{
    backgroundImage: "url('https://res.cloudinary.com/daynaexaz/image/upload/v1728893288/blue-smokebg_cegir0.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center"
  }}
>

        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
          <p className="text-muted-foreground text-1xl mb-5 mt-4 text-white ">
            {productDetails?.description}
          </p>
        </div>
        <div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">{productDetails?.title}</h1>
          </div>
          <div className="flex items-center justify-between text-white">
            {productDetails?.salePrice > 0 && (
              <p className="text-2xl font-bold text-muted-foreground text-white">
                R{productDetails?.salePrice}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div>
            <span className="text-muted-foreground">
              ({averageReview.toFixed(2)})
            </span>
          </div>
          <div className="mt-4">
  
          <select
  value={flavor || ""}
  onChange={(e) => handleFlavorChange(e.target.value)}
  className="mt-2 border rounded p-2"
  disabled={!productDetails?.flavor || productDetails.flavor.length === 0} // Disable if no flavors
>
  {productDetails?.flavor && productDetails.flavor.length > 0 ? (
    <>
      <option value="" disabled>
        Select a flavor
      </option>
      {productDetails.flavor.map((flavorOption, index) => (
        <option key={index} value={flavorOption}>
          {flavorOption}
        </option>
      ))}
    </>
  ) : (
    <option value="">No flavors available</option>
  )}
</select>


</div>

          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
              className="w-full text-white bg-blue-500 hover:bg-green-500 cursor-pointer"
              style={{
                backgroundColor: flavor ? '#3b82f6' : '#ccc',
                transition: 'background-color 0.3s ease',
              }}
              onClick={() =>
                handleAddToCart(productDetails?._id, productDetails?.totalStock)
              }
              disabled={!flavor}
            >
              {flavor ? "Add to Cart" : "Please Select a Flavor"}
            </Button>
            
            

            )}
          </div>
          <h1 className="text-white">Reviews are not available until the product is delivered.</h1>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4 text-white">Reviews</h2>
           
            <div className="grid gap-6">
              {reviews?.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div className="flex gap-4" key={reviewItem.id || reviewItem._id}>
                    <Avatar className="w-10 h-10 border">
  {reviewItem?.userProfilePicture ? (
    <img src={reviewItem.userProfilePicture} alt={`${reviewItem.userName}'s profile`} className="w-full h-full object-cover" />
  ) : (
    <AvatarFallback>
      {reviewItem?.userName[0].toUpperCase()}
    </AvatarFallback>
  )}
</Avatar>

                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1 className="text-white">No Reviews</h1>
              )}
            </div>
            <div className="mt-10 flex-col flex gap-2">
              <Label  className="text-white">Write a review</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
                placeholder="Write a review..."
              />
             <Button
  className="bg-blue-500 text-white cursor-pointer hover:bg-green-500"
  onClick={handleAddReview}
  disabled={reviewMsg.trim() === ""}
>
  Submit
</Button>

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

ProductDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  productDetails: PropTypes.shape({
    _id: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    salePrice: PropTypes.number,
    price: PropTypes.number,
    totalStock: PropTypes.number,
    flavor: PropTypes.arrayOf(PropTypes.string), 
    isDelivered: PropTypes.bool,
  }).isRequired,
};

ProductDetailsDialog.defaultProps = {
  productDetails: {
    salePrice: 0,
    totalStock: 0,
  },
};

export default ProductDetailsDialog;