import {
  localDate,
  nextDate,
  isDate,
  validateDates,
  validPhone,
  composeEnquiry,
  whatsappUrl,
} from "../lib/enquiry.mjs";

import { business } from "../data/site";

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector<HTMLElement>("[data-header]");
const menuButton =
  document.querySelector<HTMLButtonElement>("button.menu-toggle");
const drawer = document.querySelector<HTMLElement>("#site-drawer");

// Right-side drawer. It lives outside the header so `position: fixed`
// is never trapped by the header's backdrop-filter after scrolling.
function setDrawer(open: boolean) {
  document.body.classList.toggle("drawer-open", open);
  menuButton?.setAttribute("aria-expanded", String(open));
  menuButton?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  if (open) {
    header?.classList.remove("is-hidden");
    // Wait a frame: the drawer is still visibility:hidden at this instant.
    setTimeout(
      () => drawer?.querySelector<HTMLElement>(".drawer-close")?.focus(),
      60,
    );
  } else menuButton?.focus({ preventScroll: true });
}
menuButton?.addEventListener("click", () =>
  setDrawer(!document.body.classList.contains("drawer-open")),
);
document
  .querySelectorAll<HTMLElement>("[data-drawer-close]")
  .forEach((el) => el.addEventListener("click", () => setDrawer(false)));
drawer
  ?.querySelectorAll("a")
  .forEach((a) =>
    a.addEventListener("click", () =>
      document.body.classList.remove("drawer-open"),
    ),
  );
document.addEventListener("keydown", (e) => {
  if (!document.body.classList.contains("drawer-open") || !drawer) return;
  if (e.key === "Escape") setDrawer(false);
  if (e.key === "Tab") {
    const items = Array.from(drawer.querySelectorAll<HTMLElement>("a, button"));
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});
matchMedia("(min-width: 981px)").addEventListener("change", (e) => {
  if (e.matches && document.body.classList.contains("drawer-open"))
    setDrawer(false);
});

// Header: solid after scrolling, tucks away on scroll down, returns on scroll up.
let lastY = window.scrollY;
function updateHeader() {
  const y = window.scrollY;
  header?.classList.toggle("is-scrolled", y > 40);
  document.body.classList.toggle("show-float", y > 280);
  const hide =
    y > 520 &&
    y > lastY + 4 &&
    !document.body.classList.contains("drawer-open");
  if (hide) header?.classList.add("is-hidden");
  else if (y < lastY - 4 || y <= 520) header?.classList.remove("is-hidden");
  lastY = y;
}

// Subtle parallax using transform only.
const parallax = reducedMotion
  ? []
  : Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
function updateParallax() {
  const vh = window.innerHeight;
  for (const el of parallax) {
    const host = el.parentElement;
    if (!host) continue;
    const rect = host.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > vh) continue;
    const speed = Number(el.dataset.parallax) || 0.2;
    const offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
    el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
  }
}
let ticking = false;
window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateHeader();
      updateParallax();
      ticking = false;
    });
  },
  { passive: true },
);
updateHeader();
updateParallax();

if ("IntersectionObserver" in window && !reducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    observer.observe(el);
  });
} else {
  document
    .querySelectorAll<HTMLElement>("[data-reveal]")
    .forEach((el) => el.classList.add("is-visible"));
}

document
  .querySelectorAll<HTMLFormElement>("[data-date-form]")
  .forEach((form) => {
    const checkin = form.querySelector<HTMLInputElement>("[name=checkin]");
    const checkout = form.querySelector<HTMLInputElement>("[name=checkout]");
    if (!checkin || !checkout) return;
    const today = localDate();
    checkin.min = today;
    checkout.min = nextDate(today);
    const updateDates = () => {
      checkin.setCustomValidity("");
      checkout.setCustomValidity("");
      checkout.min =
        isDate(checkin.value) && checkin.value >= localDate()
          ? nextDate(checkin.value)
          : nextDate(localDate());
      if (checkin.value && checkout.value)
        checkout.setCustomValidity(
          validateDates(checkin.value, checkout.value, localDate(), false),
        );
      else if (
        form.dataset.enquiry === "contact" &&
        (checkin.value || checkout.value)
      )
        checkout.setCustomValidity(
          "Please select both a check-in and check-out date.",
        );
    };
    checkin.addEventListener("input", updateDates);
    checkout.addEventListener("input", updateDates);
    form.addEventListener("submit", (e) => {
      updateDates();
      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity();
      }
    });
  });

