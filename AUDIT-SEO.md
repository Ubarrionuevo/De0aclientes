# AUDIT-SEO.md — Auditoría SEO técnica e internacional

**Proyecto:** De 0 a Clientes
**Dominio auditado en vivo:** https://de0aclientes.com.ar
**Fecha:** 2026-10-10
**Rama de trabajo:** `seo/auditoria-tecnica`
**Autor:** auditoría técnica (SEO internacional + frontend)

> Regla de trabajo: nada de cifras, testimonios, biografías ni precios inventados.
> Todo dato faltante se registra en `TODO-contenido.md`.

---

## 0. Resumen ejecutivo

El sitio es **HTML estático puro** (sin build) desplegado en **Netlify** desde el repo
GitHub `Ubarrionuevo/De0aclientes` (rama `main`). No existe capa de servidor propia,
ni `_redirects`, ni `netlify.toml`, ni lógica de idioma por IP.

**Hallazgo crítico #1 — dominio canónico inexistente.**
Todo el sitio (canonical, `hreflang`, `og:url`, `sitemap.xml`, `robots.txt` → `Sitemap:`)
apunta a **`https://de0aclientes.com`**, que **no existe**: consultas DNS (DoH de Google,
y `Resolve-DnsName`) devuelven `NXDOMAIN`. El sitio se sirve en
**`https://de0aclientes.com.ar`**. Resultado: Google/Bing/Bingbot reciben una señal
canónica hacia un host que no resuelve → riesgo de desindexación y de que herramientas
de terceros no puedan verificar `de0aclientes.com` (explica la hipótesis 10).

**Hallazgo crítico #2 — no hay redirección por idioma (bien).**
La hipótesis de que "el sitio cambia de idioma según quién entra" **NO se cumple**:
con `es-AR`, `en-US`, `fr-FR` y sin `Accept-Language`, para Googlebot, Bingbot y Chrome,
el HTML es **byte-idéntico** (mismo MD5) y no hay `30x`. El cambio de idioma es 100%
manual (link EN/ES en el menú). Riesgo SEO internacional: **bajo**.

**Hallazgo crítico #3 — URLs duplicadas `.html` vs limpias.**
`/studio` y `/studio.html` (idem contact/privacy) devuelven **ambas `200`** sin
distinción canónica útil (el canonical apunta a `.com.html`, muerto). Netlify reescribe
los enlaces internos a URLs limpias en el HTML servido, pero el repo usa `.html`.

---

## 1. Stack, build y hosting (Fase 0)

| Ítem | Resultado | Evidencia |
|------|-----------|-----------|
| Stack | HTML + CSS inline + JS inline; único archivo JS: `consent.js` | inspección del repo |
| Build | **Ninguno** (no hay `package.json`, `netlify.toml`, `_redirects`, `_headers`, `.htaccess`, funciones/edge) | `Glob **/*.{json,toml,yml,js,ts,mjs}` → solo `consent.js` |
| Hosting | **Netlify** | header `Server: Netlify` en todas las respuestas |
| Origen | GitHub `https://github.com/Ubarrionuevo/De0aclientes.git`, rama `main` | `git remote -v` |
| Post-proceso | Netlify reescribe `.html` → URL limpia y comillas simples en el HTML servido | comparación HTML repo vs. live |
| Lógica de idioma | **No existe** (ni `navigator.language`, ni `cf-ipcountry`, ni `x-vercel-ip-country`, ni cookies/localStorage de idioma salvo `d0c_consent`) | `grep` sobre todo el repo → 0 coincidencias |
| 404 | Netlify default (genérico, en inglés) | `curl -I /pagina-que-no-existe-xyz` → `404` HTML de Netlify |

### Assets

- `logo.png` 512×512; `og-home.png`, `og-home-en.png`, `og-studio.png`, `og-studio-en.png` 1200×630 (coinciden con lo declarado).
- Sin `<img>` raster en el contenido (favicon es un SVG inline `data:`).
- Fuentes Google con `preconnect` + `display=swap`.

---

## 2. Matriz de URL y redirecciones (Fase 1)

`curl -sI -L`, verificado también con DoH de Google.

