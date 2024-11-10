import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { CircularProgress } from "@mui/material";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(currentSelectedAddress, "cartItems");

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
        )
      : 0;

      function handleInitiatePaypalPayment() {
        if (cartItems.length === 0) {
          toast({
            title: "Your cart is empty. Please add items to proceed",
            variant: "destructive",
          });
      
          return;
        }
        if (currentSelectedAddress === null) {
          toast({
            title: "Please select one address to proceed.",
            variant: "destructive",
          });
      
          return;
        }
      
        // Set loading state immediately after clicking the button
        setIsPaymemntStart(true);
      
        const orderData = {
          userId: user?.id,
          cartId: cartItems?._id,
          cartItems: cartItems.items.map((singleCartItem) => ({
            productId: singleCartItem?.productId,
            title: singleCartItem?.title,
            image: singleCartItem?.image,
            price:
              singleCartItem?.salePrice > 0
                ? singleCartItem?.salePrice
                : singleCartItem?.price,
            quantity: singleCartItem?.quantity,
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
          paymentMethod: "paypal",
          paymentStatus: "pending",
          totalAmount: totalCartAmount,
          orderDate: new Date(),
          orderUpdateDate: new Date(),
          paymentId: "",
          payerId: "",
        };
      
        // Dispatch async action
        dispatch(createNewOrder(orderData)).then((data) => {
          // Handle response and stop loader
          if (data?.payload?.success) {
            setIsPaymemntStart(false); 
          } else {
            setIsPaymemntStart(false); 
            toast({
              title: "Payment initiation failed. Please try again.",
              variant: "destructive",
            });
          }
        }).catch((error) => {
          // Handle errors and stop loader
          setIsPaymemntStart(false);
          toast({
            title: "An error occurred. Please try again.",
            variant: "destructive",
          });
        });
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
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold text-white">Total</span>
              <span className="font-bold text-white">R{totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
          <Button
  onClick={handleInitiatePaypalPayment}
  className="w-full button-white-border"
  disabled={isPaymentStart} 
>
  {isPaymentStart ? (
    <CircularProgress color="success" size={24} />
  ) : (
    "Checkout with Paypal"
  )}
</Button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
