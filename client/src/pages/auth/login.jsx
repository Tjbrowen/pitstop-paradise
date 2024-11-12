import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress from MUI

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false); // Add loading state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    setLoading(true); // Start loading when form submits

    dispatch(loginUser(formData)).then((data) => {
      setLoading(false); // Stop loading after request completes

      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        navigate("/");
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
            style={{ color: '#007bff' }} 
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={loading ? <CircularProgress size={24} /> : "Sign In"} // Show loader if loading
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <div className="text-center">
        <Link
          className="font-medium hover:underline"
          to="/auth/forgot-password"
          style={{ color: '#007bff' }}  
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}

export default AuthLogin;
