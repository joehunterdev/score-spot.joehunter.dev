# SpotScore

A micro React app to help you score and compare apartments based on customizable criteria. Features local storage persistence and the ability to mark criteria as critical (weighted 2x in scoring).

## Features

- ✅ **Add Multiple Apartments** - Track as many apartment options as you need
- ✅ **Customizable Criteria** - Start with 14 default criteria or add your own
- ✅ **Critical Items** - Mark important criteria as critical (weighted 2x)
- ✅ **Visual Scoring** - Use sliders to score each criterion from 0-10
- ✅ **Overall Score** - Automatically calculated percentage score for each apartment
- ✅ **Local Storage** - All data persists in your browser
- ✅ **Responsive Design** - Works on desktop and mobile

## Default Criteria

The app comes with these pre-configured criteria (4 marked as critical):

- Rent Price ⭐
- Location/Commute ⭐
- Square Footage
- Natural Light
- Kitchen Quality
- Bathroom Quality
- Storage Space
- Parking Available
- Pet Friendly
- Laundry In-Unit
- Noise Level ⭐
- Safety/Security ⭐
- Nearby Amenities
- Public Transit Access

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## Usage

### Managing Criteria

1. **Toggle Critical Status**: Click the checkbox next to any criterion to mark it as critical (⭐)
2. **Add New Criterion**: Enter a name in the input field, optionally check "Critical", and click "Add Criterion"
3. **Delete Criterion**: Click the × button next to any criterion to remove it

### Managing Apartments

1. **Add Apartment**: Enter the apartment name/address and click "Add Apartment"
2. **Score Criteria**: Use the sliders to rate each criterion from 0-10 for each apartment
3. **View Overall Score**: The percentage score is automatically calculated (critical items count 2x)
4. **Delete Apartment**: Click the × button in the apartment card header

### Data Persistence

All your data (criteria and apartments) is automatically saved to your browser's local storage. Your data will persist even if you close and reopen the app.

### Reset Data

Click the "Reset All Data" button to clear all apartments and restore the default criteria. This action cannot be undone.

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## Preview Production Build

```bash
npm run preview
```

## Technologies Used

- React 18
- Vite
- CSS3 (Grid & Flexbox)
- Local Storage API

## License

MIT
