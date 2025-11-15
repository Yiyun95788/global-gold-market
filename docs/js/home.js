(function() {
    // Select the home page section
    const homePage = d3.select("#home-page");
    
    // Create main content container
    const content = homePage.append("div")
        .attr("class", "home-content")
        .style("text-align", "center")
        .style("color", "#FAF9F6")
        .style("max-width", "1200px")
        .style("margin", "0 auto")
        .style("padding", "40px");
    
    // Add decorative gold bar icon (placeholder for image)
    content.append("div")
        .attr("class", "home-icon")
        .style("margin-bottom", "30px")
        .html('<!-- PLACEHOLDER: Add gold-bars icon image here -->');
    
    // Main title
    content.append("h1")
        .attr("class", "home-main-title fade-in-up")
        .style("font-size", "4.5rem")
        .style("font-weight", "700")
        .style("margin-bottom", "20px")
        .style("color", "#D4AF37")
        .style("text-shadow", "0 2px 10px rgba(212, 175, 55, 0.5)")
        .text("GOLD");
    
    // Subtitle
    content.append("h2")
        .attr("class", "home-subtitle fade-in-up")
        .style("font-size", "2rem")
        .style("font-weight", "300")
        .style("margin-bottom", "30px")
        .style("color", "#FAF9F6")
        .style("animation-delay", "0.2s")
        .text("THE GREAT POWER SHIFT");
    
    // Divider
    content.append("div")
        .attr("class", "gold-divider fade-in-up")
        .style("width", "120px")
        .style("height", "3px")
        .style("background", "linear-gradient(90deg, #D4AF37 0%, #FFD700 100%)")
        .style("margin", "30px auto")
        .style("animation-delay", "0.4s");
    
    // Live gold price ticker (animated number)
    const priceContainer = content.append("div")
        .attr("class", "price-ticker fade-in-up")
        .style("margin", "40px 0")
        .style("animation-delay", "0.6s");
    
    priceContainer.append("div")
        .style("font-size", "1rem")
        .style("color", "#FFD700")
        .style("margin-bottom", "10px")
        .style("letter-spacing", "2px")
        .text("CURRENT GOLD PRICE");
    
    const priceDisplay = priceContainer.append("div")
        .attr("id", "live-price")
        .style("font-size", "3.5rem")
        .style("font-weight", "700")
        .style("color", "#D4AF37")
        .style("font-family", "Cinzel, serif")
        .text("$3,827");
    
    priceContainer.append("div")
        .style("font-size", "1rem")
        .style("color", "#FFD700")
        .style("margin-top", "5px")
        .text("PER OUNCE");
    
    // Tagline
    content.append("p")
        .attr("class", "home-tagline fade-in-up")
        .style("font-size", "1.3rem")
        .style("max-width", "800px")
        .style("margin", "40px auto")
        .style("line-height", "1.8")
        .style("color", "#FAF9F6")
        .style("font-weight", "300")
        .style("animation-delay", "0.8s")
        .html("In October 2025, gold surged past $3,800 per ounce—a <span style='color: #FFD700; font-weight: 700;'>45% annual gain</span> that broke all records. But this isn't just about price. It's about power.");
    
    // Scroll indicator
    content.append("div")
        .attr("class", "scroll-indicator fade-in-up")
        .style("margin-top", "60px")
        .style("animation-delay", "1s")
        .html('<div style="font-size: 0.9rem; color: #FFD700; margin-bottom: 10px;">SCROLL TO EXPLORE</div><div style="font-size: 2rem; animation: bounce 2s infinite;">↓</div>');
    
    // Add bounce animation for scroll indicator
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Animate price
    setInterval(() => {
        const currentPrice = 3827;
        const variation = Math.floor(Math.random() * 10) - 5;
        priceDisplay.text("$" + (currentPrice + variation).toLocaleString());
    }, 3000);
    
})();