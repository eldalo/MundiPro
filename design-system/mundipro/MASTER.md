# MundiPro — Design System (Master)

> **Style:** Retro Panini · Inspired by Mundial sticker albums.
> Single source of truth. Page-specific overrides live in `design-system/mundipro/pages/[page].md`.

**Updated:** 2026-05-13 · **Category:** Sports prediction game (World Cup 2026)

---

## North Star

- **Estilo:** Retro Panini sticker album. Bordes gruesos, sombra apilada de color, tipografía editorial.
- **Mood:** Nostálgico, coleccionable, lúdico-deportivo. Refs: Panini World Cup albums (78/86/94), Wes Anderson covers, FotMob retro mode.
- **Densidad:** Mobile-first, generosa. Targets ≥44×44px.
- **Modos:** Light (papel beige) + Dark ("álbum nocturno", navy + cream).
- **Voz:** Habla del usuario como coleccionista. "Cromo", "Álbum", "Pegar cromo", "Reclama tu colección".

---

## Color tokens

Tokens viven en `src/index.css` bajo `:root` y `.dark`. Toda la app usa estas variables vía Tailwind (`bg-background`, `text-foreground`, `text-primary`, `border-border`, `bg-paper`, `text-ink`, `text-ink-soft`, `bg-gold`, etc.). **Nunca raw hex/oklch en componentes.**

### Light ("álbum diurno")

| Token | Valor | Uso |
|-------|-------|-----|
| `--background` | `oklch(0.94 0.04 80)` | Beige papel (con dot-grid) |
| `--paper` | `oklch(0.97 0.02 80)` | Papel limpio para card interior |
| `--ink` | `oklch(0.25 0.10 45)` | Tinta navy-marrón (bordes, texto) |
| `--ink-soft` | `oklch(0.40 0.08 45)` | Texto secundario, labels, aside |
| `--card` | `oklch(0.97 0.02 80)` | Igual que paper |
| `--primary` | `oklch(0.45 0.22 250)` | **FIFA Blue** — CTAs, accents |
| `--primary-foreground` | `oklch(0.92 0.14 85)` | **Gold** sobre primary |
| `--gold` | `oklch(0.92 0.14 85)` | Highlights, stars, trophy |
| `--accent` | `oklch(0.92 0.14 85)` | Surface alt (gold soft) |
| `--destructive` | `oklch(0.55 0.20 25)` | Red shadow plate / errors |
| `--success` | `oklch(0.55 0.18 145)` | Pronóstico exacto |
| `--warning` | `oklch(0.78 0.16 75)` | Partido por jugar |
| `--border` | `oklch(0.25 0.10 45 / 0.18)` | Bordes default (suaves) |
| `--input` | `oklch(0.25 0.10 45)` | Bordes campo (gruesos, 2px) |
| `--ring` | `oklch(0.45 0.22 250)` | Focus ring |
| `--radius` | `0.75rem` | Radio base |
| `--shadow-plate` | `4px 4px 0 var(--ink)` | **Sombra apilada** (signature) |

### Dark ("álbum nocturno")

Mismo álbum, luz tenue. Papel se vuelve navy profundo, tinta crema, primary cambia a gold (más legible en oscuro).

| Token | Valor |
|-------|-------|
| `--background` | `oklch(0.16 0.04 260)` |
| `--paper` | `oklch(0.20 0.04 260)` |
| `--ink` | `oklch(0.95 0.04 85)` |
| `--primary` | `oklch(0.92 0.14 85)` (gold) |
| `--primary-foreground` | `oklch(0.20 0.04 260)` (deep navy) |
| `--accent` | `oklch(0.55 0.22 250)` (FIFA blue inverso) |

---

## Typography

Stack: **Geist Variable** (sans) + **Geist Mono Variable** (tabular). Sin fuentes adicionales.

