export async function loader() {
  const res = await fetch(
    "https://apeu1.fscloud.com.cn/t/hoymilestest/mp/api/customa/new_ChatService/ChatService/GetChatPageUrlExtension",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: {
          sourceKey: "wss",
          language: "en-US",
        },
      }),
    }
  );

  const data = await res.json();

  // 👉 根据常见结构做兼容
  const url =
    data?.data?.url ||
    data?.url ||
    JSON.stringify(data);

  return new Response(url, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

export default function Chat() {
  return null;
}