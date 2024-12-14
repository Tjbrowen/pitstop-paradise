import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import axios from "axios";

function FlavorSelector({ productId, onFlavorSelect }) {
    const [productDetails, setProductDetails] = useState(null);
    const [flavor, setFlavor] = useState("");

    useEffect(() => {
     
        async function fetchProductDetails() {
            try {
                const response = await axios.get(`/api/admin/products/6717ee9...
`);
                setProductDetails(response.data);
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        }

        if (productId) { 
            fetchProductDetails();
        } else {
            console.error("Product ID is undefined");
        }
    }, [productId]);

    const handleFlavorChange = (e) => {
        const flavor = e.target.value;
        setFlavor(flavor);
  
        onFlavorSelect(flavor); 
    };

    return (
        <div className="mt-4">
            <Label>Select Flavor</Label>
            <select
                value={flavor}
                onChange={handleFlavorChange}
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
                disabled={!productDetails?.flavors?.length} 
            >
                <option value="" disabled>
                    {productDetails?.flavors?.length ? "Choose a flavor" : "Loading..."}
                </option>
                {productDetails?.flavors?.map((flavor) => ( 
                    <option key={flavor.id} value={flavor.name}> 
                        {flavor.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default FlavorSelector;

