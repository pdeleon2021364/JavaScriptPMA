import React from 'react'

export const Spinner = () => {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-16 w-16 border-blue-500 border-t-transparent border-blue-500'>
        </div>
    </div>
  )
}
