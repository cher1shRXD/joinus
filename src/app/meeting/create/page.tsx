"use client";

import { useEffect, useState } from "react";
import GoBack from "@/components/common/GoBack";
import { toast } from "@/components/provider/ToastProvider";
import { customFetch } from "@/libs/fetch/customFetch";
import { Plus } from "lucide-react";
import type { ChangeEvent } from "react";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import useGeolocation from "@/hooks/common/useGeolocation";
import { useCustomRouter } from "@/hooks/common/useCustomRouter";

const CreateGroup = () => {
  const [kakaoLoading, kakaoError] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_API_KEY!,
    libraries: ["services"],
  });
  const [selectedGroupType, setSelectedGroupType] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const location = useGeolocation();
  const [groupInfo, setGroupInfo] = useState({
    name: "",
    description: "",
    category: "",
    requiresApproval: false,
    address: "",
    lat: 33.450701,
    lng: 126.570667,
    startTime: "",
    expectedDurationMinutes: 0,
    memberLimit: 0,
  });
  const router = useCustomRouter();

  useEffect(() => {
    if (location.loaded && location.coordinates) {
      setGroupInfo((prev) => ({
        ...prev,
        lat: location.coordinates?.latitude || 0,
        lng: location.coordinates?.longitude || 0,
      }));
    }
  }, [location]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let newValue: string | number | boolean = value;

    if (e.target instanceof HTMLInputElement) {
      if (e.target.type === "checkbox") {
        newValue = e.target.checked;
      } else if (e.target.type === "number") {
        newValue = Number(value);
      }
    }

    setGroupInfo((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("image", file);
      const data = await customFetch.post<{ imageUrl: string }>(
        "/upload",
        formData
      );
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
    console.log(groupInfo);
    if (!name) return toast.error("모임명을 입력해주세요.");
    if (!description) return toast.error("모임 설명을 입력해주세요.");
    if (!category) return toast.error("카테고리를 선택해주세요.");
    if (!address) return toast.error("지도를 통해 모임 위치를 설정해주세요.");

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
      router.push("/");
    } catch {
      toast.error("모임 생성 실패");
    }
  };

  const flashSubmit = async () => {
    const {
      name,
      description,
      address,
      lat,
      lng,
      startTime,
      expectedDurationMinutes,
      memberLimit,
    } = groupInfo;
    if (!name) return toast.error("모임명을 입력해주세요.");
    if (!description) return toast.error("모임 설명을 입력해주세요.");
    if (!address) return toast.error("지도를 통해 모임 위치를 설정해주세요.");
    if (!startTime) return toast.error("모임 시작 시간을 입력해주세요.");
    if (expectedDurationMinutes <= 0)
      return toast.error("예상 소요 시간을 입력해주세요.");
    if (memberLimit <= 0) return toast.error("인원 제한 수를 입력해주세요.");

    try {
      await customFetch.post("/meetings/flash", {
        name: groupInfo.name,
        description: groupInfo.description,
        startTime: groupInfo.startTime,
        expectedDurationMinutes: groupInfo.expectedDurationMinutes,
        memberLimit: groupInfo.memberLimit,
        location: { latitude: lat, longitude: lng, addressString: address },
        category: groupInfo.category,
      });
      toast.success("모임이 생성되었습니다!");
      router.push("/");
    } catch {
      toast.error("모임 생성 실패");
    }
  };

  const fetchAddressFromCoords = async (lat: number, lng: number) => {
    if (lat === 0 && lng === 0) {
      setGroupInfo((prev) => ({ ...prev, address: "" }));
      return;
    }

    const geocoder = new kakao.maps.services.Geocoder();
    const coord = new kakao.maps.LatLng(lat, lng);

    geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const address =
          result[0].address?.address_name ||
          result[0].road_address?.address_name;
        setGroupInfo((prev) => ({ ...prev, address: address || "" }));
      } else {
        console.error("Failed to fetch address from coords:", status);
        setGroupInfo((prev) => ({ ...prev, address: "" }));
      }
    });
  };

  useEffect(() => {
    if (!kakaoLoading && !kakaoError) {
      fetchAddressFromCoords(groupInfo.lat, groupInfo.lng);
    }
  }, [kakaoLoading, kakaoError, groupInfo.lat, groupInfo.lng]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="bg-white border-b border-gray-100 p-4 flex-shrink-0">
        <GoBack title="모임 생성하기" />
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        <div className="p-6 space-y-8">
          <div className="w-full flex bg-gray-100 rounded-2xl items-center relative">
            <div
              className={`absolute top-1 ${
                selectedGroupType === 1 ? "left-1" : "left-[calc(50%-4px)]"
              } bg-primary h-[calc(100%-8px)] w-1/2 rounded-xl transition-all duration-300`}
            />
            <button
              className={`flex-1 text-center py-3 text-sm z-20 font-medium transition-colors ${
                selectedGroupType === 1 ? "text-white" : "text-gray-600"
              }`}
              onClick={() => setSelectedGroupType(1)}>
              번개모임
            </button>
            <button
              className={`flex-1 text-center py-3 text-sm z-20 font-medium transition-colors ${
                selectedGroupType === 0 ? "text-white" : "text-gray-600"
              }`}
              onClick={() => setSelectedGroupType(0)}>
              정기모임
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">모임명</label>
              <input
                type="text"
                name="name"
                value={groupInfo.name}
                onChange={handleChange}
                placeholder="모임명을 입력해주세요"
                className="w-full p-4 border border-gray-300 rounded-xl focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
              <textarea
                name="description"
                value={groupInfo.description}
                onChange={handleChange}
                placeholder="모임에 대한 설명을 입력해주세요"
                rows={4}
                className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
              <select
                name="category"
                value={groupInfo.category}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-xl bg-white focus:border-primary focus:outline-none transition-colors">
                <option value="">카테고리를 선택해주세요</option>
                <option value="운동/스포츠">운동/스포츠</option>
                <option value="자기계발">자기계발</option>
                <option value="인문학/책/글">인문학/책/글</option>
                <option value="외국/언어">외국/언어</option>
                <option value="음악/악기">음악/악기</option>
                <option value="스포츠관람">스포츠관람</option>
                <option value="아웃도어/여행">아웃도어/여행</option>
                <option value="업종/직무">업종/직무</option>
                <option value="문화/공연">문화/공연</option>
                <option value="공예/만들기">공예/만들기</option>
                <option value="댄스/무용">댄스/무용</option>
                <option value="봉사활동">봉사활동</option>
                <option value="사교/인맥">사교/인맥</option>
                <option value="차/바이크">차/바이크</option>
                <option value="사진/영상">사진/영상</option>
                <option value="게임/오락">게임/오락</option>
                <option value="요리/제조">요리/제조</option>
                <option value="반려동물">반려동물</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">모임 위치</label>
            <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-300">
              <Map
                center={{ lat: groupInfo.lat, lng: groupInfo.lng }}
                style={{ width: "100%", height: "100%" }}
                level={3}
                onDragEnd={(map) => {
                  const latlng = map.getCenter();
                  setGroupInfo((prev) => ({
                    ...prev,
                    lat: latlng.getLat(),
                    lng: latlng.getLng(),
                  }));
                }}
                onClick={(_t, mouseEvent) => {
                  setGroupInfo((prev) => ({
                    ...prev,
                    lat: mouseEvent.latLng.getLat(),
                    lng: mouseEvent.latLng.getLng(),
                  }));
                }}>
                <MapMarker
                  position={{ lat: groupInfo.lat, lng: groupInfo.lng }}
                  draggable={true}
                  onDragEnd={(marker) => {
                    const latlng = marker.getPosition();
                    setGroupInfo((prev) => ({
                      ...prev,
                      lat: latlng.getLat(),
                      lng: latlng.getLng(),
                    }));
                  }}
                />
              </Map>
            </div>
            {groupInfo.address && (
              <p className="mt-2 text-sm text-gray-500">
                📍 {groupInfo.address}
              </p>
            )}
          </div>

        {selectedGroupType === 0 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">이미지 업로드</label>
              <div className="flex gap-3 flex-wrap">
                {images.map((img) => (
                  <img
                    key={img}
                    src={process.env.NEXT_PUBLIC_API_URL + img}
                    alt="Uploaded image"
                    className="rounded-xl object-cover w-24 h-24 border border-gray-300"
                  />
                ))}
                <button
                  className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 hover:border-primary hover:text-primary transition-colors"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }>
                  <Plus size={24} />
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-700">참가 신청 시 승인 필요</p>
                <p className="text-xs text-gray-500 mt-1">승인이 필요한 모임으로 설정합니다</p>
              </div>
              <input
                type="checkbox"
                name="requiresApproval"
                checked={groupInfo.requiresApproval}
                onChange={handleChange}
                className="w-5 h-5 accent-primary"
              />
            </div>
          </>
        )}

        {selectedGroupType === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">모임 일시</label>
              <input
                type="datetime-local"
                name="startTime"
                value={groupInfo.startTime}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-xl focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">예상 소요 시간</label>
              <div className="relative">
                <input
                  type="number"
                  name="expectedDurationMinutes"
                  value={groupInfo.expectedDurationMinutes}
                  onChange={handleChange}
                  placeholder="120"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:border-primary focus:outline-none transition-colors pr-12"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">분</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">인원 제한</label>
              <div className="relative">
                <input
                  type="number"
                  name="memberLimit"
                  value={groupInfo.memberLimit}
                  onChange={handleChange}
                  placeholder="8"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:border-primary focus:outline-none transition-colors pr-12"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">명</span>
              </div>
            </div>
          </div>
        )}

        </div>
      </div>

      <div className="bg-white border-t border-gray-100 p-4 flex-shrink-0">
        <button
          onClick={selectedGroupType === 0 ? regularSubmit : flashSubmit}
          className="w-full bg-primary text-white py-4 rounded-2xl text-lg font-semibold hover:bg-primary/90 transition-colors">
          모임 생성하기
        </button>
      </div>
    </div>
  );
};

export default CreateGroup;
