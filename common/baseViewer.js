// /common/baseViewer.js
export function initViewer({ ionToken } = {}) {
    if (ionToken) Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOGRiZmY3Yy0wNzRjLTQ2MjktOGQ0Ni0xYmI5MzFmNDUxZDAiLCJpZCI6MzU0MDY0LCJpYXQiOjE3NjE0NTQ3MDh9.p9q4yTuNNbVz7U09nx04n-LQG0sxXh8TDw22H3FSIV0";

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
