# Design System - Graph LLM Query System

## Color System

### Primary Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Indigo | #6366f1 | Primary buttons, links, headers |
| Indigo Dark | #4f46e5 | Hover states |
| Pink | #ec4899 | Accents, highlights |

### Semantic Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Green | #10b981 | Success states |
| Amber | #f59e0b | Warnings |
| Red | #ef4444 | Errors |

### Neutrals
| Name | Light | Dark |
|------|-------|------|
| Background | #ffffff | #0f172a |
| Secondary | #f8fafc | #1e293b |
| Tertiary | #f1f5f9 | #334155 |
| Text Primary | #1e293b | #f1f5f9 |
| Text Secondary | #64748b | #cbd5e1 |
| Border | #e2e8f0 | #334155 |

## Typography

### Font Family
- **Sans Serif**: System fonts (Segoe UI, Roboto)
- **Monospace**: Fira Code / Courier New

### Sizes & Scales
```
xs:  12px (0.75rem)
sm:  14px (0.875rem)
base: 16px (1rem)
lg:  18px (1.125rem)
xl:  20px (1.25rem)
2xl: 24px (1.5rem)
```

### Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Spacing Scale

```
xs:   4px (0.25rem)
sm:   8px (0.5rem)
md:   16px (1rem)
lg:   24px (1.5rem)
xl:   32px (2rem)
2xl:  48px (3rem)
```

## Border Radius

```
sm:  6px (0.375rem)
md:  8px (0.5rem)
lg:  12px (0.75rem)
xl:  16px (1rem)
```

## Shadows

### Shadow Levels
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1)
--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1)
--shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1)
```

## Transitions

```css
--transition-fast: 150ms ease-in-out
--transition-base: 200ms ease-in-out
--transition-slow: 300ms ease-in-out
```

## Component Examples

### Button States

**Primary Button**
```
Default: Gradient background, white text
Hover: Elevated with shadow, slight lift
Active: No lift transform
Disabled: 70% opacity
```

**Input Field**
```
Default: Border color #e2e8f0
Hover: Primary highlight
Focus: Border #6366f1, shadow with primary tint
Error: Red border
```

### Card Styles

**Standard Card**
```
Background: var(--bg-secondary)
Border: 1px solid var(--border)
Shadow: var(--shadow-sm)
Radius: var(--radius-lg)
```

### Node Styling (Graph)

**Node States**
- Default: Card with shadow
- Hover: Lift transform, enhanced shadow
- Selected: Pink border, glow effect

**Node Types**
- Customer: Gold gradient
- Order: Blue gradient
- Delivery: Red gradient
- Billing: Green gradient
- Payment: Purple gradient

## Layout Patterns

### Main Layout (Home)
```
Left Panel (30%):   Chat
Center (50%):       Graph
Right Panel (20%):  Node Details

Responsive:
- 1200px: Adjust widths (35%-40%-25%)
- 1024px: Stack vertically
```

### Form Pattern
```
Flex container with gap-md
Input and button in row
Responsive: Stack on mobile
```

### Card Grid
```
Flex column layout
gap-md between cards
Cards with border + shadow
Hover: Enhanced shadow
```

## Animation Guidelines

### Entrance
- Duration: 200ms
- Timing: ease-out
- Properties: opacity, transform

### Interaction
- Duration: 150-200ms
- Timing: ease-in-out
- Properties: background, border, transform

### Loading
- Duration: 20s infinite
- Timing: linear
- Properties: stroke-dashoffset

## Accessibility

### Contrast
- Text on background: 4.5:1 minimum
- UI components: 3:1 minimum
- All colors work in grayscale

### Focus States
- 2px outline
- Primary color (#6366f1)
- 2px offset

### Motion
- Respects `prefers-reduced-motion`
- Smooth transitions (not instant)

## Dark Mode

Automatically activated via:
```css
@media (prefers-color-scheme: dark)
```

All semantic colors have dark variants defined in CSS variables.

## Usage Examples

### Creating a New Component with Design Tokens

```jsx
const Component = () => (
  <div className="component">
    <h2 className="component-title">Title</h2>
    <p>Content</p>
    <button>Action</button>
  </div>
);
```

```css
.component {
  padding: var(--space-lg);
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.component-title {
  color: var(--text-primary);
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-md);
}

.component button {
  background: var(--primary);
  color: white;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.component button:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

## Best Practices

1. **Use CSS Variables**: Never hardcode colors/spacing
2. **Responsive First**: Mobile-first media queries
3. **Consistent Spacing**: Use the scale, never arbitrary values
4. **Semantic Names**: Use intention-based classes
5. **Dark Mode**: Test all colors in both modes
6. **Accessibility**: Always include focus states
7. **Transitions**: Keep consistent timing

## Maintenance

- Review color contrast quarterly
- Update shadows when depth hierarchy changes
- Monitor performance of animations
- Test dark mode in all browsers
- Validate accessibility standards (WCAG 2.1 AA)
