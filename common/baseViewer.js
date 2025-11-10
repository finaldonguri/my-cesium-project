// /common/baseViewer.js
export function initViewer({ ionToken } = {}) {
    if (ionToken) Cesium.Ion.defaultAccessToken = ionToken;

    const viewer = new Cesium.Viewer("cesiumContainer", {
        baseLayerPicker: false,
        timeline: false,
        animation: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        terrainProvider: Cesium.createWorldTerrain(),
    });

    // スマホ向け：ピクセル比を抑えて負荷軽減（必要に応じて）
    viewer.resolutionScale = Math.min(window.devicePixelRatio || 1, 1.5);

    return viewer;
}
