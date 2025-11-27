// Page 9: Regime Text
(function() {
    const container = d3.select("#regime-text-content");
    container.html('');
    
    const article = container.append("div")
        .style("min-height", "100vh")
        .style("background", "rgba(244, 232, 208, 0.75)")
        .style("padding", "80px 0")
        .style("display", "flex")
        .style("flex-direction", "column")
        .style("justify-content", "center");
    
    const innerContent = article.append("div")
        .style("max-width", "1000px")
        .style("margin", "0 auto")
        .style("padding", "0 80px");
    
    // Headline
    innerContent.append("h2")
        .attr("class", "article-headline scroll-reveal")
        .style("border-top", "2px solid #2c2416")
        .style("border-bottom", "2px solid #2c2416")
        .style("padding", "20px 0")
        .style("margin", "0 0 20px 0")
        .text("MARKET REGIMES");
    
    // Subheadline
    innerContent.append("div")
        .attr("class", "article-subheadline scroll-reveal")
        .text("How Precious Metals Move Together Under Geopolitical Stress");
    
    // Dateline
    innerContent.append("div")
        .attr("class", "dateline scroll-reveal")
        .style("margin-bottom", "30px")
        .text("CORRELATION ANALYSIS");
    
    // Ornamental divider
    innerContent.append("div")
        .attr("class", "ornamental-divider");
    
    // Two-column text section
    const textColumns = innerContent.append("div")
        .attr("class", "text-section-columns scroll-reveal")
        .style("column-count", "2")
        .style("column-gap", "50px")
        .style("column-rule", "1px solid #d4c4a8")
        .style("margin", "40px 0");
    
    textColumns.append("p")
        .style("font-family", "'Merriweather', serif")
        .style("font-size", "1.05rem")
        .style("line-height", "1.8")
        .style("text-align", "justify")
        .style("margin-bottom", "20px")
        .html("<span style='float: left; font-size: 4rem; line-height: 0.8; font-weight: 700; margin: 5px 10px 0 0; font-family: Playfair Display, serif; color: #8b7355;'>U</span>nderstanding gold's behavior requires examining its relationship with other precious metals, particularly during periods of heightened geopolitical risk. Do gold and silver move in tandem during crises, or do they diverge?");
    
    textColumns.append("p")
        .style("font-family", "'Merriweather', serif")
        .style("font-size", "1.05rem")
        .style("line-height", "1.8")
        .style("text-align", "justify")
        .style("margin-bottom", "20px")
        .html("The concept of market regimes helps us categorize different periods based on how assets co-move. When both gold and silver rise together, we observe a risk-off regime where investors flee to precious metals. When they diverge, more complex dynamics are at play.");
    
    textColumns.append("p")
        .style("font-family", "'Merriweather', serif")
        .style("font-size", "1.05rem")
        .style("line-height", "1.8")
        .style("text-align", "justify")
        .html("From 2000 to 2025, these regime patterns have shifted in response to wars, financial crises, pandemic lockdowns, and escalating tensions between major powers. Each geopolitical shock leaves its signature in the correlation structure of precious metals.");
    
    // Pull quote
    const pullQuote = innerContent.append("div")
        .attr("class", "pull-quote scroll-reveal")
        .style("max-width", "700px")
        .style("margin", "40px auto");
    
    pullQuote.append("p")
        .style("margin", "0")
        .text("Market regimes reveal the hidden patterns of investor behavior during moments of maximum uncertainty.");
    
    // Instruction text
    innerContent.append("p")
        .attr("class", "scroll-reveal")
        .style("text-align", "center")
        .style("font-family", "'EB Garamond', serif")
        .style("font-size", "1.1rem")
        .style("line-height", "1.6")
        .style("margin", "50px auto 0")
        .style("max-width", "700px")
        .style("color", "#5c4a3a")
        .style("font-style", "italic")
        .html("The regime quilt ahead displays monthly co-movements between gold and silver across varying levels of geopolitical risk. Border thickness indicates risk intensity.");
})();