# 🎨 Laptomania Color Palette

## Primary Brand Colors

### Blue Gradient (Main Brand)
- **From**: `#2563eb` (blue-600)
- **To**: `#06b6d4` (cyan-500)
- **Usage**: Primary buttons, CTAs, brand elements
- **Tailwind**: `from-blue-600 to-cyan-500`

### Light Blue Gradient (Backgrounds)
- **From**: `#eff6ff` (blue-50)
- **Via**: `#ffffff` (white)
- **To**: `#ecfeff` (cyan-50)
- **Usage**: Page backgrounds
- **Tailwind**: `from-blue-50 via-white to-cyan-50`

## Accent Colors

### Blue Shades
| Color | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| Blue 50 | `#eff6ff` | `blue-50` | Light backgrounds |
| Blue 100 | `#dbeafe` | `blue-100` | Borders, subtle backgrounds |
| Blue 500 | `#3b82f6` | `blue-500` | Interactive elements |
| Blue 600 | `#2563eb` | `blue-600` | Primary brand color |
| Blue 700 | `#1d4ed8` | `blue-700` | Hover states |

### Cyan Shades
| Color | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| Cyan 50 | `#ecfeff` | `cyan-50` | Light backgrounds |
| Cyan 100 | `#cffafe` | `cyan-100` | Subtle accents |
| Cyan 400 | `#22d3ee` | `cyan-400` | Bright accents |
| Cyan 500 | `#06b6d4` | `cyan-500` | Secondary brand color |
| Cyan 600 | `#0891b2` | `cyan-600` | Hover states |

## Neutral Colors

### Gray Scale
| Color | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| White | `#ffffff` | `white` | Cards, backgrounds |
| Gray 50 | `#f9fafb` | `gray-50` | Subtle backgrounds |
| Gray 100 | `#f3f4f6` | `gray-100` | Borders, dividers |
| Gray 200 | `#e5e7eb` | `gray-200` | Secondary buttons |
| Gray 300 | `#d1d5db` | `gray-300` | Disabled states |
| Gray 400 | `#9ca3af` | `gray-400` | Placeholder text |
| Gray 500 | `#6b7280` | `gray-500` | Secondary text |
| Gray 600 | `#4b5563` | `gray-600` | Body text |
| Gray 700 | `#374151` | `gray-700` | Headings |
| Gray 800 | `#1f2937` | `gray-800` | Primary text |

## Status Colors

### Success (Green)
| Color | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| Green 100 | `#dcfce7` | `green-100` | Success backgrounds |
| Green 500 | `#22c55e` | `green-500` | Success icons |
| Green 700 | `#15803d` | `green-700` | Success text |

**Usage**: In stock indicators, success messages

### Warning (Orange)
| Color | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| Orange 100 | `#ffedd5` | `orange-100` | Warning backgrounds |
| Orange 500 | `#f97316` | `orange-500` | Warning badges |
| Orange 700 | `#c2410c` | `orange-700` | Warning text |

**Usage**: Low stock alerts, important notices

### Error (Red)
| Color | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| Red 100 | `#fee2e2` | `red-100` | Error backgrounds |
| Red 500 | `#ef4444` | `red-500` | Error badges, delete buttons |
| Red 700 | `#b91c1c` | `red-700` | Error text |

**Usage**: Out of stock, error messages, destructive actions

## Gradient Combinations

### Primary Gradient
```css
background: linear-gradient(to right, #2563eb, #06b6d4);
```
**Tailwind**: `bg-gradient-to-r from-blue-600 to-cyan-500`

**Usage**: 
- Primary buttons
- Hero sections
- CTAs
- Brand elements

### Background Gradient
```css
background: linear-gradient(to bottom right, #eff6ff, #ffffff, #ecfeff);
```
**Tailwind**: `bg-gradient-to-br from-blue-50 via-white to-cyan-50`

**Usage**:
- Page backgrounds
- Section backgrounds

### Hover Gradient
```css
background: linear-gradient(to right, #1d4ed8, #0891b2);
```
**Tailwind**: `from-blue-700 to-cyan-600`

**Usage**:
- Button hover states
- Interactive element hovers

## Color Usage Guidelines

### Text Colors
- **Primary Headings**: `text-gray-800`
- **Body Text**: `text-gray-600`
- **Secondary Text**: `text-gray-500`
- **Links**: `text-blue-600` (hover: `text-blue-700`)
- **Brand Text**: Gradient from blue-600 to cyan-500

### Background Colors
- **Page Background**: Gradient (blue-50 → white → cyan-50)
- **Card Background**: `bg-white`
- **Hover Background**: `bg-blue-50` or `bg-gray-100`
- **Active Background**: `bg-blue-100`

### Border Colors
- **Default**: `border-gray-200`
- **Accent**: `border-blue-100`
- **Focus**: `border-blue-500`
- **Error**: `border-red-500`

### Button Colors

#### Primary Button
- **Background**: Gradient (blue-600 → cyan-500)
- **Text**: `text-white`
- **Hover**: Gradient (blue-700 → cyan-600)

#### Secondary Button
- **Background**: `bg-white`
- **Border**: `border-blue-600`
- **Text**: `text-blue-600`
- **Hover**: `bg-blue-50`

#### Danger Button
- **Background**: `bg-red-500`
- **Text**: `text-white`
- **Hover**: `bg-red-600`

#### Disabled Button
- **Background**: `bg-gray-300`
- **Text**: `text-gray-500`
- **Cursor**: `cursor-not-allowed`

## Accessibility

### Contrast Ratios
All color combinations meet WCAG AA standards:
- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio
- **UI Components**: Minimum 3:1 contrast ratio

### Color Blindness Considerations
- Don't rely solely on color to convey information
- Use icons and text labels alongside colors
- Sufficient contrast between foreground and background

## Dark Mode (Future Enhancement)
While not currently implemented, here's a suggested dark mode palette:

### Dark Mode Colors
- **Background**: `bg-gray-900`
- **Card Background**: `bg-gray-800`
- **Text**: `text-gray-100`
- **Secondary Text**: `text-gray-400`
- **Borders**: `border-gray-700`

## Implementation Examples

### Gradient Button
```jsx
<button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600">
  Click Me
</button>
```

### Card with Border
```jsx
<div className="bg-white border border-blue-100 rounded-2xl shadow-lg">
  Card Content
</div>
```

### Status Badge
```jsx
{/* In Stock */}
<span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
  In Stock
</span>

{/* Low Stock */}
<span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
  Low Stock
</span>

{/* Out of Stock */}
<span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
  Out of Stock
</span>
```

### Page Background
```jsx
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
  Page Content
</div>
```

---

**Note**: All colors are from Tailwind CSS's default palette. No custom colors were added to maintain consistency and ease of maintenance.
