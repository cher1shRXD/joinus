import Tabbar from '@/components/common/Tabbar'
import React, { PropsWithChildren } from 'react'

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-full h-screen flex flex-col">
      <div className="w-full h-[calc(100vh-64px)]">
        {children}
      </div>
      <Tabbar />
    </div>
  )
}

export default MainLayout