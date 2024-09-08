import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes.tsx";
import Layout from "./Layout/Layout.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthContextProvider from "./Context/AuthContext.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const client = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <AuthContextProvider>
        <BrowserRouter>
          <Layout>
            <ToastContainer position="top-center" />
            <AppRoutes />
          </Layout>
        </BrowserRouter>
      </AuthContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
