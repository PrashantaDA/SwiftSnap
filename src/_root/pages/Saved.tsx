import { Models } from "appwrite"; // Importing Models from Appwrite SDK

import GridPostList from "@/components/shared/GridPostList"; // Component to display a grid of posts
import Loader from "@/components/shared/Loader"; // Loader component for displaying loading state
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations"; // Hook to fetch the current user data

const Saved = () => {
	const { data: currentUser } = useGetCurrentUser(); // Fetch current user data using custom hook

	// Process saved posts from the current user's data
	const savePosts = currentUser?.save // Safely access 'save' array
		.map((savePost: Models.Document) => ({
			...savePost.post, // Spread the post properties
			creator: {
				imageUrl: currentUser.imageUrl, // Attach current user's imageUrl to the post creator
			},
		}))
		.reverse(); // Reverse the order of posts (latest saved first)

	return (
		<div className="saved-container">
			{/* Header for saved posts */}
			<div className="flex gap-2 w-full max-w-5xl">
				<img
					src="/assets/icons/save.svg"
					width={36}
					height={36}
					alt="Saved Posts Icon"
					className="invert-white" // Inverts the color of the image for better visibility
				/>
				<h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
			</div>

			{/* Conditional rendering based on current user data */}
			{!currentUser ? ( // If currentUser data is not available, show loader
				<Loader />
			) : (
				<ul className="w-full flex justify-center max-w-5xl gap-9">
					{/* Check if there are saved posts */}
					{savePosts.length === 0 ? ( // If no saved posts, display a message
						<p className="text-light-4">No available posts</p>
					) : (
						<GridPostList
							posts={savePosts} // Pass saved posts to GridPostList component
							showStats={false} // Don't show statistics for saved posts
						/>
					)}
				</ul>
			)}
		</div>
	);
};

export default Saved;
