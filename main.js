// ==== Ionトークン ====
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOGRiZmY3Yy0wNzRjLTQ2MjktOGQ0Ni0xYmI5MzFmNDUxZDAiLCJpZCI6MzU0MDY0LCJpYXQiOjE3NjE0NTQ3MDh9.p9q4yTuNNbVz7U09nx04n-LQG0sxXh8TDw22H3FSIV0";

// ==== 共通 ====
import { initViewer } from "./common/baseViewer.js";
import { loadLayers } from "./common/layers.js";
import { setupUI } from "./common/ui.js";

const params = new URLSearchParams(location.search);
const mapKey = params.get("map") || "kurihan";
const modulePath = `./maps/map_${mapKey}.js`;

(async () => {
    const viewer = initViewer({});

    // ベースレイヤ
    const layers = await loadLayers(viewer, {
        gsi: true, satellite: true, oldmap: true, google: false
    });

    // 地図モジュールを動的 import
    const mod = await import(modulePath);
    const built = (typeof mod.default === "function")
        ? await mod.default(viewer)   // ← ここで線/ポイント等を作る（内部で zoomTo 実施）
        : {};

    // UI（レイヤ切替・線A/B・ポイントのトグル）
    setupUI(viewer, { layers, built });
})();
