import { NextRequest, NextResponse } from "next/server";
import { buildPrompt } from "@/lib/prompt";
import type { FortuneResult } from "@/lib/types";

// 简单的内存 rate limiting
const requestLog = new Map<string, number[]>();
const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= RATE_LIMIT) return false;
  recent.push(now);
  requestLog.set(ip, recent);
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "请求太频繁，请稍后再试" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { image, nickname, zodiac } = body;

    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "请提供照片" }, { status: 400 });
    }

    const base64Match = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!base64Match) {
      return NextResponse.json({ error: "图片格式不正确" }, { status: 400 });
    }

    const mediaType = base64Match[1];
    const base64Data = base64Match[2];
    const prompt = buildPrompt(nickname, zodiac);

    const apiUrl = `${process.env.YUNWU_BASE_URL || "https://yunwu.ai"}/v1/messages`;

    console.log("Calling API:", apiUrl, "base64 length:", base64Data.length);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.YUNWU_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4096,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: base64Data } },
            { type: "text", text: prompt },
          ],
        }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("API error:", response.status, errText);
      throw new Error(`API ${response.status}: ${errText}`);
    }

    const data = await response.json();
    console.log("stop_reason:", data.stop_reason, "usage:", JSON.stringify(data.usage));
    const textBlock = data.content?.find((b: { type: string }) => b.type === "text");
    if (!textBlock) throw new Error("AI 未返回文本内容");

    const rawText = textBlock.text;
    console.log("AI raw response:", rawText.substring(0, 500));

    // 提取 JSON 并处理可能的截断
    const startIdx = rawText.indexOf("{");
    if (startIdx === -1) {
      throw new Error("AI 返回内容中未找到 JSON");
    }

    let jsonStr = rawText.substring(startIdx);
    // 去掉末尾的 ``` 标记
    jsonStr = jsonStr.replace(/```\s*$/, "").trim();

    // 如果 JSON 被截断，尝试补全闭合括号
    let result: FortuneResult;
    try {
      result = JSON.parse(jsonStr);
    } catch {
      // 截断时去掉最后一个不完整的键值对，然后补全括号
      let fixed = jsonStr.replace(/,\s*"[^"]*"?\s*:?\s*"?[^"]*$/, "");
      // 补全缺失的闭合括号
      const opens = (fixed.match(/{/g) || []).length;
      const closes = (fixed.match(/}/g) || []).length;
      for (let i = 0; i < opens - closes; i++) fixed += "}";
      console.log("Fixed JSON (last 200):", fixed.substring(fixed.length - 200));
      result = JSON.parse(fixed);
    }

    // 填充缺失字段的默认值
    result = {
      overall_score: result.overall_score ?? 88,
      keywords: result.keywords ?? ["好运连连", "万事如意", "心想事成"],
      dimensions: {
        career: result.dimensions?.career ?? { score: 88, comment: "事业蒸蒸日上！" },
        wealth: result.dimensions?.wealth ?? { score: 88, comment: "财源滚滚来！" },
        love: result.dimensions?.love ?? { score: 88, comment: "桃花朵朵开！" },
        health: result.dimensions?.health ?? { score: 88, comment: "身体倍儿棒！" },
        luck: result.dimensions?.luck ?? { score: 88, comment: "锦鲤附体！" },
      },
      summary: result.summary ?? "2026火马年运势大吉，好运连连！",
      lucky_color: result.lucky_color ?? "红色",
      lucky_number: result.lucky_number ?? 8,
      face_reading: result.face_reading ?? "天庭饱满，地阁方圆，好面相！",
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("Predict API error:", err);
    return NextResponse.json({ error: "预测失败，请稍后重试" }, { status: 500 });
  }
}