| URL solicitada | Código/Destino | Notas |
|---|---|---|
| `http://de0aclientes.com.ar/` | `301` → `https://de0aclientes.com.ar/` | OK |
| `https://de0aclientes.com.ar/` | `200` | sitio real |
| `https://www.de0aclientes.com.ar/` | `301` → `https://de0aclientes.com.ar/` | OK |
| `https://de0aclientes.com/` | **NXDOMAIN (sin respuesta)** | **dominio no registrado/delegado** |
| `https://www.de0aclientes.com/` | **NXDOMAIN** | idem |
| `https://de0aclientes.com.ar/studio` | `200` | y `/studio.html` también `200` (**duplicado**) |
| `https://de0aclientes.com.ar/contact` | `200` | y `/contact.html` `200` (duplicado) |
| `https://de0aclientes.com.ar/privacy` | `200` | y `/privacy.html` `200` (duplicado) |
| `https://de0aclientes.com.ar/en/` | `200` | |
| `https://de0aclientes.com.ar/robots.txt` | `200` | permite `Googlebot`/`Bingbot` vía `*`; mantiene bots de IA; `Sitemap:` apunta a `.com` (muerto) |
| `https://de0aclientes.com.ar/sitemap.xml` | `200` | todas las `<loc>` apuntan a `.com` (muerto) |

**Cadenas/bucles:** no se observan cadenas para `.com.ar` (una sola redirección). No hay
redirección desde `.com` porque el host no resuelve.

---

## 3. Matriz de idioma (Fase 1)

`Accept-Language` × User-Agent sobre `https://de0aclientes.com.ar/`:

| UA \ AL | `en-US` | `es-AR` | `es-MX` | `es-ES` | `fr-FR` | sin header |
|---|---|---|---|---|---|---|
| Googlebot desktop | `200` | `200` | `200` | `200` | `200` | `200` |
| Googlebot smartphone | `200` | `200` | `200` | `200` | `200` | `200` |
| Bingbot | `200` | `200` | `200` | `200` | `200` | `200` |
| Chrome (Windows) | `200` | `200` | `200` | `200` | `200` | `200` |

- **Sin redirecciones** en ningún caso.
- **Contenido idéntico**: MD5 `6F87B5B8378E341825C2E3521EDF98EE` para `es-AR`, `en-US` y `fr-FR`.
- No hay geolocalización en el edge (Netlify servía el mismo bytes server-side).

**Conclusión:** no hay "idioma dinámico" ni cloaking. El sistema actual de idioma es
correcto desde el punto de vista de rastreo, pero pasivo (el usuario debe encontrar el
link EN/ES). Falta un aviso amable del lado del cliente (Fase 2.1).

---

## 4. Auditoría de `<head>` (estado EN VIVO = lo que ve Google)

| Página | `<title>` (len) | `description` (len) | canonical | `og:locale` | H1 |
|---|---|---|---|---|---|
| Home ES | De 0 a Clientes - Conseguí tu próximo cliente esta semana (61) | Tips diarios… En español e inglés. (139) | `https://de0aclientes.com/` ❌ muerto | `es_ES` ⚠️ | 1 |
| Home EN | De 0 a Clientes — Get Your Next Client This Week (50) | Daily free tips… (132) | `https://de0aclientes.com/en/` ❌ | `en_US` | 1 |
| Studio ES | No clickies acá \| De 0 a Clientes (34) | No clickies acá: te cuento… (92) | `https://de0aclientes.com/studio.html` ❌ | `es_ES` ⚠️ | 1 (oculto `sr-only`) |
| Studio EN | Do you know how to sell? Learn with me \| De 0 a Clientes (56) | **"No clickies acá: I share…"** (86) — español filtrado ❌ | `https://de0aclientes.com/en/studio.html` ❌ | `en_US` | 1 (oculto `sr-only`) |
| Contact ES | Contacto \| De 0 a Clientes (28) | Escríbenos… | `.../contact.html` ❌ | `es_ES` ⚠️ | 1 |
| Contact EN | Contact \| De 0 a Clientes (25) | Message us… | `.../en/contact.html` ❌ | `en_US` | 1 |
| Privacy ES | Política de privacidad \| De 0 a Clientes (41) | Qué datos recogemos… | `.../privacy.html` ❌ | `es_ES` ⚠️ | 1 |
| Privacy EN | Privacy Policy \| De 0 a Clientes (32) | What data we collect… | `.../en/privacy.html` ❌ | `en_US` | 1 |

