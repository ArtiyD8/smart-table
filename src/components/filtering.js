import {createComparison, defaultRules} from "../lib/compare.js";

// #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        elements[elementName].append(
            ...Object.values(indexes[elementName]).map(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            })
        );
    });

    return (data, state, action) => {
        // #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            const parent = action.parentElement;
            const input = parent.querySelector('input');
            if (input) {
                input.value = '';
            }
            if (field && state[field] !== undefined) {
                state[field] = '';
            }
        }

        // Готовим объект сравнения: только поля, которые есть в строках данных
        // totalFrom и totalTo объединяем в массив-диапазон для поля total
        const filterState = {
            date: state.date,
            customer: state.customer,
            seller: state.seller,
            total: [
                state.totalFrom ? parseFloat(state.totalFrom) : '',
                state.totalTo   ? parseFloat(state.totalTo)   : ''
            ]
        };

        // #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, filterState));
    }
}
