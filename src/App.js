import { useState } from 'react';
import { 
	ComboBox,
	LongMenu, 
	History,
	About,
	NumberPad,
	OperatorPad,
	Scientific,
	Unit,
} from './modules/components'
import { useCalculator } from './modules/calculator';
import { loadHistory } from './modules/history';
import { 
	getCategories,
	useConverter 
} from './modules/units';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

const digits = Array.from(Array(9), (_, d) => d + 1);

export default function App() {
	const fn = ['√', 'e^x', 'sin', 'cos', 'tan', 'cot', 'sec', 'csc'];
	const fnInv = ['x^2', 'ln', 'asin', 'acos', 'atan', 'acot', 'asec', 'acsc'];
	const menuOptions = ['None', 'Unit Converter','History', 'About'];
	const aboutText = `Supports standard arithmetic operations and various functions. 
	Includes data management in the form of a 'history'.`;

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

	const {
		converter,
		changeToUnit,
		changeFromUnit,
		addDigit,
		deleteDigit,
		handleCategoryChange
	} = useConverter({
		value: '',
		category: '',
		units: [],
		fromLabel: '',
		toLabel: '',
		from: '',
		to: '',
		result: ''
	})  

	const [panels, setVisible] = useState({
		default: true,
		converter: false,
		history: false,
		about: false,
	});

	const toggleDefault = () => {
		setVisible(function(prevState) {
			return {
				...prevState,
				default: true,
				converter: false,
			}
		});
	}

	const toggleConverter = () => {
		setVisible(function(prevState) {
			return {
				...prevState,
				default: !prevState.default,
				converter: !prevState.converter,
			}
		})
	}

	const toggleHistoryPanel = () => {
		setVisible(function(prevState) {
			let aboutState = prevState.about ? !prevState.about 
			: prevState.about;
			return {
				...prevState,
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
				...prevState,
				history: historyState,
				about: !prevState.about,
			}
		});
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
						{panels.default ? 
							<h3>{state.isDegree ? 'DEG' : 'RAD'}</h3> :
							<div id="topConverter">
							<button onClick={() => toggleDefault()}>
								<FontAwesomeIcon icon={faChevronLeft} />
							</button>
							<h3>Unit Converter</h3>
							</div>
							
						}
						<LongMenu 
						id="menu"
						options={menuOptions} 
						onClickDefault={() => toggleDefault()}
						onClickConverter={() => toggleConverter()}
						onClickHistoryPanel={() => toggleHistoryPanel()}
						onClickAboutPanel={() => toggleAboutPanel()}/>
					</div>
					<div className={panels.default ? 
							'default active' : 
							'default inactive'}>
						<div className="display">
							<p>{state.forDisplay || ""}</p>
							{state.result ?  <p>({state.result})</p> : ""}					
						</div>
						<Scientific 
							className='scientific'
							childClass={
								{
									toggleButtons: 'toggleButtons',
									functions: 'functions',
								}
							}
							unit={state.isDegree ? 'RAD' : 'DEG'}
							functions={state.isInverted ? fnInv : fn}
							handleToggleDegree={handleToggleDegree}
							handleToggleInverted={handleToggleInverted}
							handleAddFunction={handleAddFunction}
						/>
					</div>
					<div className={panels.converter ? 
							'converter active' : 
							'converter inactive'}>
						<div className="categories">
							<ComboBox
								options={getCategories()}
								label='Categories'
								value={converter.category}
								handleChange={handleCategoryChange}
							/>
						</div>
						<Unit 
							className='from'
							label='From'
							options={Object.keys(converter.units)}
							value={converter.value} 
							unit={converter.fromLabel}
							handleChange={changeFromUnit}
						/>
						<Unit 
							className='to'
							label='To'
							options={Object.keys(converter.units)}
							value={converter.result} 
							unit={converter.toLabel}
							handleChange={changeToUnit}
						/>
					</div>
					<div className="standard">
						<NumberPad 
							className='digits'
							digits={digits}
							handleAddDigit={panels.default ? 
								handleAddDigit : addDigit}
							handleAddConstant={panels.default ?
								handleAddConstant : () => {return;}}
							handleDeleteLast={panels.default ?
								handleDeleteLast : deleteDigit}
						/>
						<OperatorPad
							className={panels.default ? 
								'operators active' : 
								'operators inactive'}
							handleAddBinary={handleAddBinaryOperator}
							handleAddParenthesis={handleAddParenthesis}
							handleCalculation={handleCalculation}
							handleResetCalculator={handleResetCalculator}
						/>
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



