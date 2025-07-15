"use client";

import { useEffect, useState } from "react";
import GoBack from "@/components/common/GoBack";
import { toast } from "@/components/provider/ToastProvider";
import { customFetch } from "@/libs/fetch/customFetch";
import { Plus } from "lucide-react";
import type { ChangeEvent } from "react";

declare global {
  interface Window {
    daum?: any;
  }
}

const CreateGroup = () => {
  const [selectedGroupType, setSelectedGroupType] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [loadingAddr, setLoadingAddr] = useState(false);

  const [groupInfo, setGroupInfo] = useState({
    name: "",
    description: "",
    category: "",
    requiresApproval: false,
    address: "",
    lat: 0,
    lng: 0,
  });

  /* ------------------------------------------------------------------ */
  /* 주소 검색 + 좌표 변환 -------------------------------------------- */
  /* ------------------------------------------------------------------ */
  const openAddressSearch = () => {
    if (!window.daum) return toast.error("주소 검색 스크립트가 로드되지 않았습니다.");
    new window.daum.Postcode({
      oncomplete: async (data: any) => {
        try {
          setLoadingAddr(true);
          const fullAddress = data.address;
          const coords = await fetchCoords(fullAddress);
          setGroupInfo((prev) => ({
            ...prev,
            address: fullAddress,
            lat: coords.lat,
            lng: coords.lng,
          }));
        } catch {
          toast.error("좌표 변환 실패");
        } finally {
          setLoadingAddr(false);
        }
      },
    }).open();
  };

  /** 카카오 REST API로 주소 → 좌표 */
  const fetchCoords = async (address: string) => {
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_API_KEY}`,
        },
      }
    );
    const json = await res.json();
    if (json.documents?.length) {
      const { y, x } = json.documents[0]; // y=lat, x=lng
      return { lat: parseFloat(y), lng: parseFloat(x) };
    }
    throw new Error("No coords");
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setGroupInfo((prev) => ({ ...prev, [name]: value }));
  };
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setGroupInfo((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("image", file);
      const data = await customFetch.post<{ imageUrl: string }>("/upload", formData);
      if (data) {
        setImages((prev) => [...prev, data.imageUrl]);
        e.target.value = "";
      }
    } catch {
      toast.error("이미지 업로드 실패");
    }
  };

  const regularSubmit = async () => {
    const { name, description, category, address, lat, lng } = groupInfo;
    if (!name) return toast.error("모임명을 입력해주세요.");
    if (!description) return toast.error("모임 설명을 입력해주세요.");
    if (!category) return toast.error("카테고리를 선택해주세요.");
    if (!address) return toast.error("주소를 입력해주세요.");

    try {
      await customFetch.post("/meetings/regular", {
        name: groupInfo.name,
        description: groupInfo.description,
        category: groupInfo.category,
        requiresApproval: groupInfo.requiresApproval,
        photos: images,
        location: { latitude: lat, longitude: lng, addressString: address },
      });
      toast.success("모임이 생성되었습니다!");
    } catch {
      toast.error("모임 생성 실패");
    }
  };

  useEffect(() => {
    if (window.daum) return;
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full p-2">
        <GoBack title="모임 생성하기" />
      </div>

      <div className="w-full flex-1 p-3 pb-24 overflow-scroll">
        <div className="w-full flex bg-white rounded-xl items-center relative border border-gray-300">
          <div
            className={`absolute top-1 ${
              selectedGroupType === 0 ? "left-1" : "left-[calc(50%-4px)]"
            } bg-primary h-[calc(100%-8px)] w-1/2 rounded-lg transition-all duration-300`}
          />
          <div
            className={`flex-1 text-center py-3 text-sm z-20 font-medium ${
              selectedGroupType === 0 ? "text-white" : "text-primary"
            }`}
            onClick={() => setSelectedGroupType(0)}
          >
            정기모임
          </div>
          <div
            className={`flex-1 text-center py-3 text-sm z-20 font-medium ${
              selectedGroupType === 1 ? "text-white" : "text-primary"
            }`}
            onClick={() => setSelectedGroupType(1)}
          >
            번개모임
          </div>
        </div>

        <section className="mt-6">
          <p className="text-base font-semibold mb-2">이미지 업로드</p>
          <div className="flex gap-3 flex-wrap">
            {images.map((img) => (
              <img
                key={img}
                src={process.env.NEXT_PUBLIC_API_URL + img}
                alt=""
                className="w-24 h-24 rounded-lg object-cover"
              />
            ))}
            <div
              className="w-24 h-24 bg-primary rounded-lg flex items-center justify-center text-white text-3xl"
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              <Plus />
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </section>

        {/* 모임명 ------------------------------------------------------- */}
        <section className="mt-6">
          <p className="text-base font-semibold mb-2">모임명</p>
          <input
            type="text"
            name="name"
            value={groupInfo.name}
            onChange={handleChange}
            placeholder="내용을 입력"
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary"
          />
        </section>

        {/* 설명 --------------------------------------------------------- */}
        <section className="mt-6">
          <p className="text-base font-semibold mb-2">설명</p>
          <textarea
            name="description"
            value={groupInfo.description}
            onChange={handleChange}
            placeholder="모임 설명을 입력"
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:border-primary"
          />
        </section>

        {/* 카테고리 ----------------------------------------------------- */}
        <section className="mt-6">
          <p className="text-base font-semibold mb-2">카테고리</p>
          <select
            name="category"
            value={groupInfo.category}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:border-primary"
          >
            <option value="">카테고리 선택</option>
            <option value="운동/헬스">운동/헬스</option>
            {/* 다른 카테고리 추가 */}
          </select>
        </section>

        {/* 주소 --------------------------------------------------------- */}
        <section className="mt-6">
          <p className="text-base font-semibold mb-2">주소</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={groupInfo.address}
              readOnly
              placeholder="주소 검색 버튼을 클릭하세요"
              className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
            <button
              onClick={openAddressSearch}
              className="px-4 py-2 bg-primary text-white rounded-lg whitespace-nowrap"
            >
              {loadingAddr ? "로딩..." : "주소 검색"}
            </button>
          </div>
          {groupInfo.address && (
            <p className="mt-1 text-xs text-gray-400">
              (위도: {groupInfo.lat.toFixed(6)}, 경도:{" "}
              {groupInfo.lng.toFixed(6)})
            </p>
          )}
        </section>

        {/* 승인 여부 ----------------------------------------------------- */}
        <section className="mt-6 flex items-center gap-2">
          <p className="text-base font-semibold">참가 신청 시 승인 여부</p>
          <input
            type="checkbox"
            name="requiresApproval"
            checked={groupInfo.requiresApproval}
            onChange={handleCheckboxChange}
            className="accent-primary"
          />
        </section>

        {/* 제출 버튼 ---------------------------------------------------- */}
        <div className="fixed bottom-18 left-0 w-full px-2">
          <button
            onClick={regularSubmit}
            className="w-full bg-primary text-white py-4 rounded-lg text-lg font-semibold"
          >
            생성 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
