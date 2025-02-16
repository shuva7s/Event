import SocialSignInUp from "@/components/shared/SocialSignInUp";

const SignUpPage = () => {
  const development = process.env.DEPLOYMENT_MODE === "DEV";
  return <SocialSignInUp login={false} isDev={development} />;
};

export default SignUpPage;
