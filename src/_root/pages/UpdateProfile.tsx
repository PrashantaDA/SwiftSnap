import * as z from "zod"; // Importing Zod for schema validation
import { useForm } from "react-hook-form"; // Importing React Hook Form for form handling
import { zodResolver } from "@hookform/resolvers/zod"; // Zod resolver for React Hook Form
import { useNavigate, useParams } from "react-router-dom"; // React Router hooks for navigation and params

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // Form components for structured form UI
import { useToast } from "@/hooks/use-toast"; // Custom hook for displaying toast notifications

import { Textarea } from "@/components/ui/textarea"; // Textarea component for multi-line input
import { Input } from "@/components/ui/input"; // Input component for single-line input
import { Button } from "@/components/ui/button"; // Button component for user actions

import ProfileUploader from "@/components/shared/ProfileUploader"; // Profile image uploader component
import Loader from "@/components/shared/Loader"; // Loader component for loading states

import { ProfileValidation } from "@/lib/validation"; // Validation schema for profile updates
import { useUserContext } from "@/context/AuthContext"; // Context to access user information

import { useGetUserById, useUpdateUser } from "@/lib/react-query/queriesAndMutations"; // Hooks for fetching and updating user data

const UpdateProfile = () => {
	const { toast } = useToast(); // Toast notification handler
	const navigate = useNavigate(); // Hook to navigate between routes
	const { id } = useParams(); // Get the user ID from URL parameters
	const { user, setUser } = useUserContext(); // Get current user data and setter function from context
	const form = useForm<z.infer<typeof ProfileValidation>>({
		// Initialize form handling with validation
		resolver: zodResolver(ProfileValidation), // Use Zod for validation
		defaultValues: {
			// Set default values for form fields
			file: [], // Placeholder for the uploaded file
			name: user.name, // Current user's name
			username: user.username, // Current user's username
			email: user.email, // Current user's email
			bio: user.bio || "", // Current user's bio (default to empty if undefined)
		},
	});

	// Queries
	const { data: currentUser } = useGetUserById(id || ""); // Fetch current user data by ID
	const { mutateAsync: updateUser, isPending: isLoadingUpdate } = useUpdateUser(); // Mutation for updating user data

	// Loader for when current user data is being fetched
	if (!currentUser)
		return (
			<div className="flex-center w-full h-full">
				<Loader />
			</div>
		);

	// Handler for form submission
	const handleUpdate = async (value: z.infer<typeof ProfileValidation>) => {
		const updatedUser = await updateUser({
			// Perform the update mutation
			userId: currentUser.$id, // ID of the user to update
			name: value.name, // Updated name
			bio: value.bio, // Updated bio
			file: value.file, // Uploaded file (profile picture)
			imageUrl: currentUser.imageUrl, // Current image URL
			imageId: currentUser.imageId, // Current image ID
		});

		// Handle update failure
		if (!updatedUser) {
			toast({
				// Show error toast
				title: `Update user failed. Please try again.`,
			});
		}

		// Update context with new user information
		setUser({
			...user,
			name: updatedUser?.name,
			bio: updatedUser?.bio,
			imageUrl: updatedUser?.imageUrl,
		});
		return navigate(`/profile/${id}`); // Redirect to the user's profile after update
	};

	return (
		<div className="flex flex-1">
			<div className="common-container">
				{/* Header for the profile update form */}
				<div className="flex-start gap-3 justify-start w-full max-w-5xl">
					<img
						src="/assets/icons/edit.svg"
						width={36}
						height={36}
						alt="edit"
						className="invert-white" // Invert the icon color for visibility
					/>
					<h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
				</div>

				{/* Form structure */}
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleUpdate)} // Handle form submission
						className="flex flex-col gap-7 w-full mt-4 max-w-5xl"
					>
						{/* Profile Image Uploader */}
						<FormField
							control={form.control}
							name="file"
							render={({ field }) => (
								<FormItem className="flex">
									<FormControl>
										<ProfileUploader
											fieldChange={field.onChange} // Handle file input change
											mediaUrl={currentUser.imageUrl} // Current profile image URL
										/>
									</FormControl>
									<FormMessage className="shad-form_message" />
								</FormItem>
							)}
						/>

						{/* Name Input Field */}
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="shad-form_label">Name</FormLabel>
									<FormControl>
										<Input
											type="text"
											className="shad-input"
											{...field} // Bind the field to the input
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Username Input Field (disabled) */}
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="shad-form_label">Username</FormLabel>
									<FormControl>
										<Input
											type="text"
											className="shad-input"
											{...field}
											disabled // Disable editing the username
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Email Input Field (disabled) */}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="shad-form_label">Email</FormLabel>
									<FormControl>
										<Input
											type="text"
											className="shad-input"
											{...field}
											disabled // Disable editing the email
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Bio Textarea Field */}
						<FormField
							control={form.control}
							name="bio"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="shad-form_label">Bio</FormLabel>
									<FormControl>
										<Textarea
											className="shad-textarea custom-scrollbar" // Custom styles for the textarea
											{...field}
										/>
									</FormControl>
									<FormMessage className="shad-form_message" />
								</FormItem>
							)}
						/>

						{/* Action Buttons */}
						<div className="flex gap-4 items-center justify-end">
							<Button
								type="button" // Cancel button to navigate back
								className="shad-button_dark_4"
								onClick={() => navigate(-1)}
							>
								Cancel
							</Button>
							<Button
								type="submit" // Submit button to update profile
								className="shad-button_primary whitespace-nowrap"
								disabled={isLoadingUpdate} // Disable button while loading
							>
								{isLoadingUpdate && <Loader />} {/* Show loader while updating */}
								Update Profile
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default UpdateProfile;
