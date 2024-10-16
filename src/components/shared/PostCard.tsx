// Importing necessary hooks and utilities
import { useUserContext } from "@/context/AuthContext"; // Hook to access user context
import { multiFormatDateString } from "@/lib/utils"; // Utility function for formatting dates
import { Models } from "appwrite"; // Appwrite models for type definitions
import { Link } from "react-router-dom"; // Link component for navigation
import PostStats from "./PostStats"; // Component for displaying post statistics

// Type definition for the props received by PostCard component
type PostCardProps = {
	post: Models.Document; // The post object of type Models.Document
};

// PostCard component definition
const PostCard = ({ post }: PostCardProps) => {
	// Accessing the user information from the user context
	const { user } = useUserContext();

	// Early return if the post does not have a creator
	if (!post.creator) return null; // Returning null if there's no creator

	return (
		<div className="post-card">
			{" "}
			{/* Main container for the post card */}
			<div className="flex-between">
				{" "}
				{/* Flexbox for spacing between items */}
				<div className="flex items-center gap-3">
					{" "}
					{/* User information section */}
					<Link to={`/profile/${post.creator.$id}`}>
						{" "}
						{/* Link to the creator's profile */}
						<img
							src={post?.creator?.imageUrl || "/assets/icons/profile-placeholder.svg"} // Profile image or placeholder
							alt="creator" // Accessibility text for the image
							className="rounded-full w-12 lg:h-12" // Styling for the image
						/>
					</Link>
					<div className="flex flex-col">
						{" "}
						{/* Creator's name and post date */}
						<p className="base-medium lg:body-bold text-light-1">{post.creator.name}</p> {/* Creator's name */}
						<div className="flex-center gap-2 text-light-3">
							<p className="subtle-semibold lg:small-regular">{multiFormatDateString(post.$createdAt)}</p> {/* Post creation date */}
							<span>-</span>
							<p className="subtle-semibold lg:small-regular">{post.location}</p> {/* Post location */}
						</div>
					</div>
				</div>
				<Link
					to={`/update-post/${post.$id}`} // Link to update the post, visible only to the creator
					className={`${user.id !== post.creator.$id && "hidden"}`} // Hide link if the user is not the creator
				>
					<img
						src="/assets/icons/edit.svg" // Edit icon
						alt="edit" // Accessibility text for the icon
						width={20} // Width of the icon
						height={20} // Height of the icon
					/>
				</Link>
			</div>
			<Link to={`/posts/${post.$id}`}>
				{" "}
				{/* Link to view the full post */}
				<div className="small-medium lg:base-medium py-5">
					{" "}
					{/* Container for caption and tags */}
					<p>{post.caption}</p> {/* Post caption */}
					<ul className="flex gap-1 mt-2">
						{" "}
						{/* List of tags */}
						{post.tags.map((tag: string) => (
							<li
								key={tag} // Unique key for each tag
								className="text-light-3" // Styling for the tag
							>
								#{tag} {/* Displaying the tag */}
							</li>
						))}
					</ul>
				</div>
				<img
					src={post.imageUrl || "/assets/icons/profile-placeholder.svg"} // Post image or placeholder
					alt={post.caption || "Post"} // Accessibility text for the image
					className="post-card_img" // Styling for the post image
				/>
			</Link>
			<PostStats // Component to display statistics related to the post
				post={post}
				userId={user.id} // Passing user ID for stats functionality
			/>
		</div>
	);
};

export default PostCard;
