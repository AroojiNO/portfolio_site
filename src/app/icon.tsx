import { ImageResponse } from "next/og";

// Browser tab icon: amber "NA" monogram on the site's dark background
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          border: "1.5px solid rgba(255, 223, 128, 0.5)",
          borderRadius: 7,
          color: "#FFDF80",
          fontSize: 16,
          letterSpacing: -0.5,
        }}
      >
        NA
      </div>
    ),
    size
  );
}
