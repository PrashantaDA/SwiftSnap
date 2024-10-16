import * as z from "zod"; // Import Zod for schema validation
import { useForm } from "react-hook-form"; // Import React Hook Form for form handling
import { zodResolver } from "@hookform/resolvers/zod"; // Import Zod resolver for React Hook Form

import { Button } from "@/components/ui/button"; // Import Button component
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // Import Form components
import { Input } from "@/components/ui/input"; // Import Input component

import { useToast } from "@/hooks/use-toast"; // Import toast hook for notifications
import { useUserContext } from "@/context/AuthContext"; // Import user context for user info
import { Textarea } from "../ui/textarea"; // Import Textarea component
import FileUploader from "../shared/FileUploader"; // Import FileUploader component for uploading images
import { PostValidation } from "@/lib/validation"; // Import post validation schema
import { Models } from "appwrite"; // Import Models from Appwrite SDK
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations"; // Import hooks for creating and updating posts

import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Loader from "../shared/Loader"; // Import Loader component for loading state

type PostFormProps = {
	post?: Models.Document; // Optional post to be edited
	action: "Create" | "Update"; // Action type: Create or Update
};

const PostForm = ({ post, action }: PostFormProps) => {
	// Hooks for creating and updating posts
	const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost();
	const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost();

	const { user } = useUserContext(); // Get user info from context
	const { toast } = useToast(); // Get toast function for notifications
	const navigate = useNavigate(); // Get navigate function for routing

	// Initialize the form with default values based on whether it's a create or update action
	const form = useForm<z.infer<typeof PostValidation>>({
		resolver: zodResolver(PostValidation), // Use Zod for form validation
		defaultValues: {
			caption: post ? post?.caption : "", // Set caption from post or default to empty
			file: [], // Default to an empty file array
			location: post ? post?.location : "", // Set location from post or default to empty
			tags: post ? post.tags.join(",") : "", // Set tags from post or default to empty
		},
	});

	// Handle form submission
	async function onSubmit(values: z.infer<typeof PostValidation>) {
		try {
			if (post && action === "Update") {
				// If updating an existing post
				const updatedPost = await updatePost({
					...values, // Spread form values
					postId: post.$id, // Post ID for the post to be updated
					imageId: post?.imageId, // Preserve existing image ID
					imageUrl: post?.imageUrl, // Preserve existing image URL
				});

				if (!updatedPost) {
					toast({
						title: "Update failed, please try again", // Notify user on failure
					});
				} else {
					toast({ title: "Post updated successfully!" }); // Notify on success
				}

				return navigate(`/posts/${post.$id}`); // Navigate to the updated post
			}

			// If creating a new post
			const newPost = await createPost({
				...values, // Spread form values
				userId: user.id, // Include user ID for the post
			});

			if (!newPost) {
				toast({
					title: "Creation failed, please try again!", // Notify user on failure
				});
			} else {
				toast({ title: "Post created successfully!" }); // Notify on success
			}

			// Reset the form to its default values
			form.reset();
			navigate("/"); // Navigate to the home page after post creation
		} catch (error) {
			toast({
				title: "An error occurred", // Notify on generic error
			});
			console.error("Submission error:", error); // Log the error for debugging
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)} // Handle form submission
				className="flex flex-col gap-9 w-full max-w-5xl" // Styling for the form
			>
				{/* Caption Field */}
				<FormField
					control={form.control}
					name="caption"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">Caption</FormLabel>
							<FormControl>
								<Textarea
									className="shad-textarea custom-scrollbar" // Textarea for captions
									{...field}
								/>
							</FormControl>
							<FormMessage className="shad-form_message" /> {/* Display validation message */}
						</FormItem>
					)}
				/>

				{/* File Upload Field */}
				<FormField
					control={form.control}
					name="file"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">Add Photos</FormLabel>
							<FormControl>
								<FileUploader
									fieldChange={field.onChange} // Update field on file change
									mediaUrl={post?.imageUrl} // Use existing image URL if updating
								/>
							</FormControl>
							<FormMessage className="shad-form_message" /> {/* Display validation message */}
						</FormItem>
					)}
				/>

				{/* Location Field */}
				<FormField
					control={form.control}
					name="location"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">Add Location</FormLabel>
							<FormControl>
								<Input
									type="text" // Input field for location
									className="shad-input"
									{...field}
								/>
							</FormControl>
							<FormMessage className="shad-form_message" /> {/* Display validation message */}
						</FormItem>
					)}
				/>

				{/* Tags Field */}
				<FormField
					control={form.control}
					name="tags"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">Add Tags (separated by comma " , ")</FormLabel>
							<FormControl>
								<Input
									type="text" // Input field for tags
									className="shad-input"
									placeholder="React,Scenario,Learn"
									{...field}
								/>
							</FormControl>
							<FormMessage className="shad-form_message" /> {/* Display validation message */}
						</FormItem>
					)}
				/>

				{/* Action Buttons */}
				<div className="flex gap-4 items-center justify-end">
					<Button
						type="button"
						className="shad-button_dark_4"
						onClick={() => {
							navigate(-1); // Navigate back on cancel
						}}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						className="shad-button_primary whitespace-nowrap"
						disabled={isLoadingCreate || isLoadingUpdate} // Disable button while loading
					>
						{(isLoadingCreate || isLoadingUpdate) && <Loader />} {/* Show loader while processing */}
						{action} Post {/* Display action type: Create or Update */}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default PostForm;
