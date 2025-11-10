// /common/ui.js

// viewer と app = { layers, lineA, lineB, markers } を受け取る
export function setupUI(viewer, app = {}) {
    // --------------------------------------------------------
    // UI を置く専用コンテナ
    // --------------------------------------------------------
    let bar = document.getElementById("cesiumToolbar");
    if (!bar) {
        bar = document.createElement("div");
        bar.id = "cesiumToolbar";
        bar.style.position = "absolute";
        bar.style.top = "10px";
        bar.style.left = "10px";
        bar.style.zIndex = "2000";
        bar.style.background = "rgba(0,0,0,0.45)";
        bar.style.padding = "8px";
        bar.style.borderRadius = "6px";
        bar.style.color = "#fff";
        bar.style.font = "14px sans-serif";
        bar.style.display = "flex";
        bar.style.flexDirection = "column";
        bar.style.gap = "6px";
        document.body.appendChild(bar);
    }

    const makeBtn = (label, onClick) => {
        const btn = document.createElement("button");
        btn.textContent = label;
        btn.style.padding = "5px 10px";
        btn.style.background = "#222";
        btn.style.border = "1px solid #777";
        btn.style.borderRadius = "4px";
        btn.style.color = "#fff";
        btn.style.cursor = "pointer";
        btn.onclick = onClick;
        bar.appendChild(btn);
        return btn;
    };

    // ========================================================
    // ✅ ベースレイヤ切替（地理院 / 衛星 / 古地図）
    // ========================================================
    if (app.layers && typeof app.layers.activate === "function") {
        // 存在するものだけボタンを出す
        if (app.layers.gsi) makeBtn("地理院", () => app.layers.activate("gsi"));
        if (app.layers.sat) makeBtn("衛星", () => app.layers.activate("sat"));
        if (app.layers.old) makeBtn("古地図", () => app.layers.activate("old"));
    }

    // ========================================================
    // ✅ 線A / 線B の ON/OFF
    // ========================================================
    if (app.lineA) {
        makeBtn("線A ON/OFF", () => {
            app.lineA.show = !app.lineA.show;
        });
    }

    if (app.lineB) {
        makeBtn("線B ON/OFF", () => {
            app.lineB.show = !app.lineB.show;
        });
    }

    // ========================================================
    // ✅ ポイント群（点・引出線・ラベル）ON/OFF
    // ========================================================
    if (app.markers && app.markers.entities && app.markers.entities.length > 0) {
        makeBtn("ポイント ON/OFF", () => {
            // markers.setVisible() が markers.js にあるのでそれを呼ぶ
            const first = app.markers.entities[0];
            const nowShow = !first.show;
            app.markers.setVisible(nowShow);
        });
    }
}
