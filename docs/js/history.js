// Page 3: Historical Context - River Chart
(function() {
    const container = d3.select("#history-content");
    container.html('');
    
    // fullpage article wrapper
    const article = container.append("div")
        .style("min-height", "100vh")
        .style("background", "rgba(244, 232, 208, 0.75)")
        .style("padding", "80px 0");
    
    const innerContent = article.append("div")
        .style("max-width", "1600px")
        .style("margin", "0 auto")
        .style("padding", "0 80px");
    
    // Headline
    innerContent.append("h2")
        .attr("class", "article-headline scroll-reveal")
        .style("border-top", "2px solid #2c2416")
        .style("border-bottom", "2px solid #2c2416")
        .style("padding", "20px 0")
        .style("margin", "0 0 20px 0")
        .text("THE LONG VIEW");
    
    // Subheadline
    innerContent.append("div")
        .attr("class", "article-subheadline scroll-reveal")
        .text("Two Decades of Gold Price Turbulence");
    
    // Dateline
    innerContent.append("div")
        .attr("class", "dateline scroll-reveal")
        .style("margin-bottom", "30px")
        .text("HISTORICAL PRICE ANALYSIS");
    
    // Ornamental divider
    innerContent.append("div")
        .attr("class", "ornamental-divider");
    
    // Two-column text section
    const textColumns = innerContent.append("div")
        .attr("class", "text-section-columns scroll-reveal")
        .style("column-count", "2")
        .style("column-gap", "50px")
        .style("column-rule", "1px solid #d4c4a8")
        .style("margin", "40px 0")
        .style("max-width", "1200px")
        .style("margin-left", "auto")
        .style("margin-right", "auto");
    
    textColumns.append("p")
        .style("font-family", "'Merriweather', serif")
        .style("font-size", "1.05rem")
        .style("line-height", "1.8")
        .style("text-align", "justify")
        .style("margin-bottom", "20px")
        .html("<span style='float: left; font-size: 4rem; line-height: 0.8; font-weight: 700; margin: 5px 10px 0 0; font-family: Playfair Display, serif; color: #8b7355;'>G</span>old's journey from 2004 to 2025 chronicles global crises and monetary upheaval. The 2008 financial collapse, European debt crisis, COVID-19 pandemic, and geopolitical tensions each left their mark on gold's trajectory.");
    
    textColumns.append("p")
        .style("font-family", "'Merriweather', serif")
        .style("font-size", "1.05rem")
        .style("line-height", "1.8")
        .style("text-align", "justify")
        .style("margin-bottom", "20px")
        .html("The year 2025 stands unprecedented. With 86 percent year-over-year growth and crisis-level volatility, we witness the most extreme sustained increase in over twenty years. The river of gold flows widest when uncertainty peaks.");
    
    textColumns.append("p")
        .style("font-family", "'Merriweather', serif")
        .style("font-size", "1.05rem")
        .style("line-height", "1.8")
        .style("text-align", "justify")
        .html("Each surge tells a story: Nixon's severing of the dollar-gold link in 1971, the inflationary 1980s, the Great Recession, pandemic lockdowns, and now—a moment that may define the next era of global finance.");
    
    // Pull quote
    const pullQuote = innerContent.append("div")
        .attr("class", "pull-quote scroll-reveal")
        .style("max-width", "800px")
        .style("margin", "50px auto");
    
    pullQuote.append("p")
        .style("margin", "0")
        .style("font-size", "1.4rem")
        .text("'Crossing the $3,000 mark underscores gold’s role as a barometer of fear and economic instability.' - Financial Express, “Why is gold surging? 3 big reasons behind the surge to $3,000” (March 14, 2025) ");
    
    // Instruction text
    innerContent.append("p")
        .attr("class", "scroll-reveal")
        .style("text-align", "center")
        .style("font-family", "'EB Garamond', serif")
        .style("font-size", "1.1rem")
        .style("line-height", "1.6")
        .style("margin", "50px auto 30px")
        .style("max-width", "800px")
        .style("color", "#5c4a3a")
        .style("font-style", "italic")
        .html("Hover over the river chart to explore price movements and volatility patterns through two decades of economic history. The width of the river represents price volatility.");
    
    // Visualization frame
    const vizFrame = innerContent.append("div")
        .attr("class", "viz-frame scroll-reveal")
        .style("margin-top", "50px")
        .style("margin-bottom", "80px")
        .style("position", "relative");
    
    vizFrame.append("div")
        .attr("class", "viz-frame-title")
        .text("Gold Price Evolution: 2004-2025");
    
    const vizContainer = vizFrame.append("div")
        .attr("id", "river-chart-container")
        .style("width", "100%")
        .style("min-height", "650px")
        .style("display", "flex")
        .style("justify-content", "center")
        .style("align-items", "center")
        .style("padding", "30px 0")
        .style("position", "relative");
    
    // Load and process data
    d3.csv('../w6_datasets/XAU_15m_data_cleaned.csv').then(rawData => {
        
        const sampledData = rawData.filter((d, i) => i % 5 === 0);
        
        const cleanData = sampledData
            .map(d => ({
                date: new Date(d.Date),
                close: +d.Close,
                high: +d.High,
                low: +d.Low
            }))
            .filter(d => !isNaN(d.close) && d.date instanceof Date && !isNaN(d.date))
            .sort((a, b) => a.date - b.date);
        
        cleanData.forEach((d, i) => {
            const window = cleanData.slice(Math.max(0, i - 90), i + 1);
            const stdDev = d3.deviation(window, w => w.close);
            d.volatility = stdDev || 10;
        });
        
        const margin = {top: 90, right: 140, bottom: 80, left: 100};
        const width = 1200 - margin.left - margin.right;
        const height = 550 - margin.top - margin.bottom;
        
        const svg = d3.select("#river-chart-container")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("background", "#faf8f3")
            .style("display", "block");
        
        const bgGradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "bg-gradient")
            .attr("x1", "0%").attr("y1", "0%")
            .attr("x2", "0%").attr("y2", "100%");
        
        bgGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#faf8f3")
            .attr("stop-opacity", 1);
        
        bgGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#f4e8d0")
            .attr("stop-opacity", 1);
        
        svg.append("rect")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("fill", "url(#bg-gradient)");
        
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        
        const xScale = d3.scaleTime()
            .domain(d3.extent(cleanData, d => d.date))
            .range([0, width]);
        
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(cleanData, d => d.close) * 1.15])
            .range([height, 0]);
        
        const volatilityScale = d3.scaleLinear()
            .domain([0, d3.max(cleanData, d => d.volatility)])
            .range([8, 80]);
        
        const riverGradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "river-gradient")
            .attr("x1", "0%").attr("x2", "100%");
        
        riverGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#e6d5b8")
            .attr("stop-opacity", 0.6);
        
        riverGradient.append("stop")
            .attr("offset", "50%")
            .attr("stop-color", "#d4af37")
            .attr("stop-opacity", 0.7);
        
        riverGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#b8922e")
            .attr("stop-opacity", 0.8);
        
        const area = d3.area()
            .defined(d => !isNaN(d.close) && !isNaN(d.volatility))
            .x(d => xScale(d.date))
            .y0(d => yScale(d.close) + volatilityScale(d.volatility) / 2)
            .y1(d => yScale(d.close) - volatilityScale(d.volatility) / 2)
            .curve(d3.curveCatmullRom.alpha(0.5));
        
        g.append("path")
            .datum(cleanData)
            .attr("d", area)
            .style("fill", "#000")
            .style("opacity", 0.1)
            .attr("transform", "translate(3, 3)");
        
        g.append("path")
            .datum(cleanData)
            .attr("class", "river-area")
            .attr("d", area)
            .style("fill", "url(#river-gradient)")
            .style("opacity", 0.85);
        
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
            .style("stroke", "#8b7355")
            .style("stroke-width", 2.5)
            .style("opacity", 0.9);
        
        const events = [
            {year: 2008, month: 9, label: '2008 Crisis', desc: 'The Global Financial Crisis triggered a flight to safety, boosting gold prices.'},
            {year: 2011, month: 9, label: 'EU Debt', desc: 'Gold’s 2011 peak was driven by Eurozone collapse fears; its bear market began the moment central banks stabilized the system and the dollar reversed upward.'},
            {year: 2015, month: 12, label: 'Fed Hikes', desc: 'The Federal Reserve raised rates for the first time in nearly a decade, marking the end of gold’s multi-year bear market and triggering a reversal'},
            {year: 2020, month: 3, label: 'COVID-19', desc: 'The pandemic caused economic uncertainty and massive stimulus, rallying gold.'},
            {year: 2022, month: 2, label: 'Ukraine', desc: 'Russia\'s invasion of Ukraine sparked geopolitical tension, supporting gold prices.'},
            {year: 2023, month: 10, label: 'ME Conflict', desc: 'Conflict in the Middle East renewed geopolitical risks and demand for safe-haven assets.'}
        ];

        // Tooltip for events
        const eventTooltip = d3.select("body").selectAll(".history-event-tooltip").data([0])
            .join("div")
            .attr("class", "history-event-tooltip")
            .style("position", "fixed")
            .style("background", "rgba(44, 36, 22, 0.95)")
            .style("color", "#f4e8d0")
            .style("padding", "12px")
            .style("border-radius", "6px")
            .style("font-family", "'Merriweather', serif")
            .style("font-size", "13px")
            .style("max-width", "250px")
            .style("pointer-events", "none")
            .style("opacity", 0)
            .style("z-index", 1000)
            .style("box-shadow", "0 4px 12px rgba(0,0,0,0.2)");
        
        events.forEach(event => {
            const eventDate = new Date(event.year, event.month - 1);
            const x = xScale(eventDate);
            
            const dataPoint = cleanData.reduce((prev, curr) => {
                return Math.abs(curr.date - eventDate) < Math.abs(prev.date - eventDate) ? curr : prev;
            });
            
            if (dataPoint) {
                const y = yScale(dataPoint.close);
                
                // Create a group for the event to handle interactions
                const eventG = g.append("g")
                    .attr("class", "event-marker")
                    .style("cursor", "pointer")
                    .on("mouseover", function(e) {
                        d3.select(this).select("rect").style("stroke-width", 2.5).style("fill", "#fff");
                        eventTooltip.transition().duration(200).style("opacity", 1);
                        eventTooltip.html(`<strong>${event.label}</strong><br/><span style="font-size:12px; opacity:0.9">${event.desc}</span>`)
                            .style("left", (e.clientX + 15) + "px")
                            .style("top", (e.clientY + 15) + "px");
                    })
                    .on("mousemove", function(e) {
                        eventTooltip.style("left", (e.clientX + 15) + "px")
                               .style("top", (e.clientY + 15) + "px");
                    })
                    .on("mouseout", function() {
                        d3.select(this).select("rect").style("stroke-width", 1.5).style("fill", "#f4e8d0");
                        eventTooltip.transition().duration(500).style("opacity", 0);
                    });

                eventG.append("line")
                    .attr("x1", x).attr("x2", x)
                    .attr("y1", y).attr("y2", -40)
                    .style("stroke", "#5c4a3a")
                    .style("stroke-width", 2)
                    .style("stroke-dasharray", "5,5")
                    .style("opacity", 0.6);
                
                eventG.append("rect")
                    .attr("x", x - 35).attr("y", -58)
                    .attr("width", 70).attr("height", 18)
                    .attr("rx", 4)
                    .style("fill", "#f4e8d0")
                    .style("stroke", "#8b7355")
                    .style("stroke-width", 1.5)
                    .style("opacity", 0.95);
                
                eventG.append("text")
                    .attr("x", x).attr("y", -44)
                    .attr("text-anchor", "middle")
                    .style("font-size", "11px")
                    .style("font-weight", "700")
                    .style("font-family", "'Merriweather', serif")
                    .style("fill", "#2c2416")
                    .style("pointer-events", "none") // Let the group handle mouse events
                    .text(event.label);
            }
        });
        
        const xAxis = d3.axisBottom(xScale)
            .ticks(12)
            .tickFormat(d3.timeFormat("%Y"));
        
        const yAxis = d3.axisLeft(yScale)
            .ticks(8)
            .tickFormat(d => `$${d.toLocaleString()}`);
        
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
            .style("font-family", "'Merriweather', serif")
            .style("font-size", "12px")
            .style("color", "#5c4a3a")
            .selectAll("text")
            .style("font-weight", "600");
        
        g.append("g")
            .call(yAxis)
            .style("font-family", "'Merriweather', serif")
            .style("font-size", "12px")
            .style("color", "#5c4a3a")
            .selectAll("text")
            .style("font-weight", "600");
        
        g.append("text")
            .attr("x", width / 2)
            .attr("y", height + 55)
            .attr("text-anchor", "middle")
            .style("font-family", "'Merriweather', serif")
            .style("font-size", "14px")
            .style("font-weight", "700")
            .style("fill", "#2c2416")
            .text("Year");
        
        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -65)
            .attr("text-anchor", "middle")
            .style("font-family", "'Merriweather', serif")
            .style("font-size", "14px")
            .style("font-weight", "700")
            .style("fill", "#2c2416")
            .text("Gold Price (USD)");
        
        const legend = g.append("g")
            .attr("transform", `translate(${width + 20}, 30)`);
        
        legend.append("rect")
            .attr("x", -12).attr("y", -12)
            .attr("width", 105).attr("height", 80)
            .attr("rx", 6)
            .style("fill", "#f4e8d0")
            .style("stroke", "#8b7355")
            .style("stroke-width", 2)
            .style("opacity", 0.95);
        
        legend.append("text")
            .attr("x", 0).attr("y", 5)
            .style("font-family", "'Merriweather', serif")
            .style("font-size", "12px")
            .style("font-weight", "700")
            .style("fill", "#2c2416")
            .text("River Width");
        
        legend.append("text")
            .attr("x", 0).attr("y", 23)
            .style("font-family", "'Merriweather', serif")
            .style("font-size", "11px")
            .style("fill", "#5c4a3a")
            .text("= Price Volatility");
        
        const miniRiver = legend.append("g").attr("transform", "translate(10, 35)");
        miniRiver.append("path")
            .attr("d", "M0,10 Q20,5 40,10 Q60,15 70,10")
            .style("fill", "none")
            .style("stroke", "#d4af37")
            .style("stroke-width", 10)
            .style("opacity", 0.5);
        
        miniRiver.append("path")
            .attr("d", "M0,10 Q20,5 40,10 Q60,15 70,10")
            .style("fill", "none")
            .style("stroke", "#8b7355")
            .style("stroke-width", 2.5);
        
        const tooltip = d3.select("#river-chart-container")
            .append("div")
            .attr("class", "river-tooltip")
            .style("position", "absolute")
            .style("background", "rgba(28, 24, 20, 0.95)")
            .style("border", "2px solid #d4af37")
            .style("border-radius", "6px")
            .style("padding", "12px 16px")
            .style("font-family", "'Merriweather', serif")
            .style("font-size", "13px")
            .style("line-height", "1.6")
            .style("color", "#f4e8d0")
            .style("box-shadow", "0 4px 12px rgba(0,0,0,0.4)")
            .style("pointer-events", "none")
            .style("opacity", 0)
            .style("z-index", "10000")
            .style("transition", "opacity 0.2s");
        
        // Add focus circle for hover
        const focus = g.append("g")
            .style("display", "none");
        
        focus.append("circle")
            .attr("r", 7)
            .style("fill", "#d4af37")
            .style("stroke", "#2c2416")
            .style("stroke-width", 3);
        
        focus.append("line")
            .attr("class", "focus-line-x")
            .style("stroke", "#8b7355")
            .style("stroke-width", 1.5)
            .style("stroke-dasharray", "4,4")
            .style("opacity", 0.6);
        
        focus.append("line")
            .attr("class", "focus-line-y")
            .style("stroke", "#8b7355")
            .style("stroke-width", 1.5)
            .style("stroke-dasharray", "4,4")
            .style("opacity", 0.6);
        
        const bisect = d3.bisector(d => d.date).left;
        
        // Overlay for mouse tracking
        svg.append("rect")
            .attr("class", "mouse-overlay")
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .style("cursor", "crosshair")
            .on("mouseover", function() {
                focus.style("display", null);
            })
            .on("mouseout", function() {
                focus.style("display", "none");
                tooltip.style("opacity", 0);
            })
            .on("mousemove", function(event) {
                const [mx] = d3.pointer(event, this);
                const date = xScale.invert(mx);
                const index = bisect(cleanData, date);
                const d = cleanData[index];
                
                if (d) {
                    const x = xScale(d.date);
                    const y = yScale(d.close);
                    
                    // Update focus position
                    focus.attr("transform", `translate(${x},${y})`);
                    focus.select(".focus-line-x")
                        .attr("x1", 0).attr("x2", 0)
                        .attr("y1", 0).attr("y2", height - y);
                    focus.select(".focus-line-y")
                        .attr("x1", 0).attr("x2", -x)
                        .attr("y1", 0).attr("y2", 0);
                    
                    // Calculate tooltip position relative to container
                    const containerRect = document.getElementById('river-chart-container').getBoundingClientRect();
                    const svgRect = svg.node().getBoundingClientRect();
                    
                    const tooltipX = (svgRect.left - containerRect.left) + margin.left + x;
                    const tooltipY = (svgRect.top - containerRect.top) + margin.top + y;
                    
                    // Update tooltip
                    tooltip.html(`
                        <div style="font-weight: 700; margin-bottom: 6px; font-size: 14px; color: #d4af37;">
                            ${d3.timeFormat("%B %d, %Y")(d.date)}
                        </div>
                        <div style="margin-bottom: 4px;">
                            <span style="color: #b8a890;">Price:</span> <span style="color: #f4e8d0; font-weight: 600;">$${d.close.toFixed(2)}</span>
                        </div>
                        <div>
                            <span style="color: #b8a890;">Volatility:</span> <span style="color: #f4e8d0; font-weight: 600;">${d.volatility.toFixed(1)}</span>
                        </div>
                    `)
                        .style("left", (tooltipX + 20) + "px")
                        .style("top", (tooltipY - 70) + "px")
                        .style("opacity", 1);
                }
            });
        
    }).catch(error => {
        console.error("Error loading data:", error);
        d3.select("#river-chart-container")
            .html("")
            .append("div")
            .style("text-align", "center")
            .style("padding", "100px")
            .style("color", "#5c4a3a")
            .style("font-family", "'Merriweather', serif")
            .html(`<div style="font-size: 1.3rem; font-weight: 700; margin-bottom: 15px;">Unable to load historical data</div>
                   <div style="font-size: 1rem; opacity: 0.7;">${error.message}</div>`);
    });
    
})();