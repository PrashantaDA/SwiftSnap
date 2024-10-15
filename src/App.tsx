// Importing react-router-dom for routing
import { Routes, Route } from "react-router-dom";
// Importing pages and forms from the application
import { Home } from "./_root/pages";
import SigninForm from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
// Importing layout components for authentication and root
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
// ShadCN
import { Toaster } from "@/components/ui/toaster";

const App = () => {
	return (
		<main className="flex h-screen">
			<Routes>
				{/* Public Routes */}
				<Route element={<AuthLayout />}>
					<Route
						path="/sign-in"
						element={<SigninForm />}
					/>
					<Route
						path="/sign-up"
						element={<SignupForm />}
					/>
				</Route>
				{/* Private Routes */}
				<Route element={<RootLayout />}>
					<Route
						index
						element={<Home />}
					/>
				</Route>
			</Routes>
			<Toaster />
		</main>
	);
};
export default App;
