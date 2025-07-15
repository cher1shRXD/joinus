import GoBack from "@/components/common/GoBack";
import { ParamProps } from "@/types/props/param-props";

const ChatDetail = async ({ params }: ParamProps) => {
  const { id } = await params;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full p-2">
        <GoBack title="와인 시음회" />
      </div>
    </div>
  );
};

export default ChatDetail;
