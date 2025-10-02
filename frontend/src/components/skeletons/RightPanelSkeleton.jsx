const RightPanelSkeleton = () => {
	return (
		<div className='flex flex-col gap-2 w-52 my-2'>
			<div className='flex gap-2 items-center'>
				<div className='skeleton w-8 h-8 rounded-full shrink-0'></div>
				<div className='flex flex-1 justify-between'>
					<div className='flex flex-col gap-1'>
						<div className='skeleton h-2 w-12 rounded-full'></div>
						<div className='skeleton h-2 w-16 rounded-full'></div>
					</div>
					<div className='skeleton h-6 w-14 rounded-full'></div>
				</div>
			</div>
		</div>
//         <div className="flex w-52 flex-col gap-4">
//   <div className="flex items-center gap-4">
//     <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
//     <div className="flex flex-col gap-4">
//       <div className="skeleton h-4 w-20"></div>
//       <div className="skeleton h-4 w-28"></div>
//     </div>
//   </div>
// </div>
	);
};
export default RightPanelSkeleton;