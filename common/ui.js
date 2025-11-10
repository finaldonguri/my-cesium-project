// /common/ui.js
export function wireUI({ layersHandle, lineAEntity }) {
    const btnGsi = document.getElementById("btn-gsi");
    const btnSat = document.getElementById("btn-satellite");
    const btnOld = document.getElementById("btn-old");
    const btnLineA = document.getElementById("btn-lineA");

    function setActive(el) {
        [btnGsi, btnSat, btnOld].forEach(b => b?.classList.remove("active"));
        el?.classList.add("active");
    }

    btnGsi?.addEventListener("click", () => { layersHandle.activate("gsi"); setActive(btnGsi); });
    btnSat?.addEventListener("click", () => { layersHandle.activate("sat"); setActive(btnSat); });
    btnOld?.addEventListener("click", () => { layersHandle.activate("old"); setActive(btnOld); });

    btnLineA?.addEventListener("click", () => {
        if (!lineAEntity) return;
        lineAEntity.show = !lineAEntity.show;
        btnLineA.classList.toggle("active", lineAEntity.show);
    });
}
