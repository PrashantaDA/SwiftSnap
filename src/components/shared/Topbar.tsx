import { useEffect } from "react"; // Hook for managing side effects
import { Link, useNavigate } from "react-router-dom"; // Hooks and components from react-router for navigation
import { Button } from "../ui/button"; // Custom button component
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations"; // Hook for signing out
import { useUserContext } from "@/context/AuthContext"; // Context to access user information

const Topbar = () => {
	// Extracting signOut mutation and success state from the hook
	const { mutate: signOut, isSuccess } = useSignOutAccount();
	const navigate = useNavigate(); // Hook for navigation
	const { user } = useUserContext(); // Accessing user context

	// Effect to handle navigation after successful sign out
	useEffect(() => {
		if (isSuccess) navigate(0); // Reload the page on successful sign out
	}, [isSuccess, navigate]);

	return (
		<section className="topbar">
			<div className="flex-between py-4 px-5">
				{/* Logo Link */}
				<Link
					to="/"
					className="flex gap-3 items-3"
				>
					<img
						src="/assets/images/logo.svg"
						alt="logo"
						width={130}
						height={325}
					/>
				</Link>

				{/* User Actions: Logout and Profile */}
				<div className="flex gap-4">
					{/* Logout Button */}
					<Button
						variant="ghost"
						className="shad-button_ghost"
						onClick={() => signOut()} // Trigger sign out on click
					>
						<img
							src="/assets/icons/logout.svg"
							alt="logout"
						/>
					</Button>

					{/* Profile Link */}
					<Link
						to={`/profile/${user.id}`}
						className="flex-center gap-3"
					>
						<img
							src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
							alt="profile"
							className="h-8 w-8 rounded-full"
						/>
					</Link>
				</div>
			</div>
		</section>
	);
};

export default Topbar;
