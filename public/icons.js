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

// Non-traditional cyber-minimalist tech micro-glyphs for the toolkit
const skillPaths={
 'React':'<circle cx="12" cy="12" r="2.2" fill="currentColor"/><ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(30 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(-30 12 12)"/><circle cx="19.5" cy="8" r="1" fill="currentColor"/>',
 'TanStack Start':'<path d="M4 16.5l8 4 8-4M4 12l8 4 8-4M12 3.5L4 7.5l8 4 8-4-8-4z"/><circle cx="12" cy="3.5" r="1.2" fill="currentColor"/>',
 'TypeScript':'<path d="M6 5H3.5v14H6M18 5h2.5v14H18"/><path d="M8.5 9h6M11.5 9v7"/><path d="M14.5 13.5l1.8 1.8 3.2-3.3"/>',
 'JavaScript':'<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><path d="M8.5 13.5c0 1.5-.7 2.2-1.8 2.2"/><path d="M13.2 15.5c1 .5 2.5.3 2.5-1s-1.5-1.2-2.5-1.5-1.4-.7-1.4-1.5 1-1.5 2.2-1.2c.7.2 1.2.7 1.4 1.2"/><circle cx="18" cy="6.5" r="1" fill="currentColor"/>',
 'FastAPI':'<path d="M13 2.5L4.5 13h6L9.5 21.5l10-11.5h-6l2.5-7.5z"/><circle cx="18" cy="18" r="1.2" fill="currentColor"/>',
 'Node.js':'<path d="M12 2.8l7.5 4.3v8.8L12 20.2l-7.5-4.3V7.1L12 2.8z"/><path d="M12 11.5l7.5-4.3M12 11.5v8.7M12 11.5L4.5 7.2"/><circle cx="12" cy="11.5" r="2" fill="currentColor"/>',
 'Express':'<path d="M4 8h13M13 4l4 4-4 4M20 16H7M11 12l-4 4 4 4"/><circle cx="4" cy="8" r="1.2" fill="currentColor"/><circle cx="20" cy="16" r="1.2" fill="currentColor"/>',
 'PostgreSQL':'<ellipse cx="12" cy="5.5" rx="7.5" ry="2.8"/><path d="M4.5 5.5v6c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-6M4.5 11.5v6c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-6"/><path d="M12 8.3v8.9"/>',
 'Supabase':'<path d="M12.8 2.5L5 12.8c-.3.4 0 1 .5 1h5.7v7.2c0 .6.7.9 1.1.4l7.8-10.3c.3-.4 0-1-.5-1h-5.7V2.9c0-.6-.7-.9-1.1-.4z"/>',
 'MongoDB':'<path d="M12 2.5s-5.5 5.5-5.5 10.5a5.5 5.5 0 0 0 11 0c0-5-5.5-10.5-5.5-10.5z"/><path d="M12 2.5v18.5M8.5 13.5l3.5 2.5 3.5-2.5"/>',
 'Python':'<path d="M9 3.5h3.5A2.5 2.5 0 0 1 15 6v2H8a2 2 0 0 0-2 2v2H5a2.5 2.5 0 0 1-2.5-2.5V6A2.5 2.5 0 0 1 5 3.5h4z"/><circle cx="7" cy="5.8" r="1" fill="currentColor"/><path d="M15 20.5h-3.5a2.5 2.5 0 0 1-2.5-2.5V16h7a2 2 0 0 0 2-2v-2h1a2.5 2.5 0 0 1 2.5 2.5V18a2.5 2.5 0 0 1-2.5 2.5H15z"/><circle cx="17" cy="18.2" r="1" fill="currentColor"/>',
 'Pandas':'<rect x="3.5" y="4" width="17" height="16" rx="2.5"/><path d="M3.5 9h17M9 4v16M15 4v16"/><circle cx="6.2" cy="13" r="1" fill="currentColor"/><circle cx="12" cy="13" r="1" fill="currentColor"/><circle cx="17.8" cy="13" r="1" fill="currentColor"/>',
 'NumPy':'<path d="M12 2.8l7 4.1v8.2l-7 4.1-7-4.1V6.9l7-4.1z"/><path d="M12 11.5L19 7M12 11.5v8.5M12 11.5L5 7"/><circle cx="12" cy="11.5" r="1.5" fill="currentColor"/><circle cx="8.5" cy="5" r="1" fill="currentColor"/><circle cx="15.5" cy="5" r="1" fill="currentColor"/>',
 'scikit-learn':'<circle cx="7" cy="7" r="1.6" fill="currentColor"/><circle cx="5.5" cy="12.5" r="1.6" fill="currentColor"/><circle cx="9.5" cy="9.5" r="1.6" fill="currentColor"/><circle cx="15" cy="15" r="1.6"/><circle cx="18" cy="12" r="1.6"/><circle cx="17.5" cy="17.5" r="1.6"/><path d="M3.5 19.5L20.5 4.5" stroke-dasharray="2.5 2"/>',
 'LangGraph':'<circle cx="12" cy="5" r="2.5"/><circle cx="6" cy="17" r="2.5"/><circle cx="18" cy="17" r="2.5"/><path d="M10 6.5L7.5 14.5M16.5 14.5L14 6.5M8.5 17h7"/><path d="M7 11.5l1.5 2M17 11.5l-1.5 2M12 15.5l2 1.5"/><circle cx="12" cy="5" r="1.2" fill="currentColor"/>',
 'Vector search':'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2"/><path d="M14.5 9.5L20.5 3.5M20.5 3.5h-3.5M20.5 3.5v3.5"/>',
 'SQL':'<ellipse cx="11" cy="5.5" rx="6.5" ry="2.5"/><path d="M4.5 5.5v5c0 1.3 2.9 2.5 6.5 2.5s6.5-1.2 6.5-2.5v-5"/><path d="M4.5 10.5v5c0 1.3 2.9 2.5 6.5 2.5s6.5-1.2 6.5-2.5v-5"/><path d="M16 16l4.5 4.5"/><circle cx="15.5" cy="15.5" r="2.5"/>',
 'Java':'<path d="M8 18.5c2.5 1 5.5 1 8 0M7 21c3.5 1.2 7 1.2 10.5 0"/><path d="M10.5 14c-1.5-2.5.5-4.5 1.5-6.5 1 2 2.5 3.5 1 6.5"/><path d="M14 11.5c1-1.5 2-2.5 1-4.5"/><path d="M6 15.5h12c0 2-2.5 3-6 3s-6-1-6-3z"/>',
 'Docker':'<path d="M12 2.5L20 7v9.5L12 21l-8-4.5V7L12 2.5z"/><path d="M12 11.8L20 7M12 11.8v9.2M12 11.8L4 7"/><path d="M8 4.75l8 4.5M4 11.5l8 4.5M16 13.75l4-2.25"/><circle cx="12" cy="11.8" r="1.2" fill="currentColor"/>',
 'Git':'<circle cx="6.5" cy="5.5" r="2.5"/><circle cx="6.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="12" r="2.5"/><path d="M6.5 8v8M6.5 12c3 0 5.5-.5 8.5-2M14 8.5L17.5 12"/>'
};

const defaultSkillPath='<circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/>';

export function getSkillIcon(name){
 const path=skillPaths[name]||defaultSkillPath;
 return `<svg class="skill-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}
