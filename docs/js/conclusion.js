// Page 11: Conclusion
(function() {
    const container = d3.select("#conclusion-page");
    container.html('');
    
    const article = container.append("div")
        .style("min-height", "100vh")
        .style("background", "linear-gradient(180deg, #2c2416 0%, #1a1410 100%)")
        .style("padding", "80px 0")
        .style("display", "flex")
        .style("flex-direction", "column")
        .style("justify-content", "center")
        .style("position", "relative");
    
    // Add texture overlay
    article.append("div")
        .style("position", "absolute")
        .style("top", "0")
        .style("left", "0")
        .style("right", "0")
        .style("bottom", "0")
        .style("background-image", "radial-gradient(circle, rgba(212, 175, 55, 0.05) 1px, transparent 1px)")
        .style("background-size", "30px 30px")
        .style("pointer-events", "none");
    
    const innerContent = article.append("div")
        .style("max-width", "1100px")
        .style("margin", "0 auto")
        .style("padding", "0 80px")
        .style("position", "relative")
        .style("z-index", "1");
    
    // Decorative top border
    innerContent.append("div")
        .style("width", "100%")
        .style("height", "3px")
        .style("background", "linear-gradient(to right, transparent, #D4AF37, transparent)")
        .style("margin-bottom", "50px");
    
    // Main headline
    innerContent.append("h2")
        .attr("class", "scroll-reveal")
        .style("font-family", "'Playfair Display', serif")
        .style("font-size", "3.5rem")
        .style("font-weight", "900")
        .style("text-align", "center")
        .style("text-transform", "uppercase")
        .style("letter-spacing", "4px")
        .style("color", "#D4AF37")
        .style("margin-bottom", "30px")
        .style("text-shadow", "2px 2px 4px rgba(0,0,0,0.5)")
        .text("THE QUESTION");
    
    // Subheadline
    innerContent.append("div")
        .attr("class", "scroll-reveal")
        .style("font-family", "'EB Garamond', serif")
        .style("font-size", "2rem")
        .style("font-style", "italic")
        .style("text-align", "center")
        .style("color", "#f4e8d0")
        .style("margin-bottom", "50px")
        .style("letter-spacing", "2px")
        .text("Sustainable Surge or Speculative Bubble?");
    
    // Ornamental divider
    innerContent.append("div")
        .style("text-align", "center")
        .style("color", "#8b7355")
        .style("font-size", "1.2rem")
        .style("margin", "40px 0")
        .html("◆ ◆ ◆");
    
    // Summary grid
    const summaryGrid = innerContent.append("div")
        .attr("class", "scroll-reveal")
        .style("display", "grid")
        .style("grid-template-columns", "repeat(2, 1fr)")
        .style("gap", "40px")
        .style("margin", "60px 0");
    
    const summaryPoints = [
        { title: "Record Highs", text: "Gold reached $3,800+ with 86% year-over-year growth—the most extreme sustained increase in over twenty years" },
        { title: "Crisis Volatility", text: "Current uncertainty levels match those of 2008 and COVID peaks, signaling fundamental market instability" },
        { title: "Shifting Correlations", text: "Traditional relationships between gold, equities, and the dollar have fundamentally transformed" },
        { title: "Power Concentration", text: "BRICS nations accumulate while G7 sells—a strategic rebalancing of global reserves" }
    ];
    
    summaryPoints.forEach(point => {
        const card = summaryGrid.append("div")
            .style("background", "rgba(244, 232, 208, 0.05)")
            .style("border", "2px solid rgba(212, 175, 55, 0.3)")
            .style("padding", "30px")
            .style("border-radius", "4px");
        
        card.append("h4")
            .style("font-family", "'Playfair Display', serif")
            .style("color", "#D4AF37")
            .style("font-size", "1.4rem")
            .style("margin-bottom", "15px")
            .style("text-transform", "uppercase")
            .style("letter-spacing", "2px")
            .text(point.title);
        
        card.append("p")
            .style("font-family", "'Merriweather', serif")
            .style("color", "#d4c4a8")
            .style("line-height", "1.7")
            .style("font-size", "1rem")
            .text(point.text);
    });
    
    // Pull quote style takeaway
    const takeaway = innerContent.append("div")
        .attr("class", "scroll-reveal")
        .style("border-left", "4px solid #D4AF37")
        .style("border-right", "4px solid #D4AF37")
        .style("padding", "40px 50px")
        .style("margin", "60px auto")
        .style("max-width", "800px")
        .style("background", "rgba(212, 175, 55, 0.08)");
    
    takeaway.append("div")
        .style("font-family", "'Playfair Display', serif")
        .style("font-size", "1.4rem")
        .style("font-weight", "700")
        .style("color", "#D4AF37")
        .style("text-align", "center")
        .style("margin-bottom", "20px")
        .style("text-transform", "uppercase")
        .style("letter-spacing", "3px")
        .text("For Young Investors");
    
    takeaway.append("p")
        .style("font-family", "'Merriweather', serif")
        .style("font-size", "1.15rem")
        .style("line-height", "1.8")
        .style("color", "#f4e8d0")
        .style("text-align", "center")
        .html("This is uncharted territory. Old assumptions about diversification may require rethinking. Gold offers potential returns but comes with unprecedented volatility. <strong style='color: #D4AF37;'>Caution is warranted.</strong>");
    
    // Decorative bottom border
    innerContent.append("div")
        .style("width", "100%")
        .style("height", "3px")
        .style("background", "linear-gradient(to right, transparent, #D4AF37, transparent)")
        .style("margin", "60px 0 50px");
    
    // Team credit
    const credits = innerContent.append("div")
        .attr("class", "scroll-reveal")
        .style("text-align", "center")
        .style("border-top", "1px solid rgba(212, 175, 55, 0.3)")
        .style("padding-top", "40px");
    
    credits.append("div")
        .style("font-family", "'Playfair Display', serif")
        .style("font-size", "1.3rem")
        .style("color", "#D4AF37")
        .style("margin-bottom", "15px")
        .style("letter-spacing", "2px")
        .text("ANALYTICS ASSEMBLY");
    
    credits.append("div")
        .style("font-family", "'Merriweather', serif")
        .style("font-size", "1rem")
        .style("color", "#d4c4a8")
        .style("margin-bottom", "10px")
        .text("Yiyun Zhang, Amr Alomari, Aous Alomari, Shivam Bhatt, Beryl Guo");
    
    credits.append("div")
        .style("font-family", "'EB Garamond', serif")
        .style("font-size", "0.9rem")
        .style("color", "#8b7355")
        .style("font-style", "italic")
        .text("CSC316 | University of Toronto | 2025");
})();