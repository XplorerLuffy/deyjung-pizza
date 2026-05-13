# DEYJUNG Restro & Pizzeria — UI Design Project

## Figma File
- **File Key**: `MCOSKMGaPVXx9LPRerEA1i`
- **URL**: https://www.figma.com/design/MCOSKMGaPVXx9LPRerEA1i
- **Plan**: Jambayang Singye's team (`team::1628503721771190838`)

## Pages (3-page structure, Starter plan limit)
1. `🎨 Design System` — Color palette (15 tokens), typography scale (6 styles), spacing (8px grid), shadows (3 levels), border radius (6 levels). All color & text styles added to file.
2. `🧩 Components` — Partially built. Buttons, food cards, nav bars, chips, inputs, status stepper, payment cards, toast notifications, empty state.
3. `📱 Screens` — Empty. Needs: Splash, Menu, Product Detail, Cart, Order Tracking, About, Desktop screens.

## Design System
- **Primary**: Playfair Display Bold (headings) + Inter (body/UI)
- **Brand palette**: Rich red `#C8102E`, charcoal `#1A1A1A`, cream `#F5EDD8`, gold `#D4A853`, wood brown `#8B5E3C`
- **Mobile frame**: 390 × 844 (iPhone 14)
- **Desktop frame**: 1440 × 900

## Continuing This Work
To resume adding screens, the Figma MCP needs the Professional plan (rate limit was hit).
Tool: `mcp__80af6648-1cf8-403d-970c-f07d0f16afb1__use_figma` with `fileKey: MCOSKMGaPVXx9LPRerEA1i`

### Remaining screens to build on `📱 Screens` page:
- **Mobile Screen 1 — Splash** (390×844): dark hero, logo, tagline "Scan, Order & Enjoy", CTA
- **Mobile Screen 2 — Menu** (390×844): top bar, search, category chips, 2-col food card grid
- **Mobile Screen 3 — Product Detail** (390×844): hero image, size selector, toppings, spice, quantity, add to cart
- **Mobile Screen 4 — Cart** (390×844): order list, summary, table chip, payment options, place order
- **Mobile Screen 5 — Order Tracking** (390×844): 4-step vertical stepper, order summary
- **Mobile Screen 6 — About** (390×844): story, gallery, hours, contact, bottom nav
- **Desktop Menu** (1440×900): sidebar nav + 3-col grid + hero banner
- **Desktop Detail** (1440×900): two-column layout
- **Desktop Cart** (1440×900): two-column with sticky summary

### Code pattern for screens page:
```javascript
const sp = figma.root.children[2]; // "📱 Screens" page
await figma.setCurrentPageAsync(sp);
// Then create 390x844 frames for mobile screens
```
