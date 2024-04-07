import React, { PropsWithChildren } from 'react'

const ErrorMesssage = ({ children }: PropsWithChildren) => {
    if (!children) return null;
    return <div role="alert" className="bg-red-100 border border-red-300 text-red-700 px-3 py-1 rounded relative text-xs">{children}</div>
}

export default ErrorMesssage;