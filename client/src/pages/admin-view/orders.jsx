import AdminOrdersView from "@/components/admin-view/orders";

function AdminOrders() {
  return (
    <div
    style={{
      backgroundImage:
        "url('https://res.cloudinary.com/daynaexaz/image/upload/v1728893288/blue-smokebg_cegir0.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      minHeight: "100vh",
    }}
    
    >
      <AdminOrdersView />
    </div>
  );
}

export default AdminOrders;
