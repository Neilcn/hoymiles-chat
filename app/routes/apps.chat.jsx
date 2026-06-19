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

  return {
    url: data?.Data,
  };
}

import { useLoaderData } from "react-router";

export default function Chat() {
  const { url } = useLoaderData();

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat URL</h2>
      <p>{url}</p>
    </div>
  );
}