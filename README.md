# Scientific Calculator
This beginner project started off as a ReactJS practice project following a 
Youtube tutorial by Tyler Potts. Later on, I was inspired by the calculator 
app on my Android phone and decided to add more functionalities to the project,
as a history database and function support.

[Demo](https://serey-roth-calculator.netlify.app/)

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

* Version 1.1: The calculator also supports unit conversions for various categories.
The unit converter can be acessed via the dropdown menu, and users can use the number pad 
to enter or delete values for conversion. While in the unit converter mode, the 
operators are disabled and the functions are no longer visible. To return to the 
calculator, or default, mode, click on 'None' from the dropdown menu or the button
on the top leftmost of the app.

### What I learnt
Throughout the entire process, I learnt a lot about the basics of React 
and practiced building basic components, managing states and optimizing 
re-renders. In addition, while building the data management for the app, 
I also got to learn React Hooks, mainly useState, useReducer and useEffect, 
and their correct usage. 

### What tools I used
I used ReactJS as my framework, MathJS for evaluating expressions, DayJS for time calculation and MaterialUI for
the menu component.

### Future Plans 
* Version 1.0: I plan on integrating unit conversion into the app and I want to replace some 
of the components with those from MaterialUI. 
* Version 1.1: I want to replace the main components of the calculator such as the number and
operator pad, the side panels and the functions pad with components from MUI.
I also want to clean up the styling with Sass or try out Tailwind CSS.

### Version 1.1 Update (2022/08/10)
I integrated a unit converter into the app. For its UI, I used MaterialUI Autocomplete and TextField components. 

