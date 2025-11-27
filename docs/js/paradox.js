// Page 2: The Paradox - Correlation Heatmap
(function() {
    const container = d3.select("#paradox-content");
    
    container.html('');
    
    // Create fullpage article wrapper
    const article = container.append("div")
        .style("min-height", "100vh")
        .style("background", "rgba(244, 232, 208, 0.75)")
        .style("padding", "80px 0");
    
    // Inner content wrapper
    const innerContent = article.append("div")
        .style("max-width", "1400px")
        .style("margin", "0 auto")
        .style("padding", "0 80px");
    
    // Headline
    innerContent.append("h2")
        .attr("class", "article-headline scroll-reveal")
        .style("border-top", "2px solid #2c2416")
        .style("border-bottom", "2px solid #2c2416")
        .style("padding", "20px 0")
        .style("margin", "0 0 20px 0")
        .text("THE GOLD PARADOX");
    
    // Subheadline
    innerContent.append("div")
        .attr("class", "article-subheadline scroll-reveal")
        .text("When Safe Havens and Risk Assets Rise Together");
    
    // Dateline
    innerContent.append("div")
        .attr("class", "dateline scroll-reveal")
        .style("margin-bottom", "30px")
        .text("FINANCIAL MARKETS ANALYSIS");
    
    // Ornamental divider
    innerContent.append("div")
        .attr("class", "ornamental-divider");
    
    // Text section (single column)
    const textSection = innerContent.append("div")
        .attr("class", "scroll-reveal")
        .style("max-width", "900px")
        .style("margin", "40px auto");
    
    textSection.append("p")
        .style("text-align", "justify")
        .style("font-family", "Merriweather, serif")
        .style("font-size", "1.1rem")
        .style("line-height", "1.8")
        .style("margin-bottom", "20px")
        .html("<span style='float: left; font-size: 4rem; line-height: 0.8; font-weight: 700; margin: 5px 10px 0 0; font-family: Playfair Display, serif; color: #8b7355;'>F</span>or generations, the rule was simple: when stocks fell, gold rose. When markets rallied, gold declined. This inverse relationship formed the foundation of portfolio diversification.");
    
    textSection.append("p")
        .style("text-align", "justify")
        .style("font-family", "Merriweather, serif")
        .style("font-size", "1.1rem")
        .style("line-height", "1.8")
        .style("margin-bottom", "30px")
        .html("Today breaks that pattern. Gold and equities are surging together—a rare signal that traditional safe-haven narratives no longer fully explain market behavior.");
    
    // Pull quote
    const pullQuote = innerContent.append("div")
        .attr("class", "pull-quote scroll-reveal")
        .style("max-width", "700px")
        .style("margin", "40px auto");
    
    pullQuote.append("p")
        .style("margin", "0")
        .text("The simultaneous rise of gold and stocks suggests deeper structural changes in how the world values and stores wealth.");
    
    // Instruction text
    innerContent.append("p")
        .style("text-align", "center")
        .style("font-family", "EB Garamond, serif")
        .style("font-size", "1rem")
        .style("line-height", "1.6")
        .style("margin", "40px auto 30px")
        .style("max-width", "700px")
        .style("color", "#5c4a3a")
        .style("font-style", "italic")
        .html("Explore how gold's relationship with other assets has evolved from 2010 to 2025.");
    
    // Visualization frame
    const vizFrame = innerContent.append("div")
        .attr("class", "viz-frame scroll-reveal")
        .style("margin-top", "50px")
        .style("margin-bottom", "80px");
    
    vizFrame.append("div")
        .attr("class", "viz-frame-title")
        .text("Asset Correlation Matrix");
    
    vizFrame.append("div")
        .attr("id", "heatmap-viz")
        .style("width", "100%")
        .style("min-height", "600px")
        .style("display", "flex")
        .style("justify-content", "center")
        .style("align-items", "center")
        .style("padding", "20px 0");
    
    // Call visualization function
    setTimeout(() => createViz4Paradox(), 100);
    
})();

