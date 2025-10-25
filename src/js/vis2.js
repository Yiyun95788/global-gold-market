// Viz 2 - NATO vs BRICS Gold Balance Scale
function createViz2() {
    let container = document.querySelector('#viz2 .viz-container');
    container.innerHTML = '';
    
    // Add title
    let header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin: 10px; padding: 10px;';
    
    let title = document.createElement('div');
    title.style.margin = '0';
    title.innerHTML = `
        <div style="font-size: 18px; font-weight: 700;">Gold Reserve Balances (1950-2019)</div>
        <div style="font-size: 12px; color: #555; margin-top: 2px;">Drag the countries onto the scale to compare gold reserves</div>
    `;
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
        <button id="viz2-compare-g7-brics" style="width: 100%; padding: 10px; cursor: pointer; border: none; border-radius: 4px; background: linear-gradient(90deg, #4A90E2 0%, #4A90E2 50%, #E8B923 50%, #E8B923 100%); color: white; font-weight: bold; margin-bottom: 8px;">G7 vs BRICS</button>
        <button id="viz2-compare-g7-brics-top3" style="width: 100%; padding: 10px; cursor: pointer; border: none; border-radius: 4px; background: linear-gradient(90deg, #4A90E2 0%, #4A90E2 50%, #E8B923 50%, #E8B923 100%); color: white; font-weight: bold; margin-bottom: 8px;">G7 vs BRICS (Top 3)</button>
        <button id="viz2-compare-top10-rest" style="width: 100%; padding: 10px; cursor: pointer; border: none; border-radius: 4px; background: linear-gradient(90deg, #7b1fa2 0%, #7b1fa2 50%, #9e9e9e 50%, #9e9e9e 100%); color: white; font-weight: bold;">Top 10 vs Rest of World</button>
        <button id="viz2-compare-top3-rest" style="width: 100%; padding: 10px; cursor: pointer; border: none; border-radius: 4px; background: linear-gradient(90deg, #512da8 0%, #512da8 50%, #9e9e9e 50%, #9e9e9e 100%); color: white; font-weight: bold; margin-top: 8px;">Top 3 vs Rest of World</button>
    `;
    leftPanel.appendChild(quickCompare);
    
    // Alliance filter buttons
    let allianceFilter = document.createElement('div');
    allianceFilter.style.cssText = 'margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px solid #ddd;';
    allianceFilter.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 10px;">Filter by Alliance</div>
        <button id="viz2-filter-all" class="alliance-filter-btn active" style="width: 100%; padding: 6px; margin: 3px 0; cursor: pointer; border: none; border-radius: 3px;">All Countries</button>
        <button id="viz2-filter-g7" class="alliance-filter-btn" style="width: 100%; padding: 6px; margin: 3px 0; cursor: pointer; border: none; border-radius: 3px; background: #4A90E2; color: white;">G7 Only</button>
        <button id="viz2-filter-brics" class="alliance-filter-btn" style="width: 100%; padding: 6px; margin: 3px 0; cursor: pointer; border: none; border-radius: 3px; background: #E8B923; color: white;">BRICS Only</button>
        <input id="viz2-search" type="text" placeholder="Search countries..." style="margin-top: 10px; width: 100%; box-sizing: border-box; padding: 8px 10px; border: 1px solid #ccc; border-radius: 4px;" />
    `;
    leftPanel.appendChild(allianceFilter);
    
    // Country list title
    let countryListTitle = document.createElement('div');
    countryListTitle.style.cssText = 'font-weight: bold; margin-bottom: 10px; color: #333; font-size: 14px;';
    countryListTitle.textContent = 'Countries: Drag to one side of the scale to place';
    leftPanel.appendChild(countryListTitle);
    
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
    
    // Weight displays
    let weightsDiv = document.createElement('div');
    weightsDiv.style.cssText = 'position: absolute; top: 20px; left: 50%; transform: translateX(20%); display: flex; gap: 100px; z-index: 100; pointer-events: none;';
    weightsDiv.innerHTML = `
        <div style="text-align: center; background: rgba(74, 144, 226, 0.9); padding: 15px 25px; border-radius: 8px; color: white; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
            <div style="font-size: 14px; margin-bottom: 5px;">Left Side</div>
            <div id="viz2-left-weight" style="font-size: 24px;">0 t</div>
        </div>
        <div style="text-align: center; background: rgba(232, 185, 35, 0.9); padding: 15px 25px; border-radius: 8px; color: white; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
            <div style="font-size: 14px; margin-bottom: 5px;">Right Side</div>
            <div id="viz2-right-weight" style="font-size: 24px;">0 t</div>
        </div>
    `;
    canvasContainer.appendChild(weightsDiv);
    
    // Explanation text box
    let explanationDiv = document.createElement('div');
    explanationDiv.id = 'viz2-explanation';
    explanationDiv.style.cssText = 'position: absolute; top: 120px; left: calc(50% + 20% - 50px); width: 300px; background: rgba(255, 255, 255, 0.95); padding: 15px 20px; border-radius: 8px; border: 2px solid #ddd; z-index: 100; pointer-events: none; text-align: left; box-shadow: 0 2px 8px rgba(0,0,0,0.1);';
    explanationDiv.innerHTML = `
        <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #333;">Scale Information</div>
        <div id="viz2-explanation-text" style="font-size: 14px; color: #666; line-height: 1.4;">Click a comparison button to see detailed information about the gold reserve analysis.</div>
    `;
    canvasContainer.appendChild(explanationDiv);
    
    // Legend
    let legend = document.createElement('div');
    legend.style.cssText = 'position: absolute; bottom: 20px; right: 20px; background: white; padding: 15px; border: 2px solid #ddd; border-radius: 4px; z-index: 100; pointer-events: none;';
    legend.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 8px;">Alliances</div>
        <div style="display: flex; align-items: center; margin: 4px 0;">
            <div style="width: 20px; height: 20px; background: #4A90E2; margin-right: 8px; border-radius: 2px;"></div>
            <span>G7</span>
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
            Drag countries onto the scale<br>
        </div>
    `;
    canvasContainer.appendChild(legend);
    
    // Load gold reserves data and initialize
    d3.csv('../w6_datasets/gold_reserves_annual_quarterly_monthly.csv').then(function(csvData) {
        initViz2(csvData, canvasContainer);
    });
}

function initViz2(csvData, canvasContainer) {
    console.log('Initializing Viz2 with', csvData.length, 'data rows');
    
    // G7 countries
    const g7Countries = [
        "Canada", "France", "Germany", "Italy", "Japan", "United Kingdom", "United States of America"
    ];
    
    // BRICS countries
    const bricsCountriesRaw = [
        "Brazil", "Russia", "India", "China", "South Africa",
        "Egypt", "Ethiopia", "Indonesia", "Iran", "United Arab Emirates"
    ];
    
    // Process gold data
    let goldDataByPeriod = {};
    let timePeriods = [];
    let currentPeriodIndex = 0;
    let currentFilter = 'all';
    let countryNameMap = {}; // Will be loaded from JSON
    
    // Explanation dictionary for different comparison buttons
    const explanationTexts = {
        'g7-brics': 'G7 VS BRICS\n\nThe G7 represents the leading Western industrialised nations anchored around the US dollar. The BRICS grouping (Brazil, Russia, India, China, South Africa) emerged in 2009 as a coalition of major emerging economies seeking greater autonomy from Western-dominated institutions.\n\nThe US formally ended conversion of the dollar to gold in 1971, transitioning away from the gold‐standard era.\nFederal Reserve History\n\nToday, BRICS nations have become heavy net buyers of gold as a reserve asset, while many G7 members have been net sellers',
        'g7-brics-top3': 'G7 VS BRICS\n\nThe G7 represents the leading Western industrialised nations anchored around the US dollar. The BRICS grouping (Brazil, Russia, India, China, South Africa) emerged in 2009 as a coalition of major emerging economies seeking greater autonomy from Western-dominated institutions.\n\nThe US formally ended conversion of the dollar to gold in 1971, transitioning away from the gold‐standard era.\nFederal Reserve History\n\nToday, BRICS nations have become heavy net buyers of gold as a reserve asset, while many G7 members have been net sellers',
        'top10-rest': 'Top 10 Gold Holders\n\nWhile the top 10 gold reserves have long been dominated by G7 countries, BRICS members have steadily climbed the ranks. In 2002, China became a consistent top 10 holder, marking the start of a long-term accumulation trend. Russia followed in 2008, expanding its reserves rapidly as part of a broader move to reduce reliance on the US dollar. In 2009, India joined the top 10 after a major gold purchase from the IMF. Turkey entered the list in 2013 and has remained a top holder since, later expressing interest in joining the BRICS alliance in 2018.',
        'top3-rest': 'Top 3 vs Rest of the World\n\nThe world\'s top three gold holders have shifted slightly over the years, but they have consistently remained G7 nations, often including Switzerland. Switzerland\'s large reserves reflect its historic role as a global gold trading and refining hub, as well as a traditional safe haven for wealth. Before 2015, these top holders collectively owned more gold than the entire rest of the world combined. Around 2015, however, emerging economies collectively surpassed them, as countries such as China, Russia, Turkey, and India began rapidly increasing their reserves. This marked a turning point in global reserve behavior, with non-Western central banks becoming the dominant buyers of gold and signaling a gradual move away from reliance on the US dollar.',
        'default': 'Click a comparison button to see detailed information about the gold reserve analysis. Each comparison reveals different aspects of global gold distribution and strategic reserves.'
    };
    
    // Matter.js variables
    let engine, render, world, runner;
    let leftCup, rightCup, beam, fulcrum;
    let leftBodies = [];
    let rightBodies = [];
    let goldBars = [];
    
    // Load country name mapping
    d3.json('json/CountryMapIMF.json').then(data => {
        countryNameMap = data;
        console.log('Country name map loaded');
    }).catch(err => {
        console.error('Failed to load CountryMapIMF.json:', err);
    });
    
    function processGoldData() {
        // Only monthly rows, sorted so last-known values propagate correctly
        const monthlyData = csvData
            .filter(d => d.period === 'month')
            .sort((a, b) => new Date(a['Time Period']) - new Date(b['Time Period']));
        
        let cumulativeData = {};
        monthlyData.forEach(row => {
            const period = row['Time Period'];
            const countryRaw = row['Country Name'];
            const tonnes = parseFloat(row['tonnes']);
            
            if (!period || isNaN(tonnes) || tonnes <= 0) return;
            if (countryRaw.includes('Economies') || countryRaw.includes('World')) return;
            
            if (!goldDataByPeriod[period]) {
                goldDataByPeriod[period] = { ...cumulativeData };
            }
            goldDataByPeriod[period][countryRaw] = tonnes;
            cumulativeData[countryRaw] = tonnes;
        });
        
        timePeriods = Object.keys(goldDataByPeriod).sort();
        console.log('Processed', timePeriods.length, 'time periods');
        
        if (timePeriods.length === 0) {
            console.error('No time periods found');
            return;
        }
        
        currentPeriodIndex = timePeriods.length - 1;
        
        const timeSlider = document.getElementById('viz2-time-slider');
        timeSlider.max = timePeriods.length - 1;
        timeSlider.value = currentPeriodIndex;
        
        timeSlider.addEventListener('input', function(e) {
            currentPeriodIndex = parseInt(e.target.value);
            updateTimeDisplay();
            updateCountryList();
        });
        
        document.getElementById('viz2-reset-btn').addEventListener('click', resetScale);
        document.getElementById('viz2-compare-g7-brics').addEventListener('click', () => {
            updateExplanation('g7-brics');
            compareG7vsBRICS();
        });
        document.getElementById('viz2-filter-all').addEventListener('click', () => setFilter('all'));
        document.getElementById('viz2-filter-g7').addEventListener('click', () => setFilter('g7'));
        document.getElementById('viz2-filter-brics').addEventListener('click', () => setFilter('brics'));
        
        const btnTop3 = document.getElementById('viz2-compare-g7-brics-top3');
        if (btnTop3) {
            btnTop3.addEventListener('click', () => {
                updateExplanation('g7-brics-top3');
                compareG7vsBRICSTop3();
            });
        }
        const btnTop10Rest = document.getElementById('viz2-compare-top10-rest');
        if (btnTop10Rest) {
            btnTop10Rest.addEventListener('click', () => {
                updateExplanation('top10-rest');
                compareTop10VsRest();
            });
        }
        const btnTop3Rest = document.getElementById('viz2-compare-top3-rest');
        if (btnTop3Rest) {
            btnTop3Rest.addEventListener('click', () => {
                updateExplanation('top3-rest');
                compareTop3VsRest();
            });
        }
        
        // Search filter
        const searchInput = document.getElementById('viz2-search');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                updateCountryList();
            });
        }
        
        updateTimeDisplay();
        initD3Scale();
        updateCountryList();
    }
    
    function setFilter(filter) {
        currentFilter = filter;
        document.querySelectorAll('.alliance-filter-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.opacity = '0.7';
        });
        
        const activeBtn = filter === 'all' ? 'viz2-filter-all' : 
                         filter === 'g7' ? 'viz2-filter-g7' : 'viz2-filter-brics';
        document.getElementById(activeBtn).classList.add('active');
        document.getElementById(activeBtn).style.opacity = '1';
        
        updateCountryList();
    }
    
    function updateTimeDisplay() {
        const period = timePeriods[currentPeriodIndex];
        document.getElementById('viz2-time-display').textContent = period;
    }
    
    function updateExplanation(explanationKey) {
        const explanationText = explanationTexts[explanationKey] || explanationTexts['default'];
        const explanationElement = document.getElementById('viz2-explanation-text');
        if (explanationElement) {
            explanationElement.innerHTML = explanationText.replace(/\n/g, '<br>');
        }
    }
    
    function getAlliance(country) {
        if (g7Countries.includes(country)) return 'G7';
        
        const bricsVariations = {
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
        
        for (let bricsCountry in bricsVariations) {
            if (bricsVariations[bricsCountry].includes(country)) {
                return 'BRICS';
            }
        }
        
        return 'Other';
    }
    
    function getAllianceColor(alliance) {
        if (alliance === 'G7') return '#4A90E2';
        if (alliance === 'BRICS') return '#E8B923';
        return '#888888';
    }
    
    function updateCountryList() {
        const period = timePeriods[currentPeriodIndex];
        const currentData = goldDataByPeriod[period] || {};
        
        const countryListDiv = document.getElementById('viz2-country-list');
        countryListDiv.innerHTML = '';
        
        const query = (document.getElementById('viz2-search')?.value || '').trim().toLowerCase();

        let countriesWithData = Object.keys(currentData)
            .filter(country => currentData[country] > 0)
            .map(country => ({
                name: country,
                tonnes: currentData[country],
                alliance: getAlliance(country)
            }))
            .filter(item => {
                if (currentFilter === 'all') return true;
                if (currentFilter === 'g7') return item.alliance === 'G7';
                if (currentFilter === 'brics') return item.alliance === 'BRICS';
                return true;
            })
            .filter(item => {
                if (!query) return true;
                return item.name.toLowerCase().includes(query);
            })
            .sort((a, b) => b.tonnes - a.tonnes);
        
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
            
            barDiv.addEventListener('mousedown', function(e) {
                startDragCountry(item, e);
            });
            
            countryListDiv.appendChild(barDiv);
        });
    }
    
    function initD3Scale() {
        const width = canvasContainer.clientWidth || 800;
        const height = canvasContainer.clientHeight || 700;
        
        console.log('Creating D3 scale:', width, 'x', height);
        
        // Scale state
        let leftWeight = 0;
        let rightWeight = 0;
        let leftBlocks = [];
        let rightBlocks = [];
        
        // Scale positioning
        const centerX = width / 2;
        const baseY = height - 250;
        const cupWidth = 200;
        const cupHeight = 120;
        const cupOffset = 220;
        const beamLength = 480;
        
        // Create SVG
        const svg = d3.select(canvasContainer)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', '#ffffff');
        
        // Main scale group (will rotate for tipping)
        const scaleGroup = svg.append('g')
            .attr('class', 'scale-group');
        
        // Fulcrum triangle
        svg.append('polygon')
            .attr('points', `${centerX},${baseY - 20} ${centerX - 24},${baseY + 16} ${centerX + 24},${baseY + 16}`)
            .attr('fill', '#333333')
            .attr('stroke', '#000000')
            .attr('stroke-width', 2);
        
        // Beam
        const beam = scaleGroup.append('rect')
            .attr('x', centerX - beamLength/2)
            .attr('y', baseY - 24)
            .attr('width', beamLength)
            .attr('height', 8)
            .attr('fill', '#8B4513')
            .attr('stroke', '#654321')
            .attr('stroke-width', 2);
        
        // Left cup group
        const leftCupGroup = scaleGroup.append('g')
            .attr('class', 'left-cup');
        
        // Left cup - bottom
        leftCupGroup.append('rect')
            .attr('x', centerX - cupOffset - cupWidth/2)
            .attr('y', baseY + 80)
            .attr('width', cupWidth)
            .attr('height', 6)
            .attr('fill', '#E8C45A')
            .attr('stroke', '#D4A843')
            .attr('stroke-width', 2);
        
        // Left cup - left wall
        leftCupGroup.append('rect')
            .attr('x', centerX - cupOffset - cupWidth/2)
            .attr('y', baseY + 20)
            .attr('width', 6)
            .attr('height', cupHeight)
            .attr('fill', '#E8C45A')
            .attr('stroke', '#D4A843')
            .attr('stroke-width', 2);
        
        // Left cup - right wall
        leftCupGroup.append('rect')
            .attr('x', centerX - cupOffset + cupWidth/2 - 6)
            .attr('y', baseY + 20)
            .attr('width', 6)
            .attr('height', cupHeight)
            .attr('fill', '#E8C45A')
            .attr('stroke', '#D4A843')
            .attr('stroke-width', 2);
        
        // Right cup group
        const rightCupGroup = scaleGroup.append('g')
            .attr('class', 'right-cup');
        
        // Right cup - bottom
        rightCupGroup.append('rect')
            .attr('x', centerX + cupOffset - cupWidth/2)
            .attr('y', baseY + 80)
            .attr('width', cupWidth)
            .attr('height', 6)
            .attr('fill', '#E8C45A')
            .attr('stroke', '#D4A843')
            .attr('stroke-width', 2);
        
        // Right cup - left wall
        rightCupGroup.append('rect')
            .attr('x', centerX + cupOffset - cupWidth/2)
            .attr('y', baseY + 20)
            .attr('width', 6)
            .attr('height', cupHeight)
            .attr('fill', '#E8C45A')
            .attr('stroke', '#D4A843')
            .attr('stroke-width', 2);
        
        // Right cup - right wall
        rightCupGroup.append('rect')
            .attr('x', centerX + cupOffset + cupWidth/2 - 6)
            .attr('y', baseY + 20)
            .attr('width', 6)
            .attr('height', cupHeight)
            .attr('fill', '#E8C45A')
            .attr('stroke', '#D4A843')
            .attr('stroke-width', 2);
        
        // Ropes (visual only)
        scaleGroup.append('line')
            .attr('class', 'left-rope')
            .attr('x1', centerX - cupOffset)
            .attr('y1', baseY - 20)
            .attr('x2', centerX - cupOffset)
            .attr('y2', baseY + 20)
            .attr('stroke', '#654321')
            .attr('stroke-width', 3);
        
        scaleGroup.append('line')
            .attr('class', 'right-rope')
            .attr('x1', centerX + cupOffset)
            .attr('y1', baseY - 20)
            .attr('x2', centerX + cupOffset)
            .attr('y2', baseY + 20)
            .attr('stroke', '#654321')
            .attr('stroke-width', 3);
        
        // (Removed) Weight displays under scale
        
        // Function to tip the scale based on weights
        function tipScale() {
            const weightDiff = rightWeight - leftWeight; // Fixed: right heavier should tip down
            const maxAngle = 15; // degrees
            const angle = Math.max(-maxAngle, Math.min(maxAngle, weightDiff / 100));
            
            scaleGroup.transition()
                .duration(500)
                .attr('transform', `rotate(${angle}, ${centerX}, ${baseY - 20})`);
        }
        
        // Function to update weight displays
        function updateWeights() {
            const leftTxt = leftWeight.toFixed(1) + ' t';
            const rightTxt = rightWeight.toFixed(1) + ' t';
            // Update SVG labels (if present)
            // (removed under-scale labels)
            // Update header cards
            const leftEl = document.getElementById('viz2-left-weight');
            if (leftEl) leftEl.textContent = leftTxt;
            const rightEl = document.getElementById('viz2-right-weight');
            if (rightEl) rightEl.textContent = rightTxt;
        }
        
        // Function to drop a block into a cup
        window.dropCountryOnScale = function(country, mouseX, mouseY, forceLeft = null) {
            const isLeft = forceLeft !== null ? forceLeft : mouseX < centerX;
            const targetX = isLeft ? (centerX - cupOffset) : (centerX + cupOffset);
            
            // Calculate stacking position
            const blocks = isLeft ? leftBlocks : rightBlocks;
            const stackHeight = blocks.length * 22; // 20px height + 2px spacing
            const blockY = baseY + 80 - stackHeight - 20;
            
            const barWidth = 50;
            const barHeight = 18;
            
            // Create block group
            const blockGroup = scaleGroup.append('g')
                .attr('class', 'gold-block')
                .attr('data-country', country.name);
            
            // Block rectangle
            blockGroup.append('rect')
                .attr('x', targetX - barWidth/2)
                .attr('y', blockY)
                .attr('width', barWidth)
                .attr('height', barHeight)
                .attr('fill', getAllianceColor(country.alliance))
                .attr('stroke', '#ffffff')
                .attr('stroke-width', 1.5)
                .attr('rx', 3);
            
            // Country name
            blockGroup.append('text')
                .attr('x', targetX)
                .attr('y', blockY + 10)
                .attr('text-anchor', 'middle')
                .attr('font-size', '9px')
                .attr('font-weight', 'bold')
                .attr('fill', '#000')
                .text(country.name);
            
            // Tonnage
            blockGroup.append('text')
                .attr('x', targetX)
                .attr('y', blockY + 18)
                .attr('text-anchor', 'middle')
                .attr('font-size', '7px')
                .attr('fill', '#333')
                .text(country.tonnes.toFixed(0) + 't');
            
            // Add to tracking
            if (isLeft) {
                leftBlocks.push({ country, element: blockGroup });
                leftWeight += country.tonnes;
            } else {
                rightBlocks.push({ country, element: blockGroup });
                rightWeight += country.tonnes;
            }
            
            // Update display and tip scale
            updateWeights();
            tipScale();
        };
        
        // Function to reset scale
        window.resetD3Scale = function() {
            leftBlocks.forEach(b => b.element.remove());
            rightBlocks.forEach(b => b.element.remove());
            leftBlocks = [];
            rightBlocks = [];
            leftWeight = 0;
            rightWeight = 0;
            updateWeights();
            tipScale();
        };
        
        console.log('D3 scale initialized successfully');
    }
    
    processGoldData();
    
    // Drag and drop handlers
    let draggedCountry = null;
    let dragOverlay = null;
    
    function startDragCountry(country, e) {
        draggedCountry = country;
        
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
    
    // G7 vs BRICS comparison
    function compareG7vsBRICS() {
        console.log('G7 vs BRICS button clicked');
        window.resetD3Scale();
        
        const currentPeriod = timePeriods[currentPeriodIndex];
        const currentData = goldDataByPeriod[currentPeriod] || {};
        
        // G7 countries list (using the mapped names from JSON)
        const g7CountriesList = ['Canada', 'France', 'Germany', 'Italy', 'Japan', 'United Kingdom', 'United States of America'];
        
        // BRICS countries (using the mapped names from JSON)
        const bricsCountries = ['Brazil', 'Russia', 'India', 'China', 'South Africa', 'Egypt', 'Ethiopia', 
            'Iran', 'United Arab Emirates', 'Indonesia'];
        
        // Find matching countries in the data
        // countryNameMap: { "CSV Name" => "Normal Name" }
        // So we need to find CSV keys where countryNameMap[csvKey] === normalName
        const g7Data = g7CountriesList.map(name => {
            // Find CSV name that maps to this normal name
            const csvName = Object.keys(currentData).find(csvKey => countryNameMap[csvKey] === name);
            return csvName ? { name, tonnes: currentData[csvName], alliance: 'G7' } : null;
        }).filter(d => d && d.tonnes > 0);
        
        const bricsData = bricsCountries.map(name => {
            // Find CSV name that maps to this normal name
            const csvName = Object.keys(currentData).find(csvKey => countryNameMap[csvKey] === name);
            return csvName ? { name, tonnes: currentData[csvName], alliance: 'BRICS' } : null;
        }).filter(d => d && d.tonnes > 0);
        
        console.log('G7 countries found:', g7Data.length, g7Data);
        console.log('BRICS countries found:', bricsData.length, bricsData);
        
        // Drop BRICS on right first
        bricsData.forEach((country, index) => {
            setTimeout(() => {
                dropCountryOnScale(country, 700, 100, false);
            }, index * 100);
        });
        
        // Then drop G7 on left (after BRICS finishes)
        const bricsDelay = bricsData.length * 100;
        g7Data.forEach((country, index) => {
            setTimeout(() => {
                dropCountryOnScale(country, 100, 100, true);
            }, bricsDelay + (index * 100));
        });
    }
    
    // G7 vs BRICS (Top 3)
    function compareG7vsBRICSTop3() {
        console.log('G7 vs BRICS (Top 3) button clicked');
        window.resetD3Scale();
        
        const currentPeriod = timePeriods[currentPeriodIndex];
        const currentData = goldDataByPeriod[currentPeriod] || {};
        
        const g7CountriesList = ['Canada', 'France', 'Germany', 'Italy', 'Japan', 'United Kingdom', 'United States of America'];
        const bricsCountries = ['Brazil', 'Russia', 'India', 'China', 'South Africa', 'Egypt', 'Ethiopia', 
            'Iran', 'United Arab Emirates', 'Indonesia'];
        
        const g7Data = g7CountriesList.map(name => {
            const csvName = Object.keys(currentData).find(csvKey => countryNameMap[csvKey] === name);
            return csvName ? { name, tonnes: currentData[csvName], alliance: 'G7' } : null;
        }).filter(Boolean).sort((a,b) => b.tonnes - a.tonnes).slice(0,3);
        
        const bricsData = bricsCountries.map(name => {
            const csvName = Object.keys(currentData).find(csvKey => countryNameMap[csvKey] === name);
            return csvName ? { name, tonnes: currentData[csvName], alliance: 'BRICS' } : null;
        }).filter(Boolean).sort((a,b) => b.tonnes - a.tonnes).slice(0,3);
        
        // Drop BRICS first, then G7
        bricsData.forEach((country, index) => {
            setTimeout(() => {
                dropCountryOnScale(country, 700, 100, false);
            }, index * 120);
        });
        const delay = bricsData.length * 120;
        g7Data.forEach((country, index) => {
            setTimeout(() => {
                dropCountryOnScale(country, 100, 100, true);
            }, delay + index * 120);
        });
    }

    // Top 10 vs Rest of World
    function compareTop10VsRest() {
        console.log('Top 10 vs Rest of World button clicked');
        window.resetD3Scale();
        
        // 1) Get current month's data
        const currentPeriod = timePeriods[currentPeriodIndex];
        const currentData = goldDataByPeriod[currentPeriod] || {};
        if (!countryNameMap || Object.keys(countryNameMap).length === 0) {
            console.warn('Country name map not loaded yet');
            return;
        }
        
        // 2) Normalize/aggregate by mapped name (JSON): multiple CSV keys can map to same country
        const aggregated = {};
        const allowedNames = new Set(Object.values(countryNameMap));
        for (const [csvName, tonnes] of Object.entries(currentData)) {
            if (!tonnes || tonnes <= 0) continue;
            const normalName = countryNameMap[csvName];
            // Only include countries that exist in the mapping JSON value range
            if (!normalName || !allowedNames.has(normalName)) continue;
            aggregated[normalName] = (aggregated[normalName] || 0) + tonnes;
        }
        
        // 3) Build sorted array by tonnes
        const rows = Object.entries(aggregated)
            .map(([name, tonnes]) => ({ name, tonnes, alliance: getAlliance(name) }))
            .sort((a, b) => b.tonnes - a.tonnes);
        
        // 4) Split: top 10 vs rest (sum)
        const top10 = rows.slice(0, 10);
        const restSum = rows.slice(10).reduce((s, r) => s + r.tonnes, 0);
        const restBlock = { name: 'Rest of World', tonnes: restSum, alliance: 'Other' };
        
        // 5) Drop Rest of World on right first, then Top 10 on left
        dropCountryOnScale(restBlock, 700, 100, false);
        top10.forEach((country, index) => {
            setTimeout(() => {
                dropCountryOnScale(country, 100, 100, true);
            }, (index + 1) * 120);
        });
    }

    // Top 3 vs Rest of World (same as Top10 but with 3)
    function compareTop3VsRest() {
        console.log('Top 3 vs Rest of World button clicked');
        window.resetD3Scale();
        
        const currentPeriod = timePeriods[currentPeriodIndex];
        const currentData = goldDataByPeriod[currentPeriod] || {};
        if (!countryNameMap || Object.keys(countryNameMap).length === 0) {
            console.warn('Country name map not loaded yet');
            return;
        }
        
        const aggregated = {};
        const allowedNames = new Set(Object.values(countryNameMap));
        for (const [csvName, tonnes] of Object.entries(currentData)) {
            if (!tonnes || tonnes <= 0) continue;
            const normalName = countryNameMap[csvName];
            if (!normalName || !allowedNames.has(normalName)) continue;
            aggregated[normalName] = (aggregated[normalName] || 0) + tonnes;
        }
        
        const rows = Object.entries(aggregated)
            .map(([name, tonnes]) => ({ name, tonnes, alliance: getAlliance(name) }))
            .sort((a, b) => b.tonnes - a.tonnes);
        
        const top3 = rows.slice(0, 3);
        const restSum = rows.slice(3).reduce((s, r) => s + r.tonnes, 0);
        const restBlock = { name: 'Rest of World', tonnes: restSum, alliance: 'Other' };
        
        dropCountryOnScale(restBlock, 700, 100, false);
        top3.forEach((country, index) => {
            setTimeout(() => {
                dropCountryOnScale(country, 100, 100, true);
            }, (index + 1) * 120);
        });
    }
    
    // Reset scale function
    function resetScale() {
        if (window.resetD3Scale) {
            window.resetD3Scale();
        }
    }
}
