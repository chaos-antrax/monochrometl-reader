import AuthForm from "@/components/AuthForm";

const SignIn = () => {
  return (
    <div className="px-10 md:px-24 xl:px-36 space-y-6">
      <h1 className="text-7xl font-lora mt-20 md:mt-30">Sign In</h1>

      <AuthForm mode="login" />
    </div>
  );
};

export default SignIn;
