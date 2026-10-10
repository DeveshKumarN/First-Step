First Step
##Game concept
First Step is an educational homebuying mini-game that teaches first-time homebuyers why inspecting a property and understanding its condition matters before deciding how much to offer.
Game Concept
First Step is a homebuying game designed to teach first-time homebuyers the importance of carefully inspecting a property and evaluating its condition before deciding how much to offer. Instead of assuming that the listed price is the correct value, the player must investigate the house, identify possible defects, and understand how those issues affect the real buying price. The game mainly focuses on estimating a fair final offer using inspection findings.
The player is first given a property listing along with a short description and the price quoted by the seller. They must choose which areas of the house to inspect, such as the roof, electrical system, plumbing, HVAC, foundation, or windows. Each discovered issue has an estimated repair cost. After reviewing the available information, the player decides the maximum price they believe the property is worth and locks in their offer.
At the end of the round, the game reveals all hidden defects and calculates a Smart Price based on the property's market value minus repair costs. The player wins by making an offer close to this value.
The main learning outcome is that buyers should base their offer on the actual condition of the property, not just the asking price. The game makes learning fun by giving players the feeling of being a detective solving a case using clues such as inspections and hidden problems. When the final price is right on target, it creates a strong sense of satisfaction and achievement.
Gameplay Flow
1. Start the game.
2. View the property listing and seller's asking price.
3. Review the available property information.
4. Choose a limited number of areas to inspect.
5. Discover defects and their estimated repair costs.
6. Decide the maximum price you believe the property is worth.
7. Lock in your final offer.
8. Reveal all hidden defects.
9. Compare your offer with the calculated Smart Price.
10. Receive a result showing whether you made a good buying decision.
Core idea:
Smart Price = Market Value - Actual Repair Costs
The closer the player's offer is to the Smart Price, the better the result.
How to Run Locally
Prerequisites
Make sure Node.js and npm are installed on your computer.
##Steps to run locally
1. Clone or download the project repository.
2. Open the project folder in VS Code or another code editor.
3. Open a terminal inside the project folder.
4. Install the required dependencies:
npm install
5. Start the development server:
npm run dev
6. Open the local URL shown in the terminal, usually:
http://localhost:5173
##Tech Choices
- React — used to build the interactive user interface using reusable components.
- Vite — used for fast development, project setup, and local testing.
- JavaScript — used for the game logic, calculations, player decisions, and state updates.
- CSS — used to style the interface and make the game responsive and visually engaging.
- React State / useReducer — used to manage the current property, inspection choices, player offer, score, and game progress.
The project is completely frontend-based. It does not require a backend, database, authentication system, or external API.
##What I'd Do With More Time
With more development time, I would improve First Step by adding:
- More properties with different prices, locations, and hidden defects.
- Different difficulty levels with fewer inspections or more complex problems.
- More detailed and realistic inspection reports.
- A seller negotiation stage with accept, reject, and counter-offer outcomes.
- More realistic market conditions that affect property value.
- More achievements, scoring categories, and buyer rankings.
- Improved animations and visual feedback.
- More homebuying concepts such as contingencies, closing costs, mortgage payments, and appraisal risk.
##Known Issues
- Property details, repair costs, and hidden defects are currently predefined.
- The game mainly focuses on inspection-based pricing rather than the complete homebuying process.
- The current prototype is designed primarily for laptop browser use.
- Some extreme offer values may produce less realistic outcomes than normal gameplay decisions.
- Player progress is not stored after the page is refreshed.