function createViz4Paradox() {
    const container = document.querySelector('#heatmap-viz');
    const assets = ['Gold', 'BTC', 'USD', 'Silver', 'S&P 500'];
    
    Promise.all([
        d3.csv('data/SP500_oil_gold_bitcoin_extended.csv'),
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
        for (let year = 2010; year <= 2025; year++) {
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
            .style('position', 'absolute')
            .style('background', '#faf8f3')
            .style('border', '2px solid #2c2416')
            .style('padding', '10px 15px')
            .style('border-radius', '0')
            .style('pointer-events', 'none')
            .style('font-family', 'Merriweather, serif')
            .style('font-size', '12px')
            .style('opacity', 0)
            .style('z-index', '10000')
            .style('box-shadow', '0 2px 8px rgba(0,0,0,0.2)');
        
        const colorScale = d3.scaleLinear()
            .domain([-1, 0, 1])
            .range(['#8b4513', '#f4e8d0', '#2c5f2d']);
        
        function draw(selectedYear) {
            const data = correlationData[selectedYear];
            if (!data) return;
            
            svg.selectAll('g').remove();
            const g = svg.append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);
            
            let titleText = svg.select('.title-text');
            if (titleText.empty()) {
                titleText = svg.append('text')
                    .attr('class', 'title-text')
                    .attr('x', width / 2)
                    .attr('y', 30)
                    .attr('text-anchor', 'middle')
                    .style('font-family', 'Playfair Display, serif')
                    .style('font-size', '18px')
                    .style('font-weight', '700')
                    .style('fill', '#1a1410');
            }
            titleText.text(`Asset Correlations ${selectedYear}`);
            
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
                        .attr('stroke', '#2c2416')
                        .attr('stroke-width', 1)
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
                        .style('font-family', 'Merriweather, serif')
                        .style('font-weight', 'bold')
                        .style('font-size', '13px')
                        .style('fill', '#1a1410')
                        .text(value.toFixed(2));
                }
            }
            
            assets.forEach((asset, i) => {
                g.append('text')
                    .attr('class', 'heatmap-label')
                    .attr('x', -10)
                    .attr('y', i * cellSize + cellSize / 2 + 5)
                    .attr('text-anchor', 'end')
                    .style('font-family', 'Merriweather, serif')
                    .style('font-size', '13px')
                    .style('fill', '#2c2416')
                    .text(asset);
                g.append('text')
                    .attr('class', 'heatmap-label')
                    .attr('x', i * cellSize + cellSize / 2)
                    .attr('y', -10)
                    .attr('text-anchor', 'middle')
                    .style('font-family', 'Merriweather, serif')
                    .style('font-size', '13px')
                    .style('fill', '#2c2416')
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
                .attr('stop-color', '#8b4513');
            gradient.append('stop')
                .attr('offset', '50%')
                .attr('stop-color', '#f4e8d0');
            gradient.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', '#2c5f2d');
            
            svg.append('rect')
                .attr('x', legendX)
                .attr('y', legendY)
                .attr('width', legendWidth)
                .attr('height', legendHeight)
                .style('fill', 'url(#legend-gradient-paradox)')
                .style('stroke', '#2c2416')
                .style('stroke-width', 1);
            
            svg.append('g')
                .attr('transform', `translate(${legendX + legendWidth}, ${legendY})`)
                .call(d3.axisRight(d3.scaleLinear().domain([1, -1]).range([0, legendHeight]))
                    .ticks(5)
                    .tickFormat(d => d.toFixed(1)))
                .style('font-family', 'Merriweather, serif')
                .style('font-size', '11px');
        }
        
        const controls = vizWrapper.append('div')
            .style('display', 'flex')
            .style('align-items', 'center')
            .style('gap', '15px')
            .style('margin-top', '20px')
            .style('padding', '15px')
            .style('background', '#faf8f3')
            .style('border', '2px solid #8b7355')
            .style('border-radius', '0');
        
        controls.append('label')
            .attr('for', 'yearSlider-paradox')
            .style('font-family', 'Merriweather, serif')
            .style('font-weight', 'bold')
            .style('color', '#2c2416')
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
            .style('font-family', 'Playfair Display, serif')
            .style('font-weight', 'bold')
            .style('font-size', '18px')
            .style('color', '#8b7355')
            .text(years[0]);
        
        draw(years[0]);
        
        sliderInput.on('input', function() {
            const year = parseInt(this.value);
            yearDisplay.text(year);
            draw(year);
            if (animationInterval) stopAnimation();
        });

        const playPauseBtn = controls.append('button')
            .attr('id', 'playPauseBtn-paradox')
            .text('Play')
            .style('padding', '8px 20px')
            .style('margin-left', '10px')
            .style('border', '2px solid #2c2416')
            .style('background', '#f4e8d0')
            .style('cursor', 'pointer')
            .style('font-family', 'Merriweather, serif')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .style('color', '#2c2416')
            .style('transition', 'all 0.2s');

        let animationInterval = null;
        const animationSpeed = 500;

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
            playPauseBtn.text('Pause');
        }

        function stopAnimation() {
            if (animationInterval) {
                clearInterval(animationInterval);
                animationInterval = null;
                playPauseBtn.text('Play');
            }
        }

        playPauseBtn.on('click', function() {
            if (animationInterval) {
                stopAnimation();
            } else {
                startAnimation();
            }
        });
    });
}