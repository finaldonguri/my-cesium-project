// /common/markers.js
// ・地形サンプルは失敗しても高さ0で続行（初回ブラウザ対策）
// ・disableDepthTestDistance でラベルを埋もれさせない
// ・戻り値は必ず Entity[]（await必須）

export async function createMarkers(viewer, points = [], opt = {}) {
    const {
        leaderLine = true,
        show = true,
        labelFontPx = 14,
    } = opt;

    if (!viewer || !viewer.entities) return [];

    // 1) 地形サンプル（失敗しても続行）
    const cartos = points.map(p => Cesium.Cartographic.fromDegrees(p.lon, p.lat));
    try {
        if (cartos.length > 0) {
            // terrainProvider が未readyでも API は投げられるが、失敗することがある
            await Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, cartos);
        }
    } catch (e) {
        // 初回ロードで terrain が差し替わる前に叩くと失敗しがち
        console.warn("sampleTerrainMostDetailed failed; fallback to height=0", e);
    }

    const out = [];

    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const c = cartos[i];
        const terrainHeight = (c && Number.isFinite(c.height)) ? c.height : 0;
        const lift = p.lift ?? 0;
        const totalHeight = terrainHeight + lift;

        const ent = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(p.lon, p.lat, totalHeight),
            point: {
                pixelSize: p.pixelSize ?? 10,
                color: p.pointColor ?? Cesium.Color.RED,
                outlineColor: p.pointOutlineColor ?? Cesium.Color.BLACK,
                outlineWidth: p.pointOutlineWidth ?? 1,
            },
            label: {
                text: p.text ?? p.name ?? "",
                pixelOffset: new Cesium.Cartesian2(0, -18),
                font: `bold ${labelFontPx}px sans-serif`,
                fillColor: p.labelColor ?? Cesium.Color.WHITE,
                outlineColor: p.labelOutlineColor ?? Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                scaleByDistance: new Cesium.NearFarScalar(200, 1.0, 2000000, 0.6),
            },
            show,
        });

        if (leaderLine) {
            const linePositions = Cesium.Cartesian3.fromDegreesArrayHeights([
                p.lon, p.lat, terrainHeight,   // 地面（または0）
                p.lon, p.lat, totalHeight      // 持ち上げ後の点
            ]);
            ent.polyline = new Cesium.PolylineGraphics({
                positions: linePositions,
                width: p.leaderWidth ?? 2,
                material: (p.leaderColor ?? Cesium.Color.WHITE.withAlpha(0.8)),
                clampToGround: false,
            });
        }

        out.push(ent);
    }

    return out;
}
