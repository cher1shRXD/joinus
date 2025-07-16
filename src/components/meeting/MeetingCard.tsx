import { RegularMeeting, FlashMeeting } from "@/types/meeting";
import { useCustomRouter } from "@/hooks/common/useCustomRouter";
import { Users, MapPin, Clock, Calendar } from "lucide-react";

interface MeetingCardProps {
  meeting: RegularMeeting | FlashMeeting;
  type: 'regular' | 'flash';
}

const MeetingCard = ({ meeting, type }: MeetingCardProps) => {
  const router = useCustomRouter();

  const handleClick = () => {
    router.push(`/meeting/${type}/${meeting.meetingId}`);
  };

  const formatFlashTime = (timestamp: { _seconds: number; _nanoseconds: number } | string) => {
    const date = typeof timestamp === 'string' 
      ? new Date(timestamp)
      : new Date(timestamp._seconds * 1000);
    const now = new Date();
    const diffHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return date.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    return date.toLocaleDateString('ko-KR', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getImageUrl = () => {
    if (type === 'regular') {
      const regularMeeting = meeting as RegularMeeting;
      if (regularMeeting.photos && regularMeeting.photos.length > 0) {
        const photo = regularMeeting.photos[0];
        return photo.startsWith('/uploads') 
          ? `${process.env.NEXT_PUBLIC_API_URL}${photo}` 
          : photo;
      }
    }
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-2xl p-4 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex gap-3">
        <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={meeting.name}
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-lg font-medium">
                {meeting.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 text-base truncate pr-2">
              {meeting.name}
            </h3>
            {type === 'regular' && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full flex-shrink-0">
                정기
              </span>
            )}
            {type === 'flash' && (
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full flex-shrink-0">
                번개
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {meeting.description}
          </p>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin size={12} />
              <span className="truncate">{meeting.location.addressString}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Users size={12} />
              <span>{meeting.members.length}명 참여</span>
              {type === 'flash' && (
                <>
                  <span>•</span>
                  <span>최대 {(meeting as FlashMeeting).memberLimit}명</span>
                </>
              )}
            </div>
            
            {type === 'flash' && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock size={12} />
                <span>{formatFlashTime((meeting as FlashMeeting).startTime)}</span>
                <span>•</span>
                <span>{(meeting as FlashMeeting).expectedDurationMinutes}분</span>
              </div>
            )}
            
            {type === 'regular' && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar size={12} />
                <span>
                  {(meeting as RegularMeeting).requiresApproval ? '승인 필요' : '자유 참여'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingCard;