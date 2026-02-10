export interface DimensionResult {
  score: number;
  comment: string;
}

export interface FortuneResult {
  overall_score: number;
  keywords: string[];
  dimensions: {
    career: DimensionResult;
    wealth: DimensionResult;
    love: DimensionResult;
    health: DimensionResult;
    luck: DimensionResult;
  };
  summary: string;
  lucky_color: string;
  lucky_number: number;
  face_reading: string;
}

export interface PredictRequest {
  image: string; // base64
  nickname?: string;
  zodiac?: string;
}

export const ZODIAC_ANIMALS = [
  "鼠", "牛", "虎", "兔", "龙", "蛇",
  "马", "羊", "猴", "鸡", "狗", "猪",
] as const;

export const DIMENSION_LABELS: Record<string, string> = {
  career: "事业运",
  wealth: "财运",
  love: "桃花运",
  health: "健康运",
  luck: "锦鲤运",
};
