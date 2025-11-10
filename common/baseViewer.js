// /common/baseViewer.js
export function initViewer(opts = {}) {
    const viewer = new Cesium.Viewer("cesiumContainer", {
        baseLayerPicker: false,
        timeline: false,
        animation: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        terrain: Cesium.Terrain.fromWorldTerrain(), 
    });

    // スマホ向け：ピクセル比を抑えて負荷軽減（必要に応じて）
    viewer.resolutionScale = Math.min(window.devicePixelRatio || 1, 1.5);

    return viewer;
}
