import React from "react";
import "../globals.css";
const Layout = ({ children }) => {
  return (
    <html>
      <body lang="en">
        <main className="text-black">{children}</main>
      </body>
    </html>
  );
};

export default Layout;
