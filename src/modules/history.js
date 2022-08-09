const day = require('dayjs');

export function saveHistory(history) {
    if (history instanceof History) {
        let list = convertHistoryToJSON(history);
        localStorage.setItem('history', JSON.stringify(list));
    }
}

export function loadHistory() {
    const stored = localStorage.getItem('history');
    if (stored) {
       let list = JSON.parse(stored);
       return convertJSONToHistory(list);
    }
    return new History();
}

export class ExpressionResult {
    constructor(expr, res) {
        this.expr = expr;
        this.res = res;
    }
    get expression() { return this.expr; }
    get result() { return this.res; }
    set expression(e) { this.expr = e; }
    set result(r) { this.res = r; }
}

export class DateGroup {
    constructor(date) {
        this.date = date;
        this.expressionList = [];
    }
    get groupDate() { return this.date; }
    get list() { return this.expressionList; }
    set groupDate(d) { this.date = d; }
    addItem(expression) { 
        if (expression instanceof ExpressionResult) {
            this.expressionList.push(expression);
        }    
    }
}

export class History {
    constructor() {
        this.list = [];
    }
    get itemList() { return this.list; }
    set itemList(l) { this.list = l};
    addItem(date, expression) {
        const dateGroupIdx = this.isAlreadyAdded(date);
        if (dateGroupIdx !== -1) { 
            this.list[dateGroupIdx].addItem(expression);
        }
        else {
            let group = new DateGroup(date);
            group.addItem(expression);
            this.list.push(group);
        }
    }
    addDateGroup(dateGroup) { 
        if (dateGroup instanceof DateGroup && 
            this.isAlreadyAdded(dateGroup.groupDate) === -1) {
            this.list.push(dateGroup); 
        }
    }
    getItemsByDate(date) {
        return this.list.filter(dg => dg.groupDate === date);
    }
    sortItemsByDate(order) {
        const dateGroups = this.list.map(t => t);
        if (order === 'ascending') {
            return dateGroups.sort((dg1, dg2) => (day(dg1.groupDate).isSame(day(dg2.groupDate))) ? 
                    0 : (day(dg1.groupDate).isBefore(day(dg2.groupDate)) ? -1 : 1));
        } else {
            return dateGroups.sort((dg1, dg2) => (day(dg1.groupDate).isSame(day(dg2.groupDate))) ? 
                0 : (day(dg1.groupDate).isBefore(day(dg2.groupDate)) ? 1 : -1));
        }
    }
    isAlreadyAdded(date) {
        return this.list.findIndex(dg => dg.groupDate === date);
    }
}

function convertHistoryToJSON(history) {
    let list = [];
    for (let dg of history.list) {
        let group = {};
        group.date = dg.groupDate;
        group.list = dg.list.map(ex => ({
            expr: ex.expression,
            res: ex.result,
        }));
        list.push(group);
    }
    return list;
}

function convertJSONToHistory(list) {
    let history = new History();
    for (let group of list) {
        let date = group.date;
        group.list.map(function(ex) {
            history.addItem(date, new ExpressionResult(ex.expr, ex.res));
            return '';
        });
    }
    return history;
}