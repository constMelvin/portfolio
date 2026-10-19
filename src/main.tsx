import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { NextThemeProvider } from "./components/next-theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<NextThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
			>
				<App />
			</NextThemeProvider>
		</BrowserRouter>
	</StrictMode>
);
