import { Card } from "../common/Card.js";
import { I18n } from "../common/I18n.js";
import { getCardColors, FlexLayout } from "../common/utils.js";

const createProgressBar = ({ progress, color, width = 300, height = 8 }) => {
  const progressBarWidth = (width * progress) / 100;
  
  return `
    <svg width="${width}" height="${height}">
      <rect width="${width}" height="${height}" fill="#ddd" rx="5" />
      <rect width="${progressBarWidth}" height="${height}" fill="${color}" rx="5" />
    </svg>
  `;
};

const createStatsItem = ({ name, value, color, index, width }) => {
  const progressBarWidth = width - 50;
  
  return `
    <g transform="translate(0, ${index * 40})">
      <text x="0" y="15" class="stat-name">${name}</text>
      <text x="${width}" y="15" text-anchor="end" class="stat-value">${value.toFixed(1)}%</text>
      <g transform="translate(0, 20)">
        ${createProgressBar({ 
          progress: value, 
          color: color || "#3B82F6",
          width: progressBarWidth 
        })}
      </g>
    </g>
  `;
};

export const renderCustomStatsCard = (statsData = [], options = {}) => {
  const {
    username,
    hide_title = false,
    hide_border = false,
    card_width = 300,
    title_color,
    text_color,
    bg_color,
    theme = "default",
    border_radius = 4.5,
    border_color,
    locale = "en",
  } = options;

  const i18n = new I18n({
    locale,
    translations: {
      en: { title: "Custom Statistics" },
      vi: { title: "Thống Kê Tùy Chỉnh" },
    },
  });

  // Calculate total for percentage
  const total = statsData.reduce((sum, stat) => sum + stat.value, 0);
  
  // Normalize to percentage if needed
  const normalizedStats = statsData.map(stat => ({
    ...stat,
    value: total > 100 ? (stat.value / total) * 100 : stat.value
  }));

  const lheight = 40;
  const height = Math.max(
    normalizedStats.length * lheight + 50,
    hide_title ? 0 : 90
  );

  const colors = getCardColors({
    title_color,
    text_color,
    bg_color,
    border_color,
    theme,
  });

  const statsItems = normalizedStats.map((stat, index) =>
    createStatsItem({
      name: stat.name,
      value: stat.value,
      color: stat.color,
      index,
      width: card_width - 50,
    })
  ).join("");

  const card = new Card({
    customTitle: hide_title ? "" : i18n.t("title"),
    titlePrefixIcon: "",
    width: card_width,
    height,
    border_radius,
    colors,
  });

  card.setCSS(`
    .stat-name { 
      font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; 
      fill: ${colors.textColor};
    }
    .stat-value {
      font: 600 12px 'Segoe UI', Ubuntu, Sans-Serif;
      fill: ${colors.textColor};
    }
  `);

  card.setHideBorder(hide_border);
  card.setHideTitle(hide_title);

  return card.render(`
    <g transform="translate(25, ${hide_title ? 35 : 55})">
      ${statsItems}
    </g>
  `);
};