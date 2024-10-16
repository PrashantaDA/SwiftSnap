import { useParams, Link, useNavigate } from "react-router-dom"; // React Router hooks for routing and navigation

import { Button } from "@/components/ui/button"; // Button component
import Loader from "@/components/shared/Loader"; // Loader component for loading states

import PostStats from "@/components/shared/PostStats"; // Component for displaying post statistics
import GridPostList from "@/components/shared/GridPostList"; // Component for displaying a grid of posts

import { useGetPostById, useGetUserPosts, useDeletePost } from "@/lib/react-query/queriesAndMutations"; // Hooks for fetching post and user data
import { multiFormatDateString } from "@/lib/utils"; // Utility function for date formatting
import { useUserContext } from "@/context/AuthContext"; // Context for user authentication

const PostDetails = () => {
	const navigate = useNavigate(); // Hook for navigation
	const { id } = useParams(); // Hook to get the post ID from the URL
	const { user } = useUserContext(); // Access the current user context

	// Fetch the post by ID
	const { data: post, isLoading } = useGetPostById(id);
	// Fetch posts created by the post's creator
	const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(post?.creator.$id);
	// Hook to delete a post
	const { mutate: deletePost } = useDeletePost();

	// Filter out the current post from the user's posts to find related posts
	const relatedPosts = userPosts?.documents.filter((userPost) => userPost.$id !== id);

	// Function to handle post deletion
	const handleDeletePost = () => {
		deletePost({ postId: id, imageId: post?.imageId }); // Call delete function with post ID and image ID
		navigate(-1); // Navigate back to the previous page
	};

	return (
		<div className="post_details-container">
			{/* Back button for navigating to the previous page */}
			<div className="hidden md:flex max-w-5xl w-full">
				<Button
					onClick={() => navigate(-1)} // Navigate back on click
					variant="ghost"
					className="shad-button_ghost"
				>
					<img
						src={"/assets/icons/back.svg"}
						alt="back"
						width={24}
						height={24}
					/>
					<p className="small-medium lg:base-medium">Back</p>
				</Button>
			</div>

			{/* Show loader while the post is loading */}
			{isLoading || !post ? (
				<Loader />
			) : (
				<div className="post_details-card">
					{/* Display the post image */}
					<img
						src={post?.imageUrl}
						alt="creator"
						className="post_details-img"
					/>

					<div className="post_details-info">
						<div className="flex-between w-full">
							{/* Link to the creator's profile */}
							<Link
								to={`/profile/${post?.creator.$id}`}
								className="flex items-center gap-3"
							>
								<img
									src={post?.creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
									alt="creator"
									className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
								/>
								<div className="flex gap-1 flex-col">
									<p className="base-medium lg:body-bold text-light-1">{post?.creator.name}</p>
									<div className="flex-center gap-2 text-light-3">
										<p className="subtle-semibold lg:small-regular ">{multiFormatDateString(post?.$createdAt)}</p>•{/* Separator */}
										<p className="subtle-semibold lg:small-regular">{post?.location}</p>
									</div>
								</div>
							</Link>

							<div className="flex-center gap-4">
								{/* Edit post link, shown only to the post creator */}
								<Link
									to={`/update-post/${post?.$id}`}
									className={`${user.id !== post?.creator.$id && "hidden"}`} // Hide if the user is not the creator
								>
									<img
										src={"/assets/icons/edit.svg"}
										alt="edit"
										width={24}
										height={24}
									/>
								</Link>

								{/* Delete post button, shown only to the post creator */}
								<Button
									onClick={handleDeletePost} // Handle post deletion
									variant="ghost"
									className={`post_details-delete_btn ${user.id !== post?.creator.$id && "hidden"}`} // Hide if the user is not the creator
								>
									<img
										src={"/assets/icons/delete.svg"}
										alt="delete"
										width={24}
										height={24}
									/>
								</Button>
							</div>
						</div>
						<hr className="border w-full border-dark-4/80" /> {/* Divider */}
						<div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
							<p>{post?.caption}</p> {/* Display post caption */}
							<ul className="flex gap-1 mt-2">
								{/* Display post tags */}
								{post?.tags.map((tag: string, index: string) => (
									<li
										key={`${tag}${index}`} // Use unique key for each tag
										className="text-light-3 small-regular"
									>
										#{tag}
									</li>
								))}
							</ul>
						</div>
						{/* Post statistics component */}
						<div className="w-full">
							<PostStats
								post={post} // Pass post data to PostStats
								userId={user.id} // Pass user ID to PostStats
							/>
						</div>
					</div>
				</div>
			)}

			<div className="w-full max-w-5xl">
				<hr className="border w-full border-dark-4/80" /> {/* Divider */}
				<h3 className="body-bold md:h3-bold w-full my-10">More Related Posts</h3>
				{/* Show loader or related posts based on loading state */}
				{isUserPostLoading || !relatedPosts ? <Loader /> : <GridPostList posts={relatedPosts} />}
			</div>
		</div>
	);
};

export default PostDetails;
