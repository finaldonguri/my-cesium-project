// /common/tracks.js
// 線A：赤点線、地表追従（toggle可能）
export function createLineA(viewer, positionsDegrees, { show = true } = {}) {
    if (!positionsDegrees?.length) return null;

    const positions = Cesium.Cartesian3.fromDegreesArray(positionsDegrees);
    const entity = viewer.entities.add({
        name: "LineA",
        polyline: {
            positions,
            width: 3,
            material: new Cesium.PolylineDashMaterialProperty({
                color: Cesium.Color.RED,
                dashLength: 16
            }),
            clampToGround: true
        },
        show
    });
    return entity;
}

// 線B：黄色半透明の空中矢印（地形追従しない）
export function createLineB(viewer, positionsDegrees, { show = true, width = 6, alpha = 0.6 } = {}) {
    if (!positionsDegrees?.length) return null;

    const positions = Cesium.Cartesian3.fromDegreesArrayHeights(positionsDegrees);
    const entity = viewer.entities.add({
        name: "LineB",
        polyline: {
            positions,
            width,
            material: new Cesium.PolylineArrowMaterialProperty(
                Cesium.Color.YELLOW.withAlpha(alpha)
            ),
            clampToGround: false
        },
        show
    });
    return entity;
}
