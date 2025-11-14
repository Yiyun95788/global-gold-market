// Page 8: Conclusion
(function() {
    const conclusionPage = d3.select("#conclusion-page");
    
    const content = conclusionPage.append("div")
        .attr("class", "conclusion-content")
        .style("max-width", "1200px")
        .style("margin", "0 auto")
        .style("padding", "60px 40px")
        .style("color", "#FAF9F6");
    
    // Title
    content.append("h2")
        .style("font-size", "3rem")
        .style("font-weight", "700")
        .style("text-align", "center")
        .style("color", "#D4AF37")
        .style("margin-bottom", "40px")
        .text("THE QUESTION");
    
    // Main question
    content.append("h3")
        .style("font-size", "2rem")
        .style("font-weight", "300")
        .style("text-align", "center")
        .style("color", "#FFD700")
        .style("margin-bottom", "60px")
        .text("Sustainable Surge or Bubble?");
    
    // Summary points
    const summaryContainer = content.append("div")
        .style("display", "grid")
        .style("grid-template-columns", "repeat(auto-fit, minmax(300px, 1fr))")
        .style("gap", "40px")
        .style("margin-bottom", "60px");
    
    const summaryPoints = [
        {
            title: "Record Highs",
            text: "Gold reached $3,800+ with 86% YoY growth—the most extreme in 20 years"
        },
        {
            title: "Crisis Volatility",
            text: "Current uncertainty levels match 2008 and COVID peaks, signaling instability"
        },
        {
            title: "Shifting Correlations",
            text: "Traditional relationships with stocks, USD, and commodities have changed"
        },
        {
            title: "Power Concentration",
            text: "BRICS nations accumulating while G7 sells—a strategic rebalancing"
        }
    ];
    
    summaryPoints.forEach(point => {
        const card = summaryContainer.append("div")
            .style("background", "rgba(255, 255, 255, 0.1)")
            .style("padding", "30px")
            .style("border-radius", "8px")
            .style("border", "1px solid rgba(212, 175, 55, 0.3)");
        
        card.append("h4")
            .style("color", "#FFD700")
            .style("font-size", "1.3rem")
            .style("margin-bottom", "15px")
            .text(point.title);
        
        card.append("p")
            .style("line-height", "1.6")
            .text(point.text);
    });
    
    // Takeaway box
    content.append("div")
        .style("background", "linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(255, 215, 0, 0.1) 100%)")
        .style("border", "2px solid #D4AF37")
        .style("border-radius", "8px")
        .style("padding", "40px")
        .style("text-align", "center")
        .style("margin", "60px 0")
        .html(`
            <div style="font-size: 1.5rem; font-weight: 700; color: #FFD700; margin-bottom: 20px;">For Young Investors</div>
            <div style="font-size: 1.1rem; line-height: 1.8; max-width: 700px; margin: 0 auto;">
                This is uncharted territory. Old assumptions about diversification may need rethinking. 
                Gold offers potential but comes with unprecedented volatility. 
                <strong style="color: #FFD700;">Caution is warranted.</strong>
            </div>
        `);
    
    // Team info
    const teamSection = content.append("div")
        .style("text-align", "center")
        .style("margin-top", "80px")
        .style("padding-top", "40px")
        .style("border-top", "1px solid rgba(212, 175, 55, 0.3)");
    
    teamSection.append("h4")
        .style("font-size", "1.5rem")
        .style("color", "#D4AF37")
        .style("margin-bottom", "20px")
        .text("AnalyticsAssembly");
    
    teamSection.append("p")
        .style("font-size", "1rem")
        .style("color", "#FAF9F6")
        .style("margin-bottom", "10px")
        .text("Yiyun Zhang, Amr Alomari, Aous Alomari, Shivam Bhatt, Beryl Guo");
    
    teamSection.append("p")
        .style("font-size", "0.9rem")
        .style("color", "rgba(250, 249, 246, 0.7)")
        .text("CSC316 | University of Toronto | 2025");
    
})();