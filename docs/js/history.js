// Page 3: Historical Context - River Chart
(function() {
    const container = d3.select("#history-content");
    
    // Create two-column layout
    const pageContainer = container.append("div")
        .attr("class", "viz-page-container");
    
    // Left: Text section
    const textSection = pageContainer.append("div")
        .attr("class", "viz-text-section fade-in-up");
    
    textSection.append("h2")
        .html("The Long <span class='gold-accent'>View</span>");
    
    textSection.append("div")
        .attr("class", "gold-divider");
    
    textSection.append("p")
        .attr("class", "subtitle")
        .text("Two decades of turbulence");
    
    textSection.append("p")
        .html("Gold's journey from 2004 to 2025 tells the story of global crises. The 2008 financial collapse, European debt crisis, COVID-19 pandemic, and geopolitical tensions—each event left its mark.");
    
    textSection.append("div")
        .attr("class", "highlight-box")
        .html("<strong>2025 is unprecedented.</strong> With 86% year-over-year growth and crisis-level volatility, we're witnessing the most extreme sustained increase in over twenty years.");
    
    textSection.append("p")
        .text("The river of gold flows wider when uncertainty peaks. Track the price movements and volatility patterns that shaped today's market.");
    
    // Right: Visualization section
    const vizSection = pageContainer.append("div")
        .attr("class", "viz-visual-section");
    
    vizSection.append("div")
        .attr("id", "river-chart-container")
        .style("width", "100%");
    
    // Load and process data
    d3.csv('../w6_datasets/XAU_15m_data_cleaned.csv').then(rawData => {
        
        // Sample data which take every 5th row
        const sampledData = rawData.filter((d, i) => i % 5 === 0);
        
        // Parse and clean data
        const cleanData = sampledData
            .map(d => ({
                date: new Date(d.Date),
                close: +d.Close,
                high: +d.High,
                low: +d.Low
            }))
            .filter(d => !isNaN(d.close) && d.date instanceof Date && !isNaN(d.date))
            .sort((a, b) => a.date - b.date);
        
        // Calculate 90-day rolling volatility for smoother river
        cleanData.forEach((d, i) => {
            const window = cleanData.slice(Math.max(0, i - 90), i + 1);
            const stdDev = d3.deviation(window, w => w.close);
            d.volatility = stdDev || 10;
        });
        
        // Setup dimensions
        const margin = {top: 80, right: 120, bottom: 70, left: 90};
        const width = 1000 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;
        
        const svg = d3.select("#river-chart-container")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
        
        // Add background gradient
        const bgGradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "bg-gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");
        
        bgGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#f8f6f1")
            .attr("stop-opacity", 1);
        
        bgGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#ffffff")
            .attr("stop-opacity", 1);
        
        svg.append("rect")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("fill", "url(#bg-gradient)");
        
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        
        // Scales
        const xScale = d3.scaleTime()
            .domain(d3.extent(cleanData, d => d.date))
            .range([0, width]);
        
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(cleanData, d => d.close) * 1.15])
            .range([height, 0]);
        
        const volatilityScale = d3.scaleLinear()
            .domain([0, d3.max(cleanData, d => d.volatility)])
            .range([8, 80]);
        
        // Create river gradient with gold tones
        const riverGradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "river-gradient")
            .attr("x1", "0%")
            .attr("x2", "100%");
        
        riverGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#f4e5c2")
            .attr("stop-opacity", 0.6);
        
        riverGradient.append("stop")
            .attr("offset", "50%")
            .attr("stop-color", "#e6c66f")
            .attr("stop-opacity", 0.7);
        
        riverGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#D4AF37")
            .attr("stop-opacity", 0.8);
        
        // Create area generator for river
        const area = d3.area()
            .defined(d => !isNaN(d.close) && !isNaN(d.volatility))
            .x(d => xScale(d.date))
            .y0(d => yScale(d.close) + volatilityScale(d.volatility) / 2)
            .y1(d => yScale(d.close) - volatilityScale(d.volatility) / 2)
            .curve(d3.curveCatmullRom.alpha(0.5));
        
        // Draw river shadow
        g.append("path")
            .datum(cleanData)
            .attr("d", area)
            .style("fill", "#000")
            .style("opacity", 0.1)
            .attr("transform", "translate(3, 3)");
        
        // Draw river
        g.append("path")
            .datum(cleanData)
            .attr("class", "river-area")
            .attr("d", area)
            .style("fill", "url(#river-gradient)")
            .style("opacity", 0.85);
        
        // Draw center line
        const line = d3.line()
            .defined(d => !isNaN(d.close))
            .x(d => xScale(d.date))
            .y(d => yScale(d.close))
            .curve(d3.curveCatmullRom.alpha(0.5));
        
        g.append("path")
            .datum(cleanData)
            .attr("class", "price-line")
            .attr("d", line)
            .style("fill", "none")
            .style("stroke", "#B8860B")
            .style("stroke-width", 2.5)
            .style("opacity", 0.9);
        
        // Major events
        const events = [
            {year: 2008, month: 9, label: '2008 Crisis'},
            {year: 2011, month: 9, label: 'EU Debt'},
            {year: 2020, month: 3, label: 'COVID-19'},
            {year: 2022, month: 2, label: 'Ukraine'},
            {year: 2024, month: 10, label: '2024 Peak'}
        ];
        
        events.forEach(event => {
            const eventDate = new Date(event.year, event.month - 1);
            const x = xScale(eventDate);
            
            const dataPoint = cleanData.reduce((prev, curr) => {
                return Math.abs(curr.date - eventDate) < Math.abs(prev.date - eventDate) ? curr : prev;
            });
            
            if (dataPoint) {
                const y = yScale(dataPoint.close);
                
                // Event line
                g.append("line")
                    .attr("x1", x)
                    .attr("x2", x)
                    .attr("y1", y)
                    .attr("y2", -30)
                    .style("stroke", "#8B4513")
                    .style("stroke-width", 2)
                    .style("stroke-dasharray", "5,5")
                    .style("opacity", 0.6);
                
                // Event label background
                g.append("rect")
                    .attr("x", x - 30)
                    .attr("y", -48)
                    .attr("width", 60)
                    .attr("height", 16)
                    .attr("rx", 3)
                    .style("fill", "#fff")
                    .style("opacity", 0.9);
                
                // Event label
                g.append("text")
                    .attr("x", x)
                    .attr("y", -36)
                    .attr("text-anchor", "middle")
                    .style("font-size", "10px")
                    .style("font-weight", "700")
                    .style("fill", "#8B4513")
                    .text(event.label);
            }
        });
        
        // Axes
        const xAxis = d3.axisBottom(xScale)
            .ticks(12)
            .tickFormat(d3.timeFormat("%Y"));
        
        const yAxis = d3.axisLeft(yScale)
            .ticks(8)
            .tickFormat(d => `$${d.toLocaleString()}`);
        
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
            .style("font-size", "12px")
            .style("color", "#666");
        
        g.append("g")
            .call(yAxis)
            .style("font-size", "12px")
            .style("color", "#666");
        
        // Axis labels
        g.append("text")
            .attr("x", width / 2)
            .attr("y", height + 50)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-weight", "600")
            .style("fill", "#2c3e50")
            .text("Year");
        
        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -60)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-weight", "600")
            .style("fill", "#2c3e50")
            .text("Gold Price (USD)");
        
        // Legend with decorative box
        const legend = g.append("g")
            .attr("transform", `translate(${width + 15}, 30)`);
        
        legend.append("rect")
            .attr("x", -10)
            .attr("y", -10)
            .attr("width", 95)
            .attr("height", 70)
            .attr("rx", 5)
            .style("fill", "#fff")
            .style("stroke", "#D4AF37")
            .style("stroke-width", 2)
            .style("opacity", 0.9);
        
        legend.append("text")
            .attr("x", 0)
            .attr("y", 5)
            .style("font-size", "11px")
            .style("font-weight", "700")
            .style("fill", "#2c3e50")
            .text("River Width");
        
        legend.append("text")
            .attr("x", 0)
            .attr("y", 22)
            .style("font-size", "10px")
            .style("fill", "#666")
            .text("= Volatility");
        
        // Add mini river illustration in legend
        const miniRiver = legend.append("g").attr("transform", "translate(10, 32)");
        miniRiver.append("path")
            .attr("d", "M0,10 Q20,5 40,10 Q60,15 70,10")
            .style("fill", "none")
            .style("stroke", "#D4AF37")
            .style("stroke-width", 8)
            .style("opacity", 0.5);
        
        miniRiver.append("path")
            .attr("d", "M0,10 Q20,5 40,10 Q60,15 70,10")
            .style("fill", "none")
            .style("stroke", "#B8860B")
            .style("stroke-width", 2);
        
        // Tooltip
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        
        // Interactive overlay
        const bisect = d3.bisector(d => d.date).left;
        
        g.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mousemove", function(event) {
                const [mx] = d3.pointer(event);
                const date = xScale.invert(mx);
                const index = bisect(cleanData, date);
                const d = cleanData[index];
                
                if (d) {
                    tooltip.transition().duration(100).style("opacity", 0.95);
                    tooltip.html(`
                        <strong>${d3.timeFormat("%b %d, %Y")(d.date)}</strong><br/>
                        Price: <span style="color: #D4AF37; font-weight: 700;">$${d.close.toFixed(2)}</span><br/>
                        Volatility: ${d.volatility.toFixed(1)}
                    `)
                        .style("left", (event.pageX + 15) + "px")
                        .style("top", (event.pageY - 35) + "px");
                }
            })
            .on("mouseout", function() {
                tooltip.transition().duration(200).style("opacity", 0);
            });
        
    }).catch(error => {
        console.error("Error loading data:", error);
        d3.select("#river-chart-container")
            .append("div")
            .style("text-align", "center")
            .style("padding", "100px")
            .style("color", "#666")
            .html(`<div style="font-size: 1.2rem;">Unable to load data</div>
                   <div style="margin-top: 10px;">${error.message}</div>`);
    });
    
})();