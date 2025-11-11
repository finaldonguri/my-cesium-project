// /maps/map_kurihan.js
import { createLineA, createLineB } from "../common/tracks.js";
import { createMarkers } from "../common/markers.js";

// 軽い矩形算出（同期）
function rectangleFromLonLatArray(arr, padDeg = 0.01) {
    let w = 180, e = -180, s = 90, n = -90;
    for (let i = 0; i < arr.length; i += 2) {
        const lon = arr[i], lat = arr[i + 1];
        if (lon < w) w = lon; if (lon > e) e = lon;
        if (lat < s) s = lat; if (lat > n) n = lat;
    }
    return Cesium.Rectangle.fromDegrees(w - padDeg, s - padDeg, e + padDeg, n + padDeg);
}

export default async function buildKurihan(viewer) {
    // ===== 線A / 線B（原文そのまま） =====
    const coordsA = [/* …あなたのcoordsA…（省略）*/
        135.97661048267534, 35.36482341576319,
        /* 中略 */
        136.0457937723577, 35.408060909645996
    ];
    const coordsB = [/* …あなたのcoordsB…（省略）*/
        135.979684359818748, 35.36225658749678, 800,
        /* 中略 */
        136.044362103551066, 35.406748163064364, 800
    ];

    // 0) レンダリング負荷を下げる（任意）
    const scene = viewer.scene;
    scene.requestRenderMode = true;        // 変更時のみ再描画
    viewer.targetFrameRate = 30;           // 余力確保
    scene.postProcessStages.fxaa.enabled = false; // 初回負荷軽減
    scene.globe.enableLighting = false;

    // 1) 先に線だけ作る（軽い）
    const lineA = createLineA(viewer, coordsA, { show: true, dashed: true });
    const lineB = createLineB(viewer, coordsB, { show: true, clampToGround: false, arrow: true });

    // 2) 即座に矩形へ飛ぶ（エンティティの準備状態に依存しない）
    const rectA = rectangleFromLonLatArray(coordsA);
    // Bは[lon,lat,h]なので、lon/latだけ抽出
    const latsB = [];
    for (let i = 0; i < coordsB.length; i += 3) { latsB.push(coordsB[i], coordsB[i + 1]); }
    const rectB = rectangleFromLonLatArray(latsB);
    const union = Cesium.Rectangle.union(rectA, rectB);

    // 1フレーム待ってから飛ぶとさらに安定
    await new Promise(r => requestAnimationFrame(() => r()));
    await viewer.camera.flyTo({ destination: Cesium.Rectangle.expand(union, 0.02) });

    // 3) もう1フレーム置いて「軽い生成」→ その後“ゆるく”高さ補正（markers.js内で遅延）
    await new Promise(r => requestAnimationFrame(() => r()));

    const points = [
        { lon: 135.979569, lat: 35.363215, lift: 150, text: "上古賀" },
        { lon: 135.992452, lat: 35.358096, lift: 150, text: "下古賀" },
        { lon: 135.999059, lat: 35.346819, lift: 150, text: "南古賀" },
        { lon: 136.036103, lat: 35.401112, lift: 150, text: "今津" },
        { lon: 136.002362, lat: 35.387109, lift: 150, text: "饗庭野演習場" },
        { lon: 136.031997, lat: 35.372335, lift: 150, text: "饗庭" },
        { lon: 136.029968, lat: 35.359905, lift: 150, text: "熊野本" },
        { lon: 136.013546, lat: 35.358712, lift: 150, text: "大寶寺山" },
        { lon: 136.021757, lat: 35.346550, lift: 150, text: "安曇川" },
        { lon: 136.066304, lat: 35.353863, lift: 150, text: "外ヶ浜" },
        { lon: 136.027090, lat: 35.351784, lift: 150, text: "安井川" },
        { lon: 136.020389, lat: 35.343009, lift: 150, text: "十八川" },
        { lon: 136.008685, lat: 35.344818, lift: 150, text: "庄堺" },
        { lon: 136.033106, lat: 35.386475, lift: 150, text: "木津" },
        { lon: 136.043913, lat: 35.409439, lift: 150, text: "浜分" }
    ];

    // 即描画 → markers.js 内でゆっくり高さ補正
    const markers = createMarkers(viewer, points, {
        leaderLine: true,
        show: true,
        labelFontPx: 14,
        adjustDelayMs: 1200,   // 初期表示の後で
        adjustTimeoutMs: 1000  // 取得に時間がかかるなら諦める
    });

    // 4) UI用に返す
    return { lineA, lineB, markers };
}
