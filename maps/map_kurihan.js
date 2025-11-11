import { createLineA, createLineB } from "../common/tracks.js";
import { createMarkers } from "../common/markers.js";

function rectangleFromLonLatArray(arr, padDeg = 0.01) {
    let w = 180, e = -180, s = 90, n = -90;
    for (let i = 0; i < arr.length; i += 2) {
        const lon = arr[i], lat = arr[i + 1];
        if (lon < w) w = lon; if (lon > e) e = lon;
        if (lat < s) s = lat; if (lat > n) n = lat;
    }
    return Cesium.Rectangle.fromDegrees(w - padDeg, s - padDeg, e + padDeg, n + padDeg);
}

// ★XYZ（lon,lat,h）の配列を間引く（step=3なら 1/3点）
function thinXYZ(arr, step = 3) {
    const out = [];
    for (let i = 0; i < arr.length; i += 3 * step) {
        out.push(arr[i], arr[i + 1], arr[i + 2]);
    }
    // 終点が落ちないよう最後の点を保証
    const L = arr.length;
    if (L >= 3) {
        out.push(arr[L - 3], arr[L - 2], arr[L - 1]);
    }
    return out;
}

export default async function buildKurihan(viewer) {
    // === あなたの coordsA / coordsB をそのまま貼付 ===
    const coordsA = [/* 省略せず原文どおり */];
    const coordsB = [/* 省略せず原文どおり（lon,lat,h） */];

    // 0) 超軽量スタート：平面地形＋ベース1枚が main.jsで有効化済み
    const scene = viewer.scene;
    scene.requestRenderMode = true;

    // 1) 線A（軽い）→ その矩形へ即飛ぶ
    const lineA = createLineA(viewer, coordsA, { show: true, dashed: true });
    const rectA = rectangleFromLonLatArray(coordsA);
    await new Promise(r => requestAnimationFrame(() => r()));
    await viewer.camera.flyTo({ destination: Cesium.Rectangle.expand(rectA, 0.02), duration: 0.0 });

    // 2) 線Bは“間引き版”でまず表示（初回のメモリ山を避ける）
    await new Promise(r => requestAnimationFrame(() => r()));
    const coordsB_thin = thinXYZ(coordsB, 4); // ← まず 1/4 に削減（重ければ 6〜8も可）
    let lineB = createLineB(viewer, coordsB_thin, { show: true, clampToGround: false, arrow: true });

    // 3) ポイント/ラベル（markers.js はサンプル無し＝軽量版）
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
    const markers = createMarkers(viewer, points, { leaderLine: true, show: true, labelFontPx: 14, liftDefault: 150 });

    // 4) （任意）描画が安定したら、フル解像度の線Bに“差し替え”
    setTimeout(() => {
        try {
            // いまの軽量線を外して……
            viewer.entities.remove(lineB);
            // 本来の高密度線に置換
            lineB = createLineB(viewer, coordsB, { show: true, clampToGround: false, arrow: true });
            if (scene.requestRender) scene.requestRender();
        } catch (e) {
            console.warn("lineB 差し替え失敗（継続）:", e);
        }
    }, 3000);

    return { lineA, lineB, markers };
}
