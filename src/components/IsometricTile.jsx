import React from "react";

export function IsometricTile({
  children,
  count = 0,
  blackCount = 0,
  whiteCount = 0,
  demand = null,
  demandColor,
  showCounter = true,
  dragRegionId = null, // NEW: if set, makes the chip stack draggable
  style: outerStyle,
  ...props
}) {
  // 1) build chip list only if it's a chip‐showing tile
  const chipList =
    showCounter && demand == null
      ? [...Array(blackCount).fill("black"), ...Array(whiteCount).fill("white")]
      : [];

  // 2) chunk into columns of up to 10
  const columns = [];
  for (let i = 0; i < chipList.length; i += 10) {
    columns.push(chipList.slice(i, i + 10));
  }

  // should we render a badge? (either count or demand)
  const renderBadge = showCounter && (demand != null || count != null);
  const badgeBg =
    demand != null
      ? demandColor || "var(--color-primary)"
      : "var(--color-primary)";

  // sizing for demand vs. count badge
  const isDemand = demand != null;
  const badgeSize = isDemand ? 48 : 36;
  const badgeFont = isDemand ? "1.5rem" : "1.125rem";
  const badgeLine = `${badgeSize}px`;
  const badgePad = isDemand ? "0 8px" : "0 6px";
  const badgeRadius = badgeSize / 2;
  const badgeTop = -badgeSize / 2;

  return (
    <div
      {...props}
      style={{
        position: "relative",
        width: 120,
        height: 120,
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        boxShadow: "0 4px 8px var(--shadow-iso)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "8px",
        overflow: "visible",
        ...outerStyle,
      }}
    >
      {renderBadge && (
        <div
          style={{
            position: "absolute",
            top: badgeTop,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            minWidth: badgeSize,
            height: badgeSize,
            background: badgeBg,
            color: "#000",
            fontSize: badgeFont,
            fontWeight: 600,
            lineHeight: badgeLine,
            textAlign: "center",
            borderRadius: badgeRadius,
            padding: badgePad,
            boxShadow:
              "inset 0 -2px 4px rgba(0,0,0,0.2), 0 4px 6px rgba(0,0,0,0.2)",
          }}
        >
          {demand != null ? demand : count}
        </div>
      )}

      {/* —— Chip Stack —— */}
      {showCounter && demand == null && (
        <div
          draggable={dragRegionId != null}
          onDragStart={
            dragRegionId != null
              ? (e) => {
                  e.dataTransfer.setData("text/plain", dragRegionId);
                  e.dataTransfer.effectAllowed = "move";
                }
              : undefined
          }
          style={{
            position: "absolute",
            top: -4,
            right: 8,
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            cursor: dragRegionId != null ? "grab" : "default",
          }}
        >
          {columns.map((col, colIdx) => (
            <div
              key={colIdx}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginLeft: colIdx === 0 ? 0 : 4,
              }}
            >
              {col.map((color, i) => (
                <span
                  key={i}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: color === "black" ? "#000" : "#fff",
                    border:
                      color === "black"
                        ? "1px solid var(--color-border)"
                        : "1px solid #000",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    marginTop: i === 0 ? 0 : -10,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* —— Main Icon/Image —— */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>

      {/* —— Label —— */}
      <div
        style={{
          marginBottom: "4px",
          fontSize: "0.875rem",
          fontWeight: "bold",
        }}
      >
        {props["data-label"]}
      </div>
    </div>
  );
}
