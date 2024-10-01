"use client";

import React, {useState} from 'react';
import Link from "next/link";
import {
	ChevronFirst,
	ChevronLast,
	Search 
} from 'lucide-react'

interface SidebarMenu {
	name: string,
	href: string,
	current: boolean
}

interface SidebarProps {
	props: SidebarMenu[];
}

const Sidebar: React.FC<SidebarProps> = ({props}) => {
  const [open, setOpen] = useState(true)
  return (
		<div className='flex'>
			<div className={`bg-gray-200 h-screen p-5 pt-2 ${open ? "w-48" : "w-15"} duration-300 relative`}>
				<ChevronFirst 
				className={`bg-white text-black text-3xl rounded-lg
				absolute -right-3 top-2 border border-black cursor-pointer
				${!open && 'rotate-180'}`} onClick={() => setOpen(!open)}/>
				{
					open ?
					<>
						<div className={`flex items-center rounded-md bg-gray-100 mt-6 mb-2 ${!open ? 'px-4' : 'px-2.5'} py-1`}>
							<Search className={`text-black text-lg block float-left cursor-point ${open && 'mr-2'}`}/>
							<input type={'search'} placeholder='Search'
							className={`text-base bg-transparent w-full text-black focus:outline-none`}/>
						</div> 
						{
							props.map((data, index) => (
								<Link 
									key={index}
									href={data.href}
									className='text-black text-sm flex items-center gap-x-4
									cursor-pointer p-2 hover:bg-gray-400 rounded-md'>
										<span>{data.name}</span>
								</Link>
							))
						}
					</>:<></>
				}
			</div>
		</div>
  )
}

export default Sidebar