import React ,{useId}from 'react'
import { forwardRef } from 'react';

function Select({
    options,
    label,
    className,
    ...props
},ref) {
    const id=useId();
  return (
    <div className='w-full'>
      {label && <label htmlFor={id} className=''></label>}
      <select {...props} id={id} className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`} ref={ref}>
        {options?.map((option)=>(
            <option value={option} key={option}>
                {option}
            </option>
        ))}
      </select>
    </div>
  )
}

export default forwardRef(Select)
// another syntax easy also for writing forwardRef also why we not write ref in {} while we write all props in this bcz 
// Props come as the first argument {...props}.
// ref is passed as a second argument, separate from props.
// That's why you cannot destructure ref inside {}. 
