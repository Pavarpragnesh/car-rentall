import React from 'react'
import Title from '../../components/owner/Title'

const Rating = () => {
  return (
    <div className='px-4 pt-10 md:px-10 flex-1'>

      <Title
        title="Ratings"
        subTitle="User reviews and ratings"
      />

      <div className='mt-6 border border-borderColor rounded-md p-6'>

        {[1,2,3].map((item)=>(
          <div key={item} className='flex justify-between items-center border-b py-3'>

            <div>
              <p className='font-medium'>User {item}</p>
              <p className='text-sm text-gray-500'>Car Model XYZ</p>
            </div>

            <div className='text-yellow-500 text-lg'>
              ⭐⭐⭐⭐☆
            </div>

          </div>
        ))}

        <p className='text-center text-gray-400 mt-4 text-sm'>
          Demo Page (Backend later)
        </p>

      </div>

    </div>
  )
}

export default Rating