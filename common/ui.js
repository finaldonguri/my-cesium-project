export function setupUI(viewer, { layers, built }) {
    const toolbar = document.getElementById("toolbar");
    if (!toolbar) return;

    // --- ベースレイヤ切替 ---
    addBtn("地理院", () => layers.activate("gsi"));
    addBtn("衛星", () => layers.activate("sat"));
    addBtn("古地図", () => layers.activate("old"));

    // --- 線/ポイントのON/OFF ---
    if (built.lineA) addToggle("線A", built.lineA);
    if (built.lineB) addToggle("線B", built.lineB);
    if (built.markers) addToggle("ポイント", built.markers);

    function addBtn(label, onClick) {
        const b = document.createElement("button");
        b.textContent = label;
        b.onclick = onClick;
        toolbar.appendChild(b);
    }

    // target が配列でも単体でも動くトグル
    function addToggle(label, target) {
        const b = document.createElement("button");
        let on = true;
        b.textContent = `${label} ON`;
        b.onclick = () => {
            on = !on;
            const set = (e) => { if (e) e.show = on; };
            Array.isArray(target) ? target.forEach(set) : set(target);
            b.textContent = `${label} ${on ? "ON" : "OFF"}`;
        };
        toolbar.appendChild(b);
    }
}
