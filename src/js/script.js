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
    data = csvData;
    console.log('Data loaded:', data.length, 'rows');
    
    createViz1();
    createViz2();
    createViz3();
    createViz4();
    createViz5();
});

// Calculate volatility
function calculateVolatility(prices, window) {
    let volatilities = [];
    for (let i = 0; i < prices.length; i++) {
        if (i < window) {
            volatilities.push(0);
        } else {
            let windowPrices = prices.slice(i - window, i);
            let returns = [];
            for (let j = 1; j < windowPrices.length; j++) {
                returns.push(Math.log(windowPrices[j] / windowPrices[j - 1]));
            }
            let mean = returns.reduce((a, b) => a + b, 0) / returns.length;
            let variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
            volatilities.push(Math.sqrt(variance) * Math.sqrt(252) * 100);
        }
    }
    return volatilities;
}

// Viz 1
function createViz1() {
    let container = document.querySelector('#viz1 .viz-container');
    container.innerHTML = '';
    
    // Add title and controls
    let header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin: 10px; padding: 10px;';
    
    let title = document.createElement('h3');
    title.textContent = 'Gold Price & Volatility Landscape (2004-2025)';
    title.style.margin = '0';
    header.appendChild(title);
    
    let controls = document.createElement('div');
    controls.innerHTML = `
        <button onclick="setView1('top')" style="padding: 8px 15px; margin: 0 5px; cursor: pointer;">Top View</button>
        <button onclick="setView1('front')" style="padding: 8px 15px; margin: 0 5px; cursor: pointer;">Front View</button>
        <button onclick="setView1('reset')" style="padding: 8px 15px; margin: 0 5px; cursor: pointer;">Reset</button>
    `;
    header.appendChild(controls);
    
    container.appendChild(header);
    
    let vizDiv = document.createElement('div');
    vizDiv.style.width = '100%';
    vizDiv.style.height = '500px';
    vizDiv.style.position = 'relative';
    container.appendChild(vizDiv);
    
    // Legend
    let legend = document.createElement('div');
    legend.style.cssText = 'position: absolute; bottom: 20px; right: 20px; background: white; padding: 15px; border: 1px solid #ccc; z-index: 10;';
    legend.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 8px;">Price Legend</div>
        <div style="display: flex; align-items: center; margin: 4px 0;">
            <div style="width: 20px; height: 20px; background: rgb(255, 77, 51); margin-right: 8px;"></div>
            <span>High ($3800+)</span>
        </div>
        <div style="display: flex; align-items: center; margin: 4px 0;">
            <div style="width: 20px; height: 20px; background: rgb(255, 179, 51); margin-right: 8px;"></div>
            <span>$2000-$3800</span>
        </div>
        <div style="display: flex; align-items: center; margin: 4px 0;">
            <div style="width: 20px; height: 20px; background: rgb(179, 204, 51); margin-right: 8px;"></div>
            <span>$1000-$2000</span>
        </div>
        <div style="display: flex; align-items: center; margin: 4px 0;">
            <div style="width: 20px; height: 20px; background: rgb(77, 179, 51); margin-right: 8px;"></div>
            <span>Low ($400-$1000)</span>
        </div>
    `;
    vizDiv.appendChild(legend);
    
    // Calculate volatility
    let prices = data.map(d => parseFloat(d.Close));
    let volatilities = calculateVolatility(prices, 30);
    
    // Filter data
    let validData = [];
    for (let i = 0; i < data.length; i++) {
        if (volatilities[i] > 0) {
            validData.push({
                date: new Date(data[i].Date),
                price: parseFloat(data[i].Close),
                volatility: volatilities[i],
                index: i
            });
        }
    }
    
    let minPrice = Math.min(...validData.map(d => d.price));
    let maxPrice = Math.max(...validData.map(d => d.price));
    let minVol = Math.min(...validData.map(d => d.volatility));
    let maxVol = Math.max(...validData.map(d => d.volatility));
    
    let scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    
    let width = vizDiv.clientWidth;
    let height = vizDiv.clientHeight;
    let camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000);
    camera.position.set(300, 200, 300);
    camera.lookAt(0, 0, 0);
    
    let renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    vizDiv.appendChild(renderer.domElement);
    
    // Lighting
    let light1 = new THREE.DirectionalLight(0xffffff, 0.6);
    light1.position.set(200, 300, 200);
    scene.add(light1);
    let light2 = new THREE.AmbientLight(0x888888);
    scene.add(light2);
    
    let gridData = [];
    for (let i = 0; i < validData.length; i += 10) {
        gridData.push(validData[i]);
    }
    
    let timeSteps = 30;
    let volSteps = 20;
    let geometry = new THREE.BufferGeometry();
    let vertices = [];
    let colors = [];
    
    for (let t = 0; t < timeSteps; t++) {
        for (let v = 0; v < volSteps; v++) {
            let dataIdx = Math.floor((t / timeSteps) * gridData.length);
            if (dataIdx >= gridData.length) dataIdx = gridData.length - 1;
            
            let point = gridData[dataIdx];
            let x = (t / timeSteps) * 200 - 100;
            let y = (v / volSteps) * 100 - 50;
            
            let normalizedPrice = (point.price - minPrice) / (maxPrice - minPrice);
            let volFactor = point.volatility / maxVol;
            let z = normalizedPrice * 100 * (0.5 + volFactor);
            
            vertices.push(x, y, z);
            
            let r = normalizedPrice;
            let g = 1 - normalizedPrice;
            let b = 0.2;
            colors.push(r, g, b);
        }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    let material = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true
    });
    
    let points = new THREE.Points(geometry, material);
    scene.add(points);
    
    // Add grid floor
    let gridHelper = new THREE.GridHelper(200, 20, 0xcccccc, 0xeeeeee);
    gridHelper.position.y = -60;
    scene.add(gridHelper);
    
    // Add axis lines
    let axisMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    
    // X axis (time)
    let xGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-100, -60, 0),
        new THREE.Vector3(100, -60, 0)
    ]);
    scene.add(new THREE.Line(xGeo, axisMaterial));
    
    // Y axis (volatility)
    let yGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-100, -60, 0),
        new THREE.Vector3(-100, 50, 0)
    ]);
    scene.add(new THREE.Line(yGeo, axisMaterial));
    
    // Z axis (price)
    let zGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-100, -60, 0),
        new THREE.Vector3(-100, -60, 120)
    ]);
    scene.add(new THREE.Line(zGeo, axisMaterial));
    
    // Add text labels
    function makeTextSprite(message, x, y, z, scale = 40) {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        context.font = 'Bold 32px Arial';
        context.fillStyle = '#000000';
        context.fillText(message, 10, 40);
        
        let texture = new THREE.CanvasTexture(canvas);
        let spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        let sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(x, y, z);
        sprite.scale.set(scale, scale/4, 1);
        return sprite;
    }
    
    // Axis labels
    scene.add(makeTextSprite('Time (2004-2025)', 0, -75, 0));
    scene.add(makeTextSprite('Volatility %', -120, 0, 0));
    scene.add(makeTextSprite('Price ($)', -120, -60, 60));
    
    // Price axis numeric labels
    let priceSteps = [400, 1000, 2000, 3000, 3800];
    for (let i = 0; i < priceSteps.length; i++) {
        let price = priceSteps[i];
        let normalizedZ = ((price - minPrice) / (maxPrice - minPrice)) * 100;
        scene.add(makeTextSprite('$' + price, -110, -60, normalizedZ, 25));
        
        // Add tick mark
        let tickGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-105, -60, normalizedZ),
            new THREE.Vector3(-100, -60, normalizedZ)
        ]);
        scene.add(new THREE.Line(tickGeo, axisMaterial));
    }
    
    // Add key markers
    let markerGeo = new THREE.SphereGeometry(3, 16, 16);
    let marker2008 = new THREE.Mesh(markerGeo, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    marker2008.position.set(-50, 0, 30);
    scene.add(marker2008);
    scene.add(makeTextSprite('2008', -50, 10, 30, 30));
    
    let marker2025 = new THREE.Mesh(markerGeo, new THREE.MeshBasicMaterial({ color: 0x0000ff }));
    marker2025.position.set(90, 20, 80);
    scene.add(marker2025);
    scene.add(makeTextSprite('2025', 90, 30, 80, 30));
    
    // Store camera reference globally for view buttons
    window.viz1Camera = camera;
    window.viz1Scene = scene;
    window.viz1Renderer = renderer;
    window.viz1InteractionEnabled = true;
    
    // Render
    function render() {
        renderer.render(scene, camera);
    }
    render();
    
    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    renderer.domElement.addEventListener('mousedown', function(e) {
        if (window.viz1InteractionEnabled) {
            isDragging = true;
            previousMousePosition = { x: e.offsetX, y: e.offsetY };
        }
    });
    
    renderer.domElement.addEventListener('mousemove', function(e) {
        if (isDragging && window.viz1InteractionEnabled) {
            let deltaX = e.offsetX - previousMousePosition.x;
            let deltaY = e.offsetY - previousMousePosition.y;
            
            let rotSpeed = 0.005;
            let radius = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2);
            let angle = Math.atan2(camera.position.z, camera.position.x);
            angle -= deltaX * rotSpeed;
            
            camera.position.x = radius * Math.cos(angle);
            camera.position.z = radius * Math.sin(angle);
            camera.position.y += deltaY * 0.5;
            
            camera.lookAt(0, 0, 0);
            render();
        }
        previousMousePosition = { x: e.offsetX, y: e.offsetY };
    });
    
    renderer.domElement.addEventListener('mouseup', function() {
        isDragging = false;
    });
    
    renderer.domElement.addEventListener('wheel', function(e) {
        if (window.viz1InteractionEnabled) {
            e.preventDefault();
            let distance = Math.sqrt(camera.position.x ** 2 + camera.position.y ** 2 + camera.position.z ** 2);
            let newDistance = distance + e.deltaY * 0.5;
            newDistance = Math.max(150, Math.min(600, newDistance));
            
            let ratio = newDistance / distance;
            camera.position.x *= ratio;
            camera.position.y *= ratio;
            camera.position.z *= ratio;
            
            render();
        }
    });
}

// View control functions
function setView1(view) {
    if (!window.viz1Camera) return;
    
    let camera = window.viz1Camera;
    let renderer = window.viz1Renderer;
    let scene = window.viz1Scene;
    
    if (view === 'top') {
        camera.position.set(0, 200, 0);
        camera.lookAt(0, 0, 0);
        window.viz1InteractionEnabled = false;
    } else if (view === 'front') {
        camera.position.set(0, 0, 200);
        camera.lookAt(0, 0, 0);
        window.viz1InteractionEnabled = false;
    } else if (view === 'reset') {
        camera.position.set(300, 200, 300);
        camera.lookAt(0, 0, 0);
        window.viz1InteractionEnabled = true;
    }
    
    renderer.render(scene, camera);
}

// Viz 2 is now in vis2.js
// Placeholder function in case it's called before vis2.js loads
function createViz2() {
    console.log('Viz 2 loading from vis2.js...');
}

// Viz 2 OLD CODE REMOVED - now in vis2.js
/*
function createViz2Old() {
    let container = document.querySelector('#viz2 .viz-container');
    container.innerHTML = '';
    
    // Add title and controls
    let header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin: 10px; padding: 10px;';
    
    let title = document.createElement('h3');
    title.textContent = 'NATO vs BRICS: Gold Reserve Balance';
    title.style.margin = '0';
    header.appendChild(title);
    
    container.appendChild(header);
    
    // Main visualization container
    let vizDiv = document.createElement('div');
    vizDiv.style.cssText = 'width: 100%; height: 700px; position: relative; display: flex; gap: 20px;';
    container.appendChild(vizDiv);
    
    // Left panel for country selection
    let leftPanel = document.createElement('div');
    leftPanel.style.cssText = 'width: 250px; background: #f9f9f9; padding: 15px; overflow-y: auto; border-radius: 4px;';
    vizDiv.appendChild(leftPanel);
    
    // Time slider controls
    let timeControls = document.createElement('div');
    timeControls.style.cssText = 'margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px solid #ddd;';
    timeControls.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 10px;">Select Time Period</div>
        <div id="viz2-time-display" style="text-align: center; font-size: 18px; font-weight: bold; color: #333; margin-bottom: 10px;">Loading...</div>
        <input type="range" id="viz2-time-slider" style="width: 100%; margin-bottom: 10px;" min="0" max="100" value="0">
        <button id="viz2-reset-btn" style="width: 100%; padding: 8px; background: #ff5722; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 5px;">Reset Scale</button>
    `;
    leftPanel.appendChild(timeControls);
    
    // Quick compare button
    let quickCompare = document.createElement('div');
    quickCompare.style.cssText = 'margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px solid #ddd;';
    quickCompare.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 10px;">Quick Compare</div>
        <button id="viz2-compare-nato-brics" style="width: 100%; padding: 10px; cursor: pointer; border: none; border-radius: 4px; background: linear-gradient(90deg, #4A90E2 0%, #4A90E2 50%, #E8B923 50%, #E8B923 100%); color: white; font-weight: bold;">NATO vs BRICS</button>
    `;
    leftPanel.appendChild(quickCompare);
    
    // Alliance filter buttons
    let allianceFilter = document.createElement('div');
    allianceFilter.style.cssText = 'margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px solid #ddd;';
    allianceFilter.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 10px;">Filter by Alliance</div>
        <button id="viz2-filter-all" class="alliance-filter-btn active" style="width: 100%; padding: 6px; margin: 3px 0; cursor: pointer; border: none; border-radius: 3px;">All Countries</button>
        <button id="viz2-filter-nato" class="alliance-filter-btn" style="width: 100%; padding: 6px; margin: 3px 0; cursor: pointer; border: none; border-radius: 3px; background: #4A90E2; color: white;">NATO Only</button>
        <button id="viz2-filter-brics" class="alliance-filter-btn" style="width: 100%; padding: 6px; margin: 3px 0; cursor: pointer; border: none; border-radius: 3px; background: #E8B923; color: white;">BRICS Only</button>
    `;
    leftPanel.appendChild(allianceFilter);
    
    // Country list
    let countryListDiv = document.createElement('div');
    countryListDiv.id = 'viz2-country-list';
    countryListDiv.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';
    leftPanel.appendChild(countryListDiv);
    
    // Canvas for Matter.js
    let canvasContainer = document.createElement('div');
    canvasContainer.style.cssText = 'flex: 1; position: relative; background: #f5f5f5; border: 2px solid #ddd; border-radius: 4px; min-height: 700px;';
    canvasContainer.id = 'viz2-canvas-container';
    vizDiv.appendChild(canvasContainer);
    
    console.log('Canvas container created with size:', canvasContainer.clientWidth, 'x', canvasContainer.clientHeight);
    
    // Weight displays
    let weightsDiv = document.createElement('div');
    weightsDiv.style.cssText = 'position: absolute; top: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 100px; z-index: 100; pointer-events: none;';
    weightsDiv.innerHTML = `
        <div style="text-align: center; background: rgba(100, 100, 100, 0.9); padding: 15px 25px; border-radius: 8px; color: white; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
            <div style="font-size: 14px; margin-bottom: 5px;">Left Side</div>
            <div id="viz2-left-weight" style="font-size: 24px;">0 t</div>
        </div>
        <div style="text-align: center; background: rgba(100, 100, 100, 0.9); padding: 15px 25px; border-radius: 8px; color: white; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
            <div style="font-size: 14px; margin-bottom: 5px;">Right Side</div>
            <div id="viz2-right-weight" style="font-size: 24px;">0 t</div>
        </div>
    `;
    canvasContainer.appendChild(weightsDiv);
    
    // Legend
    let legend = document.createElement('div');
    legend.style.cssText = 'position: absolute; bottom: 20px; right: 20px; background: white; padding: 15px; border: 2px solid #ddd; border-radius: 4px; z-index: 100; pointer-events: none;';
    legend.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 8px;">Alliances</div>
        <div style="display: flex; align-items: center; margin: 4px 0;">
            <div style="width: 20px; height: 20px; background: #4A90E2; margin-right: 8px; border-radius: 2px;"></div>
            <span>NATO</span>
        </div>
        <div style="display: flex; align-items: center; margin: 4px 0;">
            <div style="width: 20px; height: 20px; background: #E8B923; margin-right: 8px; border-radius: 2px;"></div>
            <span>BRICS</span>
        </div>
        <div style="display: flex; align-items: center; margin: 4px 0;">
            <div style="width: 20px; height: 20px; background: #888; margin-right: 8px; border-radius: 2px;"></div>
            <span>Other</span>
        </div>
        <div style="margin-top: 10px; font-size: 12px; color: #666;">
            Drag countries onto the scale<br>Left = Blue side, Right = Gold side
        </div>
    `;
    canvasContainer.appendChild(legend);
    
    // Load gold reserves data and initialize
    d3.csv('../w6_datasets/gold_reserves_annual_quarterly_monthly.csv').then(function(csvData) {
        initViz2(csvData, canvasContainer);
    });
}

function initViz2(csvData, canvasContainer) {
    // NATO countries (current members)
    const natoCountries = [
        "Albania", "Belgium", "Bulgaria", "Canada", "Croatia", "Czechia",
        "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary",
        "Iceland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Montenegro",
        "Netherlands", "North Macedonia", "Norway", "Poland", "Portugal", "Romania",
        "Slovakia", "Slovenia", "Spain", "Sweden", "Turkey", "United Kingdom", "United States"
    ];
    
    // BRICS countries (expanded members) - will use mappings to find correct CSV names
    const bricsCountriesRaw = [
        "Brazil", 
        "Russia",
        "India", 
        "China", 
        "South Africa",
        "Egypt",
        "Ethiopia", 
        "Indonesia", 
        "Iran", 
        "United Arab Emirates"
    ];
    
    // Load country name mapping from correct path
    let countryNameMap = {};
    d3.json('../json/CountryMapIMF.json').then(function(mapping) {
        countryNameMap = mapping;
        console.log('Country mapping loaded successfully');
        processGoldData();
    }).catch((error) => {
        // If JSON fails to load, continue without mapping
        console.error('Failed to load CountryMapIMF.json:', error);
        processGoldData();
    });
    
    function normalizeCountryName(name) {
        return countryNameMap[name] || name;
    }
    
    // Process gold data by time period
    let goldDataByPeriod = {};
    let timePeriods = [];
    let currentPeriodIndex = 0;
    let currentFilter = 'all';
    
    function processGoldData() {
        // Filter for monthly data only
        const monthlyData = csvData.filter(d => d.period === 'month');
        
        // Group by time period
        monthlyData.forEach(row => {
            const period = row['Time Period'];
            const countryRaw = row['Country Name'];
            const tonnes = parseFloat(row['tonnes']);
            
            if (!period || isNaN(tonnes) || tonnes <= 0) return;
            
            // Skip aggregated regions
            if (countryRaw.includes('Economies') || countryRaw.includes('World')) return;
            
            const country = normalizeCountryName(countryRaw);
            
            if (!goldDataByPeriod[period]) {
                goldDataByPeriod[period] = {};
            }
            goldDataByPeriod[period][country] = tonnes;
        });
        
        // Get sorted time periods
        timePeriods = Object.keys(goldDataByPeriod).sort();
        
        if (timePeriods.length === 0) {
            console.error('No time periods found in data');
            return;
        }
        
        // Set to most recent period
        currentPeriodIndex = timePeriods.length - 1;
        
        // Setup time slider
        const timeSlider = document.getElementById('viz2-time-slider');
        timeSlider.max = timePeriods.length - 1;
        timeSlider.value = currentPeriodIndex;
        
        timeSlider.addEventListener('input', function(e) {
            currentPeriodIndex = parseInt(e.target.value);
            updateTimeDisplay();
            updateCountryList();
        });
        
        // Setup reset button
        document.getElementById('viz2-reset-btn').addEventListener('click', resetScale);
        
        // Setup NATO vs BRICS comparison button
        document.getElementById('viz2-compare-nato-brics').addEventListener('click', compareNATOvsBRICS);
        
        // Setup alliance filter buttons
        document.getElementById('viz2-filter-all').addEventListener('click', () => setFilter('all'));
        document.getElementById('viz2-filter-nato').addEventListener('click', () => setFilter('nato'));
        document.getElementById('viz2-filter-brics').addEventListener('click', () => setFilter('brics'));
        
        // Initialize visualization
        updateTimeDisplay();
        initMatterJS();
        updateCountryList();
    }
    
    function setFilter(filter) {
        currentFilter = filter;
        document.querySelectorAll('.alliance-filter-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.opacity = '0.7';
        });
        
        const activeBtn = filter === 'all' ? 'viz2-filter-all' : 
                         filter === 'nato' ? 'viz2-filter-nato' : 'viz2-filter-brics';
        document.getElementById(activeBtn).classList.add('active');
        document.getElementById(activeBtn).style.opacity = '1';
        
        updateCountryList();
    }
    
    function updateTimeDisplay() {
        const period = timePeriods[currentPeriodIndex];
        document.getElementById('viz2-time-display').textContent = period;
    }
    
    function getAlliance(country) {
        // Check NATO
        if (natoCountries.includes(country)) return 'NATO';
        
        // Check BRICS - need to check all variations
        const bricsVariationsMap = {
            "Brazil": ["Brazil"],
            "Russia": ["Russian Federation", "Russia"],
            "India": ["India"],
            "China": ["China, People's Republic of", "China, P.R.: Mainland", "China"],
            "South Africa": ["South Africa", "South Africa, Rep. of"],
            "Egypt": ["Egypt, Arab Republic of", "Egypt"],
            "Ethiopia": ["Ethiopia"],
            "Indonesia": ["Indonesia"],
            "Iran": ["Iran, Islamic Republic of", "Iran"],
            "United Arab Emirates": ["United Arab Emirates", "UAE"]
        };
        
        for (let bricsCountry in bricsVariationsMap) {
            if (bricsVariationsMap[bricsCountry].includes(country)) {
                return 'BRICS';
            }
        }
        
        return 'Other';
    }
    
    function getAllianceColor(alliance) {
        if (alliance === 'NATO') return '#4A90E2';
        if (alliance === 'BRICS') return '#E8B923';
        return '#888888';
    }
    
    function updateCountryList() {
        const period = timePeriods[currentPeriodIndex];
        const currentData = goldDataByPeriod[period] || {};
        
        const countryListDiv = document.getElementById('viz2-country-list');
        countryListDiv.innerHTML = '';
        
        // Get countries with data
        let countriesWithData = Object.keys(currentData)
            .filter(country => currentData[country] > 0)
            .map(country => ({
                name: country,
                tonnes: currentData[country],
                alliance: getAlliance(country)
            }))
            .filter(item => {
                if (currentFilter === 'all') return true;
                if (currentFilter === 'nato') return item.alliance === 'NATO';
                if (currentFilter === 'brics') return item.alliance === 'BRICS';
                return true;
            })
            .sort((a, b) => b.tonnes - a.tonnes);
        
        // Create draggable country bars
        countriesWithData.forEach(item => {
            const barDiv = document.createElement('div');
            barDiv.className = 'gold-bar-draggable';
            barDiv.style.cssText = `
                padding: 10px;
                background: linear-gradient(135deg, ${getAllianceColor(item.alliance)} 0%, ${getAllianceColor(item.alliance)}dd 100%);
                color: white;
                border-radius: 4px;
                cursor: grab;
                user-select: none;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                font-size: 12px;
                transition: transform 0.1s;
            `;
            barDiv.innerHTML = `
                <div style="font-weight: bold;">${item.name}</div>
                <div style="font-size: 11px; opacity: 0.9;">${item.tonnes.toFixed(1)} tonnes</div>
                <div style="font-size: 10px; opacity: 0.8;">${item.alliance}</div>
            `;
            
            barDiv.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
            });
            barDiv.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
            
            // Make it draggable onto the scale
            barDiv.addEventListener('mousedown', function(e) {
                startDragCountry(item, e);
            });
            
            countryListDiv.appendChild(barDiv);
        });
    }
    
    // Matter.js physics setup
    let engine, render, world, mouseConstraint, runner;
    let leftPlatform, rightPlatform, fulcrum, beam;
    let leftBodies = [];
    let rightBodies = [];
    let goldBars = []; // Track all gold bars for rendering text
    
    function initMatterJS() {
        // Wait for container to be rendered
        setTimeout(() => {
            const width = canvasContainer.clientWidth || 800;
            const height = canvasContainer.clientHeight || 700;
            
            console.log('Initializing Matter.js with canvas size:', width, 'x', height);
            
            // Create engine with stronger gravity
            engine = Matter.Engine.create({
                gravity: { x: 0, y: 0.8 }
            });
            world = engine.world;
        
        // Create renderer
        render = Matter.Render.create({
            element: canvasContainer,
            engine: engine,
            options: {
                width: width,
                height: height,
                wireframes: false,
                background: '#ffffff'
            }
        });
        
        // Scale positioning - lower in the canvas
        const fulcrumX = width / 2;
        const fulcrumY = height - 150;
        
        // Create fulcrum (triangle base) - larger and more visible
        const fulcrumSize = 40;
        fulcrum = Matter.Bodies.polygon(fulcrumX, fulcrumY, 3, fulcrumSize, {
            isStatic: true,
            render: {
                fillStyle: '#333333',
                strokeStyle: '#000000',
                lineWidth: 2
            },
            angle: 0
        });
        
        // Create beam (the balance bar) - longer and positioned on fulcrum
        const beamWidth = 600;
        const beamHeight = 10;
        const beamY = fulcrumY - fulcrumSize + 5;
        beam = Matter.Bodies.rectangle(fulcrumX, beamY, beamWidth, beamHeight, {
            render: {
                fillStyle: '#8B4513',
                strokeStyle: '#654321',
                lineWidth: 2
            },
            friction: 1.0,
            restitution: 0.1
        });
        
        // Create platforms on each side - larger to hold more countries
        const platformWidth = 240;
        const platformHeight = 8;
        const platformOffset = 270;
        
        leftPlatform = Matter.Bodies.rectangle(
            fulcrumX - platformOffset, 
            beamY - 5, 
            platformWidth, 
            platformHeight, 
            {
                render: {
                    fillStyle: '#4A90E2',
                    strokeStyle: '#2E5C8A',
                    lineWidth: 2
                },
                friction: 1.0,
                restitution: 0.05
            }
        );
        
        rightPlatform = Matter.Bodies.rectangle(
            fulcrumX + platformOffset, 
            beamY - 5, 
            platformWidth, 
            platformHeight, 
            {
                render: {
                    fillStyle: '#E8B923',
                    strokeStyle: '#B8921C',
                    lineWidth: 2
                },
                friction: 1.0,
                restitution: 0.05
            }
        );
        
        // Connect beam to fulcrum with revolute constraint (pivot point)
        const beamConstraint = Matter.Constraint.create({
            bodyA: beam,
            pointA: { x: 0, y: 0 },
            pointB: { x: fulcrumX, y: beamY },
            stiffness: 1,
            length: 0,
            render: { visible: false }
        });
        
        // Connect platforms to beam - fixed to beam ends
        const leftConstraint = Matter.Constraint.create({
            bodyA: beam,
            bodyB: leftPlatform,
            pointA: { x: -platformOffset, y: 0 },
            pointB: { x: 0, y: 0 },
            stiffness: 1,
            length: 0,
            render: { visible: false }
        });
        
        const rightConstraint = Matter.Constraint.create({
            bodyA: beam,
            bodyB: rightPlatform,
            pointA: { x: platformOffset, y: 0 },
            pointB: { x: 0, y: 0 },
            stiffness: 1,
            length: 0,
            render: { visible: false }
        });
        
        // Add walls to keep things contained
        const walls = [
            // Ground
            Matter.Bodies.rectangle(width / 2, height + 25, width * 2, 50, { 
                isStatic: true, 
                render: { fillStyle: '#e0e0e0' } 
            }),
            // Left wall
            Matter.Bodies.rectangle(-25, height / 2, 50, height * 2, { 
                isStatic: true, 
                render: { visible: false } 
            }),
            // Right wall
            Matter.Bodies.rectangle(width + 25, height / 2, 50, height * 2, { 
                isStatic: true, 
                render: { visible: false } 
            })
        ];
        
        // Add all bodies to world
        Matter.World.add(world, [
            fulcrum, beam, leftPlatform, rightPlatform,
            beamConstraint, leftConstraint, rightConstraint,
            ...walls
        ]);
        
        // Mouse control for interactivity
        const mouse = Matter.Mouse.create(render.canvas);
        mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        Matter.World.add(world, mouseConstraint);
        
        // Render text labels on gold bars after each render
        Matter.Events.on(render, 'afterRender', function() {
            const ctx = render.context;
            
            goldBars.forEach(bar => {
                if (!bar.countryData) return;
                
                const pos = bar.position;
                const angle = bar.angle;
                
                ctx.save();
                ctx.translate(pos.x, pos.y);
                ctx.rotate(angle);
                
                ctx.fillStyle = 'white';
                ctx.font = 'bold 8px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Truncate long names
                let displayName = bar.countryData.name;
                if (displayName.length > 14) {
                    displayName = displayName.substring(0, 12) + '..';
                }
                
                ctx.fillText(displayName, 0, -4);
                ctx.font = '7px Arial';
                ctx.fillText(bar.countryData.tonnes.toFixed(0) + 't', 0, 6);
                
                ctx.restore();
            });
        });
        
            // Run the engine and renderer with Runner (recommended API)
            runner = Matter.Runner.create();
            Matter.Runner.run(runner, engine);
            Matter.Render.run(render);
            
            console.log('Matter.js physics engine started');
            console.log('Scale components:', { fulcrum, beam, leftPlatform, rightPlatform });
            
            // Update weights continuously
            setInterval(updateWeights, 100);
        }, 100); // Wait 100ms for DOM to be ready
    }
    
    let draggedCountry = null;
    let dragOverlay = null;
    
    function startDragCountry(country, e) {
        draggedCountry = country;
        
        // Create a draggable overlay
        dragOverlay = document.createElement('div');
        dragOverlay.style.cssText = `
            position: fixed;
            padding: 10px;
            background: linear-gradient(135deg, ${getAllianceColor(country.alliance)} 0%, ${getAllianceColor(country.alliance)}dd 100%);
            color: white;
            border-radius: 4px;
            pointer-events: none;
            z-index: 10000;
            font-size: 12px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            opacity: 0.9;
        `;
        dragOverlay.innerHTML = `
            <div style="font-weight: bold;">${country.name}</div>
            <div style="font-size: 11px;">${country.tonnes.toFixed(1)} tonnes</div>
        `;
        document.body.appendChild(dragOverlay);
        
        function onMouseMove(e) {
            dragOverlay.style.left = (e.pageX + 10) + 'px';
            dragOverlay.style.top = (e.pageY + 10) + 'px';
        }
        
        function onMouseUp(e) {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            
            if (dragOverlay) {
                document.body.removeChild(dragOverlay);
                dragOverlay = null;
            }
            
            // Check if dropped on canvas
            const rect = canvasContainer.getBoundingClientRect();
            if (e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom) {
                dropCountryOnScale(country, e.clientX - rect.left, e.clientY - rect.top);
            }
            
            draggedCountry = null;
        }
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        
        onMouseMove(e);
    }
    
    function dropCountryOnScale(country, x, y, forceLeft = null) {
        const width = canvasContainer.clientWidth;
        const centerX = width / 2;
        
        // Determine which side based on drop position or forced side
        const isLeftSide = forceLeft !== null ? forceLeft : x < centerX;
        
        // Create smaller gold bar body to fit more countries
        const barWidth = 60;
        const barHeight = 22;
        
        // Physical weight based on gold reserves (scaled down for physics)
        const density = Math.max(0.001, country.tonnes / 5000);
        
        const goldBar = Matter.Bodies.rectangle(x, y, barWidth, barHeight, {
            density: density,
            friction: 0.8,
            restitution: 0.2,
            render: {
                fillStyle: getAllianceColor(country.alliance),
                strokeStyle: '#ffffff',
                lineWidth: 1.5
            },
            label: country.name,
            chamfer: { radius: 2 }
        });
        
        // Store country data
        goldBar.countryData = country;
        
        Matter.World.add(world, goldBar);
        goldBars.push(goldBar);
        
        if (isLeftSide) {
            leftBodies.push(goldBar);
        } else {
            rightBodies.push(goldBar);
        }
    }
    
    function updateWeights() {
        let leftWeight = 0;
        let rightWeight = 0;
        
        leftBodies.forEach(body => {
            if (body.countryData) {
                leftWeight += body.countryData.tonnes;
            }
        });
        
        rightBodies.forEach(body => {
            if (body.countryData) {
                rightWeight += body.countryData.tonnes;
            }
        });
        
        document.getElementById('viz2-left-weight').textContent = leftWeight.toFixed(1) + ' t';
        document.getElementById('viz2-right-weight').textContent = rightWeight.toFixed(1) + ' t';
    }
    
    function compareNATOvsBRICS() {
        // Reset scale first
        resetScale();
        
        const period = timePeriods[currentPeriodIndex];
        const currentData = goldDataByPeriod[period] || {};
        
        // Get NATO countries with data - need to match CSV names
        const natoCountriesMapping = {
            "Albania": "Albania",
            "Belgium": "Belgium",
            "Bulgaria": "Bulgaria",
            "Canada": "Canada",
            "Croatia": "Croatia",
            "Czechia": "Czech Republic",
            "Denmark": "Denmark",
            "Estonia": "Estonia",
            "Finland": "Finland",
            "France": "France",
            "Germany": "Germany",
            "Greece": "Greece",
            "Hungary": "Hungary",
            "Iceland": "Iceland",
            "Italy": "Italy",
            "Latvia": "Latvia",
            "Lithuania": "Lithuania",
            "Luxembourg": "Luxembourg",
            "Montenegro": "Montenegro",
            "Netherlands": "Netherlands, The",
            "North Macedonia": "North Macedonia, Republic of",
            "Norway": "Norway",
            "Poland": "Poland, Republic of",
            "Portugal": "Portugal",
            "Romania": "Romania",
            "Slovakia": "Slovak Republic",
            "Slovenia": "Slovenia",
            "Spain": "Spain",
            "Sweden": "Sweden",
            "Turkey": "Turkey",
            "United Kingdom": "United Kingdom",
            "United States": "United States"
        };
        
        const natoCountriesWithData = natoCountries
            .filter(country => {
                const csvName = natoCountriesMapping[country] || country;
                return currentData[csvName] && currentData[csvName] > 0;
            })
            .map(country => {
                const csvName = natoCountriesMapping[country] || country;
                return {
                    name: csvName,
                    tonnes: currentData[csvName],
                    alliance: 'NATO'
                };
            });
        
        // Get BRICS countries with data - try multiple name variations
        const bricsCountriesWithData = [];
        
        // BRICS country name variations - all possible CSV names from the data
        const bricsVariationsMap = {
            "Brazil": ["Brazil"],
            "Russia": ["Russian Federation", "Russia"],
            "India": ["India"],
            "China": ["China, People's Republic of", "China, P.R.: Mainland", "China"],
            "South Africa": ["South Africa", "South Africa, Rep. of"],
            "Egypt": ["Egypt, Arab Republic of", "Egypt"],
            "Ethiopia": ["Ethiopia"],
            "Indonesia": ["Indonesia"],
            "Iran": ["Iran, Islamic Republic of", "Iran"],
            "United Arab Emirates": ["United Arab Emirates", "UAE"]
        };
        
        bricsCountriesRaw.forEach(country => {
            const variations = bricsVariationsMap[country] || [country];
            for (let variant of variations) {
                if (currentData[variant] && currentData[variant] > 0) {
                    bricsCountriesWithData.push({
                        name: variant,
                        tonnes: currentData[variant],
                        alliance: 'BRICS'
                    });
                    break; // Found it, move to next country
                }
            }
        });
        
        console.log('BRICS countries found:', bricsCountriesWithData.length, bricsCountriesWithData);
        
        const width = canvasContainer.clientWidth;
        const fulcrumX = width / 2;
        const fulcrumY = canvasContainer.clientHeight / 2 + 50;
        const platformOffset = 200;
        
        // Add NATO countries to left side - spread them out vertically
        natoCountriesWithData.forEach((country, index) => {
            const x = fulcrumX - platformOffset + (Math.random() - 0.5) * 80;
            const y = 50 + (index * 30);
            setTimeout(() => {
                dropCountryOnScale(country, x, y, true);
            }, index * 80);
        });
        
        // Add BRICS countries to right side
        bricsCountriesWithData.forEach((country, index) => {
            const x = fulcrumX + platformOffset + (Math.random() - 0.5) * 80;
            const y = 50 + (index * 30);
            setTimeout(() => {
                dropCountryOnScale(country, x, y, false);
            }, index * 80);
        });
    }
    
    function resetScale() {
        // Remove all gold bars
        goldBars.forEach(body => Matter.World.remove(world, body));
        
        leftBodies = [];
        rightBodies = [];
        goldBars = [];
        
        updateWeights();
    }
}
*/
// END OF VIZ 2 OLD CODE

// Viz 3
function createViz3() {
    let container = document.querySelector('#viz3 .viz-container');
    container.innerHTML = '';
    
    // Set up dimensions
    const width = 800;
    const height = 500;
    
    // Create main container with controls
    const mainContainer = d3.select(container)
        .append('div')
        .style('display', 'flex')
        .style('flex-direction', 'column')
        .style('align-items', 'center')
        .style('gap', '10px');
    
    // Add title
    mainContainer.append('h3')
        .text('Gold Reserves by Country - Start of Year Comparison')
        .style('margin', '0')
        .style('text-align', 'center');
    
    // Add controls container
    const controlsContainer = mainContainer.append('div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('gap', '20px')
        .style('margin-bottom', '10px')
        .style('flex-wrap', 'wrap')
        .style('justify-content', 'center');
    
    // Year controls
    const yearControls = controlsContainer.append('div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('gap', '10px');
    
    yearControls.append('label')
        .text('Year:')
        .style('font-weight', 'bold');
    
    const yearSlider = yearControls.append('input')
        .attr('type', 'range')
        .attr('id', 'yearSlider-viz3')
        .style('width', '200px');
    
    const yearDisplay = yearControls.append('span')
        .attr('id', 'yearValue-viz3')
        .style('font-weight', 'bold')
        .style('min-width', '50px');
    
    // Data type selector
    const dataTypeControls = controlsContainer.append('div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('gap', '10px');
    
    dataTypeControls.append('label')
        .text('Data Type:')
        .style('font-weight', 'bold');
    
    const dataTypeSelect = dataTypeControls.append('select')
        .attr('id', 'dataTypeSelect-viz3')
        .style('padding', '5px 10px')
        .style('border', '1px solid #ccc')
        .style('border-radius', '4px')
        .style('font-size', '14px');
    
    dataTypeSelect.append('option')
        .attr('value', 'reserves')
        .text('Gold Reserves');
    
    dataTypeSelect.append('option')
        .attr('value', 'production')
        .text('Gold Production');
    
    dataTypeSelect.append('option')
        .attr('value', 'both')
        .text('Both Reserves & Production');
    
    // Create SVG
    const svg = mainContainer.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    const projection = d3.geoNaturalEarth1()
        .scale(120)
        .translate([width / 2, height / 2]);
    
    const path = d3.geoPath().projection(projection);
    
    // Color scale for gold reserves - using vibrant blue gradient
    const colorScale = d3.scaleSequential()
        .domain([0, 1]) // Will be updated with actual data range
        .interpolator(t => {
            // Custom interpolation from light blue to deep navy
            if (t < 0.2) return d3.interpolateRgb("#E6F3FF", "#4A90E2")(t * 5); // Light blue to medium blue
            if (t < 0.4) return d3.interpolateRgb("#4A90E2", "#1E3A8A")((t - 0.2) * 5); // Medium blue to dark blue
            if (t < 0.6) return d3.interpolateRgb("#1E3A8A", "#1E40AF")((t - 0.4) * 5); // Dark blue to deeper blue
            if (t < 0.8) return d3.interpolateRgb("#1E40AF", "#1E3A8A")((t - 0.6) * 5); // Deeper blue to navy
            return d3.interpolateRgb("#1E3A8A", "#0F172A")((t - 0.8) * 5); // Navy to very dark navy
        });
    
    // Load world map data, gold reserves data, and country mapping
    Promise.all([
        d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'),
        d3.csv('../src/data/gold_reserves_annual_quarterly_monthly.csv'),
        d3.json('../src/json/GeoJSON.json')
    ]).then(function([world, goldData, countryMapping]) {
        
        // Process data to get the first data point in the year for each country and year
        const reservesByCountryAndYear = {};
        const availableYears = new Set();
        
        // Define exclusions for regional/economic groupings and historical entities
        const exclusions = [
            'Advanced Economies',
            'CIS',
            'Central African Economic and Monetary Community',
            'Emerging and Developing Asia',
            'Emerging and Developing Countries',
            'Emerging and Developing Europe',
            'Euro Area',
            'Europe',
            'Middle East, North Africa, Afghanistan, and Pakistan',
            'Sub-Saharan Africa',
            'West African Economic and Monetary Union (WAEMU)',
            'Western Hemisphere',
            'World',
            'Czechoslovakia',
            'Netherlands Antilles',
            'Yugoslavia, SFR'
        ];
        
        goldData.forEach(d => {
            const country = d['Country Name'];
            const tonnes = +d.tonnes;
            const timePeriod = d['Time Period'];
            const period = d.period; // Use the period column from CSV
            
            if (isNaN(tonnes) || tonnes <= 0) return;
            if (!country || !timePeriod) return;
            
            // Skip if this is a grouped entity or historical entity
            if (exclusions.includes(country)) {
                return;
            }
            
            // Parse time period to get year
            let year;
            
            if (timePeriod.includes('Q')) {
                // Quarter format: 1995Q1 -> year=1995
                year = parseInt(timePeriod.split('Q')[0]);
            } else if (timePeriod.includes('-')) {
                // Month format: 2004-02 -> year=2004
                year = parseInt(timePeriod.split('-')[0]);
            } else {
                // Annual data
                year = parseInt(timePeriod);
            }
            
            if (!year || isNaN(year)) return;
            
            // Initialize country data if not exists
            if (!reservesByCountryAndYear[country]) {
                reservesByCountryAndYear[country] = {};
            }
            
            // Store data if we don't have any data for this country/year yet
            if (!reservesByCountryAndYear[country][year]) {
                reservesByCountryAndYear[country][year] = {
                    tonnes: tonnes,
                    timePeriod: timePeriod,
                    period: period
                };
                availableYears.add(year);
            }
        });
        
        
        
        // Convert years to sorted array
        const years = Array.from(availableYears).sort((a, b) => a - b);
                
        if (years.length === 0) {
            container.innerHTML = '<p>No valid gold reserves data found.</p>';
            return;
        }
        
        // Set up slider
        yearSlider
            .attr('min', years[0])
            .attr('max', years[years.length - 1])
            .attr('value', years[0])
            .attr('step', 1);
        
        yearDisplay.text(years[0]);        

        // Function to draw map for specific year
        function drawMap(selectedYear) {
            
            // Clear existing map
            svg.selectAll('.country').remove();
            svg.selectAll('.legend').remove();
            svg.selectAll('.tooltip').remove();
            
            // Get data for selected year
            const reservesForYear = {};
            Object.entries(reservesByCountryAndYear).forEach(([country, countryData]) => {
                if (countryData[selectedYear]) {
                    reservesForYear[country] = countryData[selectedYear];
                }
            });
            
            
            
            
            // Calculate min/max reserves for color scaling
            const reservesValues = Object.values(reservesForYear).map(d => d.tonnes);
            const minReserves = Math.min(...reservesValues);
            const maxReserves = Math.max(...reservesValues);
            
            // Update color scale domain
            colorScale.domain([minReserves, maxReserves]);
            
            // Draw the map
            svg.selectAll('.country')
                .data(world.features)
                .enter()
                .append('path')
                .attr('class', 'country')
                .attr('d', path)
                .attr('fill', d => {
                    // Find matching country data
                    const countryName = d.properties.NAME || d.properties.name;
                    const countryData = reservesForYear[countryName];
                    
                    if (countryData) {
                        return colorScale(countryData.tonnes);
                    }
                    return '#f0f0f0'; // Default color for countries without data
                })
                .attr('stroke', '#333')
                .attr('stroke-width', 0.5)
                .on('mouseover', function(event, d) {
                    const countryName = d.properties.NAME || d.properties.name;
                    const countryData = reservesForYear[countryName];
                    
                    d3.select(this)
                        .attr('stroke', '#000')
                        .attr('stroke-width', 2);
                    
                    if (countryData) {
                        const tooltip = svg.append('g')
                            .attr('class', 'tooltip')
                            .attr('transform', `translate(${event.offsetX}, ${event.offsetY})`);
                        
                        tooltip.append('rect')
                            .attr('x', 0)
                            .attr('y', 0)
                            .attr('width', 200)
                            .attr('height', 60)
                            .attr('fill', 'white')
                            .attr('stroke', '#333')
                            .attr('rx', 5);
                        
                        tooltip.append('text')
                            .attr('x', 10)
                            .attr('y', 20)
                            .attr('font-size', '14px')
                            .attr('font-weight', 'bold')
                            .text(countryName);
                        
                        tooltip.append('text')
                            .attr('x', 10)
                            .attr('y', 40)
                            .attr('font-size', '12px')
                            .text(`Gold Reserves: ${countryData.tonnes.toLocaleString()} tonnes`);
                    }
                })
                .on('mouseout', function() {
                    d3.select(this)
                        .attr('stroke', '#333')
                        .attr('stroke-width', 0.5);
                    
                    svg.selectAll('.tooltip').remove();
                });
            
            // Add legend
            const legend = svg.append('g')
                .attr('class', 'legend')
                .attr('transform', `translate(${width - 150}, 30)`);
            
            const legendScale = d3.scaleLinear()
                .domain([minReserves, maxReserves])
                .range([0, 100]);
            
            const legendAxis = d3.axisRight(legendScale)
                .ticks(5)
                .tickFormat(d3.format('.0f'));
            
            legend.append('g')
                .attr('class', 'legend-axis')
                .call(legendAxis);
            
            // Add legend title
            legend.append('text')
                .attr('x', 10)
                .attr('y', -10)
                .attr('text-anchor', 'start')
                .attr('font-size', '12px')
                .text('Gold Reserves (tonnes)');
            
            // Create gradient for legend
            const defs = svg.append('defs');
            const gradient = defs.append('linearGradient')
                .attr('id', 'legend-gradient')
                .attr('x1', '0%')
                .attr('x2', '0%')
                .attr('y1', '0%')
                .attr('y2', '100%');
            
            gradient.selectAll('stop')
                .data(d3.range(0, 1.1, 0.1))
                .enter()
                .append('stop')
                .attr('offset', d => `${d * 100}%`)
                .attr('stop-color', d => {
                    const value = minReserves + d * (maxReserves - minReserves);
                    return colorScale(value);
                });
            
            legend.append('rect')
                .attr('x', -10)
                .attr('y', 0)
                .attr('width', 15)
                .attr('height', 100)
                .attr('fill', 'url(#legend-gradient)')
                .attr('stroke', '#333');
        }
        
        drawMap(years[0]);
        
        // Add slider event listener
        yearSlider.on('input', function() {
            const selectedYear = parseInt(this.value);
            yearDisplay.text(selectedYear);
            drawMap(selectedYear);
        });
        
        // Add data type selector event listener (placeholder - functionality not implemented yet)
        dataTypeSelect.on('change', function() {
            const selectedDataType = this.value;
            console.log('Data type changed to:', selectedDataType);
            // TODO: Implement functionality to switch between reserves, production, or both
            // This will be implemented in future iterations
        });
    })
}

// Viz 4
function createViz4() {
    let container = document.querySelector('#viz4 .viz-container');
    const assets = ['Gold', 'BTC', 'USD', 'Silver', 'S&P 500'];
    
    Promise.all([
        d3.csv('../w6_datasets/SP500 oil gold bitcoin.csv'),
        d3.csv('data/Silver Futures Historical Data.csv'),
        d3.csv('data/US Dollar Index Futures Historical Data.csv')
    ]).then(function([mainData, silverData, usdData]) {
        const combined = {};
        
        mainData.forEach(d => {
            combined[d.Date] = {gold: +d.Gold, btc: +d.BITCOIN, sp500: +d['S&P500']};
        });
        
        silverData.forEach(d => {
            const p = d.Date.split('/');
            const key = `${p[2]}-${p[0].padStart(2, '0')}-${p[1].padStart(2, '0')}`;
            if (combined[key]) combined[key].silver = +d.Price.replace(/,/g, '');
        });
        
        usdData.forEach(d => {
            const p = d.Date.split('/');
            const key = `${p[2]}-${p[0].padStart(2, '0')}-${p[1].padStart(2, '0')}`;
            if (combined[key]) combined[key].usd = +d.Price.replace(/,/g, '');
        });
        
        const correlationData = {};
        for (let year = 2010; year <= 2024; year++) {
            const yearData = Object.keys(combined)
                .filter(d => d.startsWith(year.toString()))
                .map(d => combined[d])
                .filter(d => d.gold && d.btc && d.usd && d.silver && d.sp500);
            
            if (yearData.length < 20) continue;
            
            const allAssets = [
                yearData.map(d => d.gold),
                yearData.map(d => d.btc),
                yearData.map(d => d.usd),
                yearData.map(d => d.silver),
                yearData.map(d => d.sp500)
            ];
            
            correlationData[year] = [];
            for (let i = 0; i < 5; i++) {
                correlationData[year][i] = [];
                for (let j = 0; j < 5; j++) {
                    const x = allAssets[i], y = allAssets[j], n = x.length;
                    const sumX = x.reduce((a, b) => a + b, 0);
                    const sumY = y.reduce((a, b) => a + b, 0);
                    const sumXY = x.reduce((s, xi, k) => s + xi * y[k], 0);
                    const sumX2 = x.reduce((s, xi) => s + xi * xi, 0);
                    const sumY2 = y.reduce((s, yi) => s + yi * yi, 0);
                    const num = n * sumXY - sumX * sumY;
                    const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
                    correlationData[year][i][j] = den === 0 ? 0 : num / den;
                }
            }
        }
        
        const years = Object.keys(correlationData).map(y => parseInt(y)).sort();
        
        container.innerHTML = '';
        
        const vizWrapper = d3.select(container)
            .append('div')
            .style('display', 'flex')
            .style('flex-direction', 'column')
            .style('align-items', 'center')
            .style('justify-content', 'center')
            .style('height', '100%')
            .style('gap', '0');
        
        const svgContainer = vizWrapper.append('div');
        
        const margin = {top: 80, right: 100, bottom: 10, left: 110};
        const cellSize = 90;
        const width = cellSize * 5 + margin.left + margin.right;
        const height = cellSize * 5 + margin.top + margin.bottom;
        
        const svg = svgContainer
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);
        
        const colorScale = d3.scaleLinear()
            .domain([-1, 0, 1])
            .range(['#ef4444', '#ffffff', '#3b82f6']);
        
        function draw(year) {
            const data = correlationData[year];
            if (!data) return;
            
            svg.selectAll('g').remove();
            const g = svg.append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);
            
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', 35)
                .attr('text-anchor', 'middle')
                .style('font-size', '20px')
                .style('font-weight', '700')
                .style('fill', '#1f2937')
                .text('How strongly is gold price correlated with other financial assets?');
            
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    const value = data[i][j];
                    g.append('rect')
                        .attr('class', 'heatmap-cell')
                        .attr('x', j * cellSize)
                        .attr('y', i * cellSize)
                        .attr('width', cellSize)
                        .attr('height', cellSize)
                        .attr('fill', colorScale(value))
                        .on('mouseover', function(event) {
                            d3.select(this).style('opacity', 0.8);
                            tooltip.transition().duration(200).style('opacity', 1);
                            tooltip.html(`<strong>${assets[i]} vs ${assets[j]}</strong><br/>Correlation: ${value.toFixed(2)}<br/>Year: ${year}`)
                                .style('left', (event.pageX + 10) + 'px')
                                .style('top', (event.pageY - 10) + 'px');
                        })
                        .on('mouseout', function() {
                            d3.select(this).style('opacity', 1);
                            tooltip.transition().duration(200).style('opacity', 0);
                        });
                    
                    g.append('text')
                        .attr('class', 'heatmap-value')
                        .attr('x', j * cellSize + cellSize / 2)
                        .attr('y', i * cellSize + cellSize / 2 + 5)
                        .attr('text-anchor', 'middle')
                        .style('font-weight', 'bold')
                        .text(value.toFixed(2));
                }
            }
            
            assets.forEach((asset, i) => {
                g.append('text')
                    .attr('class', 'heatmap-label')
                    .attr('x', -10)
                    .attr('y', i * cellSize + cellSize / 2 + 5)
                    .attr('text-anchor', 'end')
                    .text(asset);
                g.append('text')
                    .attr('class', 'heatmap-label')
                    .attr('x', i * cellSize + cellSize / 2)
                    .attr('y', -10)
                    .attr('text-anchor', 'middle')
                    .text(asset);
            });
            
            const legendHeight = 250, legendWidth = 20;
            const legendX = width - margin.right + 30;
            const legendY = margin.top + (cellSize * 5 - legendHeight) / 2;
            
            const gradient = svg.append('defs')
                .append('linearGradient')
                .attr('id', 'legend-gradient')
                .attr('x1', '0%')
                .attr('y1', '100%')
                .attr('x2', '0%')
                .attr('y2', '0%');
            gradient.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', '#ef4444');
            gradient.append('stop')
                .attr('offset', '50%')
                .attr('stop-color', '#ffffff');
            gradient.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', '#3b82f6');
            
            svg.append('rect')
                .attr('x', legendX)
                .attr('y', legendY)
                .attr('width', legendWidth)
                .attr('height', legendHeight)
                .attr('rx', 4)
                .style('fill', 'url(#legend-gradient)')
                .style('stroke', '#e5e7eb')
                .style('stroke-width', 1);
            
            svg.append('g')
                .attr('transform', `translate(${legendX + legendWidth}, ${legendY})`)
                .call(d3.axisRight(d3.scaleLinear().domain([1, -1]).range([0, legendHeight])).ticks(5).tickFormat(d => d.toFixed(1)));
            
            svg.append('text')
                .attr('x', legendX + legendWidth / 2)
                .attr('y', legendY - 10)
                .attr('text-anchor', 'middle')
                .style('font-size', '12px')
                .style('font-weight', '600')
                .text('Positive');
            
            svg.append('text')
                .attr('x', legendX + legendWidth / 2)
                .attr('y', legendY + legendHeight + 20)
                .attr('text-anchor', 'middle')
                .style('font-size', '12px')
                .style('font-weight', '600')
                .text('Negative');
        }
        
        const controls = vizWrapper.append('div')
            .attr('class', 'controls');
        
        controls.append('label')
            .attr('for', 'yearSlider')
            .text('Year:');
        
        const sliderInput = controls.append('input')
            .attr('type', 'range')
            .attr('id', 'yearSlider-viz')
            .attr('min', years[0])
            .attr('max', years[years.length - 1])
            .attr('value', years[0])
            .attr('step', 1);
        
        const yearDisplay = controls.append('span')
            .attr('id', 'yearValue-viz')
            .text(years[0]);
        
        draw(years[0]);
        
        sliderInput.on('input', function() {
            const year = parseInt(this.value);
            yearDisplay.text(year);
            draw(year);
        });
    });
}

// Viz 5
function createViz5() {
    let container = document.querySelector('#viz5 .viz-container');
    container.innerHTML = 'Visualization 5';
}