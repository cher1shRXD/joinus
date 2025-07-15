export interface User {
  uid: string;
  email: string;
  nickname: string;
  profileImageUrl: string;
  interests: string[];
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}
