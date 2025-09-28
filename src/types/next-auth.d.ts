import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role: string;
    accessToken: string;
    restaurantId?: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      restaurantId?: string;
    } & DefaultSession["user"];
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    accessToken: string;
    restaurantId?: string;
  }
}