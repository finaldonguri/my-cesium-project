// /common/layers.js
// 3種のベースレイヤ（地理院 / 衛星 / 古地図）を読み込み、最初は地理院を表示
export async function loadLayers(viewer, opts = {}) {
    const { gsi = true, satellite = true, oldmap = true } = opts;

    const layers = viewer.imageryLayers;
    const added = {};

    if (gsi) {
        const gsiLayer = new Cesium.UrlTemplateImageryProvider({
            url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
            credit: new Cesium.Credit(
                '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>'
            ),
            minimumLevel: 2,
            maximumLevel: 18,
        });
        added.gsi = layers.addImageryProvider(gsiLayer);
    }

    if (satellite) {
        // 例: Cesium ion の Google 2D Satellite with Labels（あなたの資産に合わせて変更）
        const satProvider = await Cesium.IonImageryProvider.fromAssetId(3830186);
        added.satellite = layers.addImageryProvider(satProvider);
    }

    if (oldmap) {
        const oldProvider = new Cesium.UrlTemplateImageryProvider({
            url: "https://mapwarper.h-gis.jp/maps/tile/845/{z}/{x}/{y}.png",
            credit: new Cesium.Credit("Old map tiles"),
            minimumLevel: 2,
            maximumLevel: 18,
        });
        added.oldmap = layers.addImageryProvider(oldProvider);
    }

    // 最初に表示するレイヤ（地理院）以外は非表示
    let firstShown = true;
    for (const l of Object.values(added)) {
        l.show = firstShown;
        firstShown = false;
    }

    // 切替用のAPIを返す
    function activate(name) {
        if (added.gsi) added.gsi.show = (name === "gsi");
        if (added.satellite) added.satellite.show = (name === "satellite");
        if (added.oldmap) added.oldmap.show = (name === "oldmap");
    }

    return { ...added, activate };
}
