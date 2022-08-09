# Scientific Calculator
This beginner project started off as a ReactJS practice project following a 
Youtube tutorial by Tyler Potts. Later on, I was inspired by the calculator 
app on my Android phone and decided to add more functionalities to the project,
as a history database and function support.

[Demo](https://serey-roth.github.io/calculator/)

<img width="964" alt="Screen Shot 2022-08-09 at 4 15 32 PM" src="https://user-images.githubusercontent.com/88986106/183778578-427e2c94-e026-46e3-92a7-3e2598962e4c.png">
<img width="897" alt="Screen Shot 2022-08-09 at 4 15 45 PM" src="https://user-images.githubusercontent.com/88986106/183778583-ce00f3b0-0255-4261-85ae-40c2f91ac26c.png">
<img width="706" alt="Screen Shot 2022-08-09 at 4 16 07 PM" src="https://user-images.githubusercontent.com/88986106/183778585-34b35b1a-3ff1-4882-ab1d-9da11b1c1f22.png">
<img width="654" alt="Screen Shot 2022-08-09 at 4 16 38 PM" src="https://user-images.githubusercontent.com/88986106/183778588-526e9622-da71-404b-bfd2-9d698a94b9c4.png">

### Description
The calculator supports standard arithmetic operations, such as addition,
subtraction, multiplication, division, modulo division and exponentiation,
as well as function evaluations. At the time this is written, the list 
of functions includes all trig functions, e^x, ln(x), x^2 and sqrt(x).
For each function, the calculation will also perform domain checks to ensure
the right expression is being entered.

After each calculation, the calculator stores the expression and result in 
the history panel, which can be accessed through the menu on the top 
right of the app.

### What I learnt
Throughout the entire process, I learnt a lot about the basics of React 
and practiced building basic components, managing states and optimizing 
re-renders. In addition, while building the data management for the app, 
I also got to learn React Hooks, mainly useState, useReducer and useEffect, 
and their correct usage. 

### What tools I used
I used ReactJS as my framework, DayJS for time calculation and MaterialUI for
the menu component.

### Future Plans
I plan on integrating unit conversion into the app and I want to replace some 
of the components with those from MaterialUI. 


