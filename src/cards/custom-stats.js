import { Card } from "../common/Card.js";
import { getCardColors } from "../common/color.js";

export const renderCustomStatsCard = (stats = [], options = {}) => {
  const {
    theme = "default",
    card_width = 400,
    hide_border = false,
    hide_title = false,
  } = options;

  const colors = getCardColors({ theme });

  const height = stats.length * 35 + (hide_title ? 30 : 60);

  const card = new Card({
    width: card_width,
    height,
    hide_border,
    title: hide_title ? "" : "Custom Statistics",
    colors,
  });

  const items = stats
    .map(
      (s, i) => `
      <g transform="translate(0, ${i * 30})">
        <text x="0" y="14">${s.name}</text>
        <text x="${card_width - 40}" y="14" text-anchor="end">${s.value}%</text>
        <rect x="0" y="18" width="${(card_width - 60) * (s.value / 100)}" height="6" rx="3" fill="${s.color || colors.textColor}" />
      </g>`
    )
    .join("");

  return card.render(`
    <g transform="translate(30, ${hide_title ? 20 : 40})">
      ${items}
    </g>
  `);
};