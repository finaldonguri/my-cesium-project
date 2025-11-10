// /common/layers.js
// 3種のベースレイヤ（地理院/衛星/古地図）を用意。必要なら追加しやすい形に。
export function setupBaseLayers(viewer, { satelliteIonAssetId = null, oldMapUrl = null } = {}) {
    const layers = viewer.imageryLayers;

    // 地理院（標準地図）
    const gsi = layers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
            url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
            credit: "GSI"
        })
    );

    // 衛星（IonのGoogle 2D Satellite with labels等。assetIdは各自の環境に合わせて）
    let sat;
    if (satelliteIonAssetId) {
        sat = layers.addImageryProvider(
            new Cesium.IonImageryProvider({ assetId: satelliteIonAssetId })
        );
        sat.show = false;
    }

    // 古地図（例: 京都大学文学研究科図書館の歴史地図タイル等に差し替え）
    let old;
    if (oldMapUrl) {
        old = layers.addImageryProvider(
            new Cesium.UrlTemplateImageryProvider({
                url: oldMapUrl,
                credit: "Old map"
            })
        );
        old.show = false;
    }

    // 表示の切替API
    function activate(name) {
        if (gsi) gsi.show = (name === "gsi");
        if (sat) sat.show = (name === "sat");
        if (old) old.show = (name === "old");
    }

    // 既定は地理院
    activate("gsi");
    return { gsi, sat, old, activate };
}
