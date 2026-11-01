/** @param {Date} [date] */
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
/** @param {string} value */
export function isDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00`);
  return !Number.isNaN(date.getTime()) && localDate(date) === value;
}
/** @param {string} value */
export function nextDate(value) {
  if (!isDate(value)) return "";
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + 1);
  return localDate(date);
}
/** @param {string} checkin @param {string} checkout @param {string} [today] @param {boolean} [required] */
export function validateDates(
  checkin,
  checkout,
  today = localDate(),
  required = true,
) {
  if (!required && !checkin && !checkout) return "";
  if (!checkin || !checkout)
    return "Please select both a check-in and check-out date.";
  if (!isDate(checkin) || !isDate(checkout))
    return "Please enter valid calendar dates.";
  if (checkin < today) return "Your check-in date cannot be in the past.";
  if (checkout <= checkin) return "Check-out must be after check-in.";
  return "";
}
/** @param {string} value */
export function validPhone(value) {
  const digits = value.replace(/\D/g, "");
  return (
    /^\+?[\d\s().-]+$/.test(value) && digits.length >= 10 && digits.length <= 15
  );
}
/** @param {Record<string,string>} data */
export function composeEnquiry(data) {
  return [
    "Hello Singh Homestay, I would like to enquire about a stay.",
    `Name: ${data.guestName.trim()}`,
    `Mobile: ${data.phone.trim()}`,
    data.enquiryType ? `Enquiry: ${data.enquiryType}` : "",
    data.checkin ? `Check-in: ${data.checkin}` : "",
    data.checkout ? `Check-out: ${data.checkout}` : "",
    data.adults ? `Adults: ${data.adults}` : "",
    data.children ? `Children: ${data.children}` : "",
    "Accommodation: Homestay Rooms",
    data.source ? `Source: ${data.source}` : "",
    data.message?.trim() ? `Message: ${data.message.trim()}` : "",
    "Please share availability, pricing and booking arrangements. Thank you.",
  ]
    .filter(Boolean)
    .join("\n");
}
/** @param {string} message @param {string} recipient */
export const whatsappUrl = (message, recipient) =>
  `https://wa.me/${recipient}?text=${encodeURIComponent(message)}`;

/** @param {Record<string,string>} data @param {boolean} booking */
export function validateEnquiry(data, booking) {
  /** @type {Record<string,string>} */
  const errors = {};
  const name = (data.guestName || "").trim();
  if (name.length < 2 || name.length > 80)
    errors.guestName = "Enter your name using 2–80 characters.";
  if (!validPhone(data.phone || "") || data.phone.length > 24)
    errors.phone = "Enter a mobile number with 10–15 digits.";
  const today = localDate();
  const dateError = validateDates(
    data.checkin || "",
    data.checkout || "",
    today,
    booking,
  );
  if (dateError)
    errors[
      !isDate(data.checkin || "") || data.checkin < today
        ? "checkin"
        : "checkout"
    ] = dateError;
  if (!/^(?:[1-9]|1[0-2])$/.test(data.adults || ""))
    errors.adults = "Choose between 1 and 12 adults.";
  if (!/^(?:[0-9]|10)$/.test(data.children || ""))
    errors.children = "Choose between 0 and 10 children.";
  if (
    (data.message || "").length > 1500 ||
    (!booking && (data.message || "").trim().length < 2)
  )
    errors.message = "Enter a message using 2–1500 characters.";
  if (
    !booking &&
    ![
      "Room availability",
      "Directions & arrival",
      "Facilities & arrangements",
      "Other question",
    ].includes(data.enquiryType)
  )
    errors.enquiryType = "Choose an enquiry type from the list.";
  return errors;
}
