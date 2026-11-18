import type { IdentityDocId } from "./identity";

export type Registration = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  country: string;
  state: string;
  lga: string;
  address: string;
};

// The identity document images. They live only in memory (File objects) until
// they are sent: never put them in localStorage or turn them into public URLs.
export type IdentityUpload = {
  type: IdentityDocId;
  front: File;
  back: File | null;
};

// Strips spaces, dashes and brackets: "+234 816 162 0571" -> "+2348161620571".
export function normalisePhone(phone: string): string {
  return phone.replace(/[\s()-]/g, "");
}

// A Nigerian number as the backend expects it: +234 or a leading 0, then 10
// digits.
export function isNigerianPhone(phone: string): boolean {
  return /^(\+234|0)\d{10}$/.test(normalisePhone(phone));
}

// Packs the details and the images into one multipart request body, using the
// field names the backend expects (snake_case).
export function buildRegistrationFormData(
  data: Registration,
  identity: IdentityUpload,
): FormData {
  const body = new FormData();
  body.append("first_name", data.firstName.trim());
  body.append("last_name", data.lastName.trim());
  body.append("email", data.email.trim());
  if (data.phone.trim()) body.append("phone", normalisePhone(data.phone));
  if (data.dateOfBirth) body.append("date_of_birth", data.dateOfBirth);
  if (data.gender) body.append("gender", data.gender);
  body.append("country", data.country);
  body.append("state", data.state);
  body.append("lga", data.lga);
  if (data.address.trim()) body.append("address", data.address.trim());
  body.append("id_type", identity.type);
  // ASSUMED field names for the images: confirm them with the backend dev.
  body.append("id_front", identity.front, identity.front.name);
  if (identity.back) {
    body.append("id_back", identity.back, identity.back.name);
  }
  return body;
}

// The backend the registration is sent to. Set NEXT_PUBLIC_API_URL (and, if
// the route differs, NEXT_PUBLIC_REGISTER_PATH) in .env.local, and in the
// Vercel project settings for the live site. These are public values, not
// secrets: never put keys or tokens in a NEXT_PUBLIC_ variable.
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ??
  "https://culbra-backend-production.up.railway.app"
).replace(/\/+$/, "");
const REGISTER_PATH =
  process.env.NEXT_PUBLIC_REGISTER_PATH ?? "/api/register";

// Turns the backend's terse messages ("first_name required") into sentences.
const FIELD_NAMES: Record<string, string> = {
  first_name: "First name",
  last_name: "Last name",
  email: "Email address",
  phone: "Phone number",
  date_of_birth: "Date of birth",
  gender: "Gender",
  country: "Country",
  state: "State",
  lga: "Local government area",
  address: "Address",
  id_type: "Identification type",
  id_front: "Front of the document",
  id_back: "Back of the document",
};

function friendly(message: string): string {
  const text = message.trim();
  if (!text) return "";
  if (/^valid email required$/i.test(text)) {
    return "Enter a valid email address.";
  }
  const required = text.match(/^(\w+) required$/i);
  if (required) {
    const name = FIELD_NAMES[required[1]] ?? required[1].replace(/_/g, " ");
    return `${name} is required.`;
  }
  return /[.!?]$/.test(text)
    ? text.charAt(0).toUpperCase() + text.slice(1)
    : text.charAt(0).toUpperCase() + text.slice(1) + ".";
}

// Sends the registration, with the identity images, to the backend as one
// multipart request over HTTPS. Throws an Error with a readable message when
// the request fails, so the form can show it. Nothing is stored in the
// browser, and the backend must keep the images in private storage.
export async function submitRegistration(
  data: Registration,
  identity: IdentityUpload,
): Promise<void> {
  const body = buildRegistrationFormData(data, identity);

  let response: Response;
  try {
    // No Content-Type header: the browser sets it, with the multipart boundary.
    response = await fetch(`${API_URL}${REGISTER_PATH}`, {
      method: "POST",
      body,
    });
  } catch {
    throw new Error(
      "We couldn’t reach the server. Check your connection and try again.",
    );
  }

  if (response.ok) return;

  // Show the backend's own message when it sends one.
  let message = "";
  try {
    const payload = await response.json();
    const raw = payload?.error ?? payload?.message;
    if (typeof raw === "string") message = friendly(raw);
    else if (Array.isArray(payload?.errors)) {
      message = payload.errors
        .map((e: unknown) =>
          typeof e === "string"
            ? friendly(e)
            : friendly((e as { message?: string })?.message ?? ""),
        )
        .filter(Boolean)
        .join(" ");
    }
  } catch {
    // The response wasn't JSON; fall through to a generic message.
  }
  throw new Error(
    message || `Registration failed (error ${response.status}). Please try again.`,
  );
}
