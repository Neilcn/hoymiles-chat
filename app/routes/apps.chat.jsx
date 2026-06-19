import { redirect, useLoaderData } from "react-router";

export async function loader({ request }) {
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
  const url = data?.Data;

  const reqUrl = new URL(request.url);
  if (reqUrl.searchParams.get("redirect") === "1") {
    if (!url) {
      throw new Response("Chat URL not available", { status: 502 });
    }
    throw redirect(url);
  }

  if (reqUrl.searchParams.get("json") === "1") {
    return Response.json({ url });
  }

  return {
    url,
  };
}

export default function Chat() {
  const { url } = useLoaderData();

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat URL</h2>
      <p>{url}</p>
    </div>
  );
}