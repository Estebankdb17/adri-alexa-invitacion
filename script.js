// ====== Countdown ======

// 27/06/2026 17:45 (Europe/Madrid)
const target = new Date("2026-06-27T17:45:00+02:00");
const $ = (id) => document.getElementById(id);

function tick(){
  const now = new Date();
  let diff = Math.max(0, target - now);

  const days = Math.floor(diff / (1000*60*60*24));
  diff -= days * (1000*60*60*24);
  const hours = Math.floor(diff / (1000*60*60));
  diff -= hours * (1000*60*60);
  const mins = Math.floor(diff / (1000*60));
  diff -= mins * (1000*60);
  const secs = Math.floor(diff / 1000);

  $("cdDays").textContent = String(days);
  $("cdHours").textContent = String(hours).padStart(2,"0");
  $("cdMins").textContent = String(mins).padStart(2,"0");
  $("cdSecs").textContent = String(secs).padStart(2,"0");
}
tick();
setInterval(tick, 1000);

// ====== Modal RSVP ======
const modal = $("rsvpModal");
$("openRsvp").addEventListener("click", () => modal.showModal());
$("closeRsvp").addEventListener("click", () => modal.close());

// Cierra modal al click fuera
modal.addEventListener("click", (e) => {
  const r = modal.getBoundingClientRect();
  const inside = r.top <= e.clientY && e.clientY <= r.bottom && r.left <= e.clientX && e.clientX <= r.right;
  if (!inside) modal.close();
});

// ====== Envío del formulario (elige UNA opción) ======
// Opción 1: Formspree (simple, gratis)
// 1) crea form en formspree.io y te dan un endpoint (URL)
// 2) pega esa URL en FORMSPREE_ENDPOINT

const FORMSPREE_ENDPOINT = ""; // ej: "https://formspree.io/f/xxxxxx"

const form = $("rsvpForm");
const msg = $("formMsg");
const submitBtn = $("submitBtn");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!FORMSPREE_ENDPOINT) {
      msg.textContent = "Falta configurar el endpoint del formulario (Formspree/Netlify).";
      return;
    }

    submitBtn.disabled = true;
    msg.textContent = "Enviando…";

    try {
      const data = new FormData(form);
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { "Accept": "application/json" }
      });

      if (!res.ok) throw new Error("Error en el envío");
      msg.textContent = "¡Confirmación enviada! Gracias 💛";
      form.reset();

      setTimeout(() => {
        modal.close();
        msg.textContent = "";
      }, 1200);

    } catch (err) {
      msg.textContent = "No se pudo enviar. Intenta de nuevo en unos segundos.";
    } finally {
      submitBtn.disabled = false;
    }
  });
}
