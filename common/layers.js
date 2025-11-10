// /common/layers.js
// ベースレイヤ（地理院 / 衛星 / 古地図 / Google 予備）を追加し、表示切替APIを返す。
// main.js 側からは named import:  import { loadLayers } from "./common/layers.js";
export async function loadLayers(viewer, options = {}) {
    const { gsi = true, satellite = true, oldmap = true } = options;

    const layers = viewer.imageryLayers;
    let lyr_gsi, lyr_sat, lyr_old;

    if (gsi) {
        lyr_gsi = layers.addImageryProvider(
            new Cesium.UrlTemplateImageryProvider({
                url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
                credit: new Cesium.Credit(
                    '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>'
                ),
                minimumLevel: 2, maximumLevel: 18
            })
        );
    }

    if (satellite) {
        // 必要に応じて自分の assetId に
        lyr_sat = layers.addImageryProvider(
            await Cesium.IonImageryProvider.fromAssetId(3830183) // Google 2D Satellite + labels の例
        );
        lyr_sat.show = false;
    }

    if (oldmap) {
        lyr_old = layers.addImageryProvider(
            new Cesium.UrlTemplateImageryProvider({
                url: "https://mapwarper.h-gis.jp/maps/tile/845/{z}/{x}/{y}.png",
                credit: new Cesium.Credit("古地図タイル"),
                minimumLevel: 2, maximumLevel: 18
            })
        );
        lyr_old.show = false;
    }

    function activate(name) {
        if (lyr_gsi) lyr_gsi.show = (name === "gsi");
        if (lyr_sat) lyr_sat.show = (name === "sat");
        if (lyr_old) lyr_old.show = (name === "old");
    }

    // 既定は地理院
    activate("gsi");
    return { gsi: lyr_gsi, sat: lyr_sat, old: lyr_old, activate };
}
