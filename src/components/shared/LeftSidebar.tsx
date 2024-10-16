// Importing necessary hooks and components from React and React Router
import { useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";

// Importing custom components and hooks
import { Button } from "../ui/button"; // Custom button component
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations"; // Hook for signing out
import { useUserContext } from "@/context/AuthContext"; // Hook for accessing user context
import { sidebarLinks } from "@/constants"; // Sidebar link constants
import { INavLink } from "@/types"; // Type definition for navigation links

const LeftSidebar = () => {
	// Getting the current pathname from the location object
	const { pathname } = useLocation();

	// Using the sign-out mutation hook
	const { mutate: signOut, isSuccess } = useSignOutAccount();

	// Hook for programmatically navigating within the app
	const navigate = useNavigate();

	// Accessing user information from the context
	const { user } = useUserContext();

	// Effect to handle post sign-out navigation
	useEffect(() => {
		if (isSuccess) navigate(0); // Reloads the page if sign-out is successful
	}, [isSuccess]);

	return (
		<nav className="leftsidebar">
			{" "}
			{/* Main navigation container */}
			<div className="flex flex-col gap-6 ">
				{/* Logo link */}
				<Link
					to="/"
					className="flex gap-3 items-3"
				>
					<img
						src="/assets/images/logo.svg"
						alt="logo"
						width={170}
						height={36}
					/>
				</Link>

				{/* User profile link */}
				<Link
					to={`/profile/${user.id}`} // Profile link to the user's profile page
					className="flex gap-3 items-center pb-2"
				>
					<img
						src={user.imageUrl || "/assets/icons/profile-placeholder.svg"} // User's profile picture
						alt="profile"
						className="h-14 w-14 rounded-full" // Styling for the profile picture
					/>
					<div className="flex flex-col ">
						<p className="body-bold">{user.name}</p> {/* User's name */}
						<p className="small-regular text-light-3">@{user.username}</p> {/* User's username */}
					</div>
				</Link>

				{/* Sidebar links */}
				<ul className="flex flex-col gap-6">
					{sidebarLinks.map((link: INavLink) => {
						// Checking if the current link is active
						const isActive = pathname === link.route;

						return (
							<li
								className={`leftsidebar-link group ${isActive && "bg-primary-500"}`} // Active link styling
								key={link.label}
							>
								<NavLink
									to={link.route} // Navigation link to the specified route
									className="flex gap-4 items-center p-2"
								>
									<img
										src={link.imgURL} // Link icon
										alt={link.label} // Accessibility label for the icon
										className={`group-hover:invert-white ${isActive && "invert-white"}`} // Icon styling based on hover and active state
									/>
									{link.label} {/* Link label */}
								</NavLink>
							</li>
						);
					})}
				</ul>
			</div>
			{/* Logout button */}
			<Button
				variant="ghost" // Ghost variant for the button
				className="shad-button_ghost group flex items-center" // Styling for the button
				onClick={() => signOut()} // Sign-out action on button click
			>
				<img
					src="/assets/icons/logout.svg" // Logout icon
					alt="logout" // Accessibility label for the icon
					className="transform transition-transform duration-300" // Transition effects for the icon
				/>
				<p className="small-medium lg:base-medium ">Logout</p> {/* Logout label */}
			</Button>
		</nav>
	);
};

export default LeftSidebar;
