import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    // #5.1 — настроить компаратор
    // skipEmptyTargetValues — пропускаем если строка поиска пустая
    // searchMultipleFields — ищем по нескольким полям одновременно
    const compare = createComparison(
        ['skipEmptyTargetValues'],
        [rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)]
    );

    return (data, state, action) => {
        // #5.2 — применить компаратор: фильтруем только по полю поиска
        const searchState = { [searchField]: state[searchField] };
        return data.filter(row => compare(row, searchState));
    }
}
