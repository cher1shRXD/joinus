"use client"

import { toast } from "@/components/provider/ToastProvider";
import { useCustomRouter } from "@/hooks/common/useCustomRouter";
import { useSurveyStore } from "@/stores/survey"
import { useState } from "react";

const formatDateTime = (dateString?: string): string => {
  if(!dateString) return "";
  const pad = (n: number) => n.toString().padStart(2, '0');

  const date = new Date(dateString);

  const yy = date.getFullYear().toString().slice(-2); // '25'
  const mm = pad(date.getMonth() + 1); // 01~12
  const dd = pad(date.getDate());

  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  const sec = pad(date.getSeconds());

  return `${yy}-${mm}-${dd} ${hh}:${min}:${sec}`;
};


const Survey = () => {
  const { data } = useSurveyStore();
  const [text, setText] = useState("");
  const router = useCustomRouter();

  const handleSubmit = () => {
    toast.success("설문이 완료되었습니다!");
    setText("");
    router.replace("/")
  }

  return (
    <div className="w-full h-screen">
      <h1>{data?.message}</h1>
      <p>{formatDateTime(data?.timestamp)}</p>
      <textarea 
        value={text}
        onChange={(e) => setText(e.target.value)} 
      />

      <button onClick={handleSubmit}>설문 완료하기</button>
    </div>
  )
}

export default Survey