// ==== Ionトークン ====
Cesium.Ion.defaultAccessToken = "＜あなたのトークン＞";

import { initViewer } from "./common/baseViewer.js";
import { loadLayers } from "./common/layers.js";
import { setupUI } from "./common/ui.js";

const params = new URLSearchParams(location.search);
const mapKey = params.get("map") || "kurihan";
const modulePath = `./maps/map_${mapKey}.js`;

(async () => {
    const viewer = initViewer({});

    // ベースレイヤ読み込み（ボタン生成のためハンドルを受け取る）
    const layers = await loadLayers(viewer, {
        gsi: true, satellite: true, oldmap: true, google: false
    });

    // map_xxx.js は “default async function build(viewer){...return {lineA,lineB,points};}”
    const { default: build } = await import(modulePath);
    const built = (typeof build === "function") ? await build(viewer) : {};

    // 受け取りの安全化（未返却でも落ちないように）
    const lineA = built?.lineA ?? null;
    const lineB = built?.lineB ?? null;
    const points = built?.points ?? [];

    // ここで各種ボタンを出す（レイヤ切替／線A・線Bトグル／ポイント表示）
    setupUI(viewer, { layers, lineA, lineB, points });
})();
