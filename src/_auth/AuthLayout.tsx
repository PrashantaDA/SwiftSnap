// Importing necessary components from React Router for navigation and rendering child routes
import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
	// Placeholder authentication check (this will be replaced with actual logic)
	const isAuthenticated = false;

	return (
		<>
			{/* If the user is authenticated, navigate to the home page */}
			{isAuthenticated ? (
				<Navigate
					to="/"
					replace
				/>
			) : (
				<>
					{/* Layout for non-authenticated users */}
					<section className="flex flex-1 justify-center items-center flex-col py-10">
						{/* Render the child components based on the current route */}
						<Outlet />
					</section>

					{/* Side image displayed on large screens */}
					<img
						src="/assets/images/side-img.svg"
						alt="home"
						className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
					/>
				</>
			)}
		</>
	);
};

export default AuthLayout;
