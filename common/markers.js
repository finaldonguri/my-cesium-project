export async function createMarkers(viewer, points = [], opt = {}) {
  const terrain = viewer.terrainProvider;

  // 地形高度をまとめてサンプル
  const positions = points.map(p => ({
    longitude: p.lon,
    latitude: p.lat
  }));

  const sampled = await Cesium.sampleTerrainMostDetailed(terrain, positions);

  const out = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const h = sampled[i].height;        // ← 地形表面の高さ
    const labelHeight = h + (p.labelOffset ?? 150); // ← 少し持ち上げる

    const ent = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(p.lon, p.lat, labelHeight),
      point: {
        pixelSize: 10,
        color: Cesium.Color.RED
      },
      label: {
        text: p.name ?? "",
        pixelOffset: new Cesium.Cartesian2(0, -18)
      },
      polyline: opt.leaderLine ? {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          p.lon, p.lat, labelHeight,   // ← 常に地形の上から出る
          p.lon, p.lat, h              // ← 地表面
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
