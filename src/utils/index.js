export const optionsR = [
  { label: "New", value: "New", color: "#0068FF", select: true },
  { label: "Follow Up", value: "Follow Up", color: "#FFCA00", select: false },
  { label: "Token", value: "Token", color: "#2EDC20", select: false },
];

export const optionsL = [
  { label: "Cancelled", value: "Cancelled", color: "#FF4646", select: false },
  {
    label: "Visit Scheduled",
    value: "Visit Scheduled",
    color: "#0078DB",
    select: false,
  },
  { label: "Reset Filter", value: "reset", color: "black", select: false },
];

export const formatDateToShort = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  }); // e.g., "Jun 11"
};

// ToastConfig.ts
import React from "react";
import { BaseToast, ErrorToast } from "react-native-toast-message";

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#0078DB", backgroundColor: "#E6F9EC" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      // text1Style={{ fontSize: 16, fontWeight: "bold", color: "#0078DB" }}
      // text2Style={{ fontSize: 14, color: "#1C5E20" }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "#FF3333", backgroundColor: "#FFECEC" }}
      text1Style={{ fontSize: 16, fontWeight: "bold", color: "#FF3333" }}
      text2Style={{ fontSize: 14, color: "#990000" }}
    />
  ),
};



import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);

export const formatUpdatedAt = (updatedAt) => {
  const clean = updatedAt.replace("|", "").trim(); // "17 Jun 2025 06:53 PM"
  const parsed = dayjs(clean, "DD MMM YYYY hh:mm A");

  if (!parsed.isValid()) {
    return {
      relative: "Invalid",
      fullDate: "Invalid date",
      timeOnly: "Invalid time",
    };
  }

  return {
    relative: `Posted ${dayjs().to(parsed)}`, // "Posted 2 hours ago"
    fullDate: parsed.format("dddd, MMMM D, YYYY"), // "Tuesday, June 17, 2025"
    timeOnly: parsed.format("h:mm A"), // "6:53 PM"
  };
};

export const calanderOprtions = [
  {
    label: "Visit Scheduled",
    value: "Visit Scheduled",
    color: "#0068FF",
    select: true,
  },
  {
    label: "Visit Cancelled",
    value: "Visit Cancelled",
    color: "#FF4646",
    select: false,
  },
  {
    label: "Visited",
    value: "Visited",
    color: "#0078DB",
    select: false,
  },
];

export function FormatPrice({ price }) {
  return Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}
