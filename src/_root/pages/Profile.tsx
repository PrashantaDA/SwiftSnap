import { Route, Routes, Link, Outlet, useParams, useLocation } from "react-router-dom"; // React Router hooks for routing and navigation

import { Button } from "@/components/ui/button"; // Button component
import { LikedPosts } from "@/_root/pages"; // Import liked posts component
import { useUserContext } from "@/context/AuthContext"; // Context for user authentication
import { useGetUserById } from "@/lib/react-query/queriesAndMutations"; // Hook to fetch user data

import GridPostList from "@/components/shared/GridPostList"; // Component for displaying a list of posts
import Loader from "@/components/shared/Loader"; // Loader component for loading states

interface StatBlockProps {
	value: string | number; // Value to display in the stat block
	label: string; // Label for the stat block
}

// Component to display a single stat block
const StatBlock = ({ value, label }: StatBlockProps) => (
	<div className="flex-center gap-2">
		<p className="small-semibold lg:body-bold text-primary-500">{value}</p>
		<p className="small-medium lg:base-medium text-light-2">{label}</p>
	</div>
);

const Profile = () => {
	const { id } = useParams(); // Get the user ID from the URL
	const { user } = useUserContext(); // Access the current user context
	const { pathname } = useLocation(); // Get the current pathname for active link highlighting

	// Fetch the user data by ID
	const { data: currentUser } = useGetUserById(id || "");

	// Show loader if user data is still being fetched
	if (!currentUser)
		return (
			<div className="flex-center w-full h-full">
				<Loader />
			</div>
		);

	return (
		<div className="profile-container">
			<div className="profile-inner_container">
				<div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
					{/* Profile image */}
					<img
						src={currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
						alt="profile"
						className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
					/>
					<div className="flex flex-col flex-1 justify-between md:mt-2">
						<div className="flex flex-col w-full">
							{/* User name and username */}
							<h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">{currentUser.name}</h1>
							<p className="small-regular md:body-medium text-light-3 text-center xl:text-left">@{currentUser.username}</p>
						</div>

						<div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
							{/* Stat blocks for posts, followers, and following */}
							<StatBlock
								value={currentUser.posts.length} // Number of posts
								label="Posts"
							/>
							<StatBlock
								value={20} // Placeholder for followers
								label="Followers"
							/>
							<StatBlock
								value={20} // Placeholder for following
								label="Following"
							/>
						</div>

						{/* User bio */}
						<p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">{currentUser.bio}</p>
					</div>

					{/* Edit Profile link and Follow button */}
					<div className="flex justify-center gap-4">
						{/* Edit Profile button shown only to the user */}
						<div className={`${user.id !== currentUser.$id && "hidden"}`}>
							<Link
								to={`/update-profile/${currentUser.$id}`}
								className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg`}
							>
								<img
									src={"/assets/icons/edit.svg"}
									alt="edit"
									width={20}
									height={20}
								/>
								<p className="flex whitespace-nowrap small-medium">Edit Profile</p>
							</Link>
						</div>
						{/* Follow button shown to other users */}
						<div className={`${user.id === id && "hidden"}`}>
							<Button
								type="button"
								className="shad-button_primary px-8"
							>
								Follow
							</Button>
						</div>
					</div>
				</div>
			</div>
			{/* Navigation tabs for user posts and liked posts */}
			{currentUser.$id === user.id && (
				<div className="flex max-w-5xl w-full">
					<Link
						to={`/profile/${id}`} // Link to user posts
						className={`profile-tab rounded-l-lg ${pathname === `/profile/${id}` && "!bg-dark-3"}`} // Highlight if active
					>
						<img
							src={"/assets/icons/posts.svg"}
							alt="posts"
							width={20}
							height={20}
						/>
						Posts
					</Link>
					<Link
						to={`/profile/${id}/liked-posts`} // Link to liked posts
						className={`profile-tab rounded-r-lg ${pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"}`} // Highlight if active
					>
						<img
							src={"/assets/icons/like.svg"}
							alt="like"
							width={20}
							height={20}
						/>
						Liked Posts
					</Link>
				</div>
			)}
			<Routes>
				{/* Default route to display user's posts */}
				<Route
					index
					element={
						<GridPostList
							posts={currentUser.posts} // Pass user's posts to GridPostList
							showUser={false} // Do not show user info with posts
						/>
					}
				/>
				{/* Route for liked posts shown only to the user */}
				{currentUser.$id === user.id && (
					<Route
						path="/liked-posts"
						element={<LikedPosts />}
					/>
				)}
			</Routes>
			<Outlet /> {/* Outlet for nested routes */}
		</div>
	);
};

export default Profile;
