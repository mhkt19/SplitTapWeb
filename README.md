# SplitTapWeb

A mobile-friendly web version of the SplitTap Android app, focused on core features:

- Join Table: Users can join a table by entering a table number. The app checks Firestore (Firebase) to ensure the table exists, matching the Android app's logic.
- Order Tab: After joining, users can view the menu for the corresponding bar, search items, and place orders. Orders are saved to Firestore under the correct bar/table, with all fields and references matching the mobile app.
- Drink Icon: Menu items of type "Drink" display a drink icon for visual clarity.
- Mobile-First UI: The web app is designed to closely match the mobile app's user experience and layout.

## Tech Stack
- React (frontend)
- Firebase Firestore (backend)
- Node.js, npm (project setup)

## Project Structure
- `/src/JoinTable.js` — Handles joining tables and validating table numbers against Firestore.
- `/src/OrderTab.js` — Displays menu items, search, ordering, and saves orders to Firestore. Now creates order documents with Firestore references for menuItemId, tableRef, and userId, matching the mobile app.
- `/src/UserPage.js` — Main user page with tabbed navigation (Order, MyOrders).
- `/src/firebase.js` — Firebase/Firestore configuration and initialization.
- `/COPILOT_INSTRUCTIONS.md` — Custom Copilot instructions for code and UI consistency.

## Setup & Development
1. Clone this repository:
   ```sh
   git clone https://github.com/yourusername/SplitTapWeb.git
   cd SplitTapWeb
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Configure Firebase:
   - Register a web app in your Firebase project.
   - Copy your Firebase config to `/src/firebase.js`.
   - Ensure Firestore is enabled and rules allow read/write for development.

## Features Implemented
- Join Table: Validates table number by searching all bars/tables in Firestore.
- Order Tab: Fetches menu items for the joined bar, allows search, ordering, and saves orders to Firestore with all required references.
- Drink Icon: Shows a drink icon for menu items of type "Drink".
- Mobile-friendly UI: Layout and logic closely match the Android app.

## To Do
- Implement MyOrders tab to show user's orders.
- Further UI/UX refinements as needed.

## License
MIT
