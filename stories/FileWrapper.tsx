import React from 'react'

function FileWrapper(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <div className="container">
      {children}
    </div>
  )
}

export default FileWrapper