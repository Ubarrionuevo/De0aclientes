# TODO-contenido.md — datos y decisiones que dependen del dueño

**Proyecto:** De 0 a Clientes
**Fecha:** 2026-10-10

> Regla aplicada: **no se inventó ningún dato**. En los casos de abajo, el SEO ya quedó
> corregido en lo técnico, pero completar el contenido requiere información real del dueño.
> Cada ítem indica **qué falta**, **por qué importa** y **dónde se usaría**.

---

## 1. Dominio
- **Falta:** decidir si se registra/activa `de0aclientes.com`.
- **Estado:** `de0aclientes.com` **no resuelve** (NXDOMAIN). Hoy todo apunta a
  `de0aclientes.com.ar` (correcto y funcional).
- **Si se activa `.com`:** hacer 301 `de0aclientes.com.ar` → `de0aclientes.com` y
  reemplazar el dominio en canonical/hreflang/og/sitemap/JSON-LD.
- **Importa:** evita señales canónicas a un host muerto (era el hallazgo crítico #1).

## 2. Autor / E-E-A-T (`Person` + página About)
- **Falta:** nombre real, cargo, biografía (2–3 párrafos), foto profesional, enlaces
  (LinkedIn, etc.). El único indicio es el handle X `@titobarri0nuevo`.
- **Dónde se usaría:** `Person` en el JSON-LD (autor de contenido), página `/about`
  (y `/en/about`), firma de artículos.
- **Importa:** sin autor identificable no hay señales E-E-A-T ni entidad `Person` para
  knowledge graph. **No se crea la página About con datos inventados.**

## 3. Productos y precios
- **Confirmado en el sitio:** «¿No sabés vender?» — **USD 15**, pago único (Studio ES/EN).
- **Sin confirmar:** el FAQ EN del home afirma **dos productos** («a USD 15 playbook and
  lifetime access for USD 49.99»). Ese segundo producto **no aparece** en Studio, ni en ES.
- **Falta:** ¿existe el acceso de por vida a USD 49.99? Si sí → precio, qué incluye,
  dónde comprar, moneda e impuestos. Si no → quitar la mención del FAQ EN.
- **Importa:** claim de precio inconsistente entre idiomas/páginas = riesgo de confianza
  y de políticas de Google Ads/AdSense.

## 4. FAQ — paridad ES/EN
- **Falta:** decidir el FAQ canónico.
- **Estado:** home EN 5 ítems vs ES 3; Studio EN 6 ítems vs ES 4. (El `FAQPage` del
  JSON-LD debe reflejar exactamente el FAQ visible.)
- **Importa:** paridad internacional y datos estructurados válidos (evita duplicado
  parcial y contenido visible distinto del marcado).

## 5. Redes sociales (`sameAs`)
- **Falta:** listar solo las redes que **existen** (Instagram, LinkedIn, YouTube, TikTok…).
- **Estado:** `sameAs` solo incluye X y Substack. **No** se agregaron redes sin confirmar.

## 6. Blog propio vs Substack
- **Falta:** decisión. Todo el contenido editorial vive en `de0aclientes.substack.com`;
  el dominio propio aporta ~5 páginas de marketing, así que el SEO editorial **no suma**
  al dominio propio.
- **Opciones:** (a) seguir en Substack y enlazar; (b) blog estático propio (sin build) con
  `BlogPosting`; (c) importar artículos con `canonical` al original.
- **Ver:** `CONTENT-PLAN.md`.

## 7. Traducción de artículos
- **Estado:** el home EN muestra títulos traducidos que enlazan a posts **en español**
  (ya marcados con `hreflang="es"` y `· ES`).
- **Falta:** decidir si se traducen los posts o si el home EN debe mostrar solo artículos
  con versión EN.

## 8. Accesos y medición
- **Falta:** acceso a **Google Search Console** (propiedad `de0aclientes.com.ar`, y `.com`
  si se registra), **GA4** y **Bing Webmaster Tools**.
- **Importa:** verificar cobertura, `hreflang`, Core Web Vitals y reenviar el sitemap.

## 9. Datos a verificar en el copy existente
- «Más de **500**» suscriptores (el contador ya muestra 500+): confirmar cifra real vigente.
- «Respondemos en menos de **24 horas hábiles**» (`/contact`): confirmar SLA real.
- Jurisdicción legal del aviso de privacidad (GDPR / UK GDPR / CCPA): validar con asesor
  legal según el país del titular.

## 10. Página de Cookies
- **Estado:** en el footer, «Cookies» es un `<button>` que reabre el aviso de
  consentimiento (funcional). La Política de Privacidad ya está enlazada.
- **Falta (opcional):** decidir si se quiere una página `/cookies` separada.
