// Page 1: Home
(function() {
    const container = d3.select("#home-page");
    container.html('');
    
    // Create fullpage article wrapper
    const article = container.append("div")
        .style("min-height", "100vh")
        .style("background", "rgba(244, 232, 208, 0.75)")
        .style("padding", "80px 0")
        .style("display", "flex")
        .style("flex-direction", "column")
        .style("justify-content", "center");
    
    // Inner content wrapper
    const innerContent = article.append("div")
        .style("max-width", "1200px")
        .style("margin", "0 auto")
        .style("padding", "0 80px");
    
    // Masthead
    const masthead = innerContent.append("div")
        .attr("class", "masthead fade-in-up");
    
    masthead.append("div")
        .attr("class", "masthead-date")
        .text("Special Edition - November 2025");
    
    masthead.append("h1")
        .attr("class", "masthead-title")
        .html("THE GOLDEN <span class='gold-accent'>CHRONICLE</span>");
    
    masthead.append("div")
        .attr("class", "masthead-subtitle")
        .text("A Data Story of Power, Wealth, and Transformation");
    
    // Ornamental divider
    innerContent.append("div")
        .attr("class", "ornamental-divider")
        .style("margin", "40px 0");
    
    // Main headline
    innerContent.append("h2")
        .attr("class", "article-headline fade-in-up")
        .style("border-top", "2px solid #2c2416")
        .style("border-bottom", "2px solid #2c2416")
        .style("padding", "20px 0")
        .style("margin", "40px 0 20px 0")
        .style("text-align", "center")
        .html("GOLD: THE GREAT <span class='gold-accent'>POWER SHIFT</span>");
    
    // Text content
    const textSection = innerContent.append("div")
        .attr("class", "fade-in-up")
        .style("max-width", "900px")
        .style("margin", "40px auto");
    
    textSection.append("p")
        .style("text-align", "justify")
        .style("font-family", "Merriweather, serif")
        .style("font-size", "1.2rem")
        .style("line-height", "1.8")
        .style("margin-bottom", "20px")
        .html("<span style='float: left; font-size: 4rem; line-height: 0.8; font-weight: 700; margin: 5px 10px 0 0; font-family: Playfair Display, serif; color: #8b7355;'>I</span>n the autumn of 2025, gold prices shattered all previous records, surging past $3,800 per ounce. This unprecedented rally marks more than just another market milestone. It signals a fundamental transformation in the global financial order, a shift in economic power that has been decades in the making.");
    
    textSection.append("p")
        .style("text-align", "justify")
        .style("font-family", "Merriweather, serif")
        .style("font-size", "1.2rem")
        .style("line-height", "1.8")
        .style("margin-bottom", "20px")
        .html("For centuries, gold has served as humanity's ultimate store of value, a hedge against uncertainty, and a symbol of sovereign power. Today, as geopolitical tensions rise and monetary policies shift, gold is reclaiming its ancient role with renewed urgency.");
    
    // Pull quote
    
    textSection.append("p")
        .style("text-align", "justify")
        .style("font-family", "Merriweather, serif")
        .style("font-size", "1.2rem")
        .style("line-height", "1.8")
        .style("margin-top", "40px")
        .html("This data story explores the forces driving gold's historic ascent: from the paradox of its safe-haven status to the geographic redistribution of reserves, and the market regimes that reveal deeper truths about our changing world order.");
})();