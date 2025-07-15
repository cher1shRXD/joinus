"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/user";
import { customFetch } from "@/libs/fetch/customFetch";
import { cookieManager } from "@/libs/cookie/cookie";
import { useCustomRouter } from "@/hooks/common/useCustomRouter";
import { User } from "@/types/user";
import { LogOut } from "lucide-react";

const Profile = () => {
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(true);
  const router = useCustomRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user) {
          const userData = await customFetch.get<User>('/users/me');
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, setUser]);

  const handleLogout = async () => {
    try {
      await cookieManager.delete("accessToken");
      setUser(null);
      router.replace('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const formatFirebaseDate = (timestamp: { _seconds: number; _nanoseconds: number }) => {
    return new Date(timestamp._seconds * 1000).toLocaleDateString('ko-KR');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">로그인이 필요합니다</div>
      </div>
    );
  }

  const imageUrl = user.profileImageUrl?.startsWith('/uploads')
    ? `${process.env.NEXT_PUBLIC_API_URL}${user.profileImageUrl}`
    : user.profileImageUrl;

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-2xl p-6 mb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={user.nickname} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-[#FF582A] flex items-center justify-center">
                  <span className="text-white text-xl font-medium">
                    {user.nickname.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{user.nickname}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">관심사</h3>
            <div className="flex flex-wrap gap-2">
              {user.interests && user.interests.length > 0 ? (
                user.interests.map((interest, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">관심사가 설정되지 않았습니다</span>
              )}
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">가입일:</span>
              <span className="text-gray-900">
                {formatFirebaseDate(user.createdAt)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">마지막 업데이트:</span>
              <span className="text-gray-900">
                {formatFirebaseDate(user.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;