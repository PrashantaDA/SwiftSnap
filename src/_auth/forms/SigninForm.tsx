// External Libraries
import * as z from "zod"; // Zod library for schema validation
import { useForm } from "react-hook-form"; // React Hook Form for managing form state
import { zodResolver } from "@hookform/resolvers/zod"; // Resolver to integrate Zod with React Hook Form
import { Link, useNavigate } from "react-router-dom"; // React Router functions for navigation

// UI Components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // Custom form components
import { Input } from "@/components/ui/input"; // Custom input component
import { Button } from "@/components/ui/button"; // Custom button component
import Loader from "@/components/shared/Loader"; // Loader component for displaying loading states

// Custom Hooks
import { useToast } from "@/hooks/use-toast"; // Toast notification hook

// Validation Schema and API
import { SigninValidation } from "@/lib/validation"; // Zod schema for sign-in form validation
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations"; // React Query mutation for signing in

// Context
import { useUserContext } from "@/context/AuthContext"; // Auth context for managing user session

// SigninForm Component
const SigninForm = () => {
	// Initialize toast notifications
	const { toast } = useToast();

	// React Router's navigation hook
	const navigate = useNavigate();

	// Destructuring user context functions and loading state
	const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

	// Sign-in API call (using React Query)
	const { mutateAsync: signInAccount, isPending } = useSignInAccount();

	// Initialize the form with default values and Zod resolver for validation
	const form = useForm<z.infer<typeof SigninValidation>>({
		resolver: zodResolver(SigninValidation),
		defaultValues: {
			email: "", // Default email field
			password: "", // Default password field
		},
	});

	// Handle form submission and sign-in logic
	const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
		// Attempt to sign in the user
		const session = await signInAccount(user);

		// If the sign-in fails, show error toast
		if (!session) {
			toast({ title: "Login failed. Please try again." });
			return;
		}

		// If sign-in is successful, check if the user is authenticated
		const isLoggedIn = await checkAuthUser();

		// If authenticated, reset the form and navigate to the home page
		if (isLoggedIn) {
			form.reset();
			navigate("/");
		} else {
			// If not authenticated, show error toast
			toast({ title: "Login failed. Please try again." });
		}
	};

	return (
		<Form {...form}>
			<div className="sm:w-420 flex-center flex-col">
				<img
					src="/assets/images/logo.svg"
					alt="logo"
				/>

				<h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Log in to your account</h2>
				<p className="text-light-3 small-medium md:base-regular mt-2">Welcome back! Please enter your details.</p>

				{/* Sign-in Form */}
				<form
					onSubmit={form.handleSubmit(handleSignin)}
					className="flex flex-col gap-5 w-full mt-4"
				>
					{/* Email Field */}
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
										autoComplete="off"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Password Field */}
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="shad-form_label">Password</FormLabel>
								<FormControl>
									<Input
										type="password"
										className="shad-input"
										{...field}
										autoComplete="off"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Submit Button */}
					<Button
						type="submit"
						className="shad-button_primary"
					>
						{isPending || isUserLoading ? (
							<div className="flex-center gap-2">
								<Loader /> Loading...
							</div>
						) : (
							"Log in"
						)}
					</Button>

					{/* Redirect to Sign-up */}
					<p className="text-small-regular text-light-2 text-center mt-2">
						Don&apos;t have an account?
						<Link
							to="/sign-up"
							className="text-primary-500 text-small-semibold ml-1"
						>
							Sign up
						</Link>
					</p>
				</form>
			</div>
		</Form>
	);
};

export default SigninForm;
