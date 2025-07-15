"use client"

import { toast } from "@/components/provider/ToastProvider";
import { useCustomRouter } from "@/hooks/common/useCustomRouter";
import { cookieManager } from "@/libs/cookie/cookie";
import { customFetch } from "@/libs/fetch/customFetch";
import app from "@/libs/firebase/firebaseConfig";
import { useUserStore } from "@/stores/user";
import { User } from "@/types/user";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Login = () => {
  const { setUser } = useUserStore();
  const router = useCustomRouter();

  const handleLogin = async () => {
    try{
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(getAuth(app), provider);
      const idToken = await result.user.getIdTokenResult();
      if(idToken) {
        const data = await customFetch.post<{ user: User, accessToken: string, isNewUser: boolean }>('/auth/verify', { idToken: idToken.token });
        if(data) {
          await cookieManager.set("accessToken", data.accessToken);
          setUser(data.user);
          router.replace('/');
        }
      }
    }catch(e){
      toast.error("네트워크 에러");
    }
  }

  return (
    <div>
      <button onClick={handleLogin}>구글로그인</button>
    </div>
  )
}

export default Login
