"use client";

import { useState, useEffect } from "react";
import { customFetch } from "@/libs/fetch/customFetch";
import { CATEGORIES, RegularMeeting, FlashMeeting } from "@/types/meeting";
import MeetingCard from "@/components/meeting/MeetingCard";
import CategorySelector from "@/components/meeting/CategorySelector";

const Arounds = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTab, setSelectedTab] = useState<'regular' | 'flash'>('regular');
  const [regularMeetings, setRegularMeetings] = useState<RegularMeeting[]>([]);
  const [flashMeetings, setFlashMeetings] = useState<FlashMeeting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      
      if (selectedTab === 'regular') {
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }
        const url = `/meetings/regular${params.toString() ? `?${params.toString()}` : ''}`;
        const data = await customFetch.get<RegularMeeting[]>(url);
        setRegularMeetings(data);
      } else {
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }
        params.append('active', 'true');
        const url = `/meetings/flash?${params.toString()}`;
        const data = await customFetch.get<FlashMeeting[]>(url);
        setFlashMeetings(data);
      }
    } catch (error) {
      console.error('Failed to fetch meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [selectedCategory, selectedTab]);

  const currentMeetings = selectedTab === 'regular' ? regularMeetings : flashMeetings;

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white p-4 pb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-4">둘러보기</h1>
        
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSelectedTab('regular')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedTab === 'regular'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            정기 모임
          </button>
          <button
            onClick={() => setSelectedTab('flash')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedTab === 'flash'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            번개 모임
          </button>
        </div>

        <CategorySelector
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
      </div>

      <div className="p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        ) : currentMeetings.length === 0 ? (
          <div className="flex flex-col items-center py-12">
            <div className="text-gray-400 text-4xl mb-2">🔍</div>
            <div className="text-gray-500 text-center">
              <p>해당 카테고리의 모임이 없습니다</p>
              <p className="text-sm mt-1">다른 카테고리를 선택해보세요</p>
            </div>
          </div>
        ) : (
          currentMeetings.map((meeting) => (
            <MeetingCard
              key={meeting.meetingId}
              meeting={meeting}
              type={selectedTab}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Arounds;