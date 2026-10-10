# CONTENT-PLAN.md — Plan de contenido y arquitectura de información

**Proyecto:** De 0 a Clientes
**Fecha:** 2026-10-10
**Base:** hallazgos de `AUDIT-SEO.md`. Este plan **no** inventa datos: los campos que
requieren información real están listados en `TODO-contenido.md`.

---

## 1. Objetivo

1. Consolidar autoridad del **dominio propio** (`de0aclientes.com.ar`) en vez de depender
   solo de `de0aclientes.substack.com`.
2. Captar tráfico ES (LatAm/España) y EN (US/anglo) con contenido propio.
3. Empujar a dos conversiones: **suscripción al newsletter** y **venta del Studio**.

## 2. Arquitectura propuesta (sin build, HTML estático)

| Ruta | Propósito | Estado |
|---|---|---|
| `/` | Home / newsletter (media) | existe |
| `/studio` | Oferta principal (producto + servicio) | existe |
| `/contact` | Contacto | existe |
| `/privacy` | Privacidad | existe |
| `/about` | Autor / historia, E-E-A-T | **crear (requiere datos del dueño)** |
| `/blog` (o `/recursos`) | Artículos propios con `BlogPosting` | **decidir** |
| `/productos/…` | Página por producto | **decidir** |

Cada ruta tendrá su equivalente en `/en/…` con `hreflang` recíproco `es` / `en` /
`x-default`→EN.

## 3. Mapa de keywords (propuesta de objetivos, no datos)

> Objetivos SEO a validar con Search Console. No implican cifras de volumen inventadas.

| Página | ES (LatAm/España) | EN (US/anglo) |
|---|---|---|
| Home | conseguir clientes, cómo conseguir clientes | how to get clients, get clients |
| Studio | aprender a vender, vender un producto digital, vender por WhatsApp | learn to sell, how to sell, selling skills |
| About | quién está detrás de De 0 a Clientes | about |

Clústeres de blog (futuro): prospección, vender por redes, conversación de venta,
pricing, primeros clientes.

## 4. Enlazado interno

- Cada artículo del blog → enlace contextual a `/studio` y a un CTA de suscripción.
- Home → `/studio` (anchor «Studio»), footer → `/privacy` y `/contact`.
- `hreflang` por artículo (ES/EN) cuando exista traducción.

## 5. Blog propio vs Substack

Todo el contenido editorial vive hoy en Substack, así que **no suma SEO al dominio propio**.
Opciones:

- **(a) Blog estático propio** (sin build, recomendado): una carpeta `/blog`, un HTML por
  artículo con JSON-LD `BlogPosting`, enlaces internos al Studio.
- **(b) Importar** artículos de Substack con `canonical` al original.
- **(c) Seguir solo en Substack** y enlazar (mínimo esfuerzo, sin transferencia de autoridad).

## 6. Cadencia y proceso

- Frecuencia sugerida: 1 artículo/semana por idioma (o 1 quincenal si el tiempo es acotado).
- Flujo por pieza: keyword objetivo → borrador → revisión de voseo (ES) / inglés nativo (EN)
  → publicación → enlace interno → alta en `sitemap.xml` con `lastmod`.
- Los datos sensibles (nombre del autor, precios, productos, testimonios) se toman de
  `TODO-contenido.md` una vez confirmados.

## 7. Medición

- **Search Console** (impresiones, clics, CTR por consulta/página; estado de `hreflang`).
- **GA4**: suscripciones, clics a WhatsApp y a Substack.
- Revisión mensual: páginas que entran al top 10, huecos de keywords y ajustes de títulos.
