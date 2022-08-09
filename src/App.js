import { useState } from 'react';
import { 
	LongMenu, 
	History 
} from './modules/components'
import { useCalculator } from './modules/logic';

const digits = Array.from(Array(9), (_, d) => d + 1);

function App() {
	const fn = ['√', 'e^x', 'sin', 'cos', 'tan', 'cot', 'sec', 'csc'];
	const fnInv = ['x^2', 'ln', 'asin', 'acos', 'atan', 'acot', 'asec', 'acsc'];
	const menuOptions = ['None', 'History'];

	const {
		state, 
		handleAddDigit,
        handleAddExpression,
		handleAddConstant,
		handleAddFunction,
		handleAddBinaryOperator,
		handleAddParenthesis,
        handleCalculation,
        handleResetCalculator,
        handleToggleDegree,
        handleClearHistory,
        handleToggleInverted,
        handleDeleteLast
	} = useCalculator({
		expression: '',
        stack: [],
		forDisplay: '',
        result: '',
        previous: '',
        history: [],
        isDegree: true,
        isInverted: false,
	});

	const [historyVisible, setHistoryVisible] = useState(false);

	const toggleHistoryPanel = () => {
		setHistoryVisible(!historyVisible);
	}

	const handleClickHistoryItem = (e) => {
		const item = e.target.textContent;
		handleAddExpression(item);
	}
	
  	return (
      	<div className="app"> 
			<div className="contents">
				<div className="calculator">
					<div className="top">
						<h3>{state.isDegree ? 'DEG' : 'RAD'}</h3>
						<LongMenu 
						id="menu"
						options={menuOptions} 
						onClickHistoryPanel={() => toggleHistoryPanel()}/>
					</div>
					<div className="display">
						<p>{state.forDisplay || ""}</p>
						{state.result ?  <p>({state.result})</p> : ""}					
					</div>
					<div className="scientific">
						<div className="alwaysVisible">
							<button onClick={() => handleAddConstant('π')}>π</button>	
							<button onClick={() => handleAddConstant('e')}>e</button>	
						</div>
						<div className="drawer">
						<div className="switchButtons">
								<button onClick={handleToggleDegree}>{state.isDegree ? 'RAD' :
								'DEG'}</button>
								<button onClick={handleToggleInverted}>INV</button>
						</div>
						<div className="invertible">
							{state.isInverted ? 
								fnInv.map(e => 
									<button 
									key={e}
									onClick={() => handleAddFunction(e)}>{e}</button>	
									) : 
								fn.map(e => 
									<button 
									key={e}
									onClick={() => handleAddFunction(e)}>{e}</button>	
									)}
						</div>
						</div>
					</div>
					<div className="standard">
						<div className="digits">
							{digits.map(d => 
								<button
								onClick={() => handleAddDigit(d.toString())}
								key={d}>{d}</button>
							)}
							<button onClick={() => handleAddDigit("0")}>0</button>
							<button onClick={() => handleAddDigit(".")}>.</button>
							<button onClick={handleDeleteLast}>DEL</button>
						</div>
						<div className="operators">
							<button onClick={() => handleAddBinaryOperator("+")}>+</button>
							<button onClick={() => handleAddBinaryOperator("-")}>-</button>
							<button onClick={() => handleAddBinaryOperator("*")}>&times;</button>
							<button onClick={() => handleAddBinaryOperator("÷")}>&divide;</button>
							<button onClick={() => handleAddParenthesis('(')}>(</button>
							<button onClick={() => handleAddParenthesis(')')}>)</button>
							<button onClick={() => handleAddBinaryOperator('^')}>^</button>
							<button onClick={() => handleAddBinaryOperator('mod')}>mod</button>
							<button onClick={handleCalculation}>=</button>
							<button onClick={handleResetCalculator}>AC</button>
						</div>
					</div>
		  		</div>
				<History 
					className={historyVisible ? "history open" : "history closed"}
					contents={state.history ? state.history : []}
					onClickHistoryItem={(e) => handleClickHistoryItem(e)}
					onClickClearHistory={handleClearHistory}
					togglePanel={toggleHistoryPanel}
				/>
			</div>
      	</div>
  	);
}

export default App;


