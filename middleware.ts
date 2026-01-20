import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ token }) {
      return !!token;
    },
  },
});

// Protect routes yang membutuhkan authentication
export const config = {
  matcher: [
    "/api/payment/create",
    "/api/orders/:path*",
    "/api/upload",
    "/api/website/:path*",
  ],
};
