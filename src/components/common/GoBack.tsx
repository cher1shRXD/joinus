"use client";

import { useCustomRouter } from "@/hooks/common/useCustomRouter";
import { GoBackProps } from "@/types/props/go-back-props";
import { ChevronLeft } from "lucide-react";

const GoBack = ({ title }: GoBackProps) => {
  const router = useCustomRouter();

  return (
    <div className="flex items-center" onClick={router.back}>
      <ChevronLeft />
      <p>{title}</p>
    </div>
  );
};

export default GoBack;
