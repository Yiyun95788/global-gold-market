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

// Viz 1 - 3D Volatility Landscape
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
    
    // Add legend
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
    
    // Filter and normalize data
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
    
    // Find min/max for scaling
    let minPrice = Math.min(...validData.map(d => d.price));
    let maxPrice = Math.max(...validData.map(d => d.price));
    let minVol = Math.min(...validData.map(d => d.volatility));
    let maxVol = Math.max(...validData.map(d => d.volatility));
    
    // Three.js setup
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
    
    // Create grid of points
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
            
            // Z is price scaled by volatility
            let normalizedPrice = (point.price - minPrice) / (maxPrice - minPrice);
            let volFactor = point.volatility / maxVol;
            let z = normalizedPrice * 100 * (0.5 + volFactor);
            
            vertices.push(x, y, z);
            
            // Color by price (green to red)
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
    
    // X axis (Time)
    let xGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-100, -60, 0),
        new THREE.Vector3(100, -60, 0)
    ]);
    scene.add(new THREE.Line(xGeo, axisMaterial));
    
    // Y axis (Volatility)
    let yGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-100, -60, 0),
        new THREE.Vector3(-100, 50, 0)
    ]);
    scene.add(new THREE.Line(yGeo, axisMaterial));
    
    // Z axis (Price)
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