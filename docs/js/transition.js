(function() {
    // Select the transition page section
    const transitionPage = d3.select("#transition-page");
    
    // Create main content container
    const content = transitionPage.append("div")
        .attr("class", "transition-content")
        .style("text-align", "center")
        .style("color", "#FAF9F6")
        .style("max-width", "900px")
        .style("margin", "0 auto")
        .style("padding", "60px 40px");
    
    // Decorative icon (placeholder)
    content.append("div")
        .attr("class", "transition-icon")
        .style("margin-bottom", "40px")
        .style("font-size", "4rem")
        .html('<!-- PLACEHOLDER: Add globe-gold icon image here -->');
    
    // Main heading
    content.append("h2")
        .attr("class", "transition-heading")
        .style("font-size", "3rem")
        .style("font-weight", "700")
        .style("margin-bottom", "30px")
        .style("color", "#D4AF37")
        .text("WHO HOLDS THE GOLD");
    
    // Subheading
    content.append("h3")
        .attr("class", "transition-subheading")
        .style("font-size", "1.8rem")
        .style("font-weight", "300")
        .style("margin-bottom", "40px")
        .style("color", "#FFD700")
        .text("MATTERS MORE THAN THE PRICE");
    
    // Description
    content.append("p")
        .style("font-size", "1.2rem")
        .style("line-height", "1.8")
        .style("color", "#FAF9F6")
        .style("max-width", "700px")
        .style("margin", "0 auto 40px")
        .html("Behind the surge lies strategic repositioning by major powers. China, India, and Russia have been steadily accumulating reserves, concentrating global gold holdings among a few key players.");
    
    // Gold divider
    content.append("div")
        .attr("class", "gold-divider")
        .style("width", "100px")
        .style("height", "3px")
        .style("background", "linear-gradient(90deg, #D4AF37 0%, #FFD700 100%)")
        .style("margin", "40px auto");
    
    // Call to action
    content.append("p")
        .style("font-size", "1.1rem")
        .style("color", "#FFD700")
        .style("font-style", "italic")
        .text("Explore the balance of power...");
    
})();