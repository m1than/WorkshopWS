import React from "react";

export type LayoutProps = {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <header>
        <h1>Chat App</h1>
      </header>
      <main>{children}</main>
    </div>
  );
};