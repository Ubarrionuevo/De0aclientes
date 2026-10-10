# CHANGELOG-SEO.md — Cambios aplicados (Fase 2)

**Proyecto:** De 0 a Clientes
**Rama:** `seo/auditoria-tecnica`
**Fecha:** 2026-10-10
**Complementa:** `AUDIT-SEO.md` (diagnóstico) y `TODO-contenido.md` (datos que dependen del dueño).

> Todos los cambios son sobre HTML/JS estático. **No se hizo deploy a producción.**

---

## Decisión de dominio (leer primero)

Todo el sitio apuntaba a `https://de0aclientes.com`, que **no resuelve** (NXDOMAIN).
Se migraron **todas** las señales (`canonical`, `hreflang`, `og:url`, `og:image`,
`twitter:image`, `@id`/`url`/`logo`/`image` del JSON-LD, `sitemap.xml`, `Sitemap:` de
`robots.txt`, enlaces internos y footers) al dominio que sí resuelve:
**`https://de0aclientes.com.ar`**.

> Cuando el dueño registre/configure `de0aclientes.com`, la migración inversa es un
> reemplazo de `de0aclientes.com.ar` → `de0aclientes.com` (y luego 301 de `.com.ar` a
> `.com`). Ver `TODO-contenido.md` → «Dominio».

---

## Commits

| Hash | Descripción |
|---|---|
| `10c2fc9` | **Baseline** (previo): footer EN, `Product.offers.url` válido, meta description EN del Studio. |
| `954c776` | `AUDIT-SEO.md`: auditoría Fase 0/1 + veredicto de las 10 hipótesis. |
| `2a827c0` | Dominio `.com` → `.com.ar` + URLs limpias (canonical/hreflang/og/sitemap/robots/enlaces internos). |
| `d0a3fc9` | `_redirects` (301 `.html`→limpias), `_headers`, `404.html` bilingüe. |
| `87197e9` | `og:locale` `es_LA` + `alternate` coherente; `x-default` → versión EN. |
| `3c7314a` | Contador `500+` con fallback y `prefers-reduced-motion`; banner de idioma; anchor «Studio»; voseo/typos; artículos EN etiquetados `(ES)`. |
| _este commit_ | `lastmod` del sitemap, docs y validación. |

---

## Detalle de cambios

### 1. URLs y dominio (`2a827c0`, `d0a3fc9`)
- `de0aclientes.com` → `de0aclientes.com.ar` en **todos** los `<head>`, JSON-LD,
  `sitemap.xml`, `robots.txt`, `llms.txt`, `consent.js` y footers.
- URLs limpias en canónicas/og/hreflang/sitemap: `/studio`, `/contact`, `/privacy`,
  `/en/…` (sin `.html`).
- Enlaces internos convertidos a **root-relative** (`/studio`, `/en/studio`, …) para que
  funcionen igual desde cualquier profundidad.
- **`_redirects`** (Netlify): `301!` de cada `.html` a su URL limpia y de `/en` a `/en/`.
- **`_headers`**: `X-Content-Type-Options: nosniff`, `Referrer-Policy` y cache de
  imágenes/fuentes. **No** se agrega CSP (podría romper Google Fonts, Substack o AdSense).
- **`404.html`** bilingüe con enlaces a Inicio/Studio (ES y EN). Reemplaza el 404
  genérico en inglés de Netlify.
- `lastmod` del sitemap actualizado a `2026-10-10`.

### 2. Metadatos e internacional (`87197e9`)
- `og:locale` ES: `es_ES` → **`es_LA`** (público principal LatAm) con
  `og:locale:alternate = en_US`; EN a la inversa (`es_LA` como alternate).
- `hreflang` recíproco `es` / `en` mantenido; **`x-default` ahora apunta siempre a la
  versión EN** (antes apuntaba al home ES desde todas las páginas, incluido el ES).
- `hreflang` de los enlaces del menú de idioma corregidos a la **página equivalente**
  (antes `contact`/`privacy`/`studio` ES llevaban a la home EN).

