class i extends HTMLElement{constructor(){super(),window.addEventListener("DOMContentLoaded",()=>{const r=this.querySelectorAll('[role="tab"]'),s=this.querySelector('[role="tablist"]');r.forEach(t=>{t.addEventListener("click",o)});let e=0;s.addEventListener("keydown",t=>{(t.key==="ArrowRight"||t.key==="ArrowLeft")&&(r[e].setAttribute("tabindex",-1),t.key==="ArrowRight"?(e++,e>=r.length&&(e=0)):t.key==="ArrowLeft"&&(e--,e<0&&(e=r.length-1)),r[e].setAttribute("tabindex",0),r[e].focus())})});function o(r){const s=r.target,e=s.parentNode,t=e.parentNode;e.querySelectorAll('[aria-selected="true"]').forEach(a=>a.setAttribute("aria-selected",!1)),s.setAttribute("aria-selected",!0),t.querySelectorAll('[role="tabpanel"]').forEach(a=>{a.classList.remove("is-active"),a.setAttribute("tabindex",-1)}),t.parentNode.querySelector(`#${s.getAttribute("aria-controls")}`).classList.add("is-active"),t.parentNode.querySelector(`#${s.getAttribute("aria-controls")}`).setAttribute("tabindex",0)}}}window.customElements.define("reserve-products-carousel",i);
