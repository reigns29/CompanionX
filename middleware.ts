import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({ publicRoutes: ["/api/webhook", "/", "/api/suggestions"] });

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/dashboard", "/(api|trpc)(.*)"]
};
