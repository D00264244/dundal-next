import React from "react";
import "../globals.css";
import SessionProvider from "@/lib/SessionProvider";
const Layout = ({ children }) => {
  return (
    <html>
                <SessionProvider>

      <body lang="en">
        <main className="text-black">{children}</main>
      </body>
      </SessionProvider>
    </html>
  );
};

export default Layout;