document.querySelectorAll<HTMLFormElement>("[data-enquiry]").forEach((form) => {
  const submit = form.querySelector<HTMLButtonElement>("[type=submit]");
  if (submit) submit.disabled = false;
  const status = form.querySelector<HTMLElement>(".form-status");
  const result = form.querySelector<HTMLElement>(".enquiry-result");
  const phone = form.querySelector<HTMLInputElement>("[name=phone]");
  const name = form.querySelector<HTMLInputElement>("[name=guestName]");
  const message = form.querySelector<HTMLTextAreaElement>("[name=message]");
  phone?.addEventListener("input", () =>
    phone.setCustomValidity(
      validPhone(phone.value) ? "" : "Enter a mobile number with 7–15 digits.",
    ),
  );
  name?.addEventListener("input", () =>
    name.setCustomValidity(
      name.value.trim().length >= 2 ? "" : "Please enter your name.",
    ),
  );
  message?.addEventListener("input", () =>
    message.setCustomValidity(
      message.required && !message.value.trim()
        ? "Please tell us how we can help."
        : "",
    ),
  );
  if (form.dataset.enquiry === "booking") {
    const params = new URLSearchParams(location.search);
    const arrival = params.get("checkin") || "";
    const departure = params.get("checkout") || "";
    if (arrival && !validateDates(arrival, departure)) {
      (form.elements.namedItem("checkin") as HTMLInputElement).value = arrival;
      const out = form.elements.namedItem("checkout") as HTMLInputElement;
      out.value = departure;
      out.min = nextDate(arrival);
    } else if (arrival || departure) {
      if (status)
        status.textContent =
          "Please choose your dates again. The previous dates are no longer valid.";
    }
    const guests = params.get("guests") || "";
    if (/^(?:[1-9]|1[0-2])$/.test(guests))
      (form.elements.namedItem("adults") as HTMLSelectElement).value = guests;
  }
  form.addEventListener("input", () => {
    if (result) result.hidden = true;
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries()) as Record<
      string,
      string
    >;
    const dateError = validateDates(
      data.checkin || "",
      data.checkout || "",
      localDate(),
      form.dataset.enquiry === "booking",
    );
    const error =
      dateError ||
      (!validPhone(data.phone)
        ? "Please enter a mobile number with 7–15 digits."
        : "") ||
      (data.guestName.trim().length < 2 ? "Please enter your name." : "");
    if (error) {
      if (status) status.textContent = error;
      return;
    }
    if (status) status.textContent = "";
    if (!result) return;
    const prepared = composeEnquiry(data);
    const summary = result.querySelector("pre");
    const link = result.querySelector<HTMLAnchorElement>("a");
    if (summary) summary.textContent = prepared;
    if (link) link.href = whatsappUrl(prepared, business.whatsapp);
    result.hidden = false;
    result.scrollIntoView({
      behavior: reducedMotion ? "instant" : "smooth",
      block: "center",
    });
    link?.focus({ preventScroll: true });
  });
});

const lightbox = document.querySelector<HTMLDialogElement>(".lightbox");
let activePhotos: HTMLAnchorElement[] = [];
let current = 0;
let returnFocus: HTMLElement | null = null;
const lightboxImage = lightbox?.querySelector("img");
function displayPhoto(index: number) {
  if (!activePhotos.length || !lightbox || !lightboxImage) return;
  current = (index + activePhotos.length) % activePhotos.length;
  const anchor = activePhotos[current];
  lightboxImage.src = anchor.href;
  lightboxImage.alt =
    anchor.querySelector("img")?.alt ||
    anchor.dataset.caption ||
    "Homestay gallery photo";
  const caption = lightbox.querySelector("#lightbox-caption");
  if (caption)
    caption.textContent = `${current + 1} / ${activePhotos.length} — ${anchor.dataset.caption}`;
}
document.querySelectorAll<HTMLElement>("[data-gallery]").forEach((gallery) => {
  const photos = Array.from(
    gallery.querySelectorAll<HTMLAnchorElement>("[data-gallery-item]"),
  );
  const filters = gallery.querySelector<HTMLElement>(".gallery-filters");
  if (filters) filters.hidden = false;
  filters
    ?.querySelectorAll<HTMLButtonElement>("[data-filter]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        filters
          .querySelectorAll<HTMLButtonElement>("[data-filter]")
          .forEach((item) => {
            item.classList.toggle("active", item === button);
            item.setAttribute("aria-pressed", String(item === button));
          });
        photos.forEach(
          (photo) =>
            (photo.hidden =
              button.dataset.filter !== "All photos" &&
              photo.dataset.category !== button.dataset.filter),
        );
      }),
    );
  photos.forEach((anchor) =>
    anchor.addEventListener("click", (e) => {
      if (!lightbox) return;
      e.preventDefault();
      activePhotos = photos.filter((photo) => !photo.hidden);
      returnFocus = anchor;
      displayPhoto(activePhotos.indexOf(anchor));
      lightbox.showModal();
      document.body.classList.add("modal-open");
    }),
  );
});
lightbox
  ?.querySelector(".lightbox-close")
  ?.addEventListener("click", () => lightbox.close());
lightbox
  ?.querySelector(".lightbox-prev")
  ?.addEventListener("click", () => displayPhoto(current - 1));
lightbox
  ?.querySelector(".lightbox-next")
  ?.addEventListener("click", () => displayPhoto(current + 1));
lightbox?.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    e.preventDefault();
    displayPhoto(current + 1);
  }
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    displayPhoto(current - 1);
  }
});
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.close();
});
lightbox?.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  returnFocus?.focus({ preventScroll: true });
});
let touchX = 0;
lightboxImage?.addEventListener(
  "touchstart",
  (e) => (touchX = e.changedTouches[0].clientX),
  { passive: true },
);
lightboxImage?.addEventListener(
  "touchend",
  (e) => {
    const delta = e.changedTouches[0].clientX - touchX;
    if (Math.abs(delta) > 55) displayPhoto(current + (delta < 0 ? 1 : -1));
  },
  { passive: true },
);
