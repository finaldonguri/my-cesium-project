// /common/markers.js
// 地形サンプリング→エンティティ生成を「await」で直列化し、Entity[] を Promise で返す。
// ラベルは disableDepthTestDistance = Infinity で地形の裏でも見える。
// 引出線は「地面→点」の2点折れ線（clampToGround: false）。

export async function createMarkers(viewer, points = [], opt = {}) {
    const {
        leaderLine = true,
        show = true,
        labelFontPx = 14, // 既定を従来の 14px に合わせつつ、後で調整可
    } = opt;

    if (!viewer || !viewer.entities) return [];

    // まとめて地形サンプル
    const cartos = points.map(p => Cesium.Cartographic.fromDegrees(p.lon, p.lat));
    if (cartos.length > 0) {
        await Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, cartos);
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
                outlineWidth: p.pointOutlineWidth ?? 1
            },
            label: {
                text: p.text ?? p.name ?? "",
                pixelOffset: new Cesium.Cartesian2(0, -18),
                font: `bold ${labelFontPx}px sans-serif`,
                fillColor: p.labelColor ?? Cesium.Color.WHITE,
                outlineColor: p.labelOutlineColor ?? Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                // これが無いと地形/3Dタイル裏で消える
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                // 遠距離で少し小さく
                scaleByDistance: new Cesium.NearFarScalar(200, 1.0, 2000000, 0.6)
            },
            show
        });

        if (leaderLine) {
            const linePositions = Cesium.Cartesian3.fromDegreesArrayHeights([
                p.lon, p.lat, terrainHeight,   // 地面
                p.lon, p.lat, totalHeight      // 点
            ]);
            ent.polyline = new Cesium.PolylineGraphics({
                positions: linePositions,
                width: p.leaderWidth ?? 2,
                material: (p.leaderColor ?? Cesium.Color.WHITE.withAlpha(0.8)),
                clampToGround: false           // 高さを持つので必須
            });
        }

        out.push(ent);
    }

    return out; // ← ちゃんと Entity[] を返す（非同期完了後）
}
