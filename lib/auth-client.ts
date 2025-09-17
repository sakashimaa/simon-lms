import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "https://simon-lms.vercel.app",
  plugins: [emailOTPClient()],
});
