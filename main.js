// ==== Ionトークン（必要なら設定）====
Cesium.Ion.defaultAccessToken =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOGRiZmY3Yy0wNzRjLTQ2MjktOGQ0Ni0xYmI5MzFmNDUxZDAiLCJpZCI6MzU0MDY0LCJpYXQiOjE3NjE0NTQ3MDh9.p9q4yTuNNbVz7U09nx04n-LQG0sxXh8TDw22H3FSIV0";

// ==== 共通初期化 ====
import { initViewer } from "./common/baseViewer.js";
import { loadLayers } from "./common/layers.js";
import { setupUI } from "./common/ui.js";

// URL ?map=kurihan などで読み分け（デフォルトは kurihan）
const params = new URLSearchParams(location.search);
const mapKey = params.get("map") || "kurihan";

// maps/ の命名規則: map_<key>.js 例) map_kurihan.js
const modulePath = `./maps/map_${mapKey}.js`;

(async function () {
    // Viewerを作成（地形やUIの共通オプションは baseViewer.js 側で）
    const viewer = initViewer({});

    // ベースレイヤ群をロード → 戻り値を保持
    const layersCtl = await loadLayers(viewer, { gsi: true, satellite: true, oldmap: true });
    viewer.__layersCtl = layersCtl;               // ui.js からも参照できるよう保険で載せる


    // 表示したい地図モジュールを動的 import
    const mod = await import(modulePath);
    if (typeof mod.default === "function") await mod.default(viewer);


    // 共通UI（レイヤ切替や線A/B ON/OFFボタンなど）
    setupUI(viewer);
})();
