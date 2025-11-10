// /common/layers.js
// 地理院 / 衛星 / 古地図を読み込んで、どれを表示するか切り替えできるようにする
export async function loadLayers(viewer, opts = {}) {
    const { gsi = true, satellite = true, oldmap = true, google = false } = opts;

    const layers = viewer.imageryLayers;
    const added = {};

    function hideAll() {
        Object.values(added).forEach((l) => l && (l.show = false));
    }

    // 地理院タイル（標準）
    if (gsi) {
        const gsiProvider = new Cesium.UrlTemplateImageryProvider({
            url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
            credit: new Cesium.Credit(
                '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>'
            ),
            minimumLevel: 2,
            maximumLevel: 18,
        });
        added.gsi = layers.addImageryProvider(gsiProvider);
    }

    // 衛星（Cesium ion: Google 2D Satellite with Labels）
    if (satellite) {
        const satProvider = await Cesium.IonImageryProvider.fromAssetId(3830183);
        added.satellite = layers.addImageryProvider(satProvider);
        added.satellite.show = false;
    }

    // 古地図（例）
    if (oldmap) {
        const oldProvider = new Cesium.UrlTemplateImageryProvider({
            url: "https://mapwarper.h-gis.jp/maps/tile/845/{z}/{x}/{y}.png",
            credit: new Cesium.Credit("Old map"),
            minimumLevel: 2,
            maximumLevel: 18,
        });
        added.oldmap = layers.addImageryProvider(oldProvider);
        added.oldmap.show = false;
    }

    // 追加予定の Google Road 等（必要になったら実装）
    if (google) {
        // ここに必要な Provider を追加
    }

    function activate(name) {
        hideAll();
        if (added[name]) added[name].show = true;
    }

    // 既定は地理院
    activate("gsi");

    return { ...added, activate };
}
