"use client"

import GroupTypeSelector from '@/components/common/GroupTypeSelector';
import SearchInput from '@/components/common/SearchInput';
import PlaceDetail from '@/components/map/PlaceDetail';
import dynamic from 'next/dynamic'
import React from 'react'

const Map = dynamic(() => import('@/components/map/Map').then(m => m.default), { ssr: false });

const Main = () => {
  return (
    <>
      <div className='w-full h-full relative z-10'>      
        <Map />
      </div>
      <SearchInput />
      <GroupTypeSelector />
      <PlaceDetail /> 
    </>
    
  )
}

export default Main