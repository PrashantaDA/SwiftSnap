import { Models } from "appwrite"; // Importing Models type from Appwrite for type safety
import { Link } from "react-router-dom"; // Link component for navigation in React Router

import { Button } from "../ui/button"; // Importing custom Button component

// Defining the props type for UserCard component
type UserCardProps = {
	user: Models.Document; // User object of type Models.Document
};

// UserCard component definition
const UserCard = ({ user }: UserCardProps) => {
	return (
		<Link
			to={`/profile/${user.$id}`} // Link to the user's profile page
			className="user-card" // CSS class for styling
		>
			{/* User Image */}
			<img
				src={user.imageUrl || "/assets/icons/profile-placeholder.svg"} // Default image if user image is not available
				alt="creator" // Alternative text for accessibility
				className="rounded-full w-14 h-14" // Styling for the image
			/>

			{/* User Name and Username */}
			<div className="flex-center flex-col gap-1">
				<p className="base-medium text-light-1 text-center line-clamp-1">{user.name}</p> {/* Displaying user's name */}
				<p className="small-regular text-light-3 text-center line-clamp-1">@{user.username}</p> {/* Displaying user's username */}
			</div>

			{/* Follow Button */}
			<Button
				type="button" // Button type
				size="sm" // Button size
				className="shad-button_primary px-5" // CSS classes for styling
			>
				Follow
			</Button>
		</Link>
	);
};

export default UserCard;
