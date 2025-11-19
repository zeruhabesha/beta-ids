# Responsive Design - Quick Reference

## Breakpoints at a Glance

| Class | Min Width | Use Case |
|-------|-----------|----------|
| (none) | 0px | Mobile (default) |
| `sm:` | 640px | Landscape phones |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Desktops |
| `xl:` | 1280px | Large desktops |
| `2xl:` | 1536px | Extra large |

## Copy-Paste Patterns

### Responsive Header
```tsx
<div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
  <div className="space-y-1">
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Title</h1>
    <p className="text-xs sm:text-sm text-muted-foreground">Subtitle</p>
  </div>
  <div className="flex flex-wrap gap-2">
    <Button>Action 1</Button>
    <Button>Action 2</Button>
  </div>
</div>
```

### Responsive Grid (4 columns)
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
  <Card>Item 4</Card>
</div>
```

### Responsive Grid (3 columns)
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</div>
```

### Responsive Flex (Stack on mobile, row on desktop)
```tsx
<div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
  <div>Left content</div>
  <div>Right content</div>
</div>
```

### Responsive Card
```tsx
<Card className="p-3 sm:p-4 lg:p-6">
  <CardContent className="space-y-2 sm:space-y-3 lg:space-y-4">
    <h3 className="text-base sm:text-lg font-semibold">Title</h3>
    <p className="text-xs sm:text-sm text-muted-foreground">Description</p>
  </CardContent>
</Card>
```

### Responsive Button Group
```tsx
<div className="flex flex-wrap gap-2">
  <Button size="sm" className="text-xs sm:text-sm">
    <Icon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
    Button 1
  </Button>
  <Button size="sm" className="text-xs sm:text-sm">
    <Icon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
    Button 2
  </Button>
</div>
```

### Responsive Table
```tsx
<div className="overflow-x-auto">
  <table className="w-full text-xs sm:text-sm">
    <thead>
      <tr className="border-b">
        <th className="px-2 sm:px-4 py-2 text-left">Column 1</th>
        <th className="px-2 sm:px-4 py-2 text-left">Column 2</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b">
        <td className="px-2 sm:px-4 py-2">Data 1</td>
        <td className="px-2 sm:px-4 py-2">Data 2</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Responsive Modal
```tsx
<div className="fixed inset-0 flex items-center justify-center p-3 sm:p-4">
  <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-background rounded-lg shadow-lg p-4 sm:p-6">
    <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Title</h2>
    <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">Content</p>
    <div className="flex gap-2 justify-end">
      <Button variant="outline" size="sm">Cancel</Button>
      <Button size="sm">Confirm</Button>
    </div>
  </div>
</div>
```

## Responsive Typography

```tsx
// Headings
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">H1</h1>
<h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">H2</h2>
<h3 className="text-lg sm:text-xl lg:text-2xl font-bold">H3</h3>

// Body text
<p className="text-xs sm:text-sm md:text-base">Body text</p>

// Small text
<span className="text-xs sm:text-xs">Small text</span>
```

## Responsive Spacing

```tsx
// Padding
<div className="p-2 sm:p-3 lg:p-4">Content</div>
<div className="px-3 sm:px-4 lg:px-6">Horizontal padding</div>
<div className="py-2 sm:py-3 lg:py-4">Vertical padding</div>

// Margin
<div className="m-2 sm:m-3 lg:m-4">Content</div>
<div className="mb-2 sm:mb-3 lg:mb-4">Bottom margin</div>

// Gap
<div className="gap-2 sm:gap-3 lg:gap-4">Items</div>
```

## Responsive Display

```tsx
// Hide on mobile, show on tablet+
<div className="hidden sm:block">Desktop content</div>

// Show on mobile, hide on tablet+
<div className="block sm:hidden">Mobile content</div>

// Hide on mobile, show on desktop
<div className="hidden lg:block">Desktop only</div>

// Show on mobile and tablet, hide on desktop
<div className="lg:hidden">Mobile and tablet</div>
```

## Responsive Icons

```tsx
// Icon sizes
<Icon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />

// In buttons
<Button>
  <Icon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
  <span className="text-xs sm:text-sm">Button</span>
</Button>
```

## Common Mistakes to Avoid

❌ **DON'T** - Desktop first
```tsx
<div className="text-lg md:text-base sm:text-sm">Text</div>
```

✅ **DO** - Mobile first
```tsx
<div className="text-sm sm:text-base md:text-lg">Text</div>
```

---

❌ **DON'T** - Too many breakpoints
```tsx
<div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">Text</div>
```

✅ **DO** - Minimal breakpoints
```tsx
<div className="text-sm sm:text-base lg:text-lg">Text</div>
```

---

❌ **DON'T** - Fixed sizes
```tsx
<div className="w-1200 h-600">Content</div>
```

✅ **DO** - Responsive sizes
```tsx
<div className="w-full max-w-4xl h-auto">Content</div>
```

---

❌ **DON'T** - Hardcoded breakpoints
```tsx
@media (max-width: 768px) {
  /* styles */
}
```

✅ **DO** - Use Tailwind breakpoints
```tsx
<div className="hidden md:block">Content</div>
```

## Testing Checklist

- [ ] Mobile (320px)
- [ ] Mobile landscape (568px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px)
- [ ] Large desktop (1280px)
- [ ] Touch interactions work
- [ ] Text is readable
- [ ] Images scale properly
- [ ] No horizontal scrolling
- [ ] Buttons are clickable (44x44px minimum)

## Useful DevTools Tips

1. **Toggle device toolbar**: `Ctrl+Shift+M` (Windows) or `Cmd+Shift+M` (Mac)
2. **Responsive mode**: Click device dropdown to select specific devices
3. **Throttle network**: Simulate slow connections
4. **Inspect element**: Right-click → Inspect to see applied styles
5. **Edit CSS**: Double-click values in DevTools to test changes

## Resources

- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
