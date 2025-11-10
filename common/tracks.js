// /common/tracks.js

// ==========================
// 線A（地表追従の赤い点線）
// ==========================
export function createLineA(viewer, positionsDegrees, options = {}) {
    const entity = viewer.entities.add({
        id: "lineA",
        name: "LineA",
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(positionsDegrees),
            width: options.width ?? 4,
            clampToGround: true,
            material: new Cesium.PolylineDashMaterialProperty({
                color: Cesium.Color.RED,
                dashLength: 20
            })
        },
        show: true
    });

    return entity;
}



// ==========================
// 線B（空中の黄色透明矢印）
// ==========================
export function createLineB(viewer, positionsDegHeight, options = {}) {
    const entity = viewer.entities.add({
        id: "lineB",
        name: "LineB",
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(positionsDegHeight),
            width: options.width ?? 6,
            clampToGround: false,
            material: new Cesium.PolylineArrowMaterialProperty(
                Cesium.Color.YELLOW.withAlpha(0.7)
            )
        },
        show: true
    });

    return entity;
}
