// Importing necessary hooks and components
import { useGetUsers } from "@/lib/react-query/queriesAndMutations"; // Hook to fetch users
import { useToast } from "@/hooks/use-toast"; // Custom hook for toast notifications
import UserCard from "./UserCard"; // User card component for displaying individual users
import Loader from "./Loader"; // Loader component for displaying loading state

// RightSidebar component definition
const RightSidebar = () => {
	// Initialize toast notification hook
	const { toast } = useToast();

	// Fetching top creators data using custom hook
	const { data: creators, isPending, isError: isErrorCreators } = useGetUsers();

	// Handle error state when fetching creators
	if (isErrorCreators) {
		toast({
			title: "Failed to fetch creators", // Show error message if fetching fails
		});
		return null; // Return null to prevent rendering any further
	}

	return (
		<div className="rightsidebar">
			{" "}
			{/* Sidebar container */}
			<div className="px-4 py-10">
				{" "}
				{/* Header section */}
				<h2 className="h3-bold md:h2-bold text-left w-full">Top Creators</h2> {/* Section title */}
			</div>
			{isPending && !creators ? ( // Display loader while data is being fetched
				<Loader />
			) : (
				<ul className="flex flex-col gap-6 overflow-x-auto custom-scrollbar">
					{" "}
					{/* List of creators */}
					{creators?.documents.map(
						(
							creator // Mapping over fetched creators
						) => (
							<li
								key={creator?.$id} // Unique key for each creator
								className="px-3"
							>
								<UserCard user={creator} /> {/* UserCard component for each creator */}
							</li>
						)
					)}
				</ul>
			)}
		</div>
	);
};

export default RightSidebar;
