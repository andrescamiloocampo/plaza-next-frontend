import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        try {
          const res = await fetch(`${process.env.USERS_MS_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          });
          if (!res.ok) return null;
          const data = await res.json();
          // The response from the microservice should contain the token
          // and user details. We'll decode the token to get the role.
          const token = data.token;
          if (token) {
            // In a real scenario, you'd decode the JWT to get claims like role and id.
            // For now, we'll simulate this by assuming the API provides them.
            // This part MUST be adjusted based on the actual API response.
            // For this example, let's assume a function `decode` exists.
            // const decoded = decode(token); -> { id, role, name, ... }
            return {
              id: data.user.id, // Placeholder: adjust to actual response
              name: data.user.name, // Placeholder: adjust to actual response
              email: credentials.email,
              role: data.user.role, // Placeholder: adjust to actual response
              accessToken: token,
            };
          }
          return null;
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) { // This block only runs on sign-in
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;

        // If the user is an owner or employee, fetch their restaurant ID
        if (user.role === 'Propietario' || user.role === 'Empleado') {
            try {
                const userDetailsRes = await fetch(`${process.env.USERS_MS_URL}/user/${user.id}`, {
                    headers: { 'Authorization': `Bearer ${user.accessToken}` }
                });
                if (userDetailsRes.ok) {
                    const userDetails = await userDetailsRes.json();
                    token.restaurantId = userDetails.restaurantId; // Assuming this field exists in the response
                }
            } catch (e) {
                console.error("Failed to fetch user details for restaurantId", e);
            }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        if (token.restaurantId) {
            session.user.restaurantId = token.restaurantId;
        }
      }
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };