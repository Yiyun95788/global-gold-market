// Page 7: Map Text Only
(function() {
    const container = d3.select("#map-text-content");
    
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
        .html("Geographic <span class='gold-accent'>Reality</span>");
    
    pageContainer.append("div")
        .attr("class", "gold-divider");
    
    pageContainer.append("p")
        .style("font-size", "1.3rem")
        .style("color", "var(--navy-light)")
        .style("margin-bottom", "30px")
        .style("font-weight", "300")
        .text("Where the gold is concentrated");
    
    pageContainer.append("p")
        .style("font-size", "1.1rem")
        .style("line-height", "1.8")
        .style("color", "var(--navy-light)")
        .style("margin-bottom", "25px")
        .html("Gold reserves and production reveal geopolitical strategies. While top holders have historically been G7 nations, BRICS members have steadily climbed the ranks since the 2000s.");
    
    pageContainer.append("div")
        .attr("class", "highlight-box")
        .style("margin", "30px 0")
        .html("<strong>The turning point:</strong> Around 2015, emerging economies collectively surpassed the top 3 holders. This marked a shift in global reserve behavior.");
    
    pageContainer.append("p")
        .style("font-size", "1.1rem")
        .style("line-height", "1.8")
        .style("color", "var(--navy-light)")
        .text("Explore reserves and production patterns across countries and time periods using the interactive map on the next page.");
    
})();