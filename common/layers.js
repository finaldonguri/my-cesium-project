// /common/layers.js
// ベースレイヤ（地理院 / 衛星 / 古地図 / Google 予備）を追加し、表示切替APIを返す。
// main.js 側からは named import:  import { loadLayers } from "./common/layers.js";

export async function loadLayers(viewer, opts = {}) {
    const {
        enable = { gsi: true, satellite: true, oldmap: true, google: false },
        ion = { satellite: 3830183 }, // ←あなたの環境の assetId に合わせて変更
        urls = {
            oldmap: "https://mapwarper.h-gis.jp/maps/tile/845/{z}/{x}/{y}.png", // 例: 熊川
            google: null, // 使うならテンプレURLを置く
        },
        initial = "gsi", // 初期表示にするキー（"gsi" | "satellite" | "oldmap" | "google"）
    } = opts;

    const layers = viewer.imageryLayers;
    const list = {}; // { key: ImageryLayer }

    // --- 地理院（標準地図） ---
    if (enable.gsi) {
        const gsiProvider = new Cesium.UrlTemplateImageryProvider({
            url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
            minimumLevel: 2,
            maximumLevel: 18,
            credit: new Cesium.Credit(
                '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>'
            ),
        });
        const gsi = layers.addImageryProvider(gsiProvider);
        gsi.show = false; // 後で initial を反映
        list.gsi = gsi;
    }

    // --- 衛星（Cesium ion の 2D Satellite 等） ---
    if (enable.satellite && ion.satellite) {
        const satProvider = await Cesium.IonImageryProvider.fromAssetId(ion.satellite);
        const sat = layers.addImageryProvider(satProvider);
        sat.show = false;
        list.satellite = sat;
    }

    // --- 古地図（任意のタイルURL） ---
    if (enable.oldmap && urls.oldmap) {
        const oldProvider = new Cesium.UrlTemplateImageryProvider({
            url: urls.oldmap,
            minimumLevel: 2,
            maximumLevel: 18,
            credit: new Cesium.Credit("Old Map Tiles"),
        });
        const old = layers.addImageryProvider(oldProvider);
        old.show = false;
        list.oldmap = old;
    }

    // --- Google 系（将来用のプレースホルダ） ---
    if (enable.google && urls.google) {
        const gProvider = new Cesium.UrlTemplateImageryProvider({
            url: urls.google,
            credit: new Cesium.Credit("Google"),
        });
        const g = layers.addImageryProvider(gProvider);
        g.show = false;
        list.google = g;
    }

    // 表示切替API
    function activate(name) {
        Object.entries(list).forEach(([key, layer]) => {
            layer.show = (key === name);
        });
        return name;
    }

    // 初期表示
    if (list[initial]) {
        activate(initial);
    } else {
        // initial が存在しない場合は先頭を表示
        const firstKey = Object.keys(list)[0];
        if (firstKey) activate(firstKey);
    }

    // UI から参照しやすい形で返す
    return {
        list,          // { gsi?: ImageryLayer, satellite?: ImageryLayer, oldmap?: ImageryLayer, ... }
        keys: Object.keys(list), // ["gsi", "satellite", "oldmap", ...]
        activate,      // (name: string) => string
    };
}
