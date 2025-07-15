import { ParamProps } from "@/types/props/param-props"

const ChatDetail = async ({ params }: ParamProps) => {
  const { id } = await params;

  return (
    <div>{id}</div>
  )
}

export default ChatDetail