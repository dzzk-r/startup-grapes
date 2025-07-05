const tooltip = document.getElementById('tooltip');
const container = document.querySelector('.container');
let companyData = {};
let fixedTooltip = false;

fetch('/data/company-data.json')
    .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
    })
    .then((data) => {
        companyData = data;
        console.log("✅ companyData loaded");

        document.querySelectorAll('.company-circle').forEach(circle => {
            const name = circle.getAttribute('data-name');
            const data = companyData[name];

            circle.addEventListener('mouseenter', (e) => {
                if (!fixedTooltip && data) {
                    tooltip.innerHTML = `
                        <h4 class="name">${name}</h4>
                        <div>Revenue/employee: ${data.rev || "?"}</div>
                    `;
                    tooltip.classList.add('show');
                    positionTooltip(e);
                }
            });

            circle.addEventListener('mousemove', e => {
                if (!fixedTooltip) {
                    positionTooltip(e);
                }
            });

            circle.addEventListener('mouseleave', () => {
                if (!fixedTooltip) {
                    tooltip.classList.remove('show');
                }
            });

            circle.addEventListener('click', (event) => {
                if (data) {
                    fixedTooltip = true;
                    const rect = circle.getBoundingClientRect();
                    const containerRect = container.getBoundingClientRect();

                    tooltip.innerHTML = `
                        <h4 class="name">${name}</h4>
                        <table><tbody>
                          <tr><td>Revenue/employee</td><td>${data.rev || "?"}</td></tr>
                          <tr><td>Employees</td><td>${data.employees ?? "?"}</td></tr>
                          <tr><td>HQ</td><td>${data.hq || "?"}</td></tr>
                          <tr><td>Founded</td><td>${data.founded || "?"}</td></tr>
                          <tr><td>Valuation</td><td>${data.valuation || "?"}</td></tr>
                          <tr><td>Stock</td><td>${data.stock || "?"}</td></tr>
                          <tr><td>Source</td><td>${data.source ? `<a href="${data.source}" target="_blank">link</a>` : "?"}</td></tr>
                        </tbody></table>
                        <button id="close-tooltip">✖</button>
                    `;
                    tooltip.classList.add('show');
                    tooltip.style.left = `${rect.right - containerRect.left + 10}px`;
                    tooltip.style.top = `${rect.top - containerRect.top + 10}px`;
                    tooltip.style.overflowY = 'auto';
                    tooltip.style.maxHeight = '250px';
                }
            });
        });
    })
    .catch((error) => {
        console.error("❌ Failed to load company data:", error);
    });

// Делегированный обработчик для всех кликов внутри тултипа
tooltip.addEventListener('click', (event) => {
    if (event.target && event.target.id === 'close-tooltip') {
        fixedTooltip = false;
        tooltip.classList.remove('show');
        tooltip.innerHTML = '';

        // Принудительно активируем hover, если мышка всё ещё над кружком
        const eventFake = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: event.clientX,
            clientY: event.clientY,
        });

        document.querySelectorAll('.company-circle').forEach(circle => {
            const rect = circle.getBoundingClientRect();
            if (
                event.clientX >= rect.left &&
                event.clientX <= rect.right &&
                event.clientY >= rect.top &&
                event.clientY <= rect.bottom
            ) {
                circle.dispatchEvent(eventFake);
            }
        });
    }
});

function positionTooltip(e) {
    const containerRect = container.getBoundingClientRect();
    const x = e.clientX - containerRect.left + 15;
    const y = e.clientY - containerRect.top + 15;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
}
