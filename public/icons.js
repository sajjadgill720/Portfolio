// Original geometric marks drawn for this portfolio, without icon packs or browser assets.
const paths={
 demo:'<rect x="8" y="12" width="24" height="31" rx="5"/><path d="M14 20h12M14 26h8M14 32h10M32 27h11l7 10h9"/><rect x="58" y="31" width="29" height="39" rx="6"/><path d="m68 42 10 7-10 7zM14 65h23l9-13h12"/><circle cx="14" cy="65" r="6"/><circle cx="46" cy="52" r="3"/><path d="M60 15v10M55 20h10"/>',
 gym:'<path d="M22 38v20M15 42v12M29 44v8M67 38v20M74 42v12M60 44v8M29 48h31"/><path d="M44 17c-17 0-31 14-31 31s14 31 31 31c13 0 24-8 29-19"/><path d="m64 17 7 8-10 3"/><path d="M44 17a31 31 0 0 1 27 8M38 66l5 5 10-10"/>',
 aqi:'<path d="M9 41h43c17 0 18-22 4-22-8 0-11 6-10 11M9 51h60c17 0 18 22 4 22-8 0-11-6-10-11M20 62h22M18 30h10"/><circle cx="74" cy="20" r="8"/><path d="M74 6v-3M74 37v-3M60 20h-3M91 20h-3"/><path d="m16 77 12-7 10 5 14-10"/>',
 automl:'<rect x="23" y="23" width="50" height="50" rx="12"/><path d="M35 8v15M48 8v15M61 8v15M35 73v15M48 73v15M61 73v15M8 35h15M8 48h15M8 61h15M73 35h15M73 48h15M73 61h15"/><path d="m34 57 10-18 9 11 9-14M34 64h29"/><circle cx="62" cy="36" r="3"/>',
 psx:'<path d="m48 8 29 12v24c0 21-17 34-29 42-12-8-29-21-29-42V20z"/><path d="M31 57V43M43 57V34M55 57V40M67 57V29M31 65h36"/><path d="m37 23 6 5 12-10"/>',
 qa:'<path d="M13 18h27c8 0 8 8 8 8s0-8 8-8h27v53H57c-9 0-9 8-9 8s0-8-9-8H13zM48 26v53M22 30h16M22 39h16M22 48h11"/><circle cx="65" cy="43" r="11"/><path d="m73 51 9 10M61 40c0-5 8-5 8 0 0 3-4 3-4 6M65 51v.1"/>',
 gift:'<rect x="20" y="31" width="56" height="52" rx="3"/><path d="M16 24h64v15H16zM48 24v59M20 52h56M48 24C16 25 23-3 40 14l8 10c32 1 25-27 8-10z"/><path d="M30 63h8M34 59v8M62 68h6M65 65v6"/>',
 research:'<path d="M15 14v65h68M25 64l15-25 14 14 24-30M66 23h12v12"/><circle cx="40" cy="39" r="5"/><circle cx="54" cy="53" r="5"/><path d="M25 20h15M25 27h8"/><path d="M32 84v5M53 84v5M74 84v5"/>',
 brain:'<path d="M46 21c-7-17-28-11-27 3-15 2-16 22-5 29-7 16 11 31 24 22 2 8 8 8 8 1zM50 21c7-17 28-11 27 3 15 2 16 22 5 29 7 16-11 31-24 22-2 8-8 8-8 1zM29 25c-5 7 3 15 9 12M19 52c9-5 19 0 18 10M67 25c5 7-3 15-9 12M77 52c-9-5-19 0-18 10"/>',
 code:'<path d="m31 24-23 24 23 24M65 24l23 24-23 24M57 14 39 82"/><circle cx="48" cy="48" r="5"/>',
 impact:'<circle cx="48" cy="27" r="11"/><circle cx="20" cy="42" r="8"/><circle cx="76" cy="42" r="8"/><path d="M29 78V66c0-25 38-25 38 0v12zM11 77V65c0-12 9-16 18-14M85 77V65c0-12-9-16-18-14M42 65l5 5 9-11"/>',
 sun:'<circle cx="48" cy="48" r="17"/><path d="M48 7v10M48 79v10M7 48h10M79 48h10M19 19l7 7M70 70l7 7M19 77l7-7M70 26l7-7"/>',
 moon:'<path d="M74 63A33 33 0 0 1 34 19a34 34 0 1 0 40 44z"/><path d="M67 15v14M60 22h14M80 35v8M76 39h8"/>'
};
export function icon(name,cls=''){return `<svg class="project-icon ${cls}" viewBox="0 0 96 96" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.demo}</svg>`;}
