// /maps/map_kurihan.js
import { initViewer } from "../common/baseViewer.js";
import { setupBaseLayers } from "../common/layers.js";
import { createLineA, createLineB } from "../common/tracks.js";
import { createMarkers } from "../common/markers.js";
import { wireUI } from "../common/ui.js";

// ★あなたのトークンに置換
const CESIUM_ION_TOKEN = "PUT_YOUR_TOKEN_HERE";

// kurihan 向け設定（必要に応じて資産IDや古地図URLを調整）
const CONFIG = {
    satelliteIonAssetId: 3830186, // 例
    oldMapUrl: "https://ktgis.net/kjmapw/kjtilemap/edohaku/00/{z}/{x}/{y}.png" // 例：江戸時代古地図（差し替え可）
};

// ===== kurihan のデータ =====
// 線A（地表追従・点線・ON/OFF可）: lon,lat の並び
const LINE_A = [
    // 例：ダミー座標（本番値に差し替え）
    136.1675, 35.4100,
    136.1732, 35.4120,
    136.1830, 35.4158
];

// 線B（空中矢印・高度あり）: lon,lat,height の並び
const LINE_B = [
    136.1675, 35.4100, 150,
    136.1732, 35.4120, 180,
    136.1830, 35.4158, 200
];

// 引出線付きポイント
const MARKERS = [
    { name: "起点", lon: 136.1675, lat: 35.4100 },
    { name: "見どころA", lon: 136.1732, lat: 35.4120 },
    { name: "終点", lon: 136.1830, lat: 35.4158 }
];

(async function () {
    const viewer = initViewer({ ionToken: CESIUM_ION_TOKEN });
    const layersHandle = setupBaseLayers(viewer, CONFIG);

    // 線Aはトグル対象（初期ON）
    const lineA = createLineA(viewer, LINE_A, { show: true });
    createLineB(viewer, LINE_B, { show: true, width: 8, alpha: 0.6 });
    createMarkers(viewer, MARKERS);

    wireUI({ layersHandle, lineAEntity: lineA });

    // 初期視点
    const dest = Cesium.Cartesian3.fromDegrees(LINE_A[0], LINE_A[1], 1200);
    viewer.camera.flyTo({ destination: dest });
})();
