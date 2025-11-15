// Page 10: Regime Visualization Only
(function() {
    const container = d3.select("#regime-content");
    
    const vizContainer = container.append("div")
        .style("width", "100%")
        .style("max-width", "1900px")
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
        .attr("id", "regime-viz-container")
        .style("width", "100%")
        .style("min-height", "800px");
    
    // Call createViz5
    setTimeout(() => {
        const originalQuerySelector = document.querySelector;
        document.querySelector = function(selector) {
            if (selector === '#viz5 .viz-container') {
                return document.getElementById('regime-viz-container');
            }
            return originalQuerySelector.call(document, selector);
        };
        
        createViz5();
        
        document.querySelector = originalQuerySelector;
    }, 500);
    
})();