// /common/tracks.js

export function createLineA(viewer, positionsDegrees, options = {}) {
    const entity = viewer.entities.add({
        id: "lineA",
        name: "LineA",
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(positionsDegrees),
            width: 4,
            material: new Cesium.PolylineDashMaterialProperty({
                color: Cesium.Color.RED,
                dashLength: 12
            }),
            clampToGround: true
        },
        show: true
    });
    viewer.__lineA = entity;
    return entity;
}

export function createLineB(viewer, positionsDegHeight, options = {}) {
    const entity = viewer.entities.add({
        id: "lineB",
        name: "LineB",
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(positionsDegHeight),
            width: 6,
            material: new Cesium.PolylineArrowMaterialProperty(
                Cesium.Color.YELLOW.withAlpha(0.7)
            ),
            clampToGround: false
        },
        show: true
    });
    viewer.__lineB = entity;
    return entity;
}
