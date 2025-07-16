interface MapIconProps {
  className?: string;
  backgroundColor?: string;
  iconColor?: string;
}

// 사용자 위치 아이콘
export const UserLocationIcon = ({
  className = "w-8 h-8",
  backgroundColor = "#3B82F6",
  iconColor = "white",
}: MapIconProps) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="15"
      fill={backgroundColor}
      stroke="white"
      strokeWidth="2"
    />
    <circle cx="16" cy="16" r="5" fill={iconColor} />
    <circle
      cx="16"
      cy="16"
      r="9"
      fill="none"
      stroke={iconColor}
      strokeWidth="1.5"
      opacity="0.4"
    />
  </svg>
);

// 운동/스포츠 - 덤벨 아이콘
export const FitnessMapIcon = ({
  className = "w-8 h-8",
  backgroundColor = "#EF4444",
}: MapIconProps) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="15"
      fill={backgroundColor}
      stroke="white"
      strokeWidth="2"
    />
    <rect x="8" y="15" width="16" height="2" fill="white" rx="1" />
    <rect x="6" y="13" width="4" height="6" fill="white" rx="2" />
    <rect x="22" y="13" width="4" height="6" fill="white" rx="2" />
  </svg>
);

// 자기계발 - 성장 화살표
export const SelfDevelopmentMapIcon = ({
  className = "w-8 h-8",
  backgroundColor = "#10B981",
}: MapIconProps) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="15"
      fill={backgroundColor}
      stroke="white"
      strokeWidth="2"
    />
    <path
      d="M16 24L16 8M16 8L12 12M16 8L20 12"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 20L16 16L20 20"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.7"
    />
  </svg>
);

// 인문학/책/글 - 깔끔한 책
export const BookMapIcon = ({
  className = "w-8 h-8",
  backgroundColor = "#8B5CF6",
}: MapIconProps) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="15"
      fill={backgroundColor}
      stroke="white"
      strokeWidth="2"
    />
    <rect x="10" y="9" width="12" height="14" rx="1" fill="white" />
    <path
      d="M13 13h6M13 16h6M13 19h4"
      stroke={backgroundColor}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path d="M10 9v14" stroke={backgroundColor} strokeWidth="1.5" />
  </svg>
);

// 외국/언어 - 지구본
export const LanguageMapIcon = ({
  className = "w-8 h-8",
  backgroundColor = "#06B6D4",
}: MapIconProps) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="15"
      fill={backgroundColor}
      stroke="white"
      strokeWidth="2"
    />
    <circle cx="16" cy="16" r="8" fill="none" stroke="white" strokeWidth="2" />
    <path
      d="M8 16h16M16 8c-3 2.5-3 11.5 0 16M16 8c3 2.5 3 11.5 0 16"
      stroke="white"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

// 음악/악기 - 음표
export const MusicMapIcon = ({
  className = "w-8 h-8",
  backgroundColor = "#F59E0B",
}: MapIconProps) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="15"
      fill={backgroundColor}
      stroke="white"
      strokeWidth="2"
    />
    <path d="M12 20c0 1.5 1 3 3 3s3-1.5 3-3-1-3-3-3-3 1.5-3 3z" fill="white" />
    <path
      d="M18 17V8l6-1v10"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="21" cy="17" r="2" fill="white" />
  </svg>
);

// 스포츠관람 - 축구공
export const SportsMapIcon = ({
  className = "w-8 h-8",
  backgroundColor = "#DC2626",
}: MapIconProps) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="15"
      fill={backgroundColor}
      stroke="white"
      strokeWidth="2"
    />
    <circle cx="16" cy="16" r="8" fill="white" />
    <path
      d="M16 8v16M8 16h16M12 10l8 12M20 10l-8 12"
      stroke={backgroundColor}
      strokeWidth="1.5"
    />
  </svg>
);

// 아웃도어/여행 - 산
export const OutdoorMapIcon = ({
  className = "w-8 h-8",
  backgroundColor = "#059669",
}: MapIconProps) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="15"
      fill={backgroundColor}
      stroke="white"
      strokeWidth="2"
    />
    <path d="M6 22L12 12L16 16L20 10L26 22Z" fill="white" stroke="none" />
    <circle cx="22" cy="12" r="2" fill="white" />
  </svg>
);

