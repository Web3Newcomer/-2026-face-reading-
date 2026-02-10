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

  return `请基于照片中人物，生成一张2026丙午火马年"国潮开运照"。

【最重要】必须严格保留照片中人物的真实五官特征（眼睛形状、鼻子、嘴型、脸型、发型），让本人一眼就能认出是自己。只做轻度美颜：皮肤更通透、气色更红润、眼神更有光，类似手机美颜相机的效果，绝对不能换脸或大幅改变五官。

其他要求：
1. **妆造升级**：给人物加上新中式红色/金色华服或改良唐装，可搭配应景的发饰耳饰。
2. **背景元素**：融合"火马"图腾或奔腾骏马剪影，搭配暖光效果。
3. **色彩氛围**：主色调朱砂红与流光金，辅以暖橙色光晕。
4. **装饰细节**：可点缀金箔、祥云、灯笼或"2026"字样。
5. **风格质感**：光影柔和通透，高级氛围感写真风格。

画面寓意：${kw}，${desc}`;
}
