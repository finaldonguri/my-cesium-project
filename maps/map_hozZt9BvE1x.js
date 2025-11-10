const MAP_CONFIG = {
    terrain: true,
    layers: {
        gsi: true,
        satellite: true,
        oldmap: false,
        google: false,
    },
    lineA: {
        enabled: true,
        toggle: true,
        data: [], // 緯度経度を入れるだけにする
    },
    lineB: {
        enabled: true,
        toggle: true,
        data: []
    },
    markers: {
        enabled: true,
        data: [
            // {name, lat, lon, height(optional)}
        ],
    }
};
createLineA(viewer, MAP_CONFIG.lineA);
createLineB(viewer, MAP_CONFIG.lineB);
createMarkers(viewer, MAP_CONFIG.markers);