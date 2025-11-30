// Page 7: Map Text
(function() {
    const container = d3.select("#map-text-content");
    container.html('');
    
    const article = container.append("div")
        .style("min-height", "100vh")
        .style("background", "rgba(244, 232, 208, 0.75)")
        .style("padding", "80px 0")
        .style("display", "flex")
        .style("flex-direction", "column")
        .style("justify-content", "center");
    
    const innerContent = article.append("div")
        .style("max-width", "1600px")
        .style("margin", "0 auto")
        .style("padding", "0 80px");
    
    // Headline
    innerContent.append("h2")
        .attr("class", "article-headline scroll-reveal")
        .style("border-top", "2px solid #2c2416")
        .style("border-bottom", "2px solid #2c2416")
        .style("padding", "20px 0")
        .style("margin", "0 0 20px 0")
        .text("GEOGRAPHIC REALITY");
    
    // Subheadline
    innerContent.append("div")
        .attr("class", "article-subheadline scroll-reveal")
        .text("Where Gold Reserves and Production Concentrate");
    
    // Dateline
    innerContent.append("div")
        .attr("class", "dateline scroll-reveal")
        .style("margin-bottom", "30px")
        .text("GLOBAL RESERVES MAPPING");
    
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
        .html("<span style='float: left; font-size: 4rem; line-height: 0.8; font-weight: 700; margin: 5px 10px 0 0; font-family: Playfair Display, serif; color: #8b7355;'>G</span>old reserves and production patterns reveal the underlying geopolitical strategies of nations. Official gold reserves remain heavily concentrated in the post-war core. The U.S. alone holds about 8,100 tonnes of gold, while Germany, Italy, and France together hold roughly another 8,200 tonnes, leaving the U.S. and Europe with well over half of reported global central-bank gold reserves. These stocks are largely “legacy hoards” accumulated under and shortly after Bretton Woods, with Western central banks mostly holding steady rather than aggressively adding to them in recent decades.");
    
    textColumns.append("p")
        .style("font-family", "'Merriweather', serif")
        .style("font-size", "1.05rem")
        .style("line-height", "1.8")
        .style("text-align", "justify")
        .style("margin-bottom", "20px")
        .html("By contrast, emerging markets have become the main source of new official demand. BRICS members and other emerging economies now hold roughly one-fifth of global official gold reserves, and their central banks have been responsible for the bulk of net gold purchases since the early 2000s. Record central-bank buying of over 1,000 tonnes per year in 2022 and 2023 was driven primarily by countries such as China, Russia, Turkey, India, and Kazakhstan, which explicitly cite diversification away from the dollar and greater monetary resilience as key motives.");
    
    textColumns.append("p")
        .style("font-family", "'Merriweather', serif")
        .style("font-size", "1.05rem")
        .style("line-height", "1.8")
        .style("text-align", "justify")
        .html("The intersection with production underscores how the monetary map is shifting. Europe stores a disproportionate share of global official reserves but contributes relatively little to current mine output, whereas China and Russia now rank among both the largest producers and the fastest-growing official holders of gold. At the same time, many African and Latin American states are significant gold exporters with comparatively small official reserves, effectively supplying metal into a system where fiscal and monetary power is still anchored in Western vaults but increasingly reinforced by emerging-market accumulation.");
    
    // Pull quote
    const pullQuote = innerContent.append("div")
        .attr("class", "pull-quote scroll-reveal")
        .style("max-width", "700px")
        .style("margin", "40px auto");
    
    pullQuote.append("p")
        .style("margin", "0")
        .text("'The East is not only stocking up on gold and mining gold itself on a large scale. China and Russia have ranked among the top 3 gold producing nations for years.' — Ronnie Stoeferle, “5 Signs that Gold Will increasingly Flow to the East” (2023)");
    
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
        .html("Explore the interactive map ahead to trace reserves and production patterns across countries and decades.");
})();