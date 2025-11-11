// /common/markers.js
// すぐ出す（地形サンプルなし）→ 1.5秒後に地形が用意できていれば高さだけ更新。
// ・初回でも固まらない（非ブロッキング）
// ・ラベルは disableDepthTestDistance で埋もれない
// ・戻り値: 作成した Entity[]（同期的に返す）＋内部で後から高さ補正

export function createMarkers(viewer, points = [], opt = {}) {
    const {
        leaderLine = true,
        show = true,
        labelFontPx = 14,
        liftDefault = 0,
        adjustDelayMs = 1500,       // 初回描画を優先してから高さ調整
        adjustTimeoutMs = 1200      // サンプル取得の上限時間（固まらないため）
    } = opt;

    if (!viewer || !viewer.entities) return [];

    const ents = [];

    // 1) まずは「地形サンプルなし」で即描画
    for (const p of points) {
        const lift = p.lift ?? liftDefault;
        const groundH = 0;
        const totalH = groundH + lift;

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
            show
        });

        if (leaderLine) {
            ent.polyline = new Cesium.PolylineGraphics({
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                    p.lon, p.lat, 0,        // 地面（仮0）
                    p.lon, p.lat, totalH    // 点
                ]),
                width: p.leaderWidth ?? 2,
                material: (p.leaderColor ?? Cesium.Color.WHITE.withAlpha(0.8)),
                clampToGround: false,
            });
        }
        ents.push(ent);
    }

    // 2) 初回描画後に「ベストエフォート」で高さ補正（非ブロッキング）
    //    - 失敗してもそのまま運用（見た目は lift で持ち上がっているので致命的ではない）
    if (points.length > 0) {
        setTimeout(async () => {
            // 1フレーム待って描画を確実に済ませる
            await new Promise(r => requestAnimationFrame(() => r()));

            // タイムアウト付きで sampleTerrainMostDetailed を実行
            const cartos = points.map(p => Cesium.Cartographic.fromDegrees(p.lon, p.lat));
            const sampler = (async () => {
                try {
                    await Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, cartos);
                    return cartos.map(c => (Number.isFinite(c.height) ? c.height : 0));
                } catch {
                    return null;
                }
            })();

            const heights = await Promise.race([
                sampler,
                new Promise(resolve => setTimeout(() => resolve(null), adjustTimeoutMs))
            ]);

            if (!heights) return; // 取れなければ何もしない（ハング防止）

            // 取得できたら静かに座標を更新
            for (let i = 0; i < points.length; i++) {
                const p = points[i];
                const h = heights[i] ?? 0;
                const lift = p.lift ?? liftDefault;
                const totalH = h + lift;

                const ent = ents[i];
                if (!ent) continue;

                ent.position = Cesium.Cartesian3.fromDegrees(p.lon, p.lat, totalH);

                if (leaderLine && ent.polyline) {
                    ent.polyline.positions = Cesium.Cartesian3.fromDegreesArrayHeights([
                        p.lon, p.lat, h,
                        p.lon, p.lat, totalH
                    ]);
                }
            }

            // 最後に1回だけ再描画要求（requestRenderMode対策）
            if (viewer?.scene?.requestRender) viewer.scene.requestRender();
        }, adjustDelayMs);
    }

    return ents;
}
