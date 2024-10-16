// Importing necessary libraries for routing and constants
import { Link, useLocation } from "react-router-dom"; // React Router for navigation
import { bottombarLinks } from "@/constants"; // Constants for the links in the bottom bar

const Bottombar = () => {
	// Get the current pathname from the location object to determine active link
	const { pathname } = useLocation();

	return (
		<section className="bottom-bar">
			{" "}
			{/* Main section for the bottom navigation bar */}
			{/* Mapping through each link in bottombarLinks to create navigation items */}
			{bottombarLinks.map((link) => {
				// Determine if the current link is active based on the pathname
				const isActive = pathname === link.route;

				return (
					<Link
						to={link.route} // Navigate to the specified route
						key={link.label} // Use label as a unique key for each link
						className={`${isActive ? "bg-primary-500 rounded-[10px]" : ""} flex-center flex-col gap-1 p-2 transition`} // Apply active styles conditionally
					>
						<img
							src={link.imgURL} // Image URL for the navigation icon
							alt={link.label} // Alt text for accessibility
							width={16} // Fixed width for the icon
							height={16} // Fixed height for the icon
							className={`${isActive ? "invert-white" : ""}`} // Invert icon color if active
						/>
						<p className="tiny-medium text-light-2">{link.label}</p> {/* Label for the link */}
					</Link>
				);
			})}
		</section>
	);
};

export default Bottombar;
