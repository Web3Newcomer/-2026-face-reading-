import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { image, keywords, summary } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "请提供照片" }, { status: 400 });
    }

    const base64Match = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!base64Match) {
      return NextResponse.json({ error: "图片格式不正确" }, { status: 400 });
    }

    const base64Data = base64Match[2];
    const prompt = buildImagePrompt(keywords, summary);

    console.log("Generating NY image, prompt:", prompt.substring(0, 100));

    const apiUrl = `${process.env.YUNWU_BASE_URL || "https://yunwu.ai"}/v1/chat/completions`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.YUNWU_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gemini-3-pro-image-preview",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${base64Data}` },
              },
              { type: "text", text: prompt },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Image gen error:", response.status, errText);
      throw new Error(`API ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // 提取 base64 图片
    const imgMatch = content.match(/data:image\/\w+;base64,[A-Za-z0-9+/=]+/);
    if (!imgMatch) {
      console.error("No image in response, content:", content.substring(0, 200));
      throw new Error("AI 未返回图片");
    }

    return NextResponse.json({ image: imgMatch[0] });
  } catch (err) {
    console.error("Generate image error:", err);
    return NextResponse.json({ error: "图片生成失败" }, { status: 500 });
  }
}

function buildImagePrompt(keywords?: string[], summary?: string): string {
  const kw = keywords?.join("、") || "赤骥呈祥";
  const desc = summary || "2026丙午火马年大吉";

  return `请基于照片中人物的面部特征，生成一张2026丙午火马年专属的“国潮开运”写真。

核心要求：
1. **人物美化**：保持人物原貌特征但进行“开运妆造”升级（气色红润、眼神明亮、面带喜气），身着新中式红色/金色锦鲤华服或改良唐装。
2. **主题元素**：背景必须包含“火马”图腾或奔腾的骏马剪影，融合旭日东升（黎明破晓）的背景光效，象征“红火开年”。
3. **色彩氛围**：主色调为朱砂红（Vermilion）与流光金（Liquid Gold），辅以暖橙色光晕，营造高级、热烈的节日氛围。
4. **装饰细节**：画面中可点缀金箔、祥云、灯笼或“2026”字样的发光灯牌。
5. **风格质感**：高品质商业人像摄影，光影通透，具有电影海报质感。

画面寓意：${kw}，${desc}`;
}
