import { ImageResponse } from "next/og";

// Home screen icon for iPhones and iPads (iOS rounds the corners itself)
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#10121A",
          color: "#FFDF80",
          fontSize: 84,
          letterSpacing: -3,
        }}
      >
        NA
      </div>
    ),
    size
  );
}