Observaciones:
- **Canonical autorreferente: NO** en ningún caso (todos apuntan a `.com` desde `.com.ar`).
- `hreflang` recíproco presente (`es`, `en`, `x-default`) pero **apunta a `.com` muerto**.
- `title` Studio ES ≠ `og:title` (y era un título sin keyword).
- Studio usa un `H1` con `class="sr-only"` (invisible); el encabezado visible de nivel
  superior es un `H2`.
- `og:locale` = `es_ES` en español (público principal: LatAm).
- Todas las `description` dentro de 155 caracteres; títulos dentro de 60.

---

## 5. Datos estructurados (JSON-LD) — estado EN VIVO

Todos los bloques **parsean OK** (validado con `ConvertFrom-Json`):

| Página | Tipos |
|---|---|
| Home ES/EN | Organization, WebSite, WebPage, BreadcrumbList, ItemList, FAQPage |
| Studio ES/EN | Organization, WebSite, WebPage, BreadcrumbList, Product, FAQPage |
| Contact ES/EN | Organization, WebSite, WebPage, BreadcrumbList, ContactPage |
| Privacy ES/EN | Organization, WebSite, WebPage, BreadcrumbList |

Problemas detectados:
- `Product.offer.url` era `null` (ya corregido en baseline con URL válida).
- URLs de `@id`, `url`, `logo`, `image` apuntan a `.com` (muerto).
- **No hay `Person`** (no hay datos reales de autor; pendiente en `TODO-contenido.md`).
- **No hay `BlogPosting`** (no hay blog propio).
- `sameAs` solo incluye X y Substack.
- No hay `aggregateRating`/reviews (correcto: no inventar).

---

## 6. Contenido, enlazado y UX on-page

- **Hipótesis 2 (CONFIRMADA):** en `/en/` las tarjetas de artículos tienen texto en inglés
  ("Selling is the most important skill…") pero enlazan a los posts de Substack **en español**
  (`/p/vender-es-la-skill-mas-importante`, `/p/como-pase-de-0-a-10-clientes-desde`).
- **Hipótesis 3 (CONFIRMADA):** todo el contenido editorial vive en `de0aclientes.substack.com`;
  el dominio propio solo aporta ~5 páginas de marketing. El SEO de artículos no suma al dominio.
- **Hipótesis 8 (CONFIRMADA):** el FAQ difiere entre idiomas:
  - Home: EN 5 ítems vs ES 3.
  - Studio: EN 6 ítems vs ES 4.
  - El FAQ EN de la home afirma **"two products: a USD 15 playbook and lifetime access for USD 49.99"**;
    ese segundo producto/precio **no figura** en la página de Studio (que vende USD 15) ni en ES.
    → **No se modifica**; se registra en `TODO-contenido.md`.
- **Contador (hipótesis 5, CONFIRMADA):** el HTML trae `id="counter">0<` y el JS lo anima a
  500. Si JS falla o con `prefers-reduced-motion`, muestra "0+". No hay guarda de
  `prefers-reduced-motion` en la home (0 coincidencias en el HTML servido).
- **Menú (hipótesis 4, CONFIRMADA):** el link a Studio usa el anchor text
  **"No clickies acá" / "Don't click here"** (sin keyword).
- **Registro ES:** mezcla de voseo y tuteo. Ejemplos a corregir: "Únete", "Escríbenos",
  "Aprende conmigo" (imperativo tuteo), y el typo **"proposer"** en `/contact`
  ("querés proposer una colaboración" → *proponer*).
- **Cookies:** en el footer es un `<button data-consent-open>`, no un enlace a una página.
- **Redes:** solo X. Falta About, blog propio.
- **404:** default de Netlify, en inglés, sin link a Inicio/idioma.

---

## 7. Veredicto de las 10 hipótesis

