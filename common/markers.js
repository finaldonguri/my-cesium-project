// /common/markers.js
export function createMarkers(viewer, points = [], opt = {}) {
    const out = [];
    for (const p of points) {
        const height = p.height ?? 0;
        const lift = p.lift ?? 0;
        const totalHeight = height + lift;

        const ent = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(p.lon, p.lat, totalHeight),
            point: {
                pixelSize: 10,
                color: Cesium.Color.RED
            },
            label: {
                text: p.text ?? p.name ?? "",
                pixelOffset: new Cesium.Cartesian2(0, -18),
                font: '14px sans-serif',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE
            },
            polyline: opt.leaderLine ? {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                    p.lon, p.lat, totalHeight,
                    p.lon, p.lat, height
                ]),
                width: 1,
                material: Cesium.Color.WHITE.withAlpha(0.6)
            } : undefined,
            show: opt.show !== false
        });
        out.push(ent);
    }
    return out;
}
