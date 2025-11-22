# Trello Lite - Kanban Board

A lightweight, drag-and-drop Kanban board web application built with React, inspired by Trello.

## Features

- **Drag & Drop**: Intuitive drag-and-drop functionality for cards and columns
- **Column Management**: Add, edit, rename, and delete columns
- **Card Management**: Create, edit, and delete cards with titles and descriptions
- **Persistent Storage**: All data automatically saved to browser localStorage
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Clean UI**: Modern interface built with Tailwind CSS

## Tech Stack

- **React 18+** - UI framework with functional components and hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **@dnd-kit** - Modern drag-and-drop library
- **localStorage** - Browser-based data persistence

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trello-lite
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

### Board

- Click on the board title to rename it

### Columns

- **Add Column**: Click the "Add Column" button at the end of the column list
- **Rename Column**: Click on a column title to edit it inline
- **Delete Column**: Click the trash icon in the column header (requires confirmation if column contains cards)
- **Reorder Columns**: Drag column headers to reorder them

### Cards

- **Add Card**: Click the "Add Card" button at the bottom of any column
- **View/Edit Card**: Click on a card to open the detail modal
- **Edit Title & Description**: Update card details in the modal (auto-saves on blur)
- **Delete Card**: Click "Delete Card" button in the modal
- **Move Cards**: Drag cards between columns or reorder within a column

### Keyboard Shortcuts

- **Enter**: Save when editing (Shift+Enter for newline in card textarea)
- **Escape**: Cancel editing or close modals
- **Click backdrop**: Close modals

## Data Storage

All board data is automatically saved to browser localStorage with a 300ms debounce. Data persists across page refreshes. To reset the board, clear your browser's localStorage for this site.

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Project Structure

```
src/
├── components/
│   ├── Board.jsx           # Main board container with drag & drop
│   ├── Column.jsx          # Column component
│   ├── Card.jsx            # Card component
│   ├── CardModal.jsx       # Card detail modal
│   ├── AddColumnButton.jsx # Add column button
│   └── ConfirmDialog.jsx   # Confirmation dialog
├── hooks/
│   ├── useLocalStorage.js  # localStorage hook
│   └── useBoardData.js     # Board state management hook
├── utils/
│   ├── storage.js          # Storage helpers
│   └── idGenerator.js      # ID generation
├── App.jsx                 # Root component
├── main.jsx                # Entry point
└── index.css               # Global styles
```

## Development

The application uses:
- React hooks for state management (`useState`, `useEffect`, `useReducer`)
- Custom hooks for localStorage and board state
- @dnd-kit for drag-and-drop functionality
- Tailwind CSS for styling

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
