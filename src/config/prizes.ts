export interface Prize {
  id: number;
  name: string;
  emoji: string;
  probability: number; // 0-1
  color: string;
}

export const prizes: Prize[] = [
  { id: 1, name: "免費飲品升級", emoji: "🥤", probability: 0.1, color: "#FF6B6B" },
  { id: 2, name: "免費甜點一份", emoji: "🍰", probability: 0.08, color: "#FFE66D" },
  { id: 3, name: "本次消費 9 折", emoji: "🎫", probability: 0.15, color: "#4ECDC4" },
  { id: 4, name: "免費升級套餐", emoji: "🥗", probability: 0.12, color: "#95E1D3" },
  { id: 5, name: "飲品買一送一", emoji: "☕", probability: 0.1, color: "#F38181" },
  { id: 6, name: "銅板價 $49 加購飲品", emoji: "💰", probability: 0.2, color: "#AA96DA" },
  { id: 7, name: "力芽生菜沙拉加量", emoji: "🍃", probability: 0.1, color: "#78C850" },
  { id: 8, name: "謝謝參與，下次再來", emoji: "😊", probability: 0.15, color: "#C8C8C8" },
];
