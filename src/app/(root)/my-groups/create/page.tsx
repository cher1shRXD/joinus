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
    <div className="w-full h-full flex flex-col">
      <div className="w-full p-2">
        <GoBack title="모임 생성하기" />
      </div>

      <div className="w-full flex-1 p-3 pb-24 overflow-scroll">
        <div className="w-full flex bg-white rounded-xl items-center relative border border-gray-300">
          <div
            className={`absolute top-1 ${
              selectedGroupType === 1 ? "left-1" : "left-[calc(50%-4px)]"
            } bg-primary h-[calc(100%-8px)] w-1/2 rounded-lg transition-all duration-300`}
          />
          <div
            className={`flex-1 text-center py-3 text-sm z-20 font-medium ${
              selectedGroupType === 1 ? "text-white" : "text-primary"
            }`}
            onClick={() => setSelectedGroupType(1)}>
            번개모임
          </div>
          <div
            className={`flex-1 text-center py-3 text-sm z-20 font-medium ${
              selectedGroupType === 0 ? "text-white" : "text-primary"
            }`}
            onClick={() => setSelectedGroupType(0)}>
            정기모임
          </div>
        </div>

        {/* 공통 필드 */}
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

        <section className="mt-6">
          <p className="text-base font-semibold mb-2">모임 위치</p>
          <div className="w-full h-64 rounded-lg overflow-hidden">
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
            <p className="mt-1 text-xs text-gray-400">
              선택된 주소: {groupInfo.address}
            </p>
          )}
        </section>

        {/* 카테고리 (정기모임, 번개모임 공통) */}
        <section className="mt-6">
          <p className="text-base font-semibold mb-2">카테고리</p>
          <select
            name="category"
            value={groupInfo.category}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:border-primary">
            <option value="">카테고리 선택</option>
            <option value="운동/헬스">운동/헬스</option>
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
        </section>

        {selectedGroupType === 0 && (
          <>
            {/* 이미지 업로드 (정기모임) */}
            <section className="mt-6">
              <p className="text-base font-semibold mb-2">이미지 업로드</p>
              <div className="flex gap-3 flex-wrap">
                {images.map((img) => (
                  <img
                    key={img}
                    src={process.env.NEXT_PUBLIC_API_URL + img}
                    alt="Uploaded image"
                    width={96}
                    height={96}
                    className="rounded-lg object-cover w-24 h-24"
                  />
                ))}
                <div
                  className="w-24 h-24 bg-primary rounded-lg flex items-center justify-center text-white text-3xl"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }>
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

            {/* 승인 여부 (정기모임) */}
            <section className="mt-6 flex items-center gap-2">
              <p className="text-base font-semibold">참가 신청 시 승인 여부</p>
              <input
                type="checkbox"
                name="requiresApproval"
                checked={groupInfo.requiresApproval}
                onChange={handleChange}
                className="accent-primary"
              />
            </section>
          </>
        )}

        {selectedGroupType === 1 && (
          <>
            {/* 모임 일시 (번개모임) */}
            <section className="mt-6">
              <p className="text-base font-semibold mb-2">모임 일시</p>
              <input
                type="datetime-local"
                name="startTime"
                value={groupInfo.startTime}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary"
              />
            </section>

            {/* 예상 소요 시간 (번개모임) */}
            <section className="mt-6">
              <p className="text-base font-semibold mb-2">
                예상 소요 시간 (분)
              </p>
              <input
                type="number"
                name="expectedDurationMinutes"
                value={groupInfo.expectedDurationMinutes}
                onChange={handleChange}
                placeholder="예상 소요 시간 (분)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary"
              />
            </section>

            {/* 인원 제한 수 (번개모임) */}
            <section className="mt-6">
              <p className="text-base font-semibold mb-2">인원 제한 수</p>
              <input
                type="number"
                name="memberLimit"
                value={groupInfo.memberLimit}
                onChange={handleChange}
                placeholder="인원 제한 수"
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary"
              />
            </section>
          </>
        )}

        {/* 제출 버튼 ---------------------------------------------------- */}
        <div className="fixed bottom-18 left-0 w-full px-2 z-50">
          <button
            onClick={selectedGroupType === 0 ? regularSubmit : flashSubmit}
            className="w-full bg-primary text-white py-4 rounded-lg text-lg font-semibold">
            생성 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
