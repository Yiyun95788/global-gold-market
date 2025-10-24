// Switch between tabs
function showTab(tabNumber) {
    // Hide all tabs
    let tabs = document.querySelectorAll('.tab-content');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    
    // Remove active from all buttons
    let buttons = document.querySelectorAll('.tab-btn');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    
    // Show selected tab
    document.getElementById('viz' + tabNumber).classList.add('active');
    buttons[tabNumber - 1].classList.add('active');
}

// Story data
let storyParagraphs = [
    {
        title: "The Gold Paradox",
        text: "In October 2025, gold surged past $3,800 per ounce, a 45% annual gain that broke all records. What makes this truly unprecedented? Stocks are rallying simultaneously. For decades, gold and equities moved in opposite directions. This rare dual surge signals something fundamentally different in global markets."
    },
    {
        title: "Historical Insight",
        text: "Gold has long been the investor's safe haven during crises. When stocks crashed in 2008 or economies shut down during COVID-19, gold prices climbed. Today's 86% year-over-year growth represents the most extreme sustained increase in over twenty years, accompanied by crisis-level volatility comparable to 2008. The combination of high prices with high uncertainty suggests instability rather than a typical bull run. Gold's traditional correlations with the dollar, stocks, and commodities have also shifted dramatically, meaning old patterns no longer apply."
    },
    {
        title: "Geopolitical Dimension",
        text: "Behind the surge lies strategic repositioning by major powers. China, India, and Russia have been steadily accumulating reserves and concentrating global gold holdings among a few key players. Meanwhile, production has shifted from the US and Russia to China, Mexico, and Canada. Gold has become not only a commodity, but also a tool of economic strategy and national security."
    },
    {
        title: "The Question: Sustainable Surge or Bubble?",
        text: "Traditional indicators are sending mixed signals. Record prices suggest strong fundamentals, but extreme volatility hints at instability. For young investors, this creates a different risk landscape than previous gold rallies. The old assumptions about diversification may need rethinking, as this is uncharted territory requiring caution rather than confidence in historical patterns."
    }
];

let currentParagraph = 0;

function showStory() {
    document.getElementById('storyOverlay').classList.remove('hidden');
    updateStoryContent();
}

function closeStory() {
    document.getElementById('storyOverlay').classList.add('hidden');
}

function nextParagraph() {
    if (currentParagraph < storyParagraphs.length - 1) {
        currentParagraph++;
        updateStoryContent();
    }
}

function prevParagraph() {
    if (currentParagraph > 0) {
        currentParagraph--;
        updateStoryContent();
    }
}

function updateStoryContent() {
    document.getElementById('storyTitle').textContent = storyParagraphs[currentParagraph].title;
    document.getElementById('storyText').textContent = storyParagraphs[currentParagraph].text;
    document.getElementById('pageIndicator').textContent = (currentParagraph + 1) + ' / ' + storyParagraphs.length;
    
    // Update navigation buttons
    let prevBtn = document.querySelector('.story-nav button:first-child');
    let nextBtn = document.querySelector('.story-nav button:last-child');
    
    prevBtn.disabled = (currentParagraph === 0);
    nextBtn.disabled = (currentParagraph === storyParagraphs.length - 1);
}

// Show story on page load
window.addEventListener('load', function() {
    showStory();
});

// Story button click
document.getElementById('storyBtn').addEventListener('click', function() {
    currentParagraph = 0;
    showStory();
});

let data = [];

d3.csv('../w6_datasets/XAU_15m_data_cleaned.csv').then(function(csvData) {
    // Process the data
    data = csvData;
    console.log('Data loaded:', data.length, 'rows');
    
    // Create visualizations
    createViz1();
    createViz2();
    createViz3();
    createViz4();
    createViz5();
});

// Viz 1
function createViz1() {
    let container = document.querySelector('#viz1 .viz-container');
    container.innerHTML = 'Visualization 1';
}

// Viz 2
function createViz2() {
    let container = document.querySelector('#viz2 .viz-container');
    container.innerHTML = 'Visualization 2';
}

// Viz 3
function createViz3() {
    let container = document.querySelector('#viz3 .viz-container');
    container.innerHTML = 'Visualization 3';
}

// Viz 4
function createViz4() {
    let container = document.querySelector('#viz4 .viz-container');
    container.innerHTML = 'Visualization 4';
}

// Viz 5
function createViz5() {
    let container = document.querySelector('#viz5 .viz-container');
    container.innerHTML = 'Visualization 5';
}