// Page 4: Transition
(function() {
    const container = d3.select("#transition-page");
    container.html('');
    
    // Create fullpage article wrapper with dark background
    const article = container.append("div")
        .style("min-height", "100vh")
        .style("background", "linear-gradient(180deg, #2c2416 0%, #1a1410 100%)")
        .style("padding", "100px 0")
        .style("display", "flex")
        .style("flex-direction", "column")
        .style("justify-content", "center")
        .style("position", "relative");
    
    // Add subtle texture overlay
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
        .style("max-width", "1000px")
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
        .style("font-size", "4rem")
        .style("font-weight", "900")
        .style("text-align", "center")
        .style("text-transform", "uppercase")
        .style("letter-spacing", "3px")
        .style("color", "#D4AF37")
        .style("margin-bottom", "30px")
        .style("text-shadow", "2px 2px 4px rgba(0,0,0,0.5)")
        .text("WHO HOLDS THE GOLD");
    
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
        .text("Matters More Than The Price");
    
    // Ornamental divider
    innerContent.append("div")
        .style("text-align", "center")
        .style("color", "#8b7355")
        .style("font-size", "1.2rem")
        .style("margin", "40px 0")
        .html("◆ ◆ ◆");
    
    // Body text
    innerContent.append("p")
        .attr("class", "scroll-reveal")
        .style("font-family", "'Merriweather', serif")
        .style("font-size", "1.3rem")
        .style("line-height", "1.9")
        .style("text-align", "center")
        .style("color", "#f4e8d0")
        .style("max-width", "800px")
        .style("margin", "0 auto 40px")
        .html("Behind the surge lies strategic repositioning by major powers. China, India, and Russia have been steadily accumulating reserves, concentrating global gold holdings among a few key players.");
    
    innerContent.append("p")
        .attr("class", "scroll-reveal")
        .style("font-family", "'Merriweather', serif")
        .style("font-size", "1.2rem")
        .style("line-height", "1.9")
        .style("text-align", "center")
        .style("color", "#d4c4a8")
        .style("max-width", "700px")
        .style("margin", "0 auto")
        .html("The question is no longer simply <em>what is gold worth</em>, but rather: <strong>who controls it?</strong>");
    
    // Decorative bottom border
    innerContent.append("div")
        .style("width", "100%")
        .style("height", "3px")
        .style("background", "linear-gradient(to right, transparent, #D4AF37, transparent)")
        .style("margin-top", "50px");
    
    // Call to action
    innerContent.append("div")
        .attr("class", "scroll-reveal")
        .style("text-align", "center")
        .style("margin-top", "60px")
        .style("font-family", "'EB Garamond', serif")
        .style("font-size", "1.1rem")
        .style("color", "#8b7355")
        .style("font-style", "italic")
        .style("letter-spacing", "2px")
        .text("Continue reading to explore the balance of power...");
})();