// 업종/직무 - 서류가방
export const WorkMapIcon = ({
  className = "w-8 h-8",
  backgroundColor = "#6B7280",
}: MapIconProps) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="15"
      fill={backgroundColor}
      stroke="white"
      strokeWidth="2"
    />
    <rect x="8" y="13" width="16" height="10" rx="2" fill="white" />
    <rect x="12" y="9" width="8" height="4" rx="1" fill="white" />
    <path
      d="M16 17v3"
      stroke={backgroundColor}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// 문화/공연 - 마스크
export const CultureMapIcon = ({
  className = "w-8 h-8",
  backgroundColor = "#EC4899",
}: MapIconProps) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="15"
      fill={backgroundColor}
      stroke="white"
      strokeWidth="2"
    />
    <path
      d="M10 14c0-2 2-4 6-4s6 2 6 4v6c0 2-2 4-6 4s-6-2-6-4v-6z"
      fill="white"
    />
    <path
      d="M13 16c0 1 1 2 3 2s3-1 3-2"
      stroke={backgroundColor}
      strokeWidth="1.5"
      fill="none"
    />
    <circle cx="13" cy="13" r="1" fill={backgroundColor} />
    <circle cx="19" cy="13" r="1" fill={backgroundColor} />
  </svg>
);

// 공예/만들기 - 브러시
export const CraftMapIcon = ({
  className = "w-8 h-8",
  backgroundColor = "#F97316",
}: MapIconProps) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="15"
      fill={backgroundColor}
      stroke="white"
      strokeWidth="2"
    />
    <path d="M12 8h8v4h-8z" fill="white" />
    <path d="M14 12v8c0 2 1 4 2 4s2-2 2-4v-8" fill="white" />
    <path d="M12 8L16 6L20 8" stroke="white" strokeWidth="1.5" fill="none" />
  </svg>
);

// 댄스/무용 - 댄서
export const DanceMapIcon = ({
  className = "w-8 h-8",
  backgroundColor = "#A855F7",
}: MapIconProps) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="15"
      fill={backgroundColor}
      stroke="white"
      strokeWidth="2"
    />
    <circle cx="15" cy="10" r="2.5" fill="white" />
    <path
      d="M15 12.5v6l-3 4.5M15 15l4-1v6l2 3"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 봉사활동 - 하트
export const VolunteerMapIcon = ({
  className = "w-8 h-8",
  backgroundColor = "#EF4444",
}: MapIconProps) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="15"
      fill={backgroundColor}
      stroke="white"
      strokeWidth="2"
    />
    <path
      d="M16 22c-4-3-7-6-7-10 0-2.5 2-4.5 4.5-4.5 1.5 0 2.5 1 2.5 2.5 0-1.5 1-2.5 2.5-2.5 2.5 0 4.5 2 4.5 4.5 0 4-3 7-7 10z"
      fill="white"
    />
  </svg>
);

// 사교/인맥 - 사람들
export const NetworkingMapIcon = ({
  className = "w-8 h-8",
  backgroundColor = "#3B82F6",
}: MapIconProps) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="15"
      fill={backgroundColor}
      stroke="white"
      strokeWidth="2"
    />
    <circle cx="12" cy="12" r="3" fill="white" />
    <circle cx="20" cy="12" r="3" fill="white" />
    <circle cx="16" cy="20" r="3" fill="white" />
    <path
      d="M14.5 14.5l3 3M17.5 14.5l-3 3"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// 차/바이크 - 자동차
export const VehicleMapIcon = ({
  className = "w-8 h-8",
  backgroundColor = "#1F2937",
}: MapIconProps) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="15"
      fill={backgroundColor}
      stroke="white"
      strokeWidth="2"
    />
    <rect x="8" y="15" width="16" height="6" rx="2" fill="white" />
    <circle cx="12" cy="22" r="2" fill="white" />
    <circle cx="20" cy="22" r="2" fill="white" />
    <path d="M8 15l2-3h12l2 3" fill="white" />
    <rect x="10" y="13" width="2" height="2" fill={backgroundColor} />
    <rect x="20" y="13" width="2" height="2" fill={backgroundColor} />
  </svg>
);

// 사진/영상 - 카메라
export const PhotoMapIcon = ({
  className = "w-8 h-8",
  backgroundColor = "#06B6D4",
}: MapIconProps) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="15"
      fill={backgroundColor}
      stroke="white"
      strokeWidth="2"
    />
    <rect x="8" y="12" width="16" height="10" rx="2" fill="white" />
    <circle cx="16" cy="17" r="3" fill={backgroundColor} />
    <rect x="13" y="9" width="6" height="3" rx="1" fill="white" />
    <circle cx="21" cy="14" r="1" fill={backgroundColor} />
  </svg>
);

