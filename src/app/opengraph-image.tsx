import { ImageResponse } from "next/og";

// Preview card shown when a link to the site is shared (LinkedIn, Slack, iMessage, etc.)
export const alt = "Noah Arooji · Software Engineer & Machine Learning Researcher";
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
          backgroundColor: "#10121A",
          // Same amber and indigo glows as the main page background
          backgroundImage:
            "radial-gradient(circle at 10% 0%, rgba(251, 191, 36, 0.16), transparent 45%), radial-gradient(circle at 95% 100%, rgba(99, 102, 241, 0.24), transparent 50%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", width: 96, height: 4, borderRadius: 2, background: "#FFDF80", marginBottom: 40 }} />
        <div style={{ fontSize: 88, letterSpacing: -2 }}>Noah Arooji</div>
        <div style={{ fontSize: 40, color: "#FFDF80", marginTop: 16 }}>
          Software Engineer & Machine Learning Researcher
        </div>
        <div style={{ fontSize: 30, color: "#9CA3AF", marginTop: 28 }}>
          Computer Science + Applied Statistics · University of Virginia
        </div>
        <div style={{ fontSize: 28, color: "#6B7280", marginTop: 72 }}>noaharooji.com</div>
      </div>
    ),
    size
  );
}
