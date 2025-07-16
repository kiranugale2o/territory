export const addClientFields = [
  {
    name: "name",
    label: "Name",
    placeHolder: "Enter Your Name",
    type: "text",
  },
  {
    name: "contact",
    label: "Contact Number",
    placeHolder: "Enter Number",
    type: "text",
  },
  {
    name: "email",
    label: "Mail",
    placeHolder: "Enter Mail",
    type: "text",
  },

  {
    name: "city",
    label: "City",
    placeHolder: "Enter City",
    type: "text",
  },
  {
    name: "budget",
    label: "Budget",
    placeHolder: "Enter Budget",
    type: "text",
  },

  {
    name: "profession",
    label: "Profession",
    placeHolder: "Enter Profession ",
    type: "text",
  },
  {
    name: "status",
    label: "Status",
    placeHolder: "Select Status",
    type: "select",
    options: [
      { label: "Ongoing", value: "ongoing", color: "#5D00FF" },
      {
        label: "Visit Schedule",
        value: "visit",
        color: "#0068FF",
      },
      { label: "Token", value: "token", color: "#FFCA00" },
      { label: "Cancelled", value: "cancelled", color: "red" },
      {
        label: "Visit Reschedule",
        value: "visit Reschedule",
        color: "gray",
      },
      {
        label: "Received",
        value: "Received",
        color: "green",
      },
    ],
  },
  {
    name: "purpose",
    label: "Purpose",
    placeHolder: "Select Purpose ",
    type: "select",
  },

  {
    name: "income",
    label: "Income",
    placeHolder: "Annum ",
    type: "text",
  },
  {
    name: "paymentmode",
    label: " Mode of Payment",
    placeHolder: "Select  Mode of Payment",
    type: "select",
  },
  {
    name: "timeperiod",
    label: "Time Period",
    placeHolder: "Within a Month",
    type: "text",
  },
  {
    name: "decisionmaker",
    label: "Decision Maker",
    placeHolder: "Ex.Father",
    type: "text",
  },
  {
    name: "asset",
    label: "Asset",
    placeHolder: " Enter Asset",
    type: "text",
  },
  {
    name: "extra",
    label: "Extra",
    placeHolder: "Extra Details",
    type: "text",
  },
  {
    name: "remark",
    label: " Remark Details Description ",
    placeHolder:
      "Full Description writen by sales person about the client(customer) ",
    type: "description",
  },
];
//     Contact Number
//     Enter Number

//     Mail
//     Enter Mail  this is data pass to addClient compoent inside i
