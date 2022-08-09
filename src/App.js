import { useState } from 'react';
import { 
	LongMenu, 
	History,
	About 
} from './modules/components'
import { useCalculator } from './modules/logic';
import { loadHistory } from './modules/history';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons'

const digits = Array.from(Array(9), (_, d) => d + 1);

function App() {
	const fn = ['√', 'e^x', 'sin', 'cos', 'tan', 'cot', 'sec', 'csc'];
	const fnInv = ['x^2', 'ln', 'asin', 'acos', 'atan', 'acot', 'asec', 'acsc'];
	const menuOptions = ['None', 'History', 'About'];

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
        history: loadHistory(),
        isDegree: true,
        isInverted: false,
	});

	const [panels, setVisible] = useState({
		history: false,
		about: false,
	});

	const toggleHistoryPanel = () => {
		setVisible(function(prevState) {
			let aboutState = prevState.about ? !prevState.about 
			: prevState.about;
			return {
				history: !prevState.history,
				about: aboutState,
			}
		});
	}

	const toggleAboutPanel = () => {
		setVisible(function(prevState) {
			let historyState = prevState.history ? !prevState.history 
			: prevState.history;
			return {
				history: historyState,
				about: !prevState.about,
			}
		});
	}

	const handleClickHistoryItem = (e) => {
		const item = e.target.textContent;
		handleAddExpression(item);
	}

	const aboutText = `Supports standard arithmetic operations and various functions. 
	Includes data management in the form of a 'history'.`
	
  	return (
      	<div className="app"> 
			<div className="contents">
				<div className="calculator">
					<div className="top">
						<h3>{state.isDegree ? 'DEG' : 'RAD'}</h3>
						<LongMenu 
						id="menu"
						options={menuOptions} 
						onClickHistoryPanel={() => toggleHistoryPanel()}
						onClickAboutPanel={() => toggleAboutPanel()}/>
					</div>
					<div className="display">
						<p>{state.forDisplay || ""}</p>
						{state.result ?  <p>({state.result})</p> : ""}					
					</div>
					<div className="scientific">
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
									)
								}
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
							<button onClick={() => handleAddConstant('π')}>π</button>	
							<button onClick={() => handleAddConstant('e')}>e</button>	
							<button onClick={() => handleAddDigit(".")}>.</button>
							<button  id="del" onClick={handleDeleteLast}>
							<FontAwesomeIcon icon={faDeleteLeft} />
							</button>
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
				<About
					className={panels.about ? "about open" : "about closed"}
					text={aboutText}
					year={2022}
					author='Serey Roth'
					source_link={'https://github.com/serey-roth/calculator'}
					togglePanel={toggleAboutPanel}
				/>
				<History 
					className={panels.history ? "history open" : "history closed"}
					list={state.history.list}
					onClickHistoryItem={(e) => handleClickHistoryItem(e)}
					onClickClearHistory={handleClearHistory}
					togglePanel={toggleHistoryPanel}
				/>
				
			</div>
      	</div>
  	);
}

export default App;


