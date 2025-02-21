import SocialSignInUp from "@/components/auth_components/SocialSignInUp";

const SignUpPage = () => {
  const development = process.env.DEPLOYMENT_MODE === "DEV";
  return <SocialSignInUp login={false} isDev={development} />;
};

export default SignUpPage;
