// /common/tracks.js

// ==========================
// 線A（地表追従の赤い点線）
// ==========================
export function createLineA(viewer, coords, opt = {}) {
    // coordsは [lon, lat, lon, lat, ...] の形式
    // fromDegreesArray を使用（高さなし）
    const entity = viewer.entities.add({
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(coords),
            width: 3,
            material: new Cesium.PolylineDashMaterialProperty({
                color: Cesium.Color.RED
            }),
            clampToGround: true
        },
        show: opt.show !== false
    });
    return entity;
}

// ==========================
// 線B（空中の黄色透明矢印）
// ==========================
export function createLineB(viewer, coords, opt = {}) {
    // coordsは [lon, lat, height, lon, lat, height, ...] の形式
    const entity = viewer.entities.add({
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(coords),
            width: 6,
            material: Cesium.Color.YELLOW.withAlpha(0.7),
            clampToGround: !!opt.clampToGround
        },
        show: opt.show !== false
    });
    return entity;
}
