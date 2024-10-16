// React Hook Form imports for managing form state and validation
import { useForm } from "react-hook-form";
import { z } from "zod"; // Zod for defining validation schema
import { zodResolver } from "@hookform/resolvers/zod"; // Integrates Zod validation with React Hook Form

// UI Component imports for form controls, buttons, and layout
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Custom Hook imports for displaying toast notifications
import { useToast } from "@/hooks/use-toast";

// Validation schema for signup form
import { SignupValidation } from "@/lib/validation";

// Shared Loader component for displaying loading states
import Loader from "@/components/shared/Loader";

// Routing imports for navigation and linking to other pages
import { Link, useNavigate } from "react-router-dom";

// Appwrite API imports for account creation and sign-in
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext"; // Context for user authentication

const SignupForm = () => {
	// Initialize toast notifications and navigation
	const { toast } = useToast();
	const navigate = useNavigate();

	// Extracting necessary functions and state from user context
	const { checkAuthUser } = useUserContext();

	// Create new user account and handle loading state
	const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();

	// Handle user sign-in and loading state
	const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();

	// 1. Define the form using Zod for validation and default values for the form fields
	const form = useForm<z.infer<typeof SignupValidation>>({
		resolver: zodResolver(SignupValidation), // Use Zod to validate the form
		defaultValues: {
			name: "",
			username: "",
			email: "",
			password: "",
		},
	});

	// 2. Define a submit handler for the form
	async function onSubmit(values: z.infer<typeof SignupValidation>) {
		// Attempt to create a new user account
		const newUser = await createUserAccount(values);
		if (!newUser) {
			return toast({
				title: "Sign up failed.",
				description: "Please try again.",
			});
		}

		// Sign in the user after account creation
		const session = await signInAccount({
			email: values.email,
			password: values.password,
		});
		if (!session) {
			return toast({
				title: "Sign in failed.",
				description: "Please try again.",
			});
		}

		// Check if user is authenticated, then redirect or show error
		const isLoggedIn = await checkAuthUser();
		if (isLoggedIn) {
			form.reset(); // Reset the form after successful signup and login
			navigate("/"); // Redirect to the home page
		} else {
			return toast({
				title: "Sign up failed.",
				description: "Please try again.",
			});
		}
	}

	return (
		<Form {...form}>
			<div className="sm:w-420 flex-center flex-col">
				{/* Logo */}
				<img
					src="/assets/images/logo.svg"
					alt="logo"
				/>

				{/* Signup header */}
				<h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
				<p className="text-light-3 small-medium md:base-regular mt-2">To use SwiftSnap, please enter your details</p>

				{/* Signup form */}
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-5 w-full mt-4"
				>
					{/* Name field */}
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input
										type="text"
										className="shad-input"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Username field */}
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input
										type="text"
										className="shad-input"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Email field */}
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										className="shad-input"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Password field */}
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										type="password"
										className="shad-input"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Submit button with loading state */}
					<Button
						type="submit"
						className="shad-button_primary"
						disabled={isSigningIn}
					>
						{isCreatingAccount ? (
							<div className="flex-center gap-2">
								<Loader />
								Loading...
							</div>
						) : (
							"Sign Up"
						)}
					</Button>

					{/* Link to sign-in page */}
					<p className="text-small-regular text-light-2 text-center mt-2">
						Already have an account?
						<Link
							to="/sign-in"
							className="text-primary-500 text-small-semibold ml-1 hover:underline"
						>
							Log In
						</Link>
					</p>
				</form>
			</div>
		</Form>
	);
};

export default SignupForm;
