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
        .html("<span style='float: left; font-size: 4rem; line-height: 0.8; font-weight: 700; margin: 5px 10px 0 0; font-family: Playfair Display, serif; color: #8b7355;'>G</span>old reserves and production patterns reveal the underlying geopolitical strategies of nations. While historically dominated by G7 countries and Switzerland, the geography of gold has shifted dramatically since the turn of the millennium.");
    
    textColumns.append("p")
        .style("font-family", "'Merriweather', serif")
        .style("font-size", "1.05rem")
        .style("line-height", "1.8")
        .style("text-align", "justify")
        .style("margin-bottom", "20px")
        .html("China, Russia, and India have steadily climbed the ranks of top gold holders. These emerging powers view gold not merely as a financial asset but as a strategic resource essential to national sovereignty and monetary independence.");
    
    textColumns.append("p")
        .style("font-family", "'Merriweather', serif")
        .style("font-size", "1.05rem")
        .style("line-height", "1.8")
        .style("text-align", "justify")
        .html("Around 2015, a crucial threshold was crossed: emerging economies collectively surpassed the traditional top holders in total gold reserves. This marked a fundamental shift in global reserve behavior and signaled the beginning of a new era in monetary geopolitics.");
    
    // Pull quote
    const pullQuote = innerContent.append("div")
        .attr("class", "pull-quote scroll-reveal")
        .style("max-width", "700px")
        .style("margin", "40px auto");
    
    pullQuote.append("p")
        .style("margin", "0")
        .text("Geography is destiny in the gold market. Control over reserves and production defines economic sovereignty.");
    
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