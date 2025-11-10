// /common/markers.js
// [{name, lon, lat, height?}] を受け取り、点＋ラベル＋簡易引出線を作成
export function createMarkers(viewer, items = []) {
    const created = [];
    for (const it of items) {
        const h = it.height ?? 0;
        const pos = Cesium.Cartesian3.fromDegrees(it.lon, it.lat, h);

        // ラベル位置を少し東へオフセットさせて引出線
        const labelPos = Cesium.Cartesian3.fromDegrees(it.lon + 0.0003, it.lat, h); // ~30m

        const point = viewer.entities.add({
            position: pos,
            point: { pixelSize: 8, color: Cesium.Color.SKYBLUE, outlineColor: Cesium.Color.WHITE, outlineWidth: 2 }
        });

        const label = viewer.entities.add({
            position: labelPos,
            label: {
                text: it.name ?? "",
                font: "18px sans-serif",
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 3,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                showBackground: true,
                backgroundColor: Cesium.Color.fromCssColorString("rgba(0,0,0,.55)"),
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                pixelOffset: new Cesium.Cartesian2(0, 0)
            }
        });

        const leader = viewer.entities.add({
            polyline: {
                positions: [pos, labelPos],
                width: 2,
                material: Cesium.Color.WHITE.withAlpha(0.6),
                clampToGround: h === 0 // 地表のときだけ追従
            }
        });

        created.push({ point, label, leader });
    }
    return created;
}
