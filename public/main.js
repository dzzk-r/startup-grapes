// let companyData = {};
// import companyData from './data/company-data.json' assert { type: "json" };

// fetch('https://startup-grapes.vercel.app/data/company-data.json')
//   .then((response) => {
//     if (!response.ok) throw new Error("Network response was not ok");
//     return response.json();
//   })
//   .then((data) => {
//     companyData = data;
//     // 👇 например, перерисовать визуализацию или таблицу
//     console.log("Данные загружены:", companyData);
//     updateChart(companyData); // или другой метод
//   })
//   .catch((error) => {
//     console.error("Ошибка загрузки JSON:", error);
//   });

const tooltip = document.getElementById('tooltip');
let companyData = {};

fetch('/data/company-data.json')
    .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
    })
    .then((data) => {
        companyData = data;
        console.log("✅ companyData loaded");

        document.querySelectorAll('.company-circle').forEach(circle => {
            circle.addEventListener('mouseenter', () => {
                const name = circle.getAttribute('data-name');
                const data = companyData[name];

                if (data) {
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
          `;
                    tooltip.classList.add('show');
                }
            });

            circle.addEventListener('mousemove', e => {
                tooltip.style.left = `${e.pageX + 15}px`;
                tooltip.style.top = `${e.pageY + 15}px`;
                tooltip.style.transform = `translate(${15}px, ${15}px)`;
            });

            circle.addEventListener('mouseleave', () => {
                tooltip.classList.remove('show');
            });
        });
    })
    .catch((error) => {
        console.error("❌ Failed to load company data:", error);
    });
