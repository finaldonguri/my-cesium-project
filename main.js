// ==== Ionトークン ====
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOGRiZmY3Yy0wNzRjLTQ2MjktOGQ0Ni0xYmI5MzFmNDUxZDAiLCJpZCI6MzU0MDY0LCJpYXQiOjE3NjE0NTQ3MDh9.p9q4yTuNNbVz7U09nx04n-LQG0sxXh8TDw22H3FSIV0";

import { initViewer } from "./common/baseViewer.js";
import { loadLayers } from "./common/layers.js";
import { setupUI } from "./common/ui.js";

const params = new URLSearchParams(location.search);
const mapKey = params.get("map") || "kurihan";
const modulePath = `./maps/map_${mapKey}.js`;

(async () => {
    const viewer = initViewer({});

    // ★超重要：まずは最小限のレイヤのみ（GSI等、1枚だけ）
    const layers = await loadLayers(viewer, {
        gsi: true, satellite: false, oldmap: false, google: false
    });

    // ★描画負荷/メモリ削減：即効スイッチ
    const scene = viewer.scene;
    scene.requestRenderMode = true;         // 変更時のみ描画
    viewer.targetFrameRate = 30;
    viewer.resolutionScale = 0.8;           // 0.7〜0.9で調整可（低いほど軽い）
    scene.fxaa = false;
    scene.postProcessStages.fxaa.enabled = false;
    scene.globe.enableLighting = false;
    scene.fog.enabled = false;
    scene.skyAtmosphere.show = false;
    scene.skyBox = undefined;

    // ★LOD下げる：地球タイル読み過ぎ回避（OOM対策の柱）
    scene.globe.maximumScreenSpaceError = 24;  // 16〜32推奨（数字↑ほど軽い）

    // ★念のため：イメージレイヤは1枚だけ有効化（レイヤが多いとOOMになりやすい）
    const il = viewer.imageryLayers;
    for (let i = 1; i < il.length; i++) il.get(i).show = false;

    // 地図モジュール
    const mod = await import(modulePath);
    const built = (typeof mod.default === "function") ? await mod.default(viewer) : {};

    // UI
    setupUI(viewer, { layers, built });
})();
