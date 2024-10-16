// Import hooks and components
import { useToast } from "@/hooks/use-toast"; // Custom hook for toast notifications
import Loader from "@/components/shared/Loader"; // Loader component for loading states

import { useGetUsers } from "@/lib/react-query/queriesAndMutations"; // Custom hook to fetch users
import UserCard from "@/components/shared/UserCard"; // Component to display individual user information

const AllUsers = () => {
	const { toast } = useToast(); // Initialize the toast notification hook

	// Fetch users data using a custom hook, handling loading and error states
	const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();

	// Show a toast notification if there's an error fetching users
	if (isErrorCreators) {
		toast({ title: "Something went wrong." });
		return null; // Exit the component if there is an error
	}

	return (
		<div className="common-container">
			<div className="user-container">
				{/* Section heading */}
				<h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>

				{/* Display a loader while the users are being fetched */}
				{isLoading && !creators ? (
					<Loader />
				) : (
					// Display a grid of user cards once the data is loaded
					<ul className="user-grid">
						{creators?.documents.map((creator) => (
							<li
								key={creator?.$id}
								className="flex-1 min-w-[200px] w-full"
							>
								{/* Render the UserCard component for each user */}
								<UserCard user={creator} />
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default AllUsers;
