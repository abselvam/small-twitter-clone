const LoadingSpinner = ({ size = "md" }) => {
	const sizeClass = `loading-${size}`;

	return <span className={`loading loading-spinner ${sizeClass}`} />;
};
export default LoadingSpinner;
// import React from 'react'

// const LoadingSpinner = () => {
//   return (
//     <span className="loading loading-spinner loading-md"></span>
//   )
// }

// export default LoadingSpinner