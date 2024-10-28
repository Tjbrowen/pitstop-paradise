import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SimpleFooter } from "./footer";

function Policies() {
    const navigate = useNavigate();

    const handleNavigation = (url) => {
        navigate(url);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
            <div className="flex flex-col space-y-4 items-center mt-10 mx-auto w-full max-w-md">
    <Button 
        className="policy-button w-full max-w-sm" 
        onClick={() => handleNavigation('/privacy-policy')}
    >
        Privacy Policy
    </Button>
    <Button 
        className="policy-button w-full max-w-sm" 
        onClick={() => handleNavigation('/shipping-policy')}
    >
        Shipping Policy
    </Button>
    <Button 
        className="policy-button w-full max-w-sm" 
        onClick={() => handleNavigation('/refund-policy')}
    >
        Refund Policy
    </Button>
    <Button 
        className="policy-button w-full max-w-sm" 
        onClick={() => handleNavigation('/payment-policy')}
    >
        Payment Policy
    </Button>
    <Button 
        className="policy-button w-full max-w-sm" 
        onClick={() => handleNavigation('/terms')}
    >
        Terms & Conditions
    </Button>
</div>

            </div>
            <SimpleFooter className="mt-auto" />
        </div>
    );
}

export default Policies;

