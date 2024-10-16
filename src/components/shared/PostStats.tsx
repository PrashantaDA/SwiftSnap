// Importing necessary React hooks and utilities
import React, { useState, useEffect } from "react"; // React hooks for managing state and lifecycle
import { Models } from "appwrite"; // Appwrite models for type definitions
import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations"; // Custom hooks for API interactions
import { checkIsLiked } from "@/lib/utils"; // Utility function to check if the post is liked
import Loader from "./Loader"; // Loader component for displaying loading state

// Type definition for the props received by PostStats component
type PostStatsProps = {
	post: Models.Document; // The post object of type Models.Document
	userId: string; // The ID of the current user
};

// PostStats component definition
const PostStats = ({ post, userId }: PostStatsProps) => {
	// Extracting list of user IDs who liked the post
	const likesList = post.likes.map((user: Models.Document) => user.$id);
	const [likes, setLikes] = useState<string[]>(likesList); // State for managing likes
	const [isSaved, setIsSaved] = useState(false); // State for managing saved post status

	// Mutations for liking, saving, and deleting saved posts
	const { mutate: likePost } = useLikePost();
	const { mutate: savePost, isPending: isSavingPost } = useSavePost();
	const { mutate: deleteSavePost, isPending: isDeletingSaved } = useDeleteSavedPost();

	const { data: currentUser } = useGetCurrentUser(); // Fetching the current user data

	// Finding the saved post record for the current post
	const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post.$id);

	// Effect to update the saved status when currentUser changes
	useEffect(() => {
		setIsSaved(!!savedPostRecord); // Set isSaved based on existence of saved record
	}, [currentUser]);

	// Function to handle liking the post
	const handleLikePost = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevents click event from bubbling up

		let newLikes = [...likes]; // Create a copy of the current likes

		const hasLiked = newLikes.includes(userId); // Check if the user has already liked the post

		// Toggle the like status
		if (hasLiked) {
			newLikes = newLikes.filter((id) => id !== userId); // Remove user ID from likes
		} else {
			newLikes.push(userId); // Add user ID to likes
		}

		setLikes(newLikes); // Update the local likes state
		likePost({ postId: post.$id, likesArray: newLikes }); // Call the like post mutation
	};

	// Function to handle saving the post
	const handleSavePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
		e.stopPropagation(); // Prevents click event from bubbling up

		if (savedPostRecord) {
			setIsSaved(false); // Update saved status
			return deleteSavePost(savedPostRecord.$id); // Call the delete saved post mutation
		}

		savePost({ userId: userId, postId: post.$id }); // Call the save post mutation
		setIsSaved(true); // Update saved status
	};

	return (
		<div className="flex justify-between items-center z-20">
			{" "}
			{/* Container for post stats */}
			<div className="flex gap-2 mr-5">
				{" "}
				{/* Likes section */}
				<img
					src={checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"} // Like icon based on user's like status
					alt="like" // Accessibility text for the icon
					width={20} // Width of the icon
					height={20} // Height of the icon
					onClick={handleLikePost} // Click handler for liking the post
					className="cursor-pointer" // Styling for cursor
				/>
				<p className="small-medium lg:base-medium">{likes.length}</p> {/* Displays number of likes */}
			</div>
			<div className="flex gap-2 ">
				{" "}
				{/* Save post section */}
				{isSavingPost || isDeletingSaved ? ( // Conditional rendering for loading state
					<Loader /> // Show loader if saving or deleting
				) : (
					<img
						src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"} // Save icon based on saved status
						alt="save" // Accessibility text for the icon
						width={20} // Width of the icon
						height={20} // Height of the icon
						onClick={handleSavePost} // Click handler for saving the post
						className="cursor-pointer" // Styling for cursor
					/>
				)}
			</div>
		</div>
	);
};

export default PostStats;