// 게임/오락 - 게임패드
export const GameMapIcon = ({
  className = "w-8 h-8",
  backgroundColor = "#7C3AED",
}: MapIconProps) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="15"
      fill={backgroundColor}
      stroke="white"
      strokeWidth="2"
    />
    <rect x="8" y="13" width="16" height="8" rx="4" fill="white" />
    <path
      d="M11 15v4M9 17h4"
      stroke={backgroundColor}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="19" cy="16" r="1.5" fill={backgroundColor} />
    <circle cx="21" cy="18" r="1.5" fill={backgroundColor} />
  </svg>
);

// 요리/제조 - 요리사 모자
export const CookingMapIcon = ({
  className = "w-8 h-8",
  backgroundColor = "#F59E0B",
}: MapIconProps) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="15"
      fill={backgroundColor}
      stroke="white"
      strokeWidth="2"
    />
    <path d="M10 18h12v4c0 1-1 2-2 2h-8c-1 0-2-1-2-2v-4z" fill="white" />
    <path d="M10 18c0-4 2-6 6-6s6 2 6 6" fill="white" />
    <path
      d="M13 10c0-1 1-2 2-2M16 8c0-1 1-2 2-2M19 10c0-1 1-2 2-2"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// 반려동물 - 발톱
export const PetMapIcon = ({
  className = "w-8 h-8",
  backgroundColor = "#F97316",
}: MapIconProps) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="15"
      fill={backgroundColor}
      stroke="white"
      strokeWidth="2"
    />
    <ellipse cx="16" cy="18" rx="5" ry="3" fill="white" />
    <ellipse cx="12" cy="12" rx="2" ry="3" fill="white" />
    <ellipse cx="20" cy="12" rx="2" ry="3" fill="white" />
    <ellipse cx="10" cy="16" rx="1.5" ry="2" fill="white" />
    <ellipse cx="22" cy="16" rx="1.5" ry="2" fill="white" />
  </svg>
);

// 전체 카테고리 - 격자
export const AllMapIcon = ({
  className = "w-8 h-8",
  backgroundColor = "#6B7280",
}: MapIconProps) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="15"
      fill={backgroundColor}
      stroke="white"
      strokeWidth="2"
    />
    <rect x="10" y="10" width="4" height="4" fill="white" />
    <rect x="18" y="10" width="4" height="4" fill="white" />
    <rect x="10" y="18" width="4" height="4" fill="white" />
    <rect x="18" y="18" width="4" height="4" fill="white" />
  </svg>
);

// 카테고리별 색상 매핑
export const categoryColorMap: Record<string, string> = {
  "운동/스포츠": "#EF4444",
  자기계발: "#10B981",
  "인문학/책/글": "#8B5CF6",
  "외국/언어": "#06B6D4",
  "음악/악기": "#F59E0B",
  스포츠관람: "#DC2626",
  "아웃도어/여행": "#059669",
  "업종/직무": "#6B7280",
  "문화/공연": "#EC4899",
  "공예/만들기": "#F97316",
  "댄스/무용": "#A855F7",
  봉사활동: "#EF4444",
  "사교/인맥": "#3B82F6",
  "차/바이크": "#1F2937",
  "사진/영상": "#06B6D4",
  "게임/오락": "#7C3AED",
  "요리/제조": "#F59E0B",
  반려동물: "#F97316",
  all: "#6B7280",
};

// 카테고리별 아이콘 매핑
export const categoryIconMap: Record<
  string,
  React.ComponentType<MapIconProps>
> = {
  "운동/스포츠": FitnessMapIcon,
  자기계발: SelfDevelopmentMapIcon,
  "인문학/책/글": BookMapIcon,
  "외국/언어": LanguageMapIcon,
  "음악/악기": MusicMapIcon,
  스포츠관람: SportsMapIcon,
  "아웃도어/여행": OutdoorMapIcon,
  "업종/직무": WorkMapIcon,
  "문화/공연": CultureMapIcon,
  "공예/만들기": CraftMapIcon,
  "댄스/무용": DanceMapIcon,
  봉사활동: VolunteerMapIcon,
  "사교/인맥": NetworkingMapIcon,
  "차/바이크": VehicleMapIcon,
  "사진/영상": PhotoMapIcon,
  "게임/오락": GameMapIcon,
  "요리/제조": CookingMapIcon,
  반려동물: PetMapIcon,
  all: AllMapIcon,
};
