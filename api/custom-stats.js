import { renderError } from "../src/common/utils.js";
import { parseArray } from "../src/common/utils.js";
import { renderCustomStatsCard } from "../src/cards/custom-stats-card.js";

export default async function handler(req, res) {
  const {
    username,
    hide_title,
    hide_border,
    card_width,
    title_color,
    text_color,
    bg_color,
    theme,
    cache_seconds,
    locale,
    border_radius,
    border_color,
    // Tham số tùy chỉnh
    stats_names,
    stats_values,
    stats_colors,
  } = req.query;

  res.setHeader("Content-Type", "image/svg+xml");

  try {
    // Parse các tham số đầu vào
    const names = parseArray(stats_names);
    const values = parseArray(stats_values);
    const colors = parseArray(stats_colors);

    // Validate
    if (!names || names.length === 0) {
      throw new Error("stats_names is required");
    }

    if (!values || values.length === 0) {
      throw new Error("stats_values is required");
    }

    if (names.length !== values.length) {
      throw new Error("stats_names and stats_values must have same length");
    }

    // Tạo data object
    const statsData = names.map((name, index) => ({
      name: name,
      value: parseFloat(values[index]) || 0,
      color: colors && colors[index] ? colors[index] : undefined,
    }));

    // Render card
    const card = renderCustomStatsCard(statsData, {
      username,
      hide_title: hide_title === "true",
      hide_border: hide_border === "true",
      card_width: parseInt(card_width, 10),
      title_color,
      text_color,
      bg_color,
      theme,
      border_radius,
      border_color,
      locale,
    });

    res.setHeader(
      "Cache-Control",
      `public, max-age=${cache_seconds || 1800}`
    );

    return res.send(card);
  } catch (err) {
    return res.send(renderError(err.message));
  }
}