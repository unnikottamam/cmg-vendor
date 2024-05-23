import React from 'react'

const Loading = ({ text }: { text?: string }) => {
    return (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900">
                <span className="sr-only">Loading...</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
                {text || 'Loading...'}
            </p>
        </div>
    )
}

export default Loading