| # | Hipótesis | Veredicto |
|---|-----------|-----------|
| 1 | Contenido en `.com.ar` pero canonical/og/sitemap/hreflang a `.com`; enlaces internos a `.com.ar` | **CONFIRMADA** (y peor: `.com` **no resuelve**) |
| 2 | `/en/` con títulos EN que enlazan a Substack en español | **CONFIRMADA** |
| 3 | Todo el contenido editorial en Substack | **CONFIRMADA** |
| 4 | Studio `<title>` = "No clickies acá", distinto de `og:title`; menú "No clickies acá"/"Don't click here" | **CONFIRMADA** |
| 5 | Contador renderiza "0+" en HTML aunque el texto diga "500+" | **CONFIRMADA** |
| 6 | Mezcla voseo/tuteo + typo "proposer"; Studio ES dice "Aprende conmigo" | **CONFIRMADA** |
| 7 | `og:locale` = `es_ES` con público LatAm | **CONFIRMADA** |
| 8 | FAQ EN menciona dos productos y precios; ES no | **CONFIRMADA** |
| 9 | Faltan datos estructurados/About/blog/redes; "Cookies" no es enlace | **PARCIAL** — hay JSON-LD base, pero faltan Person/BlogPosting, About y blog; "Cookies" es un botón |
| 10 | Una herramienta no pudo leer `https://de0aclientes.com` | **EXPLICADA** — `.com` no resuelve; `robots.txt` de `.com.ar` **no bloquea** Googlebot/Bingbot |

---

## 8. Tabla de severidad y arreglo propuesto

| Sev. | Hallazgo | Evidencia | Arreglo |
|---|---|---|---|
| **Crítica** | Canonical/hreflang/og/sitemap/`Sitemap:` apuntan a `.com` (NXDOMAIN) | DoH NXDOMAIN; `<link rel=canonical href=https://de0aclientes.com/>` | Migrar TODAS las URLs al dominio que resuelve (`de0aclientes.com.ar`) y dejarlo parametrizable; documentar el cambio a `.com` cuando se registre/configure |
| **Crítica** | Google no puede validar el dominio del `Sitemap:` | `robots.txt` live | Apuntar a `/sitemap.xml` del dominio real |
| **Alta** | URLs `.html` y limpias devuelven `200` (duplicado) | `curl -I /studio` y `/studio.html` → 200 | Canonical self a URL limpia + `301` `.html`→limpia vía `_redirects` |
| **Alta** | Studio: `H1` solo visible para lectores de pantalla | `<h1 class="sr-only">` | Convertir el encabezado visible a `H1` |
| **Alta** | `/en/` enlaza a artículos en español | live home-en `<h3><a>` | Mostrar solo artículos con traducción o etiquetar `(ES)` + `hreflang="es"` |
| **Alta** | Contador "0+" sin JS / reduced-motion | live home | HTML con `500+`; animación condicionada a `prefers-reduced-motion` |
| **Media** | `og:locale es_ES` (público LatAm) | live | `es` (+ `es_ES` como alternate) |
| **Media** | Studio title sin keyword / ≠ og:title; desc EN con español | live | Rehacer title/description según spec |
| **Media** | Paridad FAQ ES/EN + claim USD 49.99 | live | Igualar FAQ; claim → `TODO-contenido.md` |
| **Media** | Registro mixto (voseo/tuteo) y typo "proposer" | live `/contact` | Unificar a voseo; corregir typo |
| **Media** | "No clickies acá" como anchor text | live menú | Anchor "Studio"; conservar chiste como texto secundario |
| **Media** | "Cookies" no es enlace | live footer | Hacerlo enlace a `/privacy` (o página de cookies) |
| **Baja** | 404 default de Netlify en inglés | `curl -I /xyz` | 404 por idioma con links |
| **Baja** | Sin About ni blog propio | repo | Estructura + `CONTENT-PLAN.md`; datos en `TODO-contenido.md` |
| **Baja** | `sameAs` solo X/Substack | JSON-LD | Añadir redes que existan (pedir en TODO) |

---

## 9. Lo que NO se pudo medir / pendientes de entorno

- **Lighthouse** no ejecutado: el entorno del proyecto no tiene Node/Chrome headless
  disponibles para correrlo de forma fiable. Se deja el comando y los objetivos en
  `CHANGELOG-SEO.md` para correr localmente.
- **Search Console**: requiere acceso del dueño (propiedades de dominio de `.com.ar` y `.com`).
- **DNS de `.com`**: depende del panel del registrador del dueño.

(Ver `TODO-contenido.md` para todos los datos que dependen del dueño.)
