function createBarChart(startYear, endYear, maxPrice) {
    d3.csv('VancouverHouseSale.csv').then(data => {
        // Convert year built, price, and total floor area columns to int
        data.forEach(d => {
            d.YearBuilt = parseInt(d.YearBuilt);
            d.Price = parseInt(d.Price);
            d.TotalFloorArea = parseInt(d.TotalFloorArea);
        });

        // Filter data based on year built, maxPrice, and if listDate is after 2019 
        const filteredData = data.filter(d => d.YearBuilt >= startYear && d.YearBuilt < endYear && d.Price <= maxPrice && new Date(d.ListDate) > new Date('2019-01-01'));

        const totalHeight = 500
        const totalWidth = 800

        const topMargin = 20
        const bottomMargin = 50
        const rightMargin = 20
        const leftMargin = 80

        const plotHeight = totalHeight - topMargin - bottomMargin;
        const plotWidth = totalWidth - leftMargin - rightMargin;

        const svg = d3.select('#scatterplot')
            .append('svg')
            .attr('height', totalHeight)
            .attr('width', totalWidth)
            .append('g')
            .attr('transform', `translate(${leftMargin},${topMargin})`);

        var mousemove = function showHouseDetails(d) {
            const houseDetails = d3.select("#house-details");

            houseDetails.style("display", "block");
            houseDetails.html(`
                <strong>Address:</strong> ${d.Address}<br>
                <strong>List Date:</strong> ${d.ListDate}<br>
                <strong>Price:</strong> $${d.Price}<br>
                <strong>Days on Market:</strong> ${d.DaysOnMarket}<br>
                <strong>Total Floor Area:</strong> ${d.TotalFloorArea}<br>
                <strong>Year Built:</strong> ${d.YearBuilt}<br>
                <strong>Age:</strong> ${d.Age}<br>
                <strong>Lot Size:</strong> ${d.LotSize}
            `);
        }
                
        var mouseleave = function hideHouseDetails() {
            const houseDetails = d3.select("#house-details");
            houseDetails.style("display", "none");
        }     

        var minTotalFloorArea = d3.min(filteredData, d => d.TotalFloorArea)
        var maxTotalFloorArea = d3.max(filteredData, d => d.TotalFloorArea)

        const xScale = d3.scaleLinear()
            .domain([minTotalFloorArea, maxTotalFloorArea])
            .range([0, plotWidth]);

        var minPrice = d3.min(filteredData, d => d.Price)   

        const yScale = d3.scaleLinear()
            .domain([minPrice, maxPrice])
            .range([plotHeight, 0]);   

        svg.selectAll('circle')
            .data(filteredData)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.TotalFloorArea))
            .attr('cy', d => yScale(d.Price))
            .attr('r', 5)
            .style('fill', 'blue')
            .on("mousemove", mousemove)
            .on("mouseout", mouseleave);

        // Add horizontal axis
        svg.append('g')
            .attr('transform',  `translate(0, ${plotHeight})`)
            .call(d3.axisBottom(xScale));

        svg.append('text')
            .style('text-anchor', 'middle')
            .attr('y', plotHeight + bottomMargin - 10)
            .attr('x', plotWidth / 2)
            .text('Total Floor Area (square meters)');

        // Add vertical axis
        svg.append('g')
            .call(d3.axisLeft(yScale));

        svg.append('text')
            .style('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .attr('y', -leftMargin + 20)
            .attr('x', -plotHeight / 2)
            .text('Price (CAD)');
    });
}
  
function removeChart() {
    d3.select("#scatterplot").selectAll("svg").remove();
}

const rangeInput = document.getElementById('rangeInput');
const selectedMaxPrice = document.getElementById('selectedMaxPrice');

rangeInput.addEventListener('input', () => {
    selectedMaxPrice.textContent = rangeInput.value;

    const selectedButtonId = document.querySelector(".period-btn.selected")?.id;

    switch (selectedButtonId) {
        case "button-1900":
            removeChart();
            createBarChart(1900, 1950, rangeInput.value);
            break;
        case "button-1950":
            removeChart();
            createBarChart(1950, 2000, rangeInput.value);
            break;
        case "button-2000":
            removeChart();
            createBarChart(2000, 2050, rangeInput.value);
            break;
        default:
            break;
    }
});

const startYear1900Button = document.getElementById("button-1900")
const startYear1950Button = document.getElementById("button-1950")
const startYear2000Button = document.getElementById("button-2000")

// Button click event listeners
startYear1900Button.addEventListener("click", () => {
    removeChart();
    createBarChart(1900, 1950, rangeInput.value);
    document.querySelector(".period-btn.selected")?.classList.remove("selected");
    startYear1900Button.classList.add("selected");
});

startYear1950Button.addEventListener("click", () => {
    removeChart();
    createBarChart(1950, 2000, rangeInput.value);
    document.querySelector(".period-btn.selected")?.classList.remove("selected");
    startYear1950Button.classList.add("selected");
});

startYear2000Button.addEventListener("click", () => {
    removeChart();
    createBarChart(2000, 2050, rangeInput.value);
    document.querySelector(".period-btn.selected")?.classList.remove("selected");
    startYear2000Button.classList.add("selected");
});
