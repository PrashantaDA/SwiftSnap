// Import necessary hooks and components
import { useParams } from "react-router-dom"; // Hook to access route parameters
import Loader from "@/components/shared/Loader"; // Loader component for loading states
import PostForm from "@/components/forms/PostForm"; // Form component for editing a post
import { useGetPostById } from "@/lib/react-query/queriesAndMutations"; // Hook to fetch a post by its ID

const EditPost = () => {
	// Extract the post ID from the URL parameters
	const { id } = useParams();

	// Fetch the post data using the ID
	const { data: post, isPending } = useGetPostById(id);

	// Render a loader while the post data is being fetched
	if (isPending) {
		return (
			<div className="flex-center w-full h-full">
				<Loader />
			</div>
		);
	}

	return (
		<div className="flex flex-1">
			<div className="common-container">
				{/* Header section with an edit icon and title */}
				<div className="flex-start gap-3 justify-start w-full max-w-5xl">
					{/* Icon for editing a post */}
					<img
						src="/assets/icons/edit.svg"
						width={36}
						height={36}
						alt="edit"
						className="invert-white"
					/>
					{/* Title for the edit post page */}
					<h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
				</div>

				{/* Render the PostForm for updating the post, passing the post data */}
				<PostForm
					action="Update" // Indicates this form is for updating a post
					post={post} // Pass the fetched post data to the form
				/>
			</div>
		</div>
	);
};

export default EditPost;
