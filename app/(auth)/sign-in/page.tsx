import SocialSignInUp from "@/components/shared/SocialSignInUp";

const SignInPage = () => {
  const development = process.env.DEPLOYMENT_MODE === "DEV";
  return <SocialSignInUp login={true} isDev={development} />;
};

export default SignInPage;
