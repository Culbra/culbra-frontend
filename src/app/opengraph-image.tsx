import { ImageResponse } from "next/og";

// The picture shown when the link is shared on WhatsApp, X, Facebook, Slack
// and so on.
export const alt = "CULBRA — Where you come from matters";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#000000",
          color: "#ffffff",
          borderLeft: "24px solid #fc8a0d",
        }}
      >
        <div
          style={{
            fontSize: 150,
            fontWeight: 900,
            letterSpacing: 8,
            lineHeight: 1,
          }}
        >
          CULBRA
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.15,
          }}
        >
          <span>Where you come from&nbsp;</span>
          <span style={{ color: "#12a066" }}>matters.</span>
        </div>
        <div style={{ marginTop: 28, fontSize: 32, color: "#cfcfcf" }}>
          Culture · Brains · Creativity · Impact
        </div>
      </div>
    ),
    { ...size },
  );
}
