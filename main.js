// ================= Ion トークン ==================
Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOGRiZmY3Yy0wNzRjLTQ2MjktOGQ0Ni0xYmI5MzFmNDUxZDAiLCJpZCI6MzU0MDY0LCJpYXQiOjE3NjE0NTQ3MDh9.p9q4yTuNNbVz7U09nx04n-LQG0sxXh8TDw22H3FSIV0";

// ================= 共通モジュール =================
import { initViewer } from "./common/baseViewer.js";
import { loadLayers } from "./common/layers.js";
import { setupUI } from "./common/ui.js";

// ================= map_* の自動読み込み ================
const params = new URLSearchParams(location.search);
const mapKey = params.get("map") || "kurihan";          // 例 ?map=milkstone
const modulePath = `./maps/map_${mapKey}.js`;

(async function () {
    // ------------------- Viewer 初期化 -------------------
    const viewer = initViewer({});

    // ------------------- ベースレイヤ --------------------
    const layersCtl = await loadLayers(viewer, {
        gsi: true,
        satellite: true,
        oldmap: true,
    });

    // UI があとで使えるように viewer に保存
    viewer.__layersCtl = layersCtl;

    // ------------------- map_* 読み込み -------------------
    const mod = await import(modulePath);

    // map_kurihan.js が返す値を受け取る（線A/B + マーカー）
    // 例: return { lineA, lineB, markers }
    const built = (typeof mod.default === "function")
        ? await mod.default(viewer)
        : {};

    // built.lineA, built.lineB, built.markers を UI に渡す
    const app = {
        viewer,
        layers: layersCtl,
        lineA: built.lineA || null,
        lineB: built.lineB || null,
        markers: built.markers || [],
    };

    // ------------------- UI セットアップ -------------------
    setupUI(viewer, app);

})();