| Rol | Clase Tailwind | Peso | Notas |
|-----|----------------|------|-------|
| **Display** (hero, "ENTRA AL ÁLBUM") | `font-black uppercase tracking-wide` | 900 | All caps, ancho de pantalla |
| **H1** | `text-3xl font-black tracking-tight` | 900 | |
| **H2** | `text-2xl font-bold` | 700 | |
| **H3** | `text-xl font-bold` | 700 | |
| **Body** | `text-sm` o `text-base` | 400 | |
| **Eyebrow** ("Cromo 001", "Grupo A") | `panini-eyebrow` (mono 10px tracking 0.3em) | 400 | Color `--ink-soft` |
| **Aside / caption** | `panini-aside` (Georgia serif italic) | 400 | Para "Quote-like" texto |
| **Tabular** (marcadores, puntos) | `font-mono tabular-nums` | 500–900 | Geist Mono |

**Utilidades globales** (en `index.css`):
- `.panini-display` → `font-black uppercase tracking-wide` + `text-wrap: balance`
- `.panini-eyebrow` → `font-mono text-[10px] uppercase tracking-[0.3em]` + color `--ink-soft`
- `.panini-aside` → Georgia serif italic
- `.panini-card` → border 3px `--ink`, bg paper, radius 3xl
- `.panini-btn` → border 2px ink + sombra apilada `--shadow-plate`, press traduce 2px abajo
- `.panini-dashed` → divisor punteado 2px en tono ink/30

---

## Components

### Card

Default Panini card = papel cream con borde tinta 3px + sombra apilada de color.

```jsx
<div className="relative">
  <div aria-hidden className="absolute -top-3 -right-3 h-full w-full rounded-[28px] bg-primary" />
  <div className="relative panini-card p-6">…</div>
</div>
```

**Plate color rules:**
- Hero / Login → red (`bg-destructive`)
- Signup / Profile → primary (`bg-primary`)
- Admin / danger → red
- Sub-cards / interior → omit plate, just `border-2 border-ink`

### Button

`<Button variant="panini" />` o clase `.panini-btn`. Variantes:
- `panini` (default) — FIFA blue + gold text
- `panini-gold` — gold + ink text (high emphasis on dark cards)
- `panini-outline` — paper + ink border, ink text
- `panini-ghost` — no border, no shadow, ink text

### Input

Borde 2px `--input` (ink), radius `--radius`, h-12. Icon izquierda absoluto. Eye toggle derecha para password. Error → border red + texto error red bajo input.

### Section header

```jsx
<div className="flex items-center gap-3">
  <div className="h-1.5 w-8 rounded-full bg-primary" />
  <p className="panini-eyebrow">Cromo 002</p>
</div>
<h2 className="panini-display text-3xl">Tu colección</h2>
```

### Badges / stage labels

Stage label = pequeño cromo. Borde 2px ink, fondo según stage:
- Group A-H → `bg-paper text-ink`
- Round of 16 → `bg-accent` (gold soft)
- Quarter / Semi → `bg-secondary`
- Final → `bg-primary text-primary-foreground` (gold sobre azul)

Points badge:
- 3 pts (exacto) → `bg-success text-paper`
- 1 pt (ganador) → `bg-accent text-ink`
- 0 pts → `bg-paper text-ink-soft border-2 border-ink/30`

### Avatar

Borde 2px ink, optional ring gold. Initials sobre `bg-accent text-ink`.

### Tabs

`TabsList` con fondo `bg-paper` border-2 ink rounded-xl. Active tab → `bg-ink text-paper` (alto contraste).

### Dialog

Overlay `bg-ink/30`. Content panini-card con plate gold. Close button top-right rounded-full bordeado.

---

## Layout

### Background

`body` siempre dot-grid (configurado en `index.css`). Light = beige dots cálidos. Dark = navy dots.

### Containers

- Mobile: `px-4`
- Desktop: `max-w-6xl mx-auto px-6`

### Navegación

