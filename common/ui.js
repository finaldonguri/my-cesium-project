// common/ui.js
// named export にすること（default ではない）
export function setupUI(viewer, options = {}) {
    // layers.js の戻り値を main.js から渡してもらう想定
    const layersCtl = options.layersCtl || viewer.__layersCtl || null;

    // ツールバー
    let bar = document.getElementById("toolbar");
    if (!bar) {
        bar = document.createElement("div");
        bar.id = "toolbar";
        Object.assign(bar.style, {
            position: "absolute", top: "8px", left: "8px", zIndex: 10,
            display: "flex", gap: "6px", padding: "6px", background: "rgba(0,0,0,0.35)",
            borderRadius: "6px", color: "#fff", font: "14px/1.2 system-ui, sans-serif"
        });
        document.body.appendChild(bar);
    }
    const mkBtn = (label, on) => {
        const b = document.createElement("button");
        b.textContent = label;
        Object.assign(b.style, { padding: "6px 10px", borderRadius: "4px", border: "1px solid #888", background: "#222", color: "#fff", cursor: "pointer" });
        b.addEventListener("click", on);
        bar.appendChild(b);
        return b;
    };

    // ベースレイヤ切替（layers.js が activate(name) を返す想定）
    if (layersCtl && typeof layersCtl.activate === "function") {
        mkBtn("地理院", () => layersCtl.activate("gsi"));
        mkBtn("衛星", () => layersCtl.activate("sat"));
        mkBtn("古地図", () => layersCtl.activate("old"));
    }

    // 線A/BのON/OFF（entity の id を lineA / lineB と決めておく）
    const lineA = viewer.entities.getById?.("lineA");
    const lineB = viewer.entities.getById?.("lineB");
    if (lineA) mkBtn("線A 切替", () => lineA.show = !lineA.show);
    if (lineB) mkBtn("線B 切替", () => lineB.show = !lineB.show);
}
