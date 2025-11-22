# Trello Lite - Advanced Kanban Board

A feature-rich, lightweight Kanban board web application built with React, TypeScript, and modern web technologies. Inspired by Trello, enhanced with powerful productivity features.

![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![React](https://img.shields.io/badge/React-18.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.4-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### Core Features
- **Drag & Drop**: Smooth drag-and-drop for cards and columns powered by @dnd-kit
- **Multiple Boards**: Create and manage unlimited boards with easy switching
- **Persistent Storage**: Auto-save to localStorage with intelligent debouncing
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **TypeScript**: Fully typed for better developer experience and fewer bugs

### Advanced Features
- **🎨 Dark Mode**: Toggle between light and dark themes with system preference detection
- **⌨️ Keyboard Shortcuts**: Extensive keyboard shortcuts for power users
- **🔍 Search & Filter**: Search cards and filter by priority
- **↩️ Undo/Redo**: Full history with undo/redo support (up to 50 states)
- **📊 Card Metadata**:
  - Priority levels (High, Medium, Low) with visual indicators
  - Tags/labels for categorization
  - Due dates with overdue highlighting
  - Creation timestamps
- **📤 Export/Import**: Export boards to JSON and import them back
- **🔢 Bulk Operations**: Select multiple cards and perform bulk actions
- **🎯 Smart Filtering**: Filter by search term, tags, and priority
- **✨ Animations**: Smooth animations and transitions with Framer Motion
- **📱 Mobile Optimized**: Touch-friendly interface with responsive design
- **♿ Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **🚨 Error Handling**: Graceful error boundaries and user-friendly error messages
- **🔔 Toast Notifications**: Real-time feedback for all actions

## 🚀 Quick Start

Choose your preferred installation method:

### Option 1: Docker (Recommended) 🐳

**Prerequisites:** Docker and Docker Compose

```bash
# Clone the repository
git clone <repository-url>
cd trello-lite

# Production (recommended)
docker-compose up -d
# Access at http://localhost

# OR Development (with hot-reload)
docker-compose -f docker-compose.dev.yml up -d
# Access at http://localhost:5173
```

**Using Makefile (easier):**
```bash
make up          # Production
make up-dev      # Development
make logs        # View logs
make down        # Stop containers
make help        # See all commands
```

📖 **[Complete Docker Guide →](DOCKER.md)**

### Option 2: Node.js

**Prerequisites:** Node.js 16+ and npm

```bash
# Clone the repository
git clone <repository-url>
cd trello-lite

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production (with TypeScript check)
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run type-check   # Type check without building
npm run test         # Run tests with Vitest
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `?` | Show keyboard shortcuts |
| `N` | Add new card to first column |
| `C` | Add new column |
| `/` | Focus search |
| `D` | Toggle dark mode |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Ctrl+E` | Export board |
| `Ctrl+I` | Import board |
| `Ctrl+K` | Clear filters |
| `Esc` | Close modals / Clear selection |
| `Enter` | Save when editing |

## 🎯 Usage Guide

### Boards

- **Switch Boards**: Click the board switcher dropdown in the header
- **Create Board**: Click "Create new board" in the dropdown
- **Delete Board**: Click the trash icon next to board name (requires confirmation)
- **Rename Board**: Click on the board title to edit inline

### Columns

- **Add Column**: Click the "Add Column" button or press `C`
- **Rename Column**: Click on a column title to edit it inline
- **Delete Column**: Click the trash icon (requires confirmation if it contains cards)
- **Reorder Columns**: Drag column headers to reorder

### Cards

- **Add Card**:
  - Click "Add Card" button at the bottom of any column
  - Or press `N` to add to the first column
- **Edit Card**: Click on a card to open the detail modal
- **Priority**: Set priority level (High/Medium/Low) in the card modal
- **Tags**: Add multiple tags for categorization
- **Due Date**: Set and track due dates (overdue dates highlighted in red)
- **Description**: Add detailed descriptions with multi-line support
- **Delete Card**: Click "Delete" button in the card modal
- **Duplicate Card**: Click "Duplicate" button to create a copy
- **Move Cards**: Drag cards between columns or reorder within a column

### Bulk Operations

1. Select multiple cards using the checkboxes
2. Use the bulk action buttons that appear in the header:
   - **Delete**: Remove all selected cards
   - **Clear**: Clear selection

### Search & Filter

- **Search**: Use the search bar to find cards by title or description
- **Priority Filter**: Filter cards by priority level
- **Clear Filters**: Press `Ctrl+K` or click "Clear"

### Export & Import

- **Export**: Press `Ctrl+E` or click the export icon
- **Import**: Press `Ctrl+I` and select a JSON file
- Exported files include all board data in JSON format

### Undo/Redo

- **Undo**: Press `Ctrl+Z` or click the undo button
- **Redo**: Press `Ctrl+Shift+Z` or click the redo button
- History stores up to 50 states per board

## 🛠️ Tech Stack

### Core
- **React 18.3** - UI framework with functional components and hooks
- **TypeScript 5.5** - Type safety and better DX
- **Vite 5.4** - Lightning-fast build tool and dev server

### UI & Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Framer Motion 11.5** - Smooth animations and transitions
- **React Hot Toast 2.4** - Beautiful toast notifications

### State Management
- **Zustand 4.5** - Lightweight and powerful state management
- Custom hooks for business logic

### Drag & Drop
- **@dnd-kit/core 6.1** - Modern drag-and-drop library
- **@dnd-kit/sortable 8.0** - Sortable items support

### Development Tools
- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Board.tsx       # Main board container
│   ├── Column.tsx      # Column component
│   ├── Card.tsx        # Card component
│   ├── CardModal.tsx   # Card detail modal
│   ├── AddColumnButton.tsx
│   ├── ConfirmDialog.tsx
│   ├── SearchBar.tsx
│   ├── BoardSwitcher.tsx
│   ├── EmptyState.tsx
│   ├── ErrorBoundary.tsx
│   └── KeyboardShortcutsModal.tsx
├── store/              # Zustand stores
│   ├── useBoardStore.ts    # Board state management
│   └── useThemeStore.ts    # Theme state
├── hooks/              # Custom React hooks
│   ├── useKeyboardShortcuts.ts
│   └── useLocalStorage.ts
├── utils/              # Utility functions
│   ├── storage.ts      # LocalStorage helpers
│   └── idGenerator.ts  # ID generation
├── types/              # TypeScript type definitions
│   └── index.ts
├── test/               # Test setup
│   └── setup.ts
├── App.tsx             # Root component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js` to customize colors:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',
      // Add your colors
    },
  },
}
```

### Storage Key

Change the localStorage key in `src/utils/storage.ts`:

```typescript
const BOARDS_STORAGE_KEY = 'your-custom-key';
```

## 🧪 Testing

The project includes a testing setup with Vitest and React Testing Library.

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 📊 Data Model

### TypeScript Interfaces

```typescript
interface Card {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  dueDate?: number;
}

interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

interface Board {
  id: string;
  title: string;
  columnOrder: string[];
}

interface AppState {
  board: Board;
  columns: { [columnId: string]: Column };
  cards: { [cardId: string]: Card };
}
```

## 🔒 Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## 🐛 Troubleshooting

### LocalStorage Full

If you see "Storage quota exceeded":
1. Clear browser data for this site
2. Export important boards before clearing
3. Consider reducing the number of boards/cards

### Import Fails

- Ensure the JSON file is from a Trello Lite export
- Check that the file is valid JSON
- Verify the file structure matches the expected format

### Dark Mode Not Working

- Clear browser cache
- Check system preferences
- Toggle dark mode manually with the `D` key or theme button

## 🚀 Performance Optimization

- **Lazy Loading**: Modal components load on demand
- **Memoization**: Cards and columns use React.memo
- **Debouncing**: LocalStorage writes are debounced (300ms)
- **Virtual Scrolling**: Not implemented (suitable for <100 cards per column)

## 🔮 Future Enhancements

Potential features for future versions:
- Real-time collaboration with WebSockets
- Backend synchronization
- Card attachments and images
- Comments and activity log
- Card assignments and user management
- Board templates
- Calendar view
- Reports and analytics
- Mobile apps (React Native)
- Browser extension

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Inspired by [Trello](https://trello.com)
- Built with [React](https://react.dev)
- Drag and drop by [@dnd-kit](https://dndkit.com)
- Icons from [Heroicons](https://heroicons.com)

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
