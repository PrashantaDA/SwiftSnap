import { useState, useEffect } from "react"; // Importing necessary React hooks
import { Input } from "@/components/ui/input"; // Input component for search functionality
import GridPostList from "@/components/shared/GridPostList"; // Component to display posts in a grid
import Loader from "@/components/shared/Loader"; // Loader component for loading states
import SearchResults from "@/components/shared/SearchResults"; // Component to display search results
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queriesAndMutations"; // Custom hooks for fetching posts

import { useInView } from "react-intersection-observer"; // Hook for detecting when an element is in view
import useDebounce from "@/hooks/useDebounce"; // Custom hook for debouncing input values

const Explore = () => {
	// Set up intersection observer for infinite scrolling
	const { ref, inView } = useInView();

	// Fetching posts and handling pagination
	const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();

	// State for managing the search input value
	const [searchValue, setSearchValue] = useState("");

	// Debounced version of the search value
	const debouncedValue = useDebounce(searchValue, 500);

	// Fetching searched posts based on the debounced search value
	const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedValue);

	// Fetch next page of posts when the user scrolls to the bottom and no search is active
	useEffect(() => {
		if (inView && !searchValue) fetchNextPage();
	}, [inView, searchValue, fetchNextPage]);

	// Render a loader if posts data is not available yet
	if (!posts) {
		return (
			<div className="flex-center w-full h-full">
				<Loader />
			</div>
		);
	}

	// Conditions to determine what to show
	const shouldShowSearchResults = searchValue !== ""; // Check if there's a search value
	const shouldShowPosts = !shouldShowSearchResults && posts.pages.every((item) => item?.documents.length === 0); // Check if there are no posts to show

	return (
		<div className="explore-container">
			{/* Search Input Section */}
			<div className="explore-inner_container">
				<h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
				<div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
					<img
						src="/assets/icons/search.svg"
						alt="search"
						width={24}
						height={24}
					/>
					<Input
						type="text"
						placeholder="Search..."
						className="explore-search"
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)} // Update search value on input change
					/>
				</div>
			</div>

			{/* Popular Posts Header */}
			<div className="flex-between w-full max-w-5xl mt-16 mb-8">
				<h3 className="body-bold md:h3-bold">Popular Today</h3>
				<div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
					<p className="small-medium md:base-medium text-light-2">All</p>
					<img
						src="/assets/icons/filter.svg"
						alt="filter"
						width={20}
						height={20}
					/>
				</div>
			</div>

			{/* Posts or Search Results Display */}
			<div className="flex flex-wrap gap-9 w-full max-w-5xl">
				{shouldShowSearchResults ? (
					<SearchResults
						isSearchFetching={isSearchFetching}
						searchedPosts={searchedPosts} // Display search results
					/>
				) : shouldShowPosts ? (
					<p className="text-light-4 mt-10 text-center w-full">End of posts</p> // Message when there are no posts
				) : (
					posts.pages.map((item, index) => (
						<GridPostList
							key={`page-${index}`} // Unique key for each post grid
							posts={item.documents} // Pass the documents to the grid
						/>
					))
				)}
			</div>

			{/* Loader for infinite scrolling */}
			{hasNextPage && !searchValue && (
				<div
					ref={ref}
					className="mt-10"
				>
					<Loader />
				</div>
			)}
		</div>
	);
};

export default Explore;
