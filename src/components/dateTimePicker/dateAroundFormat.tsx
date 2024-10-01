"use client"
import { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function dateAroundFormat() {
  const [value, onChange] = useState<Value>(new Date());
	return (
		<div className="p-4">
				<div className='flex bg-white rounded-md shadow-lg'>
					<div className='py-6 border-r border-gray-100'>
						<ul className='flex flex-col text-xs'>
							<li className='px-6 py-1.5 w-full leading-5'>Last 7 days</li>
							<li className='px-6 py-1.5 w-full leading-5'>Last 14 days</li>
							<li className='px-6 py-1.5 w-full leading-5'>Last 30 days</li>
							<li className='px-6 py-1.5 w-full leading-5'>Last 3 months</li>
							<li className='px-6 py-1.5 w-full leading-5'>Last 12 months</li>
							<li className='px-6 py-1.5 w-full leading-5'>Month to date</li>
							<li className='px-6 py-1.5 w-full leading-5'>Quarter to date</li>
							<li className='px-6 py-1.5 w-full leading-5'>All time</li>
							<li className='px-6 py-1.5 w-full leading-5'>Custom</li>
						</ul>
					</div>
					<div>
						<div className='flex flex-col px-6 pt-5 pb-6'>
							<div className='flex items-center justify-between'>
								<div>
									<ChevronLeft/>
								</div>
								<div>February</div>
								<div>
									<ChevronRight/>
								</div>
							</div>
							<div className='grid grid-cols-7 text-xs text-center text-gray-900'>
								<span className='flex items-center justify-center w-10 h-10 rounded-lg'>Mo</span>
								<span className='flex items-center justify-center w-10 h-10 rounded-lg'>Tu</span>
								<span className='flex items-center justify-center w-10 h-10 rounded-lg'>We</span>
								<span className='flex items-center justify-center w-10 h-10 rounded-lg'>Th</span>
								<span className='flex items-center justify-center w-10 h-10 rounded-lg'>Fri</span>
								<span className='flex items-center justify-center w-10 h-10 rounded-lg'>Sa</span>
								<span className='flex items-center justify-center w-10 h-10 rounded-lg'>Su</span>
							</div>
							<div className='grid grid-cols-7 text-xs text-center text-gray-900'>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>1</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>2</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>3</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>4</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>5</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>6</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>7</span>

								<span className='flex items-center justify-center w10 h-10 rounded-lg'>8</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>9</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>10</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>11</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>12</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>13</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>14</span>

								<span className='flex items-center justify-center w10 h-10 rounded-lg'>15</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>16</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>17</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>18</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>19</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>20</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>21</span>

								<span className='flex items-center justify-center w10 h-10 rounded-lg'>22</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>23</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>24</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>25</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>26</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>27</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>28</span>

								{/* <span className='flex items-center justify-center w10 h-10 rounded-lg'>29</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>30</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>31</span> */}
							</div>
						</div>
					</div>
					<div className='flex divide-x'>
						<div className='flex flex-col px-6 pt-5 pb-6'>
							<div className='flex items-center justify-between'>
								<div>
									<ChevronLeft/>
								</div>
								<div>February</div>
								<div>
									<ChevronRight/>
								</div>
							</div>
							<div className='grid grid-cols-7 text-xs text-center text-gray-900'>
								<span className='flex items-center justify-center w-10 h-10 rounded-lg'>Mo</span>
								<span className='flex items-center justify-center w-10 h-10 rounded-lg'>Tu</span>
								<span className='flex items-center justify-center w-10 h-10 rounded-lg'>We</span>
								<span className='flex items-center justify-center w-10 h-10 rounded-lg'>Th</span>
								<span className='flex items-center justify-center w-10 h-10 rounded-lg'>Fri</span>
								<span className='flex items-center justify-center w-10 h-10 rounded-lg'>Sa</span>
								<span className='flex items-center justify-center w-10 h-10 rounded-lg'>Su</span>
							</div>
							<div className='grid grid-cols-7 text-xs text-center text-gray-900'>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>1</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>2</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>3</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>4</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>5</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>6</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>7</span>

								<span className='flex items-center justify-center w10 h-10 rounded-lg'>8</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>9</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>10</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>11</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>12</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>13</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>14</span>

								<span className='flex items-center justify-center w10 h-10 rounded-lg'>15</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>16</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>17</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>18</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>19</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>20</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>21</span>

								<span className='flex items-center justify-center w10 h-10 rounded-lg'>22</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>23</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>24</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>25</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>26</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>27</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>28</span>

								{/* <span className='flex items-center justify-center w10 h-10 rounded-lg'>29</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>30</span>
								<span className='flex items-center justify-center w10 h-10 rounded-lg'>31</span> */}
							</div>
						</div>
					</div>
				</div>
		</div>
	)
}