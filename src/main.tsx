import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import {QueryClientProvider} from "@tanstack/react-query";
import {RouterProvider} from "react-router-dom";

import {queryClient} from "@/lib/query_client.ts";
import {router} from "@/lib/router.tsx";
import {Toaster} from "react-hot-toast";
import AxiosProvider from "@/store/providers/axiosprovider.tsx";

createRoot(document.getElementById("root")!).render(<StrictMode>
  <AxiosProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
      <Toaster/>
    </QueryClientProvider>
  </AxiosProvider>
</StrictMode>);
