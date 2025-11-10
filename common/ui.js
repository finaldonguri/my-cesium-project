// /common/ui.js
export function setupUI(viewer, ctx = {}) {
    const layersCtl = ctx.layersCtl || viewer.__layersCtl;

    // ツールバー準備
    let bar = document.getElementById("toolbar");
    if (!bar) {
        bar = document.createElement("div");
        bar.id = "toolbar";
        bar.style.position = "absolute";
        bar.style.top = "10px";
        bar.style.left = "10px";
        bar.style.zIndex = "2000";
        bar.style.background = "rgba(0,0,0,0.4)";
        bar.style.padding = "6px";
        bar.style.borderRadius = "6px";
        bar.style.color = "#fff";
        document.body.appendChild(bar);
    }

    function addBtn(label, onClick) {
        const b = document.createElement("button");
        b.textContent = label;
        b.style.marginRight = "6px";
        b.style.padding = "4px 10px";
        b.style.background = "#222";
        b.style.border = "1px solid #777";
        b.style.color = "#fff";
        b.onclick = onClick;
        bar.appendChild(b);
        return b;
    }

    // ----------- レイヤ切替ボタン -----------
    if (layersCtl?.activate) {
        addBtn("地理院", () => layersCtl.activate("gsi"));
        addBtn("衛星", () => layersCtl.activate("satellite"));
        addBtn("古地図", () => layersCtl.activate("oldmap"));
    }

    // ----------- 線A/B（ID: lineA / lineB） -----------
    const lineA = viewer.entities.getById("lineA");
    const lineB = viewer.entities.getById("lineB");

    if (lineA) addBtn("線A ON/OFF", () => lineA.show = !lineA.show);
    if (lineB) addBtn("線B ON/OFF", () => lineB.show = !lineB.show);
}
