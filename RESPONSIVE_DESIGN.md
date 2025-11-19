# Responsive Design Guide

## Overview
This project uses a mobile-first responsive design approach with Tailwind CSS breakpoints. All components are optimized for mobile, tablet, and desktop screens.

## Tailwind Breakpoints

| Breakpoint | Min Width | Usage |
|-----------|-----------|-------|
| `xs` | 0px | Mobile (default) |
| `sm` | 640px | Small devices (landscape phones) |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktops |
| `xl` | 1280px | Large desktops |
| `2xl` | 1536px | Extra large screens |

## Mobile-First Approach

Always start with mobile styles, then add responsive modifiers:

```tsx
// ✅ CORRECT - Mobile first
<div className="text-sm sm:text-base md:text-lg lg:text-xl">
  Responsive text
</div>

// ❌ WRONG - Desktop first
<div className="text-xl lg:text-lg md:text-base sm:text-sm">
  Responsive text
</div>
```

## Common Responsive Patterns

### 1. Spacing
```tsx
// Responsive padding
<div className="px-3 sm:px-4 lg:px-6">
  Content
</div>

// Responsive gap
<div className="gap-2 sm:gap-3 lg:gap-4">
  Items
</div>
```

### 2. Grid Layouts
```tsx
// 1 column on mobile, 2 on tablet, 4 on desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {items.map(item => <Card key={item.id}>{item}</Card>)}
</div>
```

### 3. Flex Layouts
```tsx
// Stack on mobile, row on tablet+
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### 4. Typography
```tsx
// Responsive text sizes
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
  Heading
</h1>

<p className="text-xs sm:text-sm md:text-base">
  Body text
</p>
```

### 5. Display Utilities
```tsx
// Hide on mobile, show on tablet+
<div className="hidden sm:block">
  Desktop only content
</div>

// Show on mobile, hide on tablet+
<div className="block sm:hidden">
  Mobile only content
</div>
```

## Responsive Components

### ResponsiveContainer
Wraps content with responsive max-width and padding:

```tsx
<ResponsiveContainer maxWidth="lg" padding="md">
  <h1>Page Title</h1>
</ResponsiveContainer>
```

### ResponsiveGrid
Creates responsive grid layouts:

```tsx
<ResponsiveGrid columns={4} gap="md">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
  <Card>Item 4</Card>
</ResponsiveGrid>
```

### ResponsiveFlex
Creates responsive flex layouts:

```tsx
<ResponsiveFlex 
  direction="col" 
  justify="between" 
  align="center" 
  gap="md"
  responsive={true}
>
  <div>Left</div>
  <div>Right</div>
</ResponsiveFlex>
```

### ResponsiveStack
Creates vertical stacks with responsive gaps:

```tsx
<ResponsiveStack gap="lg">
  <Header />
  <Content />
  <Footer />
</ResponsiveStack>
```

### ResponsiveHeader
Creates responsive page headers:

```tsx
<ResponsiveHeader
  title="Page Title"
  subtitle="Page description"
  action={<Button>Action</Button>}
/>
```

## Best Practices

### 1. Always Test on Mobile First
- Start development on mobile view
- Progressively enhance for larger screens
- Use browser DevTools to test different breakpoints

### 2. Use Semantic Breakpoints
```tsx
// ✅ GOOD - Clear intent
<div className="hidden md:block">
  Desktop navigation
</div>

// ❌ AVOID - Unclear
<div className="hidden lg:block">
  Desktop navigation
</div>
```

### 3. Avoid Excessive Breakpoints
```tsx
// ✅ GOOD - Minimal breakpoints
<div className="text-sm sm:text-base lg:text-lg">
  Text
</div>

// ❌ AVOID - Too many breakpoints
<div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
  Text
</div>
```

### 4. Use Responsive Utilities
```tsx
// ✅ GOOD - Use utility classes
<div className="flex flex-col sm:flex-row gap-4">
  Items
</div>

// ❌ AVOID - Custom media queries
<div style={{ display: 'flex', flexDirection: 'column' }}>
  Items
</div>
```

### 5. Optimize Images
```tsx
// ✅ GOOD - Responsive images
<img 
  src="image.jpg" 
  alt="Description"
  className="w-full h-auto"
/>

// ❌ AVOID - Fixed sizes
<img 
  src="image.jpg" 
  alt="Description"
  width="1200"
  height="600"
/>
```

## Common Responsive Patterns

### Header with Responsive Navigation
```tsx
<header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  <h1 className="text-2xl sm:text-3xl">Title</h1>
  <nav className="flex gap-2">
    <Button>Nav 1</Button>
    <Button>Nav 2</Button>
  </nav>
</header>
```

### Card Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <Card key={item.id}>
      <CardContent>{item.content}</CardContent>
    </Card>
  ))}
</div>
```

### Sidebar Layout
```tsx
<div className="flex flex-col lg:flex-row gap-4">
  <aside className="w-full lg:w-64">
    <Sidebar />
  </aside>
  <main className="flex-1">
    <Content />
  </main>
</div>
```

### Modal/Dialog
```tsx
<div className="fixed inset-0 flex items-center justify-center p-4">
  <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl">
    <Dialog>
      <DialogContent>
        Content
      </DialogContent>
    </Dialog>
  </div>
</div>
```

## Performance Tips

1. **Minimize CSS**: Use Tailwind's purge feature
2. **Lazy Load Images**: Use `loading="lazy"` attribute
3. **Optimize Fonts**: Use system fonts or subset web fonts
4. **Reduce Motion**: Respect `prefers-reduced-motion`
5. **Test Performance**: Use Lighthouse and WebPageTest

## Accessibility

1. **Touch Targets**: Minimum 44x44px on mobile
2. **Font Sizes**: Minimum 16px for body text
3. **Color Contrast**: WCAG AA standard (4.5:1)
4. **Semantic HTML**: Use proper heading hierarchy
5. **ARIA Labels**: Add for screen readers

## Testing Checklist

- [ ] Mobile (320px - 640px)
- [ ] Tablet (640px - 1024px)
- [ ] Desktop (1024px+)
- [ ] Touch interactions
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Performance on slow networks
- [ ] Dark mode support

## Resources

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Mobile-First Responsive Design](https://www.nngroup.com/articles/mobile-first-responsive-web-design/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Vitals](https://web.dev/vitals/)