- **Mobile bottom nav**: 3 items (Home · Fixtures · Perfil) + cromo amarillo "activo" rounded-full bajo icon. Fondo `bg-paper border-t-2 border-ink`.
- **Mobile top bar**: 56px, logo escudo + theme toggle. Sin notificaciones por ahora.
- **Desktop sidebar**: 240px, fondo `bg-sidebar`, item activo → `bg-sidebar-accent` con barra izq 4px primary. Logo arriba, perfil/admin abajo.

### Iconos

Lucide. Tamaños h-4/5/6/7. Stroke 2 (más grueso que default; suma a vibe Panini).

### Banderas

`<TeamFlag />` con SVG `flagcdn.com`. Marco: `rounded border-2 border-ink/40` (mock-cromo).

---

## Estados & feedback

- **Loading:** `Skeleton` con bg `var(--muted)` y shimmer suave.
- **Empty state:** Card paper + ilustración mínima + frase aside ("Aún no hay cromos en esta hoja del álbum.") + CTA.
- **Success toast:** `sonner` 3s. Mensaje: "Cromo pegado · ARG 2 – 1 MEX". Background gold, text ink.
- **Error toast:** `sonner` destructive, text paper.
- **Validation inline:** Border red en input + texto rojo bold sm bajo.

---

## Animación

- 120–200ms ease-out.
- Botones `panini-btn`: press traduce 2px Y + shadow shrinks.
- Stickers (cards hero) sutil tilt `rotate(-1deg)` en hover desktop.
- Stagger 40ms en listas (fixtures, ranking).
- Respetar `prefers-reduced-motion`.

---

## Accesibilidad

- Focus ring visible (`ring-2 ring-ring ring-offset-2 ring-offset-paper`).
- Contraste mínimo 4.5:1 (ink sobre paper = 9:1, ✓).
- Labels visibles siempre, no placeholder-only.
- `aria-live="polite"` en toasts.
- Touch targets ≥44px.
- Tabular numbers en datos.
- `aria-invalid` en inputs con error.

---

## Voice & microcopy

| Acción default | Versión Panini |
|----------------|----------------|
| Entrar / Iniciar sesión | Entra al álbum / Pegar cromo |
| Registrarse | Crea tu álbum |
| Guardar pronóstico | Pegar cromo |
| Pronóstico exacto | Cromo brillante |
| Ranking | Tu colección |
| Próximo partido | Próximo cromo |
| Perfil | Mi álbum |

Usar sin saturar — la voz refuerza la metáfora pero el copy crítico (errores, mensajes Supabase) sigue claro.

---

## Anti-patterns

- ❌ Hex/oklch raw en componentes — siempre tokens
- ❌ Cards sin borde grueso o sin sombra apilada (excepto sub-cards interior)
- ❌ Sombras suaves `shadow-md` por sí solas (rompen vibe)
- ❌ Tipo proporcional en marcadores (siempre mono + tabular)
- ❌ Gradientes blur "vaporwave" (eran del look anterior)
- ❌ Hover-only para info crítica
- ❌ Banderas emoji (siempre SVG)
- ❌ Bottom nav >5 ítems

---

## Inventario de páginas

| Página | Status | Doc |
|--------|--------|-----|
| Login | ✅ Panini | `pages/login.md` |
| Signup | ✅ Panini | `pages/signup.md` |
| Home | ✅ Panini | `pages/home.md` |
| Fixtures | ✅ Panini | `pages/fixtures.md` |
| Profile | ✅ Panini | `pages/profile.md` |
| Admin · Matches | ✅ Panini | `pages/admin-matches.md` |
| Admin · Match Edit | ✅ Panini | `pages/admin-match-edit.md` |

---

## Files

- **Tokens & utilities:** `src/index.css`
- **Master doc:** este archivo
- **Page docs:** `design-system/mundipro/pages/*.md`
- **Layout components:** `src/components/layouts/*`
- **Primitives:** `src/components/ui/*` (shadcn) + `src/components/ui-extras/*`
- **Domain components:** `src/components/{dashboard,match,profile,feedback}/*`
