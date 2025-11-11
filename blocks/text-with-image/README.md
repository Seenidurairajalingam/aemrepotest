# Text with Image Component

A versatile component that displays text and image content in 5 different layout variations, optimized for responsive design.

## Variations

### 1. Overlay Right (Default)
- **Usage**: No additional class needed (default behavior)
- **Description**: Text overlays the image on the right side with a semi-transparent background
- **Best for**: Hero sections, promotional content

### 2. Overlay Left
- **Usage**: Add `overlay-left` class to the block
- **Description**: Text overlays the image on the left side with a semi-transparent background
- **Best for**: Alternative hero layouts, visual balance

### 3. Side by Side - Text Left
- **Usage**: Add `side-by-side-left` class to the block
- **Description**: Text appears on the left, image on the right in a 50/50 split
- **Best for**: Feature explanations, product descriptions

### 4. Side by Side - Text Right
- **Usage**: Add `side-by-side-right` class to the block
- **Description**: Image appears on the left, text on the right in a 50/50 split
- **Best for**: Testimonials, case studies

### 5. Text Below
- **Usage**: Add `text-below` class to the block
- **Description**: Image on top, text centered below
- **Best for**: Article headers, blog posts

## Authoring

The component accepts three content areas in the Universal Editor:

1. **Layout Variation**: Dropdown selector to choose the layout style:
   - Overlay Right (default)
   - Overlay Left
   - Side by Side - Text Left
   - Side by Side - Text Right
   - Text Below Image

2. **Background Image**: Upload an image or provide an image reference

3. **Text Content**: Rich text content including title, description, and optional CTA link

### Legacy Support

The component also supports CSS class-based variation selection for backward compatibility:
- Add `overlay-left`, `side-by-side-left`, `side-by-side-right`, or `text-below` class to the block

## Responsive Behavior

- **Desktop**: Shows the specified variation layout
- **Tablet**: Maintains variation with adjusted spacing
- **Mobile**: All variations stack vertically (image on top, text below) for optimal mobile experience

## Technical Implementation

- **JavaScript**: `/blocks/text-with-image/text-with-image.js`
- **CSS**: `/blocks/text-with-image/text-with-image.css`
- **Component Model**: Registered in `component-models.json`

## Usage Examples

```html
<!-- Using Universal Editor (Recommended) -->
<!-- Authors select variation through dropdown in Universal Editor -->
<div class="text-with-image">
  <div>overlay-left</div> <!-- Variation selection -->
  <div><!-- image content --></div>
  <div><!-- text content --></div>
</div>

<!-- Legacy CSS Class Method -->
<!-- Overlay Right (Default) -->
<div class="text-with-image">
  <div><!-- image content --></div>
  <div><!-- text content --></div>
</div>

<!-- Overlay Left -->
<div class="text-with-image overlay-left">
  <div><!-- image content --></div>
  <div><!-- text content --></div>
</div>

<!-- Side by Side - Text Left -->
<div class="text-with-image side-by-side-left">
  <div><!-- image content --></div>
  <div><!-- text content --></div>
</div>

<!-- Side by Side - Text Right -->
<div class="text-with-image side-by-side-right">
  <div><!-- image content --></div>
  <div><!-- text content --></div>
</div>

<!-- Text Below -->
<div class="text-with-image text-below">
  <div><!-- image content --></div>
  <div><!-- text content --></div>
</div>
```

## Features

- ✅ 5 distinct layout variations
- ✅ Fully responsive design
- ✅ Universal Editor compatible
- ✅ Backdrop blur effects for overlays
- ✅ Semantic HTML structure
- ✅ Accessible markup
- ✅ Smooth transitions and hover effects