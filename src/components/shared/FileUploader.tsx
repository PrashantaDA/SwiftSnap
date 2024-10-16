// Importing necessary hooks and components
import { useCallback, useState } from "react"; // React hooks for managing state and memoization
import { FileWithPath, useDropzone } from "react-dropzone"; // Dropzone library for file drag-and-drop functionality
import { Button } from "../ui/button"; // Button component for user interactions
import { convertFileToUrl } from "@/lib/utils"; // Utility function to convert files to URLs

// Type definition for the props that FileUploader will receive
type FileUploaderProps = {
	fieldChange: (files: File[]) => void; // Callback function to handle file changes
	mediaUrl: string; // Initial media URL to display (if any)
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
	// Local state to manage selected files and their URL
	const [file, setFile] = useState<File[]>([]); // State to hold the uploaded files
	const [fileUrl, setFileUrl] = useState<string>(mediaUrl); // State to hold the URL of the uploaded file

	// Function to handle file drop events
	const onDrop = useCallback(
		(acceptedFiles: FileWithPath[]) => {
			setFile(acceptedFiles); // Set the accepted files in state
			fieldChange(acceptedFiles); // Call the passed in fieldChange function with the accepted files
			setFileUrl(convertFileToUrl(acceptedFiles[0])); // Convert the first accepted file to a URL and update state
		},
		[file] // Dependency array; fieldChange is added here to prevent stale closure issues
	);

	// Setup dropzone configuration for file uploads
	const { getRootProps, getInputProps } = useDropzone({
		onDrop, // Specify the onDrop handler
		accept: {
			"image/*": [".png", ".jpeg", ".jpg"], // Accept only image files
		},
	});

	return (
		<div
			{...getRootProps()} // Spread the dropzone props to the outer div
			className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
		>
			<input
				{...getInputProps()} // Spread the input props to the hidden file input
				className="cursor-pointer"
			/>

			{/* Display the uploaded image if a valid file URL exists */}
			{fileUrl ? (
				<>
					<div className="flex flex-1 justify-center w-full p-5 lg:p-10">
						<img
							src={fileUrl} // Use the file URL for the image source
							alt="image" // Accessibility label for the image
							className="file_uploader-img"
						/>
					</div>
					<p className="file_uploader-label">Click or drag photo to replace</p>
				</>
			) : (
				// Display the upload prompt if no file is selected
				<div className="file_uploader-box">
					<img
						src="/assets/icons/file-upload.svg" // Icon for file upload
						width={96}
						height={77}
						alt="file upload" // Accessibility label for the upload icon
					/>

					<h3 className="base-medium text-light-2 mb-2 mt-6">Drag photo here</h3>
					<p className="text-light-4 small-regular mb-6">JPEG, PNG, JPG</p>

					<Button
						type="button"
						className="shad-button_dark_4" // Button for selecting files from the computer
					>
						Select from computer
					</Button>
				</div>
			)}
		</div>
	);
};

export default FileUploader;
