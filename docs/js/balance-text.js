// Page 5: Balance Text
(function() {
    const container = d3.select("#balance-text-content");
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
        .text("THE BALANCE OF POWER");
    
    // Subheadline
    innerContent.append("div")
        .attr("class", "article-subheadline scroll-reveal")
        .text("G7 versus BRICS: A Tale of Two Alliances");
    
    // Dateline
    innerContent.append("div")
        .attr("class", "dateline scroll-reveal")
        .style("margin-bottom", "30px")
        .text("GEOPOLITICAL ANALYSIS");
    
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
        .html("<span style='float: left; font-size: 4rem; line-height: 0.8; font-weight: 700; margin: 5px 10px 0 0; font-family: Playfair Display, serif; color: #8b7355;'>T</span>he Group of Seven (G7) represents the leading Western industrialized nations, economies anchored around the United States dollar and the post-war financial architecture established at Bretton Woods. For decades, these nations held the majority of the world's gold reserves.");
    
    textColumns.append("p")
        .style("font-family", "'Merriweather', serif")
        .style("font-size", "1.05rem")
        .style("line-height", "1.8")
        .style("text-align", "justify")
        .style("margin-bottom", "20px")
        .html("In contrast, BRICS emerged in 2009 as a coalition of major emerging economies: Brazil, Russia, India, China, and South Africa, seeking greater autonomy from Western-dominated financial institutions. Recently expanded to include Egypt, Ethiopia, Iran, and the United Arab Emirates, this bloc represents a direct challenge to the established order. ");
    
    textColumns.append("p")
        .style("font-family", "'Merriweather', serif")
        .style("font-size", "1.05rem")
        .style("line-height", "1.8")
        .style("text-align", "justify")
        .style("margin-bottom", "20px")
        .html("Nixon’s 1971 end to dollar–gold convertibility collapsed Bretton Woods and created today’s fiat-dollar system. Since then, G7 gold reserves have trended down while emerging economies have accumulated more. ");

    textColumns.append("p")
        .style("font-family", "'Merriweather', serif")
        .style("font-size", "1.05rem")
        .style("line-height", "1.8")
        .style("text-align", "justify")
        .html("The shift in gold holdings between these two blocs tells a revealing story. While G7 nations have been net sellers of gold reserves, BRICS countries have become aggressive buyers, systematically accumulating physical gold as a hedge against dollar dominance.");
    
    // Pull quote
    const pullQuote = innerContent.append("div")
        .attr("class", "pull-quote scroll-reveal")
        .style("max-width", "700px")
        .style("margin", "40px auto");
    
    pullQuote.append("p")
        .style("margin", "0")
        .text("'Gold has been flowing from West to East, thereby boosting gold holdings of the East at the expense of the West, while increasing the importance of Asian gold markets.' - In Gold We Trust report (Incrementum AG)");
    
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
        .html("Use the interactive scale ahead to compare gold reserves across time periods. Drag countries onto either side to explore different geopolitical alignments.");
})();