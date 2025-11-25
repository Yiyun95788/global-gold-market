// Visualization 3: World map showing gold reserves and production by country
// Uses world-atlas TopoJSON, IMF reserves data, and OWID production data
// Missing data handled with last-known-value backfill
function createViz3() {
    let container = document.querySelector('#viz3 .viz-container');
    container.innerHTML = '';
    
    // Set up dimensions
    const width = 800;
    const height = 500;
    
    const mainContainer = d3.select(container)
        .append('div')
        .style('display', 'flex')
        .style('flex-direction', 'column')
        .style('align-items', 'center')
        .style('gap', '10px');
    
    mainContainer.append('h3')
        .text('Gold Reserves by Country - Start of Year Comparison')
        .style('margin', '0')
        .style('text-align', 'center');
    
    const controlsContainer = mainContainer.append('div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('gap', '20px')
        .style('margin-bottom', '10px')
        .style('flex-wrap', 'wrap')
        .style('justify-content', 'center');
    
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
    
    const playPauseBtn = yearControls.append('button')
        .attr('id', 'playPauseBtn-viz3')
        .text('▶ Play')
        .style('padding', '5px 15px')
        .style('border', '1px solid #ccc')
        .style('border-radius', '4px')
        .style('background-color', '#f0f0f0')
        .style('cursor', 'pointer')
        .style('font-size', '14px')
        .style('font-weight', 'bold');
    
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
    
    const vizContainer = mainContainer.append('div')
        .style('display', 'flex')
        .style('gap', '20px')
        .style('align-items', 'flex-start');
    
    const svg = vizContainer.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    const legendContainer = vizContainer.append('div')
        .attr('id', 'legend-container-viz3')
        .style('min-width', '200px');
    
    const projection = d3.geoNaturalEarth1()
        .scale(120)
        .translate([width / 2, height / 2]);
    
    const path = d3.geoPath().projection(projection);
    
    // Blue gradient for reserves
    const colorScale = d3.scaleSequential()
        .domain([0, 1])
        .interpolator(t => {
            if (t < 0.2) return d3.interpolateRgb("#E6F3FF", "#4A90E2")(t * 5);
            if (t < 0.4) return d3.interpolateRgb("#4A90E2", "#1E3A8A")((t - 0.2) * 5);
            if (t < 0.6) return d3.interpolateRgb("#1E3A8A", "#1E40AF")((t - 0.4) * 5);
            if (t < 0.8) return d3.interpolateRgb("#1E40AF", "#1E3A8A")((t - 0.6) * 5);
            return d3.interpolateRgb("#1E3A8A", "#0F172A")((t - 0.8) * 5);
        });
    
    const tooltip = d3.select('body').append('div')
        .attr('class', 'viz3-tooltip')
        .style('position', 'absolute')
        .style('background', 'white')
        .style('border', '2px solid #333')
        .style('border-radius', '8px')
        .style('padding', '12px 16px')
        .style('box-shadow', '0 4px 12px rgba(0,0,0,0.3)')
        .style('pointer-events', 'none')
        .style('display', 'none')
        .style('z-index', '10000')
        .style('font-family', 'Arial, sans-serif')
        .style('max-width', '250px')
        .style('line-height', '1.5');

    const loadCsvWithFallback = async (paths) => {
        for (const p of paths) {
            try {
                const rows = await d3.csv(p);
                if (rows && rows.length >= 0) return rows;
            } catch (e) {}
        }
        throw new Error('Failed to load CSV from provided paths');
    };

    // Load map, data, and name mappings
    Promise.all([
        d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'),
        d3.csv('../docs/data/gold_reserves_annual_quarterly_monthly.csv'),
        d3.json('../docs/json/CountryMapIMF.json'),
        d3.json('../docs/json/country_name_mapping_vis3.json'),
        loadCsvWithFallback(['../docs/data/gold-production.csv', '../w6_datasets/gold-production.csv'])
    ]).then(function([worldTopology, goldData, countryMapIMF, productionMap, productionCsv]) {
        
        const world = topojson.feature(worldTopology, worldTopology.objects.countries);
        
        const normalizeCountryName = (imfName) => {
            return countryMapIMF[imfName] || imfName;
        };

        const normalizeProductionName = (entityName) => {
            const mapped = productionMap[entityName];
            if (mapped === null || mapped === undefined || mapped === '') return null;
            return mapped;
        };
        
        const reservesByCountryAndYear = {};
        const availableYears = new Set();
        
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
            const countryRaw = d['Country Name'];
            const tonnes = +d.tonnes;
            const timePeriod = d['Time Period'];
            const period = d.period; // Use the period column from CSV
            
            if (isNaN(tonnes) || tonnes <= 0) return;
            if (!countryRaw || !timePeriod) return;
            if (exclusions.includes(countryRaw)) return;
            
            const country = normalizeCountryName(countryRaw);
            let year;
            
            if (timePeriod.includes('Q')) {
                year = parseInt(timePeriod.split('Q')[0]);
            } else if (timePeriod.includes('-')) {
                year = parseInt(timePeriod.split('-')[0]);
            } else {
                year = parseInt(timePeriod);
            }
            
            if (!year || isNaN(year)) return;
            if (!reservesByCountryAndYear[country]) reservesByCountryAndYear[country] = {};
            
            if (!reservesByCountryAndYear[country][year]) {
                reservesByCountryAndYear[country][year] = {
                    tonnes: tonnes,
                    timePeriod: timePeriod,
                    period: period
                };
                availableYears.add(year);
            }
        });

        const productionByCountryAndYear = {};
        const productionYears = new Set();
        productionCsv.forEach(d => {
            const entityRaw = d['Entity'];
            const year = parseInt(d['Year']);
            const tonnes = +d['production|Gold|Mine|tonnes'];
            if (!entityRaw || !year || isNaN(year) || isNaN(tonnes)) return;
            const country = normalizeProductionName(entityRaw);
            if (!country) return;
            if (!productionByCountryAndYear[country]) productionByCountryAndYear[country] = {};
            if (productionByCountryAndYear[country][year] === undefined) {
                productionByCountryAndYear[country][year] = { tonnes, year };
                productionYears.add(year);
            }
        });

        const years = Array.from(availableYears).sort((a, b) => a - b);
        const prodYearsSorted = Array.from(productionYears).sort((a, b) => a - b);
        
        const minYearReserves = years[0];
        const maxYearReserves = years[years.length - 1];
        const minYearProduction = prodYearsSorted.length > 0 ? prodYearsSorted[0] : null;
        const maxYearProduction = prodYearsSorted.length > 0 ? prodYearsSorted[prodYearsSorted.length - 1] : null;
        const maxYear = Math.max(maxYearReserves, maxYearProduction || 0);
                
        if (years.length === 0) {
            container.innerHTML = '<p>No valid gold reserves data found.</p>';
            return;
        }
        
        // Function to update slider min/max based on data type
        function updateSliderRange(dataType, resetToMin = false) {
            let minYear;
            if (dataType === 'production' || dataType === 'both') {
                minYear = minYearProduction || minYearReserves;
            } else {
                minYear = minYearReserves;
            }
            
            const currentValue = parseInt(yearSlider.node().value || yearSlider.attr('value'));
            yearSlider.attr('min', minYear).attr('max', maxYear).attr('step', 1);
            
            // If resetting to min (when switching categories) or current value is below new min, set it to min
            if (resetToMin || currentValue < minYear) {
                yearSlider.attr('value', minYear);
                yearSlider.node().value = minYear; // Update DOM property for visual position
                yearDisplay.text(minYear);
                return minYear;
            }
            return currentValue;
        }
        
        // Initialize slider for reserves (default)
        const initialYear = updateSliderRange('reserves');
        yearDisplay.text(initialYear);

        let selectedDataType = 'reserves';

        function drawMap(selectedYear) {
            svg.selectAll('.country').remove();
            svg.selectAll('.legend').remove();
            svg.selectAll('.tooltip').remove();
            
            // Last Known Value (LKV) backfill for reserves
            const reservesForYear = {};
            const reservesFreshness = {};
            Object.entries(reservesByCountryAndYear).forEach(([country, countryData]) => {
                if (countryData[selectedYear]) {
                    reservesForYear[country] = countryData[selectedYear];
                    reservesFreshness[country] = 'current';
                } else {
                    for (let y = selectedYear - 1; y >= years[0]; y--) {
                        if (countryData[y]) {
                            reservesForYear[country] = countryData[y];
                            reservesFreshness[country] = 'last_known';
                            break;
                        }
                    }
                }
            });

            // LKV backfill for production
            const productionForYear = {};
            const productionFreshness = {};
            Object.entries(productionByCountryAndYear).forEach(([country, countryData]) => {
                if (countryData[selectedYear]) {
                    productionForYear[country] = countryData[selectedYear];
                    productionFreshness[country] = 'current';
                } else {
                    for (let y = selectedYear - 1; y >= (prodYearsSorted[0] ?? selectedYear); y--) {
                        if (countryData[y]) {
                            productionForYear[country] = countryData[y];
                            productionFreshness[country] = 'last_known';
                            break;
                        }
                    }
                }
            });
            
            let legendTitle = 'Gold Reserves (tonnes)';
            if (selectedDataType === 'reserves') {
                const reservesValues = Object.values(reservesForYear).map(d => d.tonnes);
                const minReserves = reservesValues.length ? Math.min(...reservesValues) : 0;
                const maxReserves = reservesValues.length ? Math.max(...reservesValues) : 1;
                colorScale.domain([minReserves, maxReserves]);
                legendTitle = 'Gold Reserves (tonnes)';
            } else if (selectedDataType === 'both') {
                const reservesValues = Object.values(reservesForYear).map(d => d.tonnes);
                const minReserves = reservesValues.length ? Math.min(...reservesValues) : 0;
                const maxReserves = reservesValues.length ? Math.max(...reservesValues) : 1;
                colorScale.domain([minReserves, maxReserves]);
                legendTitle = 'Gold Reserves & Production (tonnes)';
            }

            // Normalizers for bivariate coloring
            const reservesDomain = (() => {
                const vals = Object.values(reservesForYear).map(d => d.tonnes);
                const a = vals.length ? Math.min(...vals) : 0;
                const b = vals.length ? Math.max(...vals) : 1;
                return [a, b];
            })();
            const prodDomain = (() => {
                const vals = Object.values(productionForYear).map(d => d.tonnes);
                const a = vals.length ? Math.min(...vals) : 0;
                const b = vals.length ? Math.max(...vals) : 1;
                return [a, b];
            })();
            const norm = (v, a, b) => (b > a ? Math.max(0, Math.min(1, (v - a) / (b - a))) : 0);
            
            const productionScale = d3.scaleSequential()
                .domain(prodDomain)
                .interpolator(t => d3.interpolateLab('#FFFACD', '#FFD700')(t));
            
            // Update production scale domain if in production-only mode
            if (selectedDataType === 'production') {
                const prodValues = Object.values(productionForYear).map(d => d.tonnes);
                const minP = prodValues.length ? Math.min(...prodValues) : 0;
                const maxP = prodValues.length ? Math.max(...prodValues) : 1;
                productionScale.domain([minP, maxP]);
                legendTitle = 'Gold Production (tonnes)';
            }

            const toRgb = (css) => {
                const c = d3.color(css);
                return c ? [c.r, c.g, c.b] : [255, 255, 255];
            };

            // Quantization resolution (NxN)
            const gridSize = 7;

            const bivariateColor = (r, p) => {
                // Preserve individual ramps along axes
                const vR = reservesDomain[0] + r * (reservesDomain[1] - reservesDomain[0]);
                const vP = prodDomain[0] + p * (prodDomain[1] - prodDomain[0]);
                if (p <= 0) return colorScale(vR);     // reserves-only ramp
                if (r <= 0) return productionScale(vP); // production-only ramp
                // Bilinear interpolation in Lab space between fixed corners:
                // c00: low/low (white), c10: high reserves (blue), c01: high production (yellow), c11: high/high (green)
                const c00 = d3.color('#FFFFFF');
                const c10 = d3.color('#1f77b4');  // saturated blue
                const c01 = d3.color('#FFD400');  // saturated yellow
                const c11 = d3.color('#00A000');  // green for high/high
                const rowLow = d3.interpolateLab(c00, c01)(p);
                const rowHigh = d3.interpolateLab(c10, c11)(p);
                return d3.interpolateLab(rowLow, rowHigh)(r);
            };
            
            // Draw the map
            svg.selectAll('.country')
                .data(world.features)
                .enter()
                .append('path')
                .attr('class', 'country')
                .attr('d', path)
                .attr('fill', d => {
                    const countryName = d.properties.NAME || d.properties.name;
                    if (selectedDataType === 'production') {
                        const pd = productionForYear[countryName];
                        return pd ? productionScale(pd.tonnes) : '#f0f0f0';
                    }
                    if (selectedDataType === 'both') {
                        const rd = reservesForYear[countryName];
                        const pd = productionForYear[countryName];
                        if (!rd && !pd) return '#f0f0f0';
                        const rRaw = rd ? norm(rd.tonnes, reservesDomain[0], reservesDomain[1]) : 0;
                        const pRaw = pd ? norm(pd.tonnes, prodDomain[0], prodDomain[1]) : 0;
                        // Quantize to grid centers
                        const q = gridSize - 1;
                        const r = Math.round(rRaw * q) / q;
                        const p = Math.round(pRaw * q) / q;
                        return bivariateColor(r, p);
                    }
                    // reserves
                    const rd = reservesForYear[countryName];
                    return rd ? colorScale(rd.tonnes) : '#f0f0f0';
                })
                .attr('stroke', '#333')
                .attr('stroke-width', 0.5)
                .on('mouseover', function(event, d) {
                    const countryName = d.properties.NAME || d.properties.name;
                    const rData = reservesForYear[countryName];
                    const rFresh = reservesFreshness[countryName];
                    const pData = productionForYear[countryName];
                    const pFresh = productionFreshness[countryName];
                    
                    d3.select(this)
                        .attr('stroke', '#000')
                        .attr('stroke-width', 2);
                    
                    const hasAny = (selectedDataType === 'production') ? !!pData : !!rData || (selectedDataType === 'both' && (!!rData || !!pData));
                    
                    // Always show tooltip with country name
                    let tooltipHtml = `<div style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #333;">${countryName}</div>`;
                    
                    if (hasAny) {
                        // Build HTML tooltip content with data
                        const showReserves = selectedDataType !== 'production' && rData;
                        const showProduction = selectedDataType !== 'reserves' && pData;
                        
                        if (showReserves) {
                            tooltipHtml += `<div style="margin-bottom: 4px;"><strong>Reserves:</strong> ${rData.tonnes.toLocaleString()} tonnes</div>`;
                            if (rFresh === 'last_known') {
                                tooltipHtml += `<div style="font-size: 12px; color: #666; font-style: italic; margin-bottom: 6px;">(last known from ${rData.timePeriod})</div>`;
                            }
                        }
                        if (showProduction) {
                            tooltipHtml += `<div style="margin-bottom: 4px;"><strong>Production:</strong> ${pData.tonnes.toLocaleString()} tonnes</div>`;
                            if (pFresh === 'last_known') {
                                tooltipHtml += `<div style="font-size: 12px; color: #666; font-style: italic;">(last known)</div>`;
                            }
                        }
                    } else {
                        // No data available
                        tooltipHtml += `<div style="margin-bottom: 4px; color: #666;">No data</div>`;
                    }
                    
                    tooltip
                        .style('display', 'block')
                        .html(tooltipHtml)
                        .style('left', (event.pageX + 15) + 'px')
                        .style('top', (event.pageY - 10) + 'px');
                })
                .on('mousemove', function(event) {
                    tooltip
                        .style('left', (event.pageX + 15) + 'px')
                        .style('top', (event.pageY - 10) + 'px');
                })
                .on('mouseout', function() {
                    d3.select(this)
                        .attr('stroke', '#333')
                        .attr('stroke-width', 0.5);
                    
                    tooltip.style('display', 'none');
                });
            
            // Clear and rebuild legend in HTML container
            legendContainer.html('');
            
            legendContainer.append('div')
                .style('font-weight', 'bold')
                .style('font-size', '14px')
                .style('margin-bottom', '10px')
                .text(legendTitle);

            if (selectedDataType === 'both') {
                // 2D bivariate legend (production vs reserves)
                const bivariateLegend = legendContainer.append('div')
                    .style('position', 'relative')
                    .style('padding', '20px 0 0 0');
                
                const n = gridSize;
                const cellSize = 14;
                const leftMargin = 50; // Space for Y-axis scale
                const bottomMargin = 50; // Space for X-axis scale
                const topMargin = 20; // Space for title
                const rightMargin = 20;
                
                const legendSvg = bivariateLegend.append('svg')
                    .attr('width', n * cellSize + leftMargin + rightMargin)
                    .attr('height', n * cellSize + topMargin + bottomMargin);
                
                // Draw grid
                for (let i = 0; i < n; i++) {
                    for (let j = 0; j < n; j++) {
                        const p = i / (n - 1); // x: production
                        const r = j / (n - 1); // y: reserves
                        legendSvg.append('rect')
                            .attr('x', leftMargin + i * cellSize)
                            .attr('y', topMargin + (n - 1 - j) * cellSize)
                            .attr('width', cellSize)
                            .attr('height', cellSize)
                            .attr('fill', bivariateColor(r, p))
                            .attr('stroke', 'none');
                    }
                }
                
                // Border around grid
                legendSvg.append('rect')
                    .attr('x', leftMargin - 1)
                    .attr('y', topMargin - 1)
                    .attr('width', n * cellSize + 2)
                    .attr('height', n * cellSize + 2)
                    .attr('fill', 'none')
                    .attr('stroke', '#333')
                    .attr('stroke-width', 2);
                
                // Y-axis scale (Reserves - left side)
                const reservesScale = d3.scaleLinear()
                    .domain([reservesDomain[1], reservesDomain[0]]) // Reversed for top-to-bottom
                    .range([0, n * cellSize]);
                
                const reservesAxis = d3.axisLeft(reservesScale)
                    .ticks(5)
                    .tickFormat(d3.format('.0f'));
                
                legendSvg.append('g')
                    .attr('class', 'reserves-axis')
                    .attr('transform', `translate(${leftMargin - 5}, ${topMargin})`)
                    .call(reservesAxis);
                
                // X-axis scale (Production - bottom)
                const productionScaleAxis = d3.scaleLinear()
                    .domain([prodDomain[0], prodDomain[1]])
                    .range([0, n * cellSize]);
                
                const productionAxis = d3.axisBottom(productionScaleAxis)
                    .ticks(5)
                    .tickFormat(d => d3.format('.1f')(d / 100));
                
                legendSvg.append('g')
                    .attr('class', 'production-axis')
                    .attr('transform', `translate(${leftMargin}, ${topMargin + n * cellSize + 5})`)
                    .call(productionAxis);
                
                // Y-axis label (Reserves - vertical)
                legendSvg.append('text')
                    .attr('x', 10)
                    .attr('y', topMargin + n * cellSize / 2)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '11px')
                    .attr('font-weight', 'bold')
                    .attr('transform', `rotate(-90, 10, ${topMargin + n * cellSize / 2})`)
                    .text('Reserves (tonnes)');
                
                // X-axis label (Production - horizontal)
                legendSvg.append('text')
                    .attr('x', leftMargin + n * cellSize / 2)
                    .attr('y', topMargin + n * cellSize + bottomMargin - 5)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '11px')
                    .attr('font-weight', 'bold')
                    .text('Production (100 tonnes)');
                
            } else {
                // 1D legend for single dataset
                const legendSvg = legendContainer.append('svg')
                    .attr('width', 120)
                    .attr('height', 120);
                
                // Determine which scale to use
                const currentScale = selectedDataType === 'production' ? productionScale : colorScale;
                const [minVal, maxVal] = currentScale.domain();
                
                const legendScale = d3.scaleLinear()
                    .domain([minVal, maxVal])
                    .range([0, 100]);

                const legendAxis = d3.axisRight(legendScale)
                    .ticks(5)
                    .tickFormat(d3.format('.0f'));

                legendSvg.append('g')
                    .attr('class', 'legend-axis')
                    .attr('transform', 'translate(20,10)')
                    .call(legendAxis);

                // Create gradient
                const defs = legendSvg.append('defs');
                const gradientId = `legend-gradient-${selectedDataType}`;
                const gradient = defs.append('linearGradient')
                    .attr('id', gradientId)
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
                        const value = minVal + d * (maxVal - minVal);
                        return currentScale(value);
                    });

                legendSvg.append('rect')
                    .attr('x', 5)
                    .attr('y', 10)
                    .attr('width', 15)
                    .attr('height', 100)
                    .attr('fill', `url(#${gradientId})`)
                    .attr('stroke', '#333')
                    .attr('stroke-width', 1);
            }
        }
        
        drawMap(initialYear);
        
        // Add slider event listener
        yearSlider.on('input', function() {
            const selectedYear = parseInt(this.value);
            yearDisplay.text(selectedYear);
            drawMap(selectedYear);
        });
        
        // Add data type selector event listener
        dataTypeSelect.on('change', function() {
            selectedDataType = this.value;
            // Reset slider to starting year when switching categories
            const updatedYear = updateSliderRange(selectedDataType, true);
            drawMap(updatedYear);
            // Stop animation if running
            if (animationInterval) {
                clearInterval(animationInterval);
                animationInterval = null;
                playPauseBtn.text('▶ Play');
            }
        });
        
        // Animation state
        let animationInterval = null;
        const animationSpeed = 200; // milliseconds per year
        
        // Animation function
        function startAnimation() {
            if (animationInterval) return; // Already playing
            
            const minYear = parseInt(yearSlider.attr('min'));
            const maxYear = parseInt(yearSlider.attr('max'));
            
            animationInterval = setInterval(() => {
                let currentYear = parseInt(yearSlider.node().value);
                currentYear++;
                
                if (currentYear > maxYear) {
                    currentYear = minYear; // Loop back to start
                }
                
                yearSlider.attr('value', currentYear);
                yearSlider.node().value = currentYear;
                yearDisplay.text(currentYear);
                drawMap(currentYear);
            }, animationSpeed);
            
            playPauseBtn.text('⏸ Pause');
        }
        
        function stopAnimation() {
            if (animationInterval) {
                clearInterval(animationInterval);
                animationInterval = null;
                playPauseBtn.text('▶ Play');
            }
        }
        
        // Play/pause button event listener
        playPauseBtn.on('click', function() {
            if (animationInterval) {
                stopAnimation();
            } else {
                startAnimation();
            }
        });
    })
}


