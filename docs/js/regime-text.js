// Page 9: Regime Text Only
(function() {
    const container = d3.select("#regime-text-content");
    
    const pageContainer = container.append("div")
        .style("max-width", "900px")
        .style("margin", "0 auto")
        .style("padding", "80px 40px")
        .style("height", "100vh")
        .style("display", "flex")
        .style("flex-direction", "column")
        .style("justify-content", "center");
    
    pageContainer.append("h2")
        .style("font-size", "3rem")
        .style("color", "var(--gold-primary)")
        .style("margin-bottom", "20px")
        .style("font-weight", "700")
        .html("Market <span class='gold-accent'>Regimes</span>");
    
    pageContainer.append("div")
        .attr("class", "gold-divider");
    
    pageContainer.append("p")
        .style("font-size", "1.3rem")
        .style("color", "var(--navy-light)")
        .style("margin-bottom", "30px")
        .style("font-weight", "300")
        .text("How assets move together");
    
    pageContainer.append("p")
        .style("font-size", "1.1rem")
        .style("line-height", "1.8")
        .style("color", "var(--navy-light)")
        .style("margin-bottom", "25px")
        .html("Understanding gold's behavior requires examining its co-movement with other precious metals during periods of geopolitical tension.");
    
    pageContainer.append("div")
        .attr("class", "highlight-box")
        .style("margin", "30px 0")
        .html("<strong>Regime analysis:</strong> The quilt on the next page shows how gold and silver returns align (or diverge) across different geopolitical risk environments from 2000-2025.");
    
    pageContainer.append("p")
        .style("font-size", "1.1rem")
        .style("line-height", "1.8")
        .style("color", "var(--navy-light)")
        .text("Border thickness indicates geopolitical risk intensity. Click legend items to filter patterns.");
    
})();