// /common/markers.js
// 任意個のポイントに「点・引出線・ラベル（少し横にオフセット）」を生成
// 使い方：createMarkers(viewer, { data: [{name, lat, lon, height?, color?, clampToGround?}], ... })

export function createMarkers(viewer, config = {}) {
    const {
        data = [],                 // [{ name, lat, lon, height?, color?, clampToGround? }, ...]
        pointSize = 10,            // 点のサイズ(px)
        pointColor = Cesium.Color.YELLOW,
        leaderWidth = 2,           // 引出線の太さ(px)
        labelFontPxBase = 16,      // ラベルのフォントサイズ(px)
        labelBgColor = Cesium.Color.fromCssColorString("rgba(0,0,0,0.55)"),
        labelTextColor = Cesium.Color.WHITE,
        offsetMeters = { east: 25, north: 25, up: 5 },   // ラベルのオフセット（東・北・上方向, m）
    } = config;

    const entities = [];   // ここに作ったエンティティを全部入れて返す

    // ローカルENUでm単位のオフセットを"世界座標"に変換して加えるユーティリティ
    function offsetPositionFromLlh(lon, lat, h, { east, north, up }) {
        const base = Cesium.Cartesian3.fromDegrees(lon, lat, h || 0);
        const enu = Cesium.Transforms.eastNorthUpToFixedFrame(base);
        const local = new Cesium.Cartesian3(east || 0, north || 0, up || 0);
        // ベクトルとして回転だけを適用
        const worldVec = Cesium.Matrix4.multiplyByPointAsVector(enu, local, new Cesium.Cartesian3());
        // 基点に加算して最終的な座標
        return Cesium.Cartesian3.add(base, worldVec, new Cesium.Cartesian3());
    }

    data.forEach((p) => {
        const { name = "", lat, lon, height = 0, color, clampToGround = false, description } = p;
        if (lat == null || lon == null) return;

        const basePos = Cesium.Cartesian3.fromDegrees(lon, lat, height);
        const labelPos = offsetPositionFromLlh(lon, lat, height, offsetMeters);

        // 1) 点
        const pointEntity = viewer.entities.add({
            position: basePos,
            point: {
                pixelSize: pointSize,
                color: color ? color : pointColor,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 1.5,
                heightReference: clampToGround ? Cesium.HeightReference.CLAMP_TO_GROUND : Cesium.HeightReference.NONE,
            },
            description: description || undefined,
        });

        // 2) ラベル（少し横へオフセット）
        const labelEntity = viewer.entities.add({
            position: labelPos,
            label: {
                text: name,
                font: `${labelFontPxBase}px "Noto Sans JP", "Segoe UI", "Helvetica Neue", Arial, sans-serif`,
                fillColor: labelTextColor,
                style: Cesium.LabelStyle.FILL,
                showBackground: true,
                backgroundColor: labelBgColor,
                pixelOffset: new Cesium.Cartesian2(0, 0),
                translucencyByDistance: new Cesium.NearFarScalar(200.0, 1.0, 2000000.0, 0.2),
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 3000000.0),
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            },
        });

        // 3) 引出線（点 → ラベル）
        const leaderEntity = viewer.entities.add({
            polyline: {
                positions: [basePos, labelPos],
                clampToGround: false, // ラベルが浮いているのでfalse推奨
                width: leaderWidth,
                material: (color ? color : pointColor).withAlpha(0.9),
            },
        });

        entities.push(pointEntity, labelEntity, leaderEntity);
    });

    // まとめて可視/不可視を切り替えるAPIを返す（UI側から呼ぶ）
    function setVisible(show) {
        entities.forEach((e) => (e.show = !!show));
    }
    function remove() {
        entities.forEach((e) => viewer.entities.remove(e));
    }

    return { entities, setVisible, remove };
}
