// Accepted Nigerian identity documents and the rules for uploading them.

export type IdentityDocId = "nin" | "pvc" | "passport" | "drivers-licence";

export type IdentityDocConfig = {
  id: IdentityDocId;
  label: string;
  frontLabel: string;
  backLabel: string;
  // "required": back image must be uploaded. "optional": shown, but may be
  // skipped (for documents that only sometimes print on the reverse).
  // "none": the document has no back to upload, so no field is shown.
  back: "required" | "optional" | "none";
};

export const ID_TYPES: IdentityDocConfig[] = [
  {
    id: "nin",
    label: "NIN / National ID Card",
    frontLabel: "Front of Document",
    backLabel: "Back of Document",
    back: "required",
  },
  {
    id: "pvc",
    label: "Permanent Voter's Card (PVC)",
    frontLabel: "Front of Document",
    backLabel: "Back of Document",
    back: "required",
  },
  {
    id: "passport",
    label: "Nigerian International Passport",
    frontLabel: "Passport Bio-data / Photo Page",
    backLabel: "Back of Document",
    back: "none",
  },
  {
    id: "drivers-licence",
    label: "Driver's Licence",
    frontLabel: "Front of Document",
    backLabel: "Back of Document",
    back: "required",
  },
];

export function getIdType(id: string): IdentityDocConfig | undefined {
  return ID_TYPES.find((t) => t.id === id);
}

export const ACCEPTED_MIME = ["image/jpeg", "image/png", "image/webp"];
export const ACCEPTED_EXT = [".jpg", ".jpeg", ".png", ".webp"];
export const MAX_BYTES = 5 * 1024 * 1024; // 5 MB per image

// Returns an error message, or null when the file is acceptable.
export function validateIdentityFile(file: File): string | null {
  const name = file.name.toLowerCase();
  const typeOk = ACCEPTED_MIME.includes(file.type);
  const extOk = ACCEPTED_EXT.some((ext) => name.endsWith(ext));
  if (!typeOk || !extOk) {
    return "Unsupported file. Upload a JPG, JPEG, PNG or WEBP image.";
  }
  if (file.size > MAX_BYTES) {
    return "This image is larger than 5 MB. Choose a smaller one.";
  }
  if (file.size === 0) return "This file is empty. Choose another image.";
  return null;
}
