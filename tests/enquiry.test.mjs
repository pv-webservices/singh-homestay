import test from "node:test";
import assert from "node:assert/strict";
import {
  localDate,
  nextDate,
  isDate,
  validateDates,
  validPhone,
  composeEnquiry,
  whatsappUrl,
} from "../src/lib/enquiry.mjs";

test("calendar dates reject rollover and handle leap years", () => {
  assert.equal(isDate("2026-02-29"), false);
  assert.equal(isDate("2028-02-29"), true);
  assert.equal(isDate("2026-13-01"), false);
  assert.equal(isDate("2026-2-01"), false);
  assert.equal(nextDate("2026-12-31"), "2027-01-01");
  assert.equal(localDate(new Date(2026, 9, 28, 23, 50)), "2026-10-28");
});
test("enquiries reject past, missing and reversed dates", () => {
  assert.equal(validateDates("2026-10-28", "2026-10-29", "2026-10-28"), "");
  assert.match(validateDates("2026-10-27", "2026-10-29", "2026-10-28"), /past/);
  assert.match(
    validateDates("2026-10-28", "2026-10-28", "2026-10-28"),
    /after/,
  );
  assert.match(validateDates("2026-11-01", "", "2026-10-28"), /both/);
  assert.equal(validateDates("", "", "2026-10-28", false), "");
  assert.match(
    validateDates("2026-02-30", "2026-03-01", "2026-01-01"),
    /valid/,
  );
});
test("contact numbers have usable digits", () => {
  assert.equal(validPhone("+91 92880 56157"), true);
  assert.equal(validPhone("abcdefghij"), false);
  assert.equal(validPhone("123"), false);
  assert.equal(validPhone("1234567890123456"), false);
});
test("structured message retains names, dates and children without confirming a booking", () => {
  const message = composeEnquiry({
    guestName: "Asha & Family",
    phone: "+91 90000 00000",
    checkin: "2026-11-02",
    checkout: "2026-11-04",
    adults: "2",
    children: "1",
    message: "Window seat? & quiet, please.",
  });
  assert.match(message, /Asha & Family/);
  assert.match(message, /Check-in: 2026-11-02/);
  assert.match(message, /Adults: 2/);
  assert.match(message, /Children: 1/);
  assert.doesNotMatch(message, /booking is confirmed/i);
  const url = new URL(whatsappUrl(message, "919288056157"));
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.pathname, "/919288056157");
  assert.equal(url.searchParams.get("text"), message);
});

test("WhatsApp handoff uses the configured business recipient", () => {
  assert.equal(
    new URL(whatsappUrl("Test only", "919000000000")).pathname,
    "/919000000000",
  );
});
