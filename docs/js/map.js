// Page 8: Map Visualization Only
(function() {
    const container = d3.select("#map-content");
    container.html('');
    
    // Create newspaper-styled article wrapper
    const article = container.append("div")
        .style("min-height", "100vh")
        .style("background", "transparent")
        .style("padding", "60px 0");
    
    const innerContent = article.append("div")
        .style("max-width", "1800px")
        .style("margin", "0 auto")
        .style("padding", "0 60px");
    
    // Visualization frame with newspaper styling
    const vizFrame = innerContent.append("div")
        .attr("class", "viz-frame scroll-reveal")
        .style("background", "#faf8f3")
        .style("border", "3px double #8b7355")
        .style("padding", "40px")
        .style("box-shadow", "0 4px 15px rgba(0,0,0,0.1)");
    
    vizFrame.append("div")
        .attr("class", "viz-frame-title")
        .style("font-family", "'Playfair Display', serif")
        .style("font-size", "1.8rem")
        .style("font-weight", "700")
        .style("text-align", "center")
        .style("text-transform", "uppercase")
        .style("letter-spacing", "2px")
        .style("margin-bottom", "30px")
        .style("padding-bottom", "15px")
        .style("border-bottom", "2px solid #8b7355")
        .style("color", "#2c2416")
        .text("Global Gold Reserves & Production");
    
    vizFrame.append("div")
        .attr("id", "map-viz-container")
        .style("width", "100%")
        .style("min-height", "700px")
        .style("background", "#ffffff");
    
    // Call createViz3
    setTimeout(() => {
        const originalQuerySelector = document.querySelector;
        document.querySelector = function(selector) {
            if (selector === '#viz3 .viz-container') {
                return document.getElementById('map-viz-container');
            }
            return originalQuerySelector.call(document, selector);
        };
        
        createViz3();
        
        document.querySelector = originalQuerySelector;
    }, 500);
    
})();