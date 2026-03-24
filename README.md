# Kanban Board

A React + TypeScript Kanban board application with drag & drop functionality, multi-select support, and localStorage persistence.

## Features

- **Three columns**: To Do, In Progress, Done
- **Card management**: Create, edit (inline), and delete cards
- **Drag & Drop**: Move cards between columns with positioning indicators
- **Multi-select**: Select multiple cards with Shift+click and drag them together
- **Persistence**: Data saved to localStorage and restored on reload
- **Modern UI**: Clean, responsive design with hover effects and transitions

## How to Run

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
cd kanban-board
npm install
```

### Development
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build
```bash
npm run build
```
Builds the app for production to the `build` folder.

## Technical Decisions

### Technology Stack
- **React 18** with TypeScript for type safety
- **@dnd-kit** for drag & drop functionality (chosen over react-beautiful-dnd for better TypeScript support and active maintenance)
- **CSS** for styling (no CSS framework to keep dependencies minimal)
- **localStorage** for data persistence (simple, no backend required)

### Architecture
- **Component-based structure**: Separate components for Card, Column, and AddCardForm
- **TypeScript interfaces**: Strong typing for Card, Column, and BoardState
- **Custom hooks**: Not used to keep the implementation simple for this test
- **State management**: React useState (no Redux/Context needed for this scale)

### Drag & Drop Implementation
- Used @dnd-kit for its modern API and excellent TypeScript support
- Implemented visual feedback with hover states and drag previews
- Added positioning indicators through CSS transitions
- Multi-card drag functionality preserves card order

### UI/UX Choices
- Modern, clean design inspired by GitHub's interface
- Subtle animations and transitions for better user experience
- Clear visual feedback for selected cards and drag states
- Responsive layout that works on different screen sizes
- Color scheme using blues and grays for professional appearance

## AI Usage

### What AI Helped With
- Initial project setup and dependency installation
- TypeScript type definitions and interfaces
- Component structure and boilerplate code
- CSS styling and responsive design
- Drag & drop implementation with @dnd-kit

### What Required Manual Adjustments
- Fine-tuning the drag & drop logic for multi-select functionality
- Adjusting CSS for proper visual feedback and hover states
- Fixing TypeScript type compatibility issues
- Testing and debugging the multi-card selection behavior
- Optimizing the localStorage persistence logic

### Challenges Resolved Manually
1. **Multi-select range selection**: Had to implement proper Shift+click behavior with range calculation
2. **Drag positioning**: Required manual adjustment of drop zones and visual indicators
3. **Type compatibility**: Fixed several TypeScript interface mismatches between components
4. **CSS specificity**: Had to override default Create React App styles properly

## Deployment

### Vercel (Recommended)
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Vercel will automatically detect it's a React app and deploy

### Netlify
1. Run `npm run build`
2. Upload the `build` folder to Netlify
3. Or connect GitHub repository for automatic deployment

### GitHub Pages
```bash
npm install gh-pages --save-dev
```
Add to `package.json`:
```json
"homepage": "https://[username].github.io/[repository-name]",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```
Then run:
```bash
npm run deploy
```

## Browser Support
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Improvements
- Add keyboard shortcuts for power users
- Implement card templates for quick creation
- Add search/filter functionality
- Include card metadata (due dates, assignees, tags)
- Add export/import functionality for board data
