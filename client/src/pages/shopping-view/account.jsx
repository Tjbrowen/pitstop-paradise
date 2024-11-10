import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import ShoppingHeader from "@/components/shopping-view/header";

function ShoppingAccount() {
  return (
    <div
    className="flex flex-col"
    style={{
      backgroundImage: "url('https://res.cloudinary.com/daynaexaz/image/upload/v1728893288/blue-smokebg_cegir0.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}
  >
       <ShoppingHeader /> 
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={accImg}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-lg border shadow-sm">
          <Tabs defaultValue="orders">
          <TabsList className="bg-transparent"> 
  <TabsTrigger value="orders" className="bg-[#322fdf] text-white"> 
    Orders
  </TabsTrigger>
  <TabsTrigger value="address" className="bg-[#322fdf] text-white"> 
    Address
  </TabsTrigger>
</TabsList>

            <TabsContent value="orders">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
