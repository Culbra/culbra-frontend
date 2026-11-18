// While the backend isn't ready, /register and /partner show a countdown
// instead of their forms. Flip these to true when each form can submit.
export const REGISTRATION_OPEN = false;
export const PARTNERSHIPS_OPEN = false;

// When registration opens. PLACEHOLDER: set the real date here, or in
// NEXT_PUBLIC_LAUNCH_DATE. Keep the +01:00 so it is Lagos time (WAT).
export const LAUNCH_DATE =
  process.env.NEXT_PUBLIC_LAUNCH_DATE ?? "2026-12-01T09:00:00+01:00";
