import Loader from "@/components/shared/Loader"; // Loader component for loading states
import PostCard from "@/components/shared/PostCard"; // Component to display individual posts
import RightSidebar from "@/components/shared/RightSidebar";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations"; // Hook to fetch recent posts
import { Models } from "appwrite"; // Importing Models from Appwrite

const Home = () => {
	// Fetch recent posts and their loading/error states
	const { data: posts, isPending: isPostLoading, isError: isErrorPosts } = useGetRecentPosts();

	return (
		<div className="flex flex-1">
			<div className="home-container">
				<div className="home-posts">
					<h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>

					{/* Display loader if posts are still loading */}
					{isPostLoading && !posts ? (
						<Loader />
					) : isErrorPosts ? (
						// Display error message if there was an error loading posts
						<div>Error loading posts</div>
					) : (
						<ul className="flex flex-col flex-1 gap-8 w-full">
							{/* Map over the posts and display each using PostCard */}
							{posts?.documents.map((post: Models.Document) => (
								<PostCard
									post={post}
									key={post.imageId} // Unique key for each post card
								/>
							))}
						</ul>
					)}
				</div>
			</div>
			<RightSidebar />
		</div>
	);
};

export default Home;
