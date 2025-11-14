// Page 8: Map Visualization Only
(function() {
    const container = d3.select("#map-content");
    
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
        .attr("id", "map-viz-container")
        .style("width", "100%")
        .style("min-height", "700px");
    
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