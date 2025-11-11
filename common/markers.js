// /common/markers.js
// 地形サンプルを一切使わず、lift（相対高さ）だけで即描画する安全版。
// まず安定させることを最優先。disableDepthTestDistance でラベルは沈まない。

export function createMarkers(viewer, points = [], opt = {}) {
    const {
        leaderLine = true,
        show = true,
        labelFontPx = 14,
        liftDefault = 150,     // lift未指定時の既定（あなたのデータに合わせて）
    } = opt;

    if (!viewer || !viewer.entities) return [];

    const ents = [];

    for (const p of points) {
        const lift = (p.lift ?? liftDefault);
        const baseH = 0;                  // 地形サンプルしない＝0基準
        const totalH = baseH + lift;

        const ent = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(p.lon, p.lat, totalH),
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
            ent.polyline = new Cesium.PolylineGraphics({
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                    p.lon, p.lat, baseH,   // “地面”を0扱い
                    p.lon, p.lat, totalH
                ]),
                width: p.leaderWidth ?? 2,
                material: (p.leaderColor ?? Cesium.Color.WHITE.withAlpha(0.8)),
                clampToGround: false,
            });
        }

        ents.push(ent);
    }

    return ents;
}
