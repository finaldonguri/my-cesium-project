// /maps/map_kurihan.js
import { createLineA, createLineB } from "../common/tracks.js";
import { createMarkers } from "../common/markers.js";

// ---- ヘルパ：terrain/imagery の ready を極力待つ（失敗は無視して続行）
async function ensureSceneReady(viewer) {
    try {
        if (viewer?.terrainProvider?.readyPromise) {
            await viewer.terrainProvider.readyPromise;
        }
    } catch (e) {
        console.warn("terrain readyPromise failed (continue):", e);
    }
    try {
        const layers = viewer?.imageryLayers;
        if (layers && layers.length > 0) {
            const waits = [];
            for (let i = 0; i < layers.length; i++) {
                const p = layers.get(i).imageryProvider;
                if (p && p.readyPromise) waits.push(p.readyPromise);
            }
            if (waits.length) await Promise.allSettled(waits);
        }
    } catch (e) {
        console.warn("imagery readyPromise failed (continue):", e);
    }
}

// ---- ヘルパ：度の配列 [lon,lat,lon,lat,...] から Rectangle を得る
function rectangleFromLonLatArray(arr, padDeg = 0.01) {
    let west = 180, east = -180, south = 90, north = -90;
    for (let i = 0; i < arr.length; i += 2) {
        const lon = arr[i], lat = arr[i + 1];
        if (lon < west) west = lon;
        if (lon > east) east = lon;
        if (lat < south) south = lat;
        if (lat > north) north = lat;
    }
    return Cesium.Rectangle.fromDegrees(west - padDeg, south - padDeg, east + padDeg, north + padDeg);
}

export default async function buildKurihan(viewer) {
    // ------ kurihan 線A(lon,lat の並び) ------
    const coordsA = [ /* (省略せず原文どおり貼付） */
        135.97661048267534, 35.36482341576319,
        135.97679996825266, 35.36382759910151,
        135.97890536355646, 35.36310648281633,
        135.97913695703988, 35.362144984416524,
        135.98130551420277, 35.36180158935581,
        135.9829898304458, 35.36059969514149,
        135.98608476154237, 35.35939778303565,
        135.98962182565276, 35.358813990700185,
        135.99124298003665, 35.35816151191858,
        135.98890599124945, 35.35292432018871,
        135.9893691782163, 35.352769774945934,
        135.98823226475224, 35.35010811602774,
        135.99317994371614, 35.347669616032995,
        135.99682227759166, 35.34643316537488,
        135.9976223278071, 35.34667358781837,
        135.99804340686785, 35.34665641481042,
        135.99854870174076, 35.34730898654601,
        136.00238052119363, 35.34698270133717,
        136.00865459919893, 35.34562602765274,
        136.00966518894475, 35.34480170846408,
        136.01120212751647, 35.34475018823551,
        136.01259168841698, 35.345763413366434,
        136.01587610509094, 35.345368428809813,
        136.02069746033658, 35.34425215766549,
        136.02012900360455, 35.34311869733738,
        136.02073956824268, 35.3452825623463,
        136.02153961845812, 35.345969491498906,
        136.02217123704924, 35.34741202370657,
        136.02358185190278, 35.34758375201545,
        136.0242134704939, 35.34863128679389,
        136.02572935511262, 35.34919798027394,
        136.026508351375, 35.3494040496446,
        136.02690837648274, 35.35167077802412,
        136.02747683321474, 35.352271793818595,
        136.02949801270637, 35.3589856947664,
        136.0300033075793, 35.35919173916392,
        136.03023490106267, 35.360273463624686,
        136.03002436153236, 35.36035931415163,
        136.0325087279908, 35.36726139780711,
        136.03341404797146, 35.36980231481287,
        136.0323824042726, 35.37163927931583,
        136.0323402963665, 35.37694392340082,
        136.0332666703002, 35.38020550553897,
        136.03280348333337, 35.38223105334142,
        136.03351931773665, 35.38648797110119,
        136.0351194181675, 35.386590958263845,
        136.0337930191261, 35.38909693869335,
        136.0337930191261, 35.392272213020235,
        136.03425620609298, 35.39498396995367,
        136.03514047212056, 35.39743820299364,
        136.03629843953766, 35.39989236133399,
        136.0366563567393, 35.40056166428032,
        136.0360457921012, 35.40171147944664,
        136.0373721911426, 35.401883092244105,
        136.03796170182764, 35.40262102311042,
        136.03838278088838, 35.4031015326014,
        136.03916177715078, 35.40454304388949,
        136.0398986655071, 35.40565848136188,
        136.04328835194625, 35.40833546831901,
        136.0443199956451, 35.409450853310375,
        136.0457937723577, 35.408060909645996
    ];

    // ------ kurihan 線B(lon,lat,height の並び) ------
    const coordsB = [ /* 原文どおり（省略） */
        135.979684359818748, 35.36225658749678, 800,
        /* ...中略... */
        136.044362103551066, 35.406748163064364, 800
    ];

    // 1) まず線を作る（表示ONのまま）
    const lineA = createLineA(viewer, coordsA, { show: true, dashed: true });
    const lineB = createLineB(viewer, coordsB, { show: true, clampToGround: false, arrow: true });

    // 2) シーン準備を極力待つ（terrain/imagery）
    await ensureSceneReady(viewer);

    // 3) ポイントは await で確実に作ってから返す
    const points = [
        { lon: 135.979569, lat: 35.363215, lift: 150, text: "上古賀" },
        { lon: 135.992452, lat: 35.358096, lift: 150, text: "下古賀" },
        { lon: 135.999059, lat: 35.346819, lift: 150, text: "南古賀" },
        { lon: 136.036103, lat: 35.401112, lift: 150, text: "今津" },
        { lon: 136.002362, lat: 35.387109, lift: 150, text: "饗庭野演習場" },
        { lon: 136.031997, lat: 35.372335, lift: 150, text: "饗庭" },
        { lon: 136.029968, lat: 35.359905, lift: 150, text: "熊野本" },
        { lon: 136.013546, lat: 35.358712, lift: 150, text: "大寶寺山" },
        { lon: 136.021757, lat: 35.346550, lift: 150, text: "安曇川" },
        { lon: 136.066304, lat: 35.353863, lift: 150, text: "外ヶ浜" },
        { lon: 136.027090, lat: 35.351784, lift: 150, text: "安井川" },
        { lon: 136.020389, lat: 35.343009, lift: 150, text: "十八川" },
        { lon: 136.008685, lat: 35.344818, lift: 150, text: "庄堺" },
        { lon: 136.033106, lat: 35.386475, lift: 150, text: "木津" },
        { lon: 136.043913, lat: 35.409439, lift: 150, text: "浜分" }
    ];
    const markers = await createMarkers(viewer, points, { leaderLine: true, show: true, labelFontPx: 14 });

    // 4) エンティティ準備に依存せず「座標矩形」で確実に飛ぶ
    //    （初回ロードで zoomTo([...]) がスキップされる問題を回避）
    const rectA = rectangleFromLonLatArray(coordsA);
    const rectB = rectangleFromLonLatArray(coordsB.filter((_, i) => i % 3 !== 2)); // lon,latだけ抽出
    const union = Cesium.Rectangle.union(rectA, rectB);

    // レンダリング1フレーム待ってから飛ぶとより安定
    await new Promise(r => requestAnimationFrame(() => r()));
    await viewer.camera.flyTo({ destination: Cesium.Rectangle.expand(union, 0.02) });

    return { lineA, lineB, markers };
}
