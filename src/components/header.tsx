"use client";

import React, {useState} from "react";
import Link from "next/link";

interface ListMenu {
	name: string,
	href: string,
	current: boolean
}

interface ListAlarm {
	alarmTime: string,
	log: string,
	status: string
}

interface headerProps {
	menu: ListMenu[];
	alarm: ListAlarm[];
}

const Header: React.FC<headerProps> = ({menu, alarm}) => {
	const [isClick, setIsClick] = useState(false);
	const toggleNavbar = () => {
		setIsClick(!isClick);
	}
	return (
		<nav>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-20">
					<div className="flex w-1/6 justify-center">
						<Link href="/" className="text-black">
							Logo
						</Link>
					</div>
					<div className="flex w-4/6">
						{/* <div className="grid grid-flow-row auto-rows-max border border-black w-full">
							{alarm.map((item, index) => (
								<div key={index} className="flex grid grid-flow-col justify-between auto-cols-max">
									<a className="mr-2 text-xs">{item.alarmTime}</a>
									<a className="mx-2 text-xs">{item.log}</a>
									<a className="ml-2 text-xs">{item.status}</a>
								</div>
							))}
						</div> */}
					</div>
					<div className="flex w-1/6 justify-center">
						<Link href="/" className="text-black">
							Admin
						</Link>
					</div>
				</div>
			</div>
			<div className="bg-black">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-10">
						<div className="hidden sm:block">
							<div className="flex items-center space-x-4">
									{menu.map((item) => (
										<Link
											key={item.name}
											href={item.href}
											aria-current={item.current ? 'page' : undefined}
											className={item.current ? 'bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium' 
												: 'text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium'}
										>
											{item.name}
										</Link>
									))}
							</div>
						</div>
						<div className="sm:hidden flex items-center">
							<button 
							className="inline-flex items-center justify-center p-2 rounded-md text-white
							hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring_white"
							onClick={toggleNavbar}>
								{isClick ? (
									<svg
									className="h-6 w-6"
									xmlns="http://www.w4.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6L12 12"
										/>
									</svg>
								):(
									<svg
									className="h-6 w-6"
									xmlns="http://www.w4.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 6h16M4 12h16m-7 6h7"
										/>
									</svg>
								)}
							</button>
						</div>
					</div>
				</div>
				{isClick && (
					<div className="sm:hidden">
						<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
							{menu.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									aria-current={item.current ? 'page' : undefined}
									className={item.current ? 'bg-gray-900 block text-white rounded-md px-3 py-2 text-sm font-medium' 
										: 'text-gray-300 block hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium'}
								>
									{item.name}
								</Link>
							))}
						</div>
					</div>
				)}
			</div>
		</nav>
	)
}

export default Header