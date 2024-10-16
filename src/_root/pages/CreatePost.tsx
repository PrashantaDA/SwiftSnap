// Import the PostForm component to handle post creation
import PostForm from "@/components/forms/PostForm";

const CreatePost = () => {
	return (
		<div className="flex flex-1">
			<div className="common-container">
				{/* Header section with icon and title */}
				<div className="max-w-5xl flex-start gap-3 justify-start w-full">
					{/* Icon for creating a post */}
					<img
						src="/assets/icons/add-post.svg"
						alt="add"
						width={36}
						height={36}
					/>
					{/* Title for the post creation page */}
					<h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
				</div>

				{/* PostForm component to handle post input and submission */}
				<PostForm action="Create" />
			</div>
		</div>
	);
};

export default CreatePost;
