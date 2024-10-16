import GridPostList from "@/components/shared/GridPostList"; // Component for displaying a grid of posts
import Loader from "@/components/shared/Loader"; // Loader component for loading states
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations"; // Hook to fetch the current user

const LikedPosts = () => {
	// Fetch current user data, including liked posts
	const { data: currentUser } = useGetCurrentUser();

	// If current user data is still loading, show a loader
	if (!currentUser) {
		return (
			<div className="flex-center w-full h-full">
				<Loader />
			</div>
		);
	}

	return (
		<>
			{/* Display a message if the user has no liked posts */}
			{currentUser.liked.length === 0 && <p className="text-light-4">No liked posts</p>}

			{/* Display the grid of liked posts */}
			<GridPostList
				posts={currentUser.liked} // Pass the liked posts to the GridPostList
				showStats={false} // Optional prop to hide stats, can be set to true if needed
			/>
		</>
	);
};

export default LikedPosts;
