import React from "react";
import "../globals.css";
import SessionProvider from "@/lib/SessionProvider";
const Layout = ({ children }) => {
  return (
    <html>
      <body lang="en">
        <SessionProvider>
          <main className="text-black">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
};

export default Layout;
