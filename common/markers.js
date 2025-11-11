// /common/markers.js
export function createMarkers(viewer, points = [], opt = {}) {
    const out = [];

    for (const p of points) {
        const lift = p.lift ?? 0;

        // 地形の高さをサンプリング
        const position = Cesium.Cartographic.fromDegrees(p.lon, p.lat);
        const positions = [position];

        // 地形の高さを取得してからエンティティを作成
        Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, positions).then(() => {
            const terrainHeight = position.height || 0;
            const totalHeight = terrainHeight + lift;

            const ent = viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(p.lon, p.lat, totalHeight),
                point: {
                    pixelSize: 10,
                    color: Cesium.Color.RED
                },
                label: {
                    text: p.text ?? p.name ?? "",
                    pixelOffset: new Cesium.Cartesian2(0, -18),
                    font: 'bold 14px sans-serif',
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE
                },
                polyline: opt.leaderLine ? {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                        p.lon, p.lat, totalHeight,
                        p.lon, p.lat, terrainHeight
                    ]),
                    width: 2,
                    material: Cesium.Color.BLUE.withAlpha(0.8)
                } : undefined,
                show: opt.show !== false
            });
            out.push(ent);
        });
    }

    return out;
}