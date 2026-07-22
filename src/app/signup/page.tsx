import AuthForm from "@/components/AuthForm";
import React from "react";

const SignUp = () => {
  return (
    <div className="px-10 md:px-24 xl:px-36 space-y-6">
      <h1 className="text-7xl font-lora mt-20 md:mt-30 xl:mt-20">Sign Up</h1>

      <AuthForm mode="signup" />
    </div>
  );
};

export default SignUp;
