import { renderError } from "../src/common/error.js";
import { renderCustomStatsCard } from "../src/cards/custom-stats.js"

const parseArray = (str) => {
  if (!str) return [];
  return str.split(",").map((s) => s.trim());
};

export default async function handler(req, res) {
  res.setHeader("Content-Type", "image/svg+xml");

  try {
    const {
      stats_names,
      stats_values,
      stats_colors,
      theme,
      hide_border,
      hide_title,
      card_width,
    } = req.query;

    const names = parseArray(stats_names);
    const values = parseArray(stats_values).map(Number);
    const colors = parseArray(stats_colors);

    if (!names.length || !values.length) {
      throw new Error("stats_names and stats_values are required");
    }

    if (names.length !== values.length) {
      throw new Error("stats_names and stats_values length mismatch");
    }

    const stats = names.map((name, i) => ({
      name,
      value: values[i],
      color: colors[i],
    }));

    const svg = renderCustomStatsCard(stats, {
      theme,
      hide_border: hide_border === "true",
      hide_title: hide_title === "true",
      card_width: Number(card_width) || 400,
    });

    res.setHeader("Cache-Control", "public, max-age=1800");
    return res.status(200).send(svg);
  } catch (err) {
    return res.status(500).send(renderError(err.message));
  }
}