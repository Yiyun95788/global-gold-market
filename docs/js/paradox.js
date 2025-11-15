// Page 2: The Paradox - Correlation Heatmap
(function() {
    const container = d3.select("#paradox-content");
    
    // Create two-column layout
    const pageContainer = container.append("div")
        .attr("class", "viz-page-container");
    
    // Left: Text section
    const textSection = pageContainer.append("div")
        .attr("class", "viz-text-section fade-in-up");
    
    textSection.append("h2")
        .html("The Gold <span class='gold-accent'>Paradox</span>");
    
    textSection.append("div")
        .attr("class", "gold-divider");
    
    textSection.append("p")
        .attr("class", "subtitle")
        .text("Something unprecedented is happening");
    
    textSection.append("p")
        .html("For decades, gold and stocks moved in <strong>opposite directions</strong>. When markets crashed, investors fled to gold. When stocks rallied, gold languished.");
    
    textSection.append("div")
        .attr("class", "highlight-box")
        .html("<strong>Today is different.</strong> Both gold AND equities are surging simultaneously—a rare phenomenon that signals fundamental shifts in global markets.");
    
    textSection.append("p")
        .text("Use the slider below to explore how gold's relationship with other assets has evolved from 2010 to 2025. Watch the correlations shift as we approach the present day.");
    
    // Right: Visualization section
    const vizSection = pageContainer.append("div")
        .attr("class", "viz-visual-section");
    
    vizSection.append("div")
        .attr("id", "heatmap-viz")
        .style("width", "100%")
        .style("min-height", "500px");
    
    // Call the existing createViz4 function (correlation heatmap)
    // We'll adapt it to work in this container
    createViz4Paradox();
    
})();

