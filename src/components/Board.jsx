// src/components/Board.jsx
import React, { useState } from "react";
import { IsometricTile } from "./IsometricTile"; // or your Tile component
// Pipeline icons
import factory from "../assets/factory.png";
import factoryWH from "../assets/factoryWH.png";
import transit1 from "../assets/transit1.png";
import transit2 from "../assets/transit2.png";
import transit3 from "../assets/transit3.png";
import transit4 from "../assets/transit4.png";
import central from "../assets/central.png";
// Regional icons
import truck1 from "../assets/truck1.png";
import dc1 from "../assets/dc1.png";
import market1 from "../assets/market1.png";
import truck2 from "../assets/truck2.png";
import dc2 from "../assets/dc2.png";
import market2 from "../assets/market2.png";
import truck3 from "../assets/truck3.png";
import dc3 from "../assets/dc3.png";
import market3 from "../assets/market3.png";
import truck4 from "../assets/truck4.png";
import dc4 from "../assets/dc4.png";
import market4 from "../assets/market4.png";
import logo from "../assets/Logo.png";

// Initial chip counts
const initialCounts = {
  factory: 0,
  factoryWH: 15,
  transit1: 15,
  transit2: 5,
  transit3: 15,
  transit4: 10,
  central: 25,
  truck1: 5,
  dc1: 5,
  market1: 0,
  truck2: 8,
  dc2: 2,
  market2: 0,
  truck3: 3,
  dc3: 7,
  market3: 0,
  truck4: 6,
  dc4: 4,
  market4: 0,
};

// Board layout definitions
const pipeline = [
  { key: "factory", icon: factory, label: "Factory" },
  { key: "factoryWH", icon: factoryWH, label: "Factory WH" },
  { key: "transit1", icon: transit1, label: "Transit 1" },
  { key: "transit2", icon: transit2, label: "Transit 2" },
  { key: "transit3", icon: transit3, label: "Transit 3" },
  { key: "transit4", icon: transit4, label: "Transit 4" },
  { key: "central", icon: central, label: "Central DC" },
];
const regions = [
  { id: 1, truckIcon: truck1, dcIcon: dc1, marketIcon: market1 },
  { id: 2, truckIcon: truck2, dcIcon: dc2, marketIcon: market2 },
  { id: 3, truckIcon: truck3, dcIcon: dc3, marketIcon: market3 },
  { id: 4, truckIcon: truck4, dcIcon: dc4, marketIcon: market4 },
];

// Preset one‐die outcomes per round & market
const dicePreset = {
  1: { market1: 1, market2: 1, market3: 2, market4: 9 },
  2: { market1: 1, market2: 0, market3: 1, market4: 0 },
  3: { market1: 2, market2: 2, market3: 0, market4: 1 },
  4: { market1: 1, market2: 2, market3: 2, market4: 9 },
  5: { market1: 0, market2: 0, market3: 0, market4: 2 },
  6: { market1: 9, market2: 1, market3: 9, market4: 0 },
  7: { market1: 1, market2: 1, market3: 0, market4: 9 },
  8: { market1: 9, market2: 1, market3: 9, market4: 1 },
  9: { market1: 2, market2: 9, market3: 1, market4: 2 },
  10: { market1: 9, market2: 1, market3: 2, market4: 1 },
  11: { market1: 2, market2: 9, market3: 9, market4: 9 },
  12: { market1: 0, market2: 1, market3: 1, market4: 0 },
  13: { market1: 9, market2: 1, market3: 1, market4: 2 },
  14: { market1: 1, market2: 2, market3: 0, market4: 2 },
  15: { market1: 0, market2: 2, market3: 2, market4: 2 },
  16: { market1: 9, market2: 1, market3: 2, market4: 2 },
  17: { market1: 1, market2: 2, market3: 1, market4: 1 },
  18: { market1: 0, market2: 2, market3: 9, market4: 9 },
  19: { market1: 1, market2: 0, market3: 1, market4: 1 },
  20: { market1: 1, market2: 0, market3: 9, market4: 9 },
};

