# Structure and deployment review

## Deployment diagnosis

The supplied build log reports successful deployment but selects `dist/app.js` as a root entrypoint. The site is static HTML with browser ES modules and two separate Vercel API functions. The former `public/app.js` was unused by HTML and exported a dummy HTTP handler. Treating it as a backend is inconsistent with the intended deployment. The precise live routing failure still requires verification against the deployed project settings/output.

Changes:
- Set `framework: null` explicitly in `vercel.json`; keep `dist` as static output and `api/` for functions.
- Remove the unused `app.js` shim and `brief.js` re-export; import the brief implementation directly.
- Clean the fixed `dist/` directory before every build so deleted source files cannot survive there.
- Pin Node to 24.x instead of automatically accepting future majors.
- Use the same API handlers locally and on Vercel. Previously two implementations had already diverged on input validation. Malformed/null JSON and oversized parsed bodies now receive controlled errors.
- Discover local public assets from the public directory rather than maintaining a second handwritten filename list.

The npm cache-dir warning and skipped cache upload do not indicate a failed deployment. No dependencies are needed. No lockfile is required until dependencies are introduced.

## Structure assessment

The architecture is suitable for a small vanilla JavaScript portfolio: browser files in `public/`, serverless endpoints in `api/`, one build script, and tests outside shipped assets. All remaining browser JavaScript modules are reachable through the HTML entrypoint or its imports. Documentation screenshots are review evidence, not runtime assets; they are already excluded from deployment. Generated `dist/` and `.vercel/` are ignored by Git.

The project is not fully optimized. Nine stylesheets total about 133 KB before compression, with overlapping base, refinements, and polish rules. They reflect successive design iterations. A future visual refactor should consolidate those rules by component while preserving cascade order and comparing desktop/mobile screenshots. Blindly deleting or rearranging them would change the design. The approximately 1.4 MB sculpture PNG is another performance opportunity. It is referenced by the site and is not an orphan.

The chat limiter remains in memory per process. Vercel forwarded addresses are used only in the Vercel environment; local hosting uses the socket address. High-volume deployments need a shared limiter. Live AI acceptance still requires configured credentials.

## Verification

`npm test` checks local HTTP serving, private-path denial, grounded answers, validation, cross-origin rejection, the Vercel handler's parsed-body behavior, and the static build. The build regression deliberately creates a stale `dist/app.js`, rebuilds, and verifies removal plus all local HTML/module references. These are local checks; they do not establish that the updated commit has been deployed.

Vercel setup: repository root, Framework Preset Other, Build Command `npm run build`, Output Directory `dist`, Node 24.x. Do not use `dist` or `public` as the project's Root Directory. Deploy the source project rather than old `.vercel/output` artifacts.

Reference: https://vercel.com/docs/builds/configure-a-build
