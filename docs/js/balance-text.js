// Page 5: Balance Text Only
(function() {
    const container = d3.select("#balance-text-content");
    
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
        .html("The Balance of <span class='gold-accent'>Power</span>");
    
    pageContainer.append("div")
        .attr("class", "gold-divider");
    
    pageContainer.append("p")
        .style("font-size", "1.3rem")
        .style("color", "var(--navy-light)")
        .style("margin-bottom", "30px")
        .style("font-weight", "300")
        .text("Who holds the gold tells the real story");
    
    pageContainer.append("p")
        .style("font-size", "1.1rem")
        .style("line-height", "1.8")
        .style("color", "var(--navy-light)")
        .style("margin-bottom", "25px")
        .html("The G7 represents leading Western industrialized nations anchored around the US dollar. BRICS emerged in 2009 as a coalition of major emerging economies seeking greater autonomy.");
    
    pageContainer.append("div")
        .attr("class", "highlight-box")
        .style("margin", "30px 0")
        .html("<strong>The shift is real.</strong> BRICS nations have become heavy net buyers of gold, while many G7 members have been net sellers. This strategic repositioning signals de-dollarization trends.");
    
    pageContainer.append("p")
        .style("font-size", "1.1rem")
        .style("line-height", "1.8")
        .style("color", "var(--navy-light)")
        .text("Use the interactive scale on the next page to compare gold reserves across time. Drag countries onto either side to explore different groupings.");
    
})();