// Preset for regular demand: Round -> { Yellow (market3), Blue (market4), Green (market2), Red (market1) }
const regularDicePreset = {
  1: { market3: 2, market4: 3, market2: 2, market1: 3 },
  2: { market3: 3, market4: 3, market2: 2, market1: 3 },
  3: { market3: 2, market4: 2, market2: 2, market1: 3 },
  4: { market3: 2, market4: 3, market2: 3, market1: 2 },
  5: { market3: 3, market4: 3, market2: 2, market1: 3 },
  6: { market3: 3, market4: 3, market2: 2, market1: 2 },
  7: { market3: 2, market4: 2, market2: 2, market1: 2 },
  8: { market3: 3, market4: 3, market2: 2, market1: 3 },
  9: { market3: 3, market4: 2, market2: 3, market1: 2 },
  10: { market3: 3, market4: 3, market2: 3, market1: 2 },
  11: { market3: 2, market4: 2, market2: 3, market1: 3 },
  12: { market3: 2, market4: 3, market2: 3, market1: 2 },
  13: { market3: 3, market4: 2, market2: 3, market1: 2 },
  14: { market3: 2, market4: 3, market2: 3, market1: 3 },
  15: { market3: 3, market4: 2, market2: 2, market1: 2 },
  16: { market3: 3, market4: 3, market2: 3, market1: 3 },
  17: { market3: 3, market4: 3, market2: 2, market1: 2 },
  18: { market3: 2, market4: 3, market2: 2, market1: 3 },
  19: { market3: 3, market4: 2, market2: 2, market1: 2 },
  20: { market3: 2, market4: 2, market2: 3, market1: 3 },
};

const dieFaces = [0, 1, 1, 2, 2, 9];

// Single‐die face
const DiceFace = ({ value, color }) => (
  <div
    style={{
      width: "4rem",
      height: "4rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: color,
      border: "1px solid var(--color-border)",
      borderRadius: "0.25rem",
      fontSize: "2rem",
      fontWeight: 600,
      color: "#000",
    }}
  >
    {value}
  </div>
);

export default function Board() {
  // Core state
  const [round, setRound] = useState(0);
  const [counts, setCounts] = useState({ ...initialCounts });
  const [demands, setDemands] = useState({
    market1: 0,
    market2: 0,
    market3: 0,
    market4: 0,
  });
  const [diceState, setDiceState] = useState({
    market1: 0,
    market2: 0,
    market3: 0,
    market4: 0,
  });
  const [isRegularDemand, setIsRegularDemand] = useState(false);
  const [stats, setStats] = useState([]);

  // Workflow flags & inputs
  const [transportDone, setTransportDone] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [transportToCentralDone, setTransportToCentralDone] = useState(false);
  const [factoryOrdered, setFactoryOrdered] = useState(false);
  const [productionDone, setProductionDone] = useState(false);

  const [orders, setOrders] = useState({ 1: 0, 2: 0, 3: 0, 4: 0 });
  const [factoryOrder, setFactoryOrder] = useState(0);
  const [productionAmt, setProductionAmt] = useState(0);
  const [lastProdRound, setLastProdRound] = useState(null);

  // 1. Deliver to markets
  const handleSupply = (regionId, marketId) => {
    const dcKey = `dc${regionId}`,
      mKey = `market${marketId}`;
    const avail = counts[dcKey],
      need = -demands[mKey];
    const sup = Math.min(avail, need);
    if (!sup) return;
    setCounts((c) => ({ ...c, [dcKey]: c[dcKey] - sup }));
    setDemands((d) => ({ ...d, [mKey]: d[mKey] + sup }));
  };

  // 2. Tally & push new row
  const handleMarketsSupplied = () => {
    if (round === 0 || stats.some((s) => s.round === round)) return;
    let totalD = 0,
      totalS = 0;
    for (let i = 1; i <= 4; i++) {
      const v = diceState[`market${i}`];
      totalD += v;
      totalS += v + demands[`market${i}`];
    }
    const missed = totalD - totalS;
    setStats((s) => [
      ...s,
      {
        round,
        totalDemand: totalD,
        totalSupplied: totalS,
        missed,
        ordersPlaced: null,
        produced: null,
      },
    ]);
  };

  // 3. Regional transport
  const handleRegionalTransport = () => {
    if (!stats.some((s) => s.round === round) || transportDone) return;
    setCounts((c) => {
      const n = { ...c };
      for (let i = 1; i <= 4; i++) {
        const t = n[`truck${i}`] || 0;
        n[`dc${i}`] = (n[`dc${i}`] || 0) + t;
        n[`truck${i}`] = 0;
      }
      return n;
    });
    setTransportDone(true);
  };

  // 4. Order from central DC → patch ordersPlaced
  const handleOrderFromCentral = () => {
    if (!transportDone || orderDone) return;
    const sum = Object.values(orders).reduce((a, b) => a + b, 0);
    if (sum > counts.central) {
      alert("Insufficient stock");
      return;
    }
    setCounts((c) => {
      const n = { ...c, central: c.central - sum };
      for (let i = 1; i <= 4; i++) {
        n[`truck${i}`] = (n[`truck${i}`] || 0) + orders[i];
      }
      return n;
    });
    setOrderDone(true);
    const cnt = Object.values(orders).filter((x) => x > 0).length;
    setStats((s) =>
      s.map((r) =>
        r.round === round
          ? { ...r, ordersPlaced: (r.ordersPlaced || 0) + cnt }
          : r
      )
    );
  };

  // 5. Transport to central DC
  const handleTransportToCentralDC = () => {
    if (!transportDone || transportToCentralDone) return;
    setCounts((c) => ({
      ...c,
      central: c.central + c.transit4,
      transit4: c.transit3,
      transit3: c.transit2,
      transit2: c.transit1,
      transit1: 0,
    }));
    setTransportToCentralDone(true);
  };

  // 6. Order from factory WH → patch ordersPlaced
  const handleOrderFromFactory = () => {
    if (!transportToCentralDone || factoryOrdered) return;
    if (factoryOrder > counts.factoryWH) {
      alert("Insufficient stock");
      return;
    }
    setCounts((c) => ({
      ...c,
      factoryWH: c.factoryWH - factoryOrder,
      transit1: c.transit1 + factoryOrder,
    }));
    setFactoryOrdered(true);
    const cnt = factoryOrder > 0 ? 1 : 0;
    setStats((s) =>
      s.map((r) =>
        r.round === round
          ? { ...r, ordersPlaced: (r.ordersPlaced || 0) + cnt }
          : r
      )
    );
  };

  // 7. Produce → patch ordersPlaced & produced
  const handleProduce = () => {
    if (!factoryOrdered || productionDone || round % 2 === 0) return;
    setCounts((c) => ({ ...c, factory: c.factory + productionAmt }));
    setLastProdRound(round);
    setProductionDone(true);
    const cnt = productionAmt > 0 ? 1 : 0;
    setStats((s) =>
      s.map((r) =>
        r.round === round
          ? {
              ...r,
              ordersPlaced: (r.ordersPlaced || 0) + cnt,
              produced: productionAmt,
            }
          : r
      )
    );
  };

  // 8. Roll Dice → next round & delayed production move
  const rollDice = () => {
    const next = round + 1;
    // delay: move factory→WH on round = lastProdRound+2
    if (lastProdRound != null && next === lastProdRound + 2) {
      setCounts((c) => ({
        ...c,
        factoryWH: c.factoryWH + c.factory,
        factory: 0,
      }));
      setLastProdRound(null);
    }
    setRound(next);
    setTransportDone(false);
    setOrderDone(false);
    setTransportToCentralDone(false);
    setFactoryOrdered(false);
    setProductionDone(false);
    setOrders({ 1: 0, 2: 0, 3: 0, 4: 0 });
    setFactoryOrder(0);
    setProductionAmt(0);

    const preset = isRegularDemand
      ? regularDicePreset[next] || {}
      : dicePreset[next] || {};
    const newDice = {},
      newDem = {};
    for (let i = 1; i <= 4; i++) {
      const key = `market${i}`;
      const v =
        preset[key] != null
          ? preset[key]
          : dieFaces[Math.floor(Math.random() * dieFaces.length)];
      newDice[key] = v;
      newDem[key] = -v;
    }
    setDiceState(newDice);
    setDemands(newDem);
  };

  // 9. Reset
  const handleReset = () => {
    if (!window.confirm("Reset board to round 0?")) return;
    setRound(0);
    setCounts({ ...initialCounts });
    setDemands({ market1: 0, market2: 0, market3: 0, market4: 0 });
    setDiceState({ market1: 0, market2: 0, market3: 0, market4: 0 });
    setStats([]);
    setTransportDone(false);
    setOrderDone(false);
    setTransportToCentralDone(false);
    setFactoryOrdered(false);
    setProductionDone(false);
    setOrders({ 1: 0, 2: 0, 3: 0, 4: 0 });
    setFactoryOrder(0);
    setProductionAmt(0);
    setLastProdRound(null);
  };

  const supplyDone = stats.some((s) => s.round === round);
  const gridCols = !orderDone && transportDone ? "auto auto auto" : "auto auto";

  return (
    <div style={{ padding: "2rem", background: "var(--color-bg)" }}>
      {/* Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        {/* Round & Demand Toggle */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <h2 style={{ margin: 0 }}>Round {round}</h2>
          <div
            style={{
              marginTop: "0.5rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ marginRight: "0.5rem" }}>Demand</span>
            <div
              style={{ position: "relative", width: "40px", height: "20px" }}
            >
              <input
                type="checkbox"
                disabled={round !== 0}
                checked={isRegularDemand}
                onChange={(e) => setIsRegularDemand(e.target.checked)}
                style={{
                  opacity: 0,
                  width: "40px",
                  height: "20px",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 1,
                  cursor: round === 0 ? "pointer" : "not-allowed",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: isRegularDemand ? "#2196F3" : "#FF9800",
                  borderRadius: "20px",
                  transition: "background 0.4s",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "2px",
                  left: isRegularDemand ? "22px" : "2px",
                  width: "16px",
                  height: "16px",
                  background: "#fff",
                  borderRadius: "50%",
                  transition: "left 0.4s",
                }}
              />
            </div>
            <span style={{ marginLeft: "0.5rem" }}>
              {isRegularDemand ? "regular" : "irregular"}
            </span>
          </div>
        </div>
        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <button onClick={rollDice} style={btnStyle}>
            Roll Dice
          </button>
          <button
            onClick={handleMarketsSupplied}
            disabled={round === 0 || stats.some((s) => s.round === round)}
            style={btnStyle}
          >
            Markets supplied
          </button>
          <button
            onClick={handleRegionalTransport}
            disabled={!stats.some((s) => s.round === round) || transportDone}
            style={btnStyle}
          >
            Regional transport
          </button>
          <button
            onClick={handleOrderFromCentral}
            disabled={!transportDone || orderDone}
            style={btnStyle}
          >
            Order from central DC
          </button>
          <button
            onClick={handleTransportToCentralDC}
            disabled={!transportDone || transportToCentralDone}
            style={btnStyle}
          >
            Transport to central DC
          </button>
          <button
            onClick={handleOrderFromFactory}
            disabled={!transportToCentralDone || factoryOrdered}
            style={btnStyle}
          >
            Order from factory WH
          </button>
          <button
            onClick={handleProduce}
            disabled={!factoryOrdered || productionDone || round % 2 === 0}
            style={btnStyle}
          >
            Produce
          </button>
          <button onClick={handleReset} style={btnStyle}>
            Reset Board
          </button>
        </div>
      </div>
      {/* Playing Board */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: gridCols,
          alignItems: "center",
          gap: "2rem",
        }}
      >
        {/* Head pipeline + inputs */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Factory + delayed production input */}
          <div style={{ position: "relative" }}>
            {transportToCentralDone &&
              factoryOrdered &&
              round % 2 === 1 &&
              !productionDone && (
                <input
                  type="number"
                  min={0}
                  value={productionAmt}
                  onChange={(e) =>
                    setProductionAmt(parseInt(e.target.value, 10) || 0)
                  }
                  style={prodInputStyle}
                />
              )}
            <IsometricTile
              count={counts.factory}
              blackCount={Math.floor(counts.factory / 5)}
              whiteCount={counts.factory % 5}
              data-label="Factory"
            >
              <img src={factory} alt="Factory" style={imgStyle} />
            </IsometricTile>
          </div>

          {/* Factory WH */}
          <IsometricTile
            count={counts.factoryWH}
            blackCount={Math.floor(counts.factoryWH / 5)}
            whiteCount={counts.factoryWH % 5}
            data-label="Factory WH"
          >
            <img src={factoryWH} alt="Factory WH" style={imgStyle} />
          </IsometricTile>

          {/* Order-from-FWH input */}
          {transportToCentralDone && !factoryOrdered && (
            <input
              type="number"
              min={0}
              value={factoryOrder}
              onChange={(e) =>
                setFactoryOrder(parseInt(e.target.value, 10) || 0)
              }
              style={orderInputStyle}
            />
          )}

          {/* Rest of pipeline */}
          {pipeline.slice(2).map(({ key, icon, label }) => {
            const total = counts[key];
            const black = key === "central" ? 0 : Math.floor(total / 5);
            const white = key === "central" ? total : 0;
            return (
              <IsometricTile
                key={key}
                count={total}
                blackCount={black}
                whiteCount={white}
                data-label={label}
              >
                <img src={icon} alt={label} style={imgStyle} />
              </IsometricTile>
            );
          })}
        </div>

        {/* Order-from-central inputs */}
        {!orderDone && transportDone && (
          <div style={orderGridStyle}>
            {regions.map(({ id }) => (
              <input
                key={id}
                type="number"
                min={0}
                value={orders[id]}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10) || 0;
                  setOrders((o) => ({ ...o, [id]: v }));
                }}
                style={orderInputStyle}
              />
            ))}
          </div>
        )}

        {/* Regions → Market → Dice */}
        <div style={regionsGridStyle}>
          {regions.map(({ id, truckIcon, dcIcon, marketIcon }) => {
            const t = counts[`truck${id}`] || 0;
            const d = counts[`dc${id}`] || 0;
            const m = demands[`market${id}`] || 0;
            const v = diceState[`market${id}`] || 0;
            const cols = ["red", "green", "yellow", "blue"];
            const col = cols[id - 1];
            return (
              <React.Fragment key={id}>
                <IsometricTile
                  count={t}
                  blackCount={0}
                  whiteCount={t}
                  data-label={`Truck ${id}`}
                >
                  <img src={truckIcon} alt="" style={imgStyle} />
                </IsometricTile>
                <IsometricTile
                  count={d}
                  blackCount={0}
                  whiteCount={d}
                  data-label={`DC ${id}`}
                  dragRegionId={id}
                >
                  <img src={dcIcon} alt="" style={imgStyle} />
                </IsometricTile>
                <IsometricTile
                  demand={m}
                  demandColor={col}
                  data-label={`Market ${id}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) =>
                    handleSupply(
                      parseInt(e.dataTransfer.getData("text/plain"), 10),
                      id
                    )
                  }
                >
                  <img src={marketIcon} alt="" style={imgStyle} />
                </IsometricTile>
                <IsometricTile showCounter={false} data-label="Dice">
                  <DiceFace value={v} color={col} />
                </IsometricTile>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Stats Table */}
      {stats.length > 0 && (
        <table style={statsTableStyle}>
          <thead>
            <tr>
              <th style={th}>Round</th>
              <th style={th}>Demand</th>
              <th style={th}>Supplied</th>
              <th style={th}>Missed</th>
              <th style={th}>Orders Placed</th>
              <th style={th}>Produced</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((r) => (
              <tr key={r.round}>
                <td style={td}>{r.round}</td>
                <td style={td}>{r.totalDemand}</td>
                <td style={td}>{r.totalSupplied}</td>
                <td style={td}>{r.missed}</td>
                <td style={td}>{r.ordersPlaced ?? "–"}</td>
                <td style={td}>{r.produced ?? "–"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Footer with copyright and logo */}
      <div
        style={{
          position: "absolute",
          bottom: "1rem",
          right: "1rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{ width: "234px", height: "46x", marginRight: "0.5rem" }}
        />
        <span style={{ color: "#666", fontSize: "0.75rem" }}>
          © {new Date().getFullYear()} Involvation
        </span>
      </div>
    </div>
  );
}

// Shared styles
const btnStyle = {
  padding: "0.5rem 1rem",
  background: "var(--color-primary)",
  color: "#fff",
  border: "none",
  borderRadius: "0.25rem",
  cursor: "pointer",
};
const imgStyle = { width: "90%", height: "90%", objectFit: "contain" };
const prodInputStyle = {
  position: "absolute",
  top: -60, // raised above the tile
  left: "50%",
  transform: "translateX(-50%)",
  width: "3.2rem", // 20% smaller
  height: "3.2rem",
  fontSize: "1.6rem",
  padding: "0.2rem",
  borderRadius: "0.2rem",
  border: "1px solid var(--color-border)",
  textAlign: "center",
  zIndex: 10, // ensure it's on top
};
const orderInputStyle = {
  width: "3.2rem", // 20% smaller
  height: "3.2rem",
  fontSize: "1.6rem",
  padding: "0.2rem",
  borderRadius: "0.2rem",
  border: "1px solid var(--color-border)",
  textAlign: "center",
};
const orderGridStyle = {
  display: "grid",
  gridTemplateRows: "repeat(4,auto)",
  rowGap: "2rem",
  justifyItems: "center",
};
const regionsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4,auto)",
  gridTemplateRows: "repeat(4,auto)",
  gap: "1rem",
  rowGap: "2rem",
};
const statsTableStyle = {
  marginTop: "2rem",
  borderCollapse: "collapse",
  width: "100%",
};
const th = {
  border: "1px solid #ccc",
  padding: "0.5rem",
  background: "#f5f5f5",
};
const td = { border: "1px solid #ccc", padding: "0.5rem", textAlign: "center" };