// Adapted version of createViz4 for this page layout
function createViz4Paradox() {
    const container = document.querySelector('#heatmap-viz');
    const assets = ['Gold', 'BTC', 'USD', 'Silver', 'S&P 500'];
    
    Promise.all([
        d3.csv('../w6_datasets/SP500 oil gold bitcoin.csv'),
        d3.csv('data/Silver Futures Historical Data.csv'),
        d3.csv('data/US Dollar Index Futures Historical Data.csv')
    ]).then(function([mainData, silverData, usdData]) {
        const combined = {};
        
        mainData.forEach(d => {
            combined[d.Date] = {gold: +d.Gold, btc: +d.BITCOIN, sp500: +d['S&P500']};
        });
        
        silverData.forEach(d => {
            const p = d.Date.split('/');
            const key = `${p[2]}-${p[0].padStart(2, '0')}-${p[1].padStart(2, '0')}`;
            if (combined[key]) combined[key].silver = +d.Price.replace(/,/g, '');
        });
        
        usdData.forEach(d => {
            const p = d.Date.split('/');
            const key = `${p[2]}-${p[0].padStart(2, '0')}-${p[1].padStart(2, '0')}`;
            if (combined[key]) combined[key].usd = +d.Price.replace(/,/g, '');
        });
        
        const correlationData = {};
        for (let year = 2010; year <= 2024; year++) {
            const yearData = Object.keys(combined)
                .filter(d => d.startsWith(year.toString()))
                .map(d => combined[d])
                .filter(d => d.gold && d.btc && d.usd && d.silver && d.sp500);
            
            if (yearData.length < 20) continue;
            
            const allAssets = [
                yearData.map(d => d.gold),
                yearData.map(d => d.btc),
                yearData.map(d => d.usd),
                yearData.map(d => d.silver),
                yearData.map(d => d.sp500)
            ];
            
            correlationData[year] = [];
            for (let i = 0; i < 5; i++) {
                correlationData[year][i] = [];
                for (let j = 0; j < 5; j++) {
                    const x = allAssets[i], y = allAssets[j], n = x.length;
                    const sumX = x.reduce((a, b) => a + b, 0);
                    const sumY = y.reduce((a, b) => a + b, 0);
                    const sumXY = x.reduce((s, xi, k) => s + xi * y[k], 0);
                    const sumX2 = x.reduce((s, xi) => s + xi * xi, 0);
                    const sumY2 = y.reduce((s, yi) => s + yi * yi, 0);
                    const num = n * sumXY - sumX * sumY;
                    const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
                    correlationData[year][i][j] = den === 0 ? 0 : num / den;
                }
            }
        }
        
        const years = Object.keys(correlationData).map(y => parseInt(y)).sort();
        
        container.innerHTML = '';
        
        const vizWrapper = d3.select(container)
            .append('div')
            .style('display', 'flex')
            .style('flex-direction', 'column')
            .style('align-items', 'center')
            .style('gap', '20px');
        
        const svgContainer = vizWrapper.append('div');
        
        const margin = {top: 60, right: 100, bottom: 10, left: 110};
        const cellSize = 75;
        const width = cellSize * 5 + margin.left + margin.right;
        const height = cellSize * 5 + margin.top + margin.bottom;
        
        const svg = svgContainer
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);
        
        const colorScale = d3.scaleLinear()
            .domain([-1, 0, 1])
            .range(['#ef4444', '#ffffff', '#3b82f6']);
        
        function draw(selectedYear) {
            const data = correlationData[selectedYear];
            if (!data) return;
            
            svg.selectAll('g').remove();
            const g = svg.append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);
            
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', 30)
                .attr('text-anchor', 'middle')
                .style('font-size', '18px')
                .style('font-weight', '700')
                .style('fill', '#1a1f3a')
                .text(`Asset Correlations in ${selectedYear}`);
            
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    const value = data[i][j];
                    g.append('rect')
                        .attr('class', 'heatmap-cell')
                        .attr('x', j * cellSize)
                        .attr('y', i * cellSize)
                        .attr('width', cellSize)
                        .attr('height', cellSize)
                        .attr('fill', colorScale(value))
                        .on('mouseover', function(event) {
                            d3.select(this).style('opacity', 0.8);
                            tooltip.transition().duration(200).style('opacity', 1);
                            tooltip.html(`<strong>${assets[i]} vs ${assets[j]}</strong><br/>Correlation: ${value.toFixed(2)}<br/>Year: ${selectedYear}`)
                                .style('left', (event.pageX + 10) + 'px')
                                .style('top', (event.pageY - 10) + 'px');
                        })
                        .on('mouseout', function() {
                            d3.select(this).style('opacity', 1);
                            tooltip.transition().duration(200).style('opacity', 0);
                        });
                    
                    g.append('text')
                        .attr('class', 'heatmap-value')
                        .attr('x', j * cellSize + cellSize / 2)
                        .attr('y', i * cellSize + cellSize / 2 + 5)
                        .attr('text-anchor', 'middle')
                        .style('font-weight', 'bold')
                        .style('font-size', '13px')
                        .text(value.toFixed(2));
                }
            }
            
            assets.forEach((asset, i) => {
                g.append('text')
                    .attr('class', 'heatmap-label')
                    .attr('x', -10)
                    .attr('y', i * cellSize + cellSize / 2 + 5)
                    .attr('text-anchor', 'end')
                    .style('font-size', '13px')
                    .text(asset);
                g.append('text')
                    .attr('class', 'heatmap-label')
                    .attr('x', i * cellSize + cellSize / 2)
                    .attr('y', -10)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '13px')
                    .text(asset);
            });
            
            const legendHeight = 250, legendWidth = 20;
            const legendX = width - margin.right + 30;
            const legendY = margin.top + (cellSize * 5 - legendHeight) / 2;
            
            const gradient = svg.append('defs')
                .append('linearGradient')
                .attr('id', 'legend-gradient-paradox')
                .attr('x1', '0%')
                .attr('y1', '100%')
                .attr('x2', '0%')
                .attr('y2', '0%');
            gradient.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', '#ef4444');
            gradient.append('stop')
                .attr('offset', '50%')
                .attr('stop-color', '#ffffff');
            gradient.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', '#3b82f6');
            
            svg.append('rect')
                .attr('x', legendX)
                .attr('y', legendY)
                .attr('width', legendWidth)
                .attr('height', legendHeight)
                .attr('rx', 4)
                .style('fill', 'url(#legend-gradient-paradox)')
                .style('stroke', '#e5e7eb')
                .style('stroke-width', 1);
            
            svg.append('g')
                .attr('transform', `translate(${legendX + legendWidth}, ${legendY})`)
                .call(d3.axisRight(d3.scaleLinear().domain([1, -1]).range([0, legendHeight])).ticks(5).tickFormat(d => d.toFixed(1)));
        }
        
        const controls = vizWrapper.append('div')
            .style('display', 'flex')
            .style('align-items', 'center')
            .style('gap', '15px')
            .style('margin-top', '20px');
        
        controls.append('label')
            .attr('for', 'yearSlider-paradox')
            .style('font-weight', 'bold')
            .text('Year:');
        
        const sliderInput = controls.append('input')
            .attr('type', 'range')
            .attr('id', 'yearSlider-paradox')
            .attr('min', years[0])
            .attr('max', years[years.length - 1])
            .attr('value', years[0])
            .attr('step', 1)
            .style('width', '300px');
        
        const yearDisplay = controls.append('span')
            .attr('id', 'yearValue-paradox')
            .style('font-weight', 'bold')
            .style('font-size', '18px')
            .style('color', '#D4AF37')
            .text(years[0]);
        
        draw(years[0]);
        
        // --- Slider event ---
        sliderInput.on('input', function() {
            const year = parseInt(this.value);
            yearDisplay.text(year);
            draw(year);

            // If user moves the slider manually, stop animation
            if (animationInterval) stopAnimation();
        });

        // --- Play/Pause Button ---
        const playPauseBtn = controls.append('button')
            .attr('id', 'playPauseBtn-paradox')
            .text('▶ Play')
            .style('padding', '5px 15px')
            .style('margin-left', '10px')
            .style('border', '1px solid #ccc')
            .style('border-radius', '4px')
            .style('background-color', '#f0f0f0')
            .style('cursor', 'pointer')
            .style('font-size', '14px')
            .style('font-weight', 'bold');

        // --- NEW: Animation State ---
        let animationInterval = null;
        const animationSpeed = 500; // ms per year

        function startAnimation() {
            if (animationInterval) return;

            const minYear = years[0];
            const maxYear = years[years.length - 1];

            animationInterval = setInterval(() => {
                let currentYear = parseInt(sliderInput.node().value);
                currentYear++;

                if (currentYear > maxYear) currentYear = minYear;

                sliderInput.attr('value', currentYear);
                sliderInput.node().value = currentYear;

                yearDisplay.text(currentYear);
                draw(currentYear);
            }, animationSpeed);

            playPauseBtn.text('⏸ Pause');
        }

        function stopAnimation() {
            if (animationInterval) {
                clearInterval(animationInterval);
                animationInterval = null;
                playPauseBtn.text('▶ Play');
            }
        }

        // --- NEW: Button Event Listener ---
        playPauseBtn.on('click', function() {
            if (animationInterval) {
                stopAnimation();
            } else {
                startAnimation();
            }
        });
    });
}