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
    /^[+\d\s().-]+$/.test(value) && digits.length >= 7 && digits.length <= 15
  );
}
/** @param {Record<string,string>} data */
export function composeEnquiry(data) {
  return [
    "Hello Singh Homestay, I would like to enquire about a stay.",
    `Name: ${data.guestName.trim()}`,
    `Mobile: ${data.phone.trim()}`,
    data.email ? `Email: ${data.email.trim()}` : "",
    data.enquiryType ? `Enquiry: ${data.enquiryType}` : "",
    data.checkin ? `Check-in: ${data.checkin}` : "",
    data.checkout ? `Check-out: ${data.checkout}` : "",
    data.adults ? `Adults: ${data.adults}` : "",
    data.children ? `Children: ${data.children}` : "",
    "Accommodation: Homestay Rooms",
    data.message?.trim() ? `Message: ${data.message.trim()}` : "",
    "Please share availability, pricing and booking arrangements. Thank you.",
  ]
    .filter(Boolean)
    .join("\n");
}
/** @param {string} message @param {string} recipient */
export const whatsappUrl = (message, recipient) =>
  `https://wa.me/${recipient}?text=${encodeURIComponent(message)}`;
