// /common/tracks.js

// ==========================
// 線A（地表追従の赤い点線）
// ==========================
export function createLineA(viewer, coords, opt = {}) {
    const entity = viewer.entities.add({
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(coords.flat()),
            width: 3,
            material: new Cesium.PolylineDashMaterialProperty({
                color: Cesium.Color.RED
            }),
            clampToGround: true
        },
        show: opt.show !== false
    });
    return entity; // ← 返す
}



// ==========================
// 線B（空中の黄色透明矢印）
// ==========================

export function createLineB(viewer, coords, opt = {}) {
    const entity = viewer.entities.add({
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(coords.flat()),
            width: 6,
            material: Cesium.Color.YELLOW.withAlpha(0.7),
            clampToGround: !!opt.clampToGround
        },
        show: opt.show !== false
    });
    return entity; // ← 返す
}
