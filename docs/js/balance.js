// Page 6: Balance Scale Visualization Only
(function() {
    const container = d3.select("#balance-content");
    
    const vizContainer = container.append("div")
        .style("width", "100%")
        .style("max-width", "1800px")
        .style("margin", "0 auto")
        .style("padding", "40px")
        .style("min-height", "100vh")
        .style("display", "flex")
        .style("align-items", "center")
        .style("justify-content", "center");
    
    const vizSection = vizContainer.append("div")
        .style("width", "100%")
        .style("background", "white")
        .style("border-radius", "8px")
        .style("box-shadow", "0 4px 20px rgba(0, 0, 0, 0.1)")
        .style("padding", "40px");
    
    vizSection.append("div")
        .attr("id", "balance-viz-container")
        .style("width", "100%")
        .style("min-height", "700px");
    
    // Call createViz2
    setTimeout(() => {
        const originalQuerySelector = document.querySelector;
        document.querySelector = function(selector) {
            if (selector === '#viz2 .viz-container') {
                return document.getElementById('balance-viz-container');
            }
            return originalQuerySelector.call(document, selector);
        };
        
        createViz2();
        
        document.querySelector = originalQuerySelector;
    }, 500);
    
})();