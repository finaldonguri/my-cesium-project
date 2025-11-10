export function createMarkers(viewer, points = [], opt = {}) {
    const out = [];
    for (const p of points) {
        const ent = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(p.lon, p.lat, p.height ?? 0),
            point: { pixelSize: 10, color: Cesium.Color.ORANGE },
            label: { text: p.name ?? "", pixelOffset: new Cesium.Cartesian2(0, -18) },
            polyline: opt.leaderLine ? {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([p.lon, p.lat, (p.height ?? 0), p.lon, p.lat, 0]),
                width: 1,
                material: Cesium.Color.WHITE.withAlpha(0.6),
                clampToGround: true
            } : undefined,
            show: opt.show !== false
        });
        out.push(ent);
    }
    return out; // ← 配列で返す
}
