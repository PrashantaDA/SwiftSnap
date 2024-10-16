// Importing necessary modules and components
import { Models } from "appwrite"; // Importing Models from Appwrite for type definitions
import { Link } from "react-router-dom"; // Link component for routing

import PostStats from "./PostStats"; // Importing the PostStats component for displaying post statistics
import { useUserContext } from "@/context/AuthContext"; // Importing the user context for accessing user information

// Type definition for the props that GridPostList will receive
type GridPostListProps = {
	posts: Models.Document[]; // Array of post documents
	showUser?: boolean; // Optional prop to determine if the user info should be shown
	showStats?: boolean; // Optional prop to determine if the post stats should be shown
};

const GridPostList = ({ posts, showUser = true, showStats = true }: GridPostListProps) => {
	const { user } = useUserContext(); // Accessing the user context to get the current user

	return (
		<ul className="grid-container">
			{" "}
			{/* Main container for the grid of posts */}
			{posts.map((post) => (
				<li
					key={post.$id} // Unique key for each post item
					className="relative min-w-80 h-80" // Styling for the individual post item
				>
					<Link
						to={`/posts/${post.$id}`} // Link to the individual post detail page
						className="grid-post_link" // Class for styling the post link
					>
						<img
							src={post.imageUrl} // Image source for the post
							alt="post" // Accessibility label for the post image
							className="h-full w-full object-cover" // Styling to ensure the image covers the area
						/>
					</Link>

					{/* User and statistics information section */}
					<div className="grid-post_user">
						{/* Conditionally rendering user information */}
						{showUser && (
							<div className="flex items-center justify-start gap-2 flex-1">
								<img
									src={post.creator.imageUrl || "/assets/icons/profile-placeholder.svg"} // Image of the post creator
									alt="creator" // Accessibility label for the creator image
									className="w-8 h-8 rounded-full" // Styling for the creator image
								/>
								<p className="line-clamp-1">{post.creator.name}</p> {/* Creator's name with line clamping */}
							</div>
						)}
						{/* Conditionally rendering post statistics */}
						{showStats && (
							<PostStats
								post={post} // Passing the post data to the PostStats component
								userId={user.id} // Passing the current user's ID
							/>
						)}
					</div>
				</li>
			))}
		</ul>
	);
};

export default GridPostList;
