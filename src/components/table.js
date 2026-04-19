import {cloneTemplate} from "../lib/utils.js";

export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // #1.2 — [...before].reverse() чтобы не мутировать исходный массив
    [...before].reverse().forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.prepend(root[subName].container);
    });

    after.forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.append(root[subName].container);
    });

    // #1.3 — обработать события
    root.container.addEventListener('change', () => {
        onAction();
    });

    root.container.addEventListener('reset', () => {
        setTimeout(onAction);
    });

    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

    const render = (data) => {
        // #1.1 — преобразовать данные в строки из шаблона
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);

            Object.keys(item).forEach(key => {
                if (key in row.elements) {
                    const el = row.elements[key];
                    const tag = el.tagName.toLowerCase();
                    if (tag === 'input' || tag === 'select') {
                        el.value = item[key];
                    } else {
                        el.textContent = item[key];
                    }
                }
            });

            return row.container;
        });

        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}
