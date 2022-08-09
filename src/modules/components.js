import { useState } from "react";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

const ITEM_HEIGHT = 48;

export function LongMenu(props) {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = (e) => {
		if (e.target.innerText === 'History') {
			props.onClickHistoryPanel();
		}
		setAnchorEl(null);
	};

	return (
		<div id={props.id}>
		<IconButton
			aria-label="more"
			id="long-button"
			aria-controls={open ? 'long-menu' : undefined}
			aria-expanded={open ? 'true' : undefined}
			aria-haspopup="true"
			onClick={handleClick}
		>
			<MoreVertIcon />
		</IconButton>
		<Menu
			id="long-menu"
			MenuListProps={{
				'aria-labelledby': 'long-button',
			}}
			anchorEl={anchorEl}
			open={open}
			onClose={handleClose}
			PaperProps={{
				style: {
					maxHeight: ITEM_HEIGHT * 4.5,
					width: '20ch',
				},
			}}
		>
			{props.options.map((option) => (
			<MenuItem key={option} 
			selected={option === 'None'} 
			onClick={handleClose}>
				{option}
			</MenuItem>
			))}
		</Menu>
		</div>
	);
}

export function History(props) {
	return (
		<div className={props.className}>
			<div id="head">
				<button onClick={props.togglePanel}>
				<FontAwesomeIcon icon={faChevronLeft} />
				</button>
				<h3>History</h3>
				<p onClick={props.onClickClearHistory}>Clear</p>
			</div>
			<div id="main">
			{props.contents.length > 0 ? 
				props.contents.map((ex, index) => 
				<div 
				className="expression-result"
				key={ex + index}>
					<p onClick={props.onClickHistoryItem}>{ex.expression}</p>
					<p onClick={props.onClickHistoryItem}>{ex.result}</p>
				</div>) : ""
			}
			</div>
		</div>	
	);
}