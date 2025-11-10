// /template/map_template.js
import { initViewer } from "../common/baseViewer.js";
import { setupBaseLayers } from "../common/layers.js";
import { createLineA, createLineB } from "../common/tracks.js";
import { createMarkers } from "../common/markers.js";
import { wireUI } from "../common/ui.js";

const CESIUM_ION_TOKEN = "PUT_YOUR_TOKEN_HERE";

const CONFIG = {
    satelliteIonAssetId: 3830186,       // 例：Google 2D Satellite with labels（あなたの環境に合わせて）
    oldMapUrl: "https://{s}.tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=YOUR_KEY", // 置き換え推奨
};

const DATA = {
    lineA: [ /* lon,lat, lon,lat, ... （地表追従）*/],
    // lineB は高度あり：[lon,lat,height, lon,lat,height, ...]
    lineB: [ /* ... */],
    markers: [
        // { name: "地点1", lon: 135.0, lat: 35.0, height: 0 },
    ]
};

(async function () {
    const viewer = initViewer({ ionToken: CESIUM_ION_TOKEN });
    const layersHandle = setupBaseLayers(viewer, CONFIG);

    const lineA = createLineA(viewer, DATA.lineA, { show: true });
    createLineB(viewer, DATA.lineB, { show: true, width: 6, alpha: 0.6 });
    createMarkers(viewer, DATA.markers);

    wireUI({ layersHandle, lineAEntity: lineA });

    // 初期視点（lineA or markers の先頭にズーム）
    const first = DATA.lineA?.length >= 2
        ? Cesium.Cartesian3.fromDegrees(DATA.lineA[0], DATA.lineA[1], 1200)
        : (DATA.markers?.length ? Cesium.Cartesian3.fromDegrees(DATA.markers[0].lon, DATA.markers[0].lat, 1200) : null);
    if (first) viewer.camera.flyTo({ destination: first });
})();