### 3. On-page / contenido (`3c7314a`)
- **Contador:** el HTML ahora trae `500` (antes `0`), así sin JS se ve `500+`. La
  animación sigue, pero **respeta `prefers-reduced-motion`** y muestra el valor final.
  Se agregó guarda `if (counterEl)` (en `contact`/`privacy` el JS buscaba un `#counter`
  inexistente y lanzaba `TypeError`, cortando el resto del script).
- **Banner de idioma** (`lang.js`, nuevo): sugiere el otro idioma **sin redirigir**,
  se inyecta por JS (no afecta el HTML rastreado) y recuerda la elección en
  `localStorage["d0c_lang_choice"]`. Se incluye en las 8 páginas.
- **Anchor del menú:** «No clickies acá» / «Don't click here» → **«Studio»** (mejor
  señal de enlazado interno). El chiste se conserva como identidad en la propia página.
- **Registro ES a voseo:** «Escríbenos» → «Escribinos»; «Aprende conmigo» → «Aprendé
  conmigo»; «Aprende a vender» → «Aprendé a vender»; «Únete a los 500+» → «Sumate a los
  500+». Typo corregido: «proposer» → **«proponer»** en `/contact`.
- **Artículos EN:** las tarjetas del home EN traducen el título pero enlazan a posts de
  Substack **en español**; se agregó `hreflang="es"` a esos enlaces y la etiqueta `· ES`
  en la metadata de cada artículo.

### 4. No se modificó (deliberadamente)
- **Precios y claims** (USD 15; claim EN «USD 49.99 lifetime»). → `TODO-contenido.md`.
- **Datos estructurados** de autor (`Person`), `BlogPosting`, redes en `sameAs`: no se
  inventan. → `TODO-contenido.md`.
- **Paridad de FAQ ES/EN**: no se reescribe contenido sin fuente. → `TODO-contenido.md`.
- Identidad visual, colores, tipografías y layout.

---

## Cómo validar (local)

```powershell
# 1) No debe quedar ninguna URL al .com muerto
Get-ChildItem -Recurse -Include *.html,*.xml,*.txt,*.js |
  Select-String -Pattern 'de0aclientes\.com/'   # esperado: 0

# 2) JSON-LD parsea en todas las páginas
Get-ChildItem -Recurse -Filter *.html | ForEach-Object {
  $h = Get-Content $_.FullName -Raw
  [regex]::Matches($h,'(?s)<script type="application/ld\+json">(.*?)</script>') |
    ForEach-Object { $_.Groups[1].Value | ConvertFrom-Json | Out-Null }
  "OK $($_.Name)"
}

# 3) Enlaces internos sin .html
Get-ChildItem -Recurse -Filter *.html |
  Select-String -Pattern 'href="[^"]*\.html"'   # esperado: 0

# 4) Redirecciones en vivo (tras deploy)
curl.exe -sI https://de0aclientes.com.ar/studio.html   # esperado: 301 -> /studio
curl.exe -sI https://de0aclientes.com.ar/en            # esperado: 301 -> /en/
curl.exe -sI https://de0aclientes.com.ar/no-existe     # esperado: 404 + 404.html
```

## Lighthouse (pendiente de entorno)

El entorno del proyecto no tenía Node/Chrome headless fiables. Correr localmente:

```bash
npx lighthouse https://de0aclientes.com.ar/ \
  --preset=desktop --only-categories=performance,seo,best-practices,accessibility \
  --view
# repetir para /es: /studio /contact /privacy /en/ /en/studio /en/contact /en/privacy
```

**Objetivos:** SEO ≥ 95, Accessibility ≥ 90, Best Practices ≥ 90, Performance ≥ 85 (móvil).
Puntos típicos a vigilar: `lang.js`/`consent.js` sin `defer` faltante, contraste del
banner inyectado, y CLS del banner (es `position:fixed`, no debería desplazar contenido).

## Checklist de deploy (Netlify)

1. Merge de `seo/auditoria-tecnica` → `main` (aún **no** hecho).
2. Confirmar en Netlify que `_redirects`, `_headers`, `404.html` y `lang.js` se publican
   (están en la raíz del sitio).
3. Verificar los 4 `curl` de arriba.
4. Reenviar `sitemap.xml` en Search Console (propiedad `de0aclientes.com.ar`).
