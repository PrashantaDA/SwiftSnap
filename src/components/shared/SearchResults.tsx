/* eslint-disable @typescript-eslint/no-explicit-any */

// Importing necessary components
import GridPostList from "./GridPostList"; // Component to display a list of posts in a grid
import Loader from "./Loader"; // Loader component for displaying loading state

// Defining the types for props
type SearchResultProps = {
	isSearchFetching: boolean; // Indicates if a search is in progress
	searchedPosts: any; // The result of the search; type should be more specific if possible
};

// SearchResults component definition
const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultProps) => {
	// Render loading indicator if the search is in progress
	if (isSearchFetching) {
		return <Loader />;
	}
	// Check if there are any searched posts to display
	else if (searchedPosts && searchedPosts.documents.length > 0) {
		return <GridPostList posts={searchedPosts.documents} />; // Render list of posts if found
	}
	// Render a message if no results are found
	else {
		return <p className="text-light-4 mt-10 text-center w-full">No results found</p>;
	}
};

export default SearchResults;
