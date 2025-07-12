import { Option } from "lucide-react";

export const EventInputData = [
  {
    label: "Client Name",
    name: "cname",
    placeHolder: "Enter Client Name",
    type: "text",
  },
  {
    label: "Client Number",
    name: "cnumber",
    placeHolder: "Enter Client Number",
    type: "text",
  },
  {
    label: "",
    name: "eventstatus",
    placeHolder: "Event",
    type: "select",
  },
  {
    label: "Project Name",
    name: "pname",
    placeHolder: "Enter Project Name",
    type: "text",
  },
  {
    label: "Date",
    name: "pdate",
    placeHolder: "Date",
    type: "date",
  },
];

export const formatDateToShort = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  }); // e.g., "Jun 11"
};

export const formatIndianAmount = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return amount;

  if (num >= 10000000) {
    return (num / 10000000).toFixed(2) + "crore";
  } else if (num >= 100000) {
    return (num / 100000).toFixed(2) + "lakh";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + "K";
  } else {
    return num.toString();
  }
};
