// Minimal script.js - only data loading and createViz5 function
let data = [];

// Load dataset
d3.csv('../w6_datasets/XAU_15m_data_cleaned.csv').then(function(csvData) {
    data = csvData;
    console.log('Data loaded:', data.length, 'rows');
});

// createViz5 is now in script.js from the original code
// This function creates the regime quilt visualization
function createViz5() {
    const wrap = d3.select('#regime-viz-container');
    wrap.html('');

    const shell = wrap.append('div')
        .style('display','grid')
        .style('grid-template-columns','1fr 220px')
        .style('gap','16px')
        .style('align-items','start');

    let insightsOn = false;

    const header = shell.append('div')
        .style('grid-column','1 / -1')
        .style('display','flex')
        .style('justify-content','space-between')
        .style('align-items','center')
        .style('margin-bottom','4px');

    header.append('h3')
        .style('margin','0')
        .style('font-weight','800')
        .text('Interactive Gold-Silver Regime Quilt');

    const insightBtn = header.append('button')
        .style('padding','12px 22px')
        .style('font-size','18px')
        .style('font-weight','600')
        .style('border-radius','18px')
        .style('border','2px solid #2563eb')
        .style('background','#ffffff')
        .style('color','#1f2937')
        .style('cursor','pointer')
        .style('box-shadow','0 4px 14px rgba(0,0,0,0.10)')
        .style('transition','all 0.15s ease')
        .html('🔮 Reveal Insights')
        .on('mouseenter', function () {
            d3.select(this)
                .style('background','#eef2ff')
                .style('transform','translateY(-1px)');
        })
        .on('mouseleave', function () {
            d3.select(this)
                .style('background','#ffffff')
                .style('transform','translateY(0)');
        });


    d3.selectAll('.insight-toast').remove();
    const insightToast = d3.select('body')
        .append('div')
        .attr('class','insight-toast')
        .style('position','fixed')
        .style('left','50%')
        .style('bottom','80px')
        .style('transform','translateX(-50%)')
        .style('padding','20px 32px')
        .style('background','#111827f0')
        .style('color','#f9fafb')
        .style('border-radius','24px')
        .style('font-size','20px')
        .style('font-weight','600')
        .style('line-height','1.5')
        .style('max-width','900px')
        .style('text-align','center')
        .style('box-shadow','0 18px 45px rgba(0,0,0,0.45)')
        .style('opacity',0)
        .style('pointer-events','none')
        .style('transition','opacity 0.3s ease')
        .style('z-index',10001);


    const margin = {top: 36, right: 10, bottom: 40, left: 50};
    const years = d3.range(2000, 2026);
    const months = d3.range(1, 13);
    const cell = 28, gap = 6;
    const w = years.length*(cell+gap) + margin.left + margin.right;
    const h = months.length*(cell+gap) + margin.top + margin.bottom;

    const regimeColor = {
        '++': '#34C38F',
        '+-': '#F5A524',
        '-+': '#8B5CF6',
        '--': '#3B82F6'
    };

    function gprStrokeWidth(gpr) {
        if (gpr == null || isNaN(gpr)) return 1.5;
        if (gpr < 100) return 1.5;
        if (gpr < 150) return 3;
        return 5;
    }
    function gprBucket(gpr) {
        if (gpr == null || isNaN(gpr)) return 'N/A';
        if (gpr < 100) return 'Low';
        if (gpr < 150) return 'Medium';
        return 'High';
    }

    // tooltip
    const tooltip = d3.select('body')
        .append('div')
        .attr('class','quilt-tip')
        .style('position','fixed')
        .style('pointer-events','none')
        .style('background','#fff')
        .style('border','1px solid #22A776')
        .style('border-radius','10px')
        .style('box-shadow','0 12px 30px rgba(0,0,0,0.08)')
        .style('padding','10px 12px')
        .style('font-size','12px')
        .style('line-height','1.4')
        .style('opacity',0)
        .style('z-index', '10000');

    // left SVG
    const svgWrapper = shell.append('div')
        .style('position','relative');

    const svg = svgWrapper
        .append('svg')
        .attr('width', w)
        .attr('height', h);

    // Soft glow filter for ++ clusters
    const defs = svg.append('defs');
    const glow = defs.append('filter')
        .attr('id','softGlow')
        .attr('x','-50%')
        .attr('y','-50%')
        .attr('width','200%')
        .attr('height','200%');
    glow.append('feGaussianBlur')
        .attr('stdDeviation','3.5')
        .attr('result','coloredBlur');
    const feMerge = glow.append('feMerge');
    feMerge.append('feMergeNode').attr('in','coloredBlur');
    feMerge.append('feMergeNode').attr('in','SourceGraphic');

    // sidebar：Legend + How to Read
    const sidebar = shell.append('div')
        .style('position','sticky')
        .style('top','10px')
        .style('align-self','start')
        .style('display','flex')
        .style('flex-direction','column')
        .style('gap','12px');

    // Legend
    const legend = sidebar.append('div')
        .style('background','#fff')
        .style('border','1px solid #e5e7eb')
        .style('border-radius','12px')
        .style('padding','12px')
        .style('box-shadow','0 6px 18px rgba(0,0,0,0.05)');

    legend.append('div')
        .style('font-weight','700')
        .style('margin-bottom','8px')
        .text('Legend');

    const legendItems = [
        {key:'++', label:'+ / +', color:regimeColor['++']},
        {key:'+-', label:'+ / −', color:regimeColor['+-']},
        {key:'-+', label:'− / +', color:regimeColor['-+']},
        {key:'--', label:'− / −', color:regimeColor['--']},
    ];

    const lg = legend.selectAll('.legend-row')
        .data(legendItems)
        .enter().append('div')
        .attr('class','legend-row')
        .style('display','flex')
        .style('align-items','center')
        .style('gap','8px')
        .style('margin','6px 0')
        .on('mouseenter',(_,d)=>{
            svg.selectAll('.qcell').transition().duration(150)
                .style('opacity', c => (c.regime === d.key ? 1 : 0.15));
        })
        .on('mouseleave',()=>{
            svg.selectAll('.qcell').transition().duration(150).style('opacity',1);
        });

    lg.append('div')
        .style('width','18px')
        .style('height','18px')
        .style('border-radius','6px')
        .style('border','2px solid #1f2937')
        .style('background', d=>d.color);

    lg.append('div').text(d=>d.label);

    legend.append('hr').style('margin','10px 0');

    [['Low','1.5px'],['Medium','3px'],['High','5px']].forEach(([lab,wid])=>{
        const row = legend.append('div')
            .style('display','flex')
            .style('align-items','center')
            .style('gap','8px')
            .style('margin','6px 0');
        row.append('div')
            .style('width','24px')
            .style('height','18px')
            .style('border-radius','6px')
            .style('border', `${wid} solid #1f2937`)
            .style('background','#ffffff');
        row.append('div').text(`GPR: ${lab}`);
    });

    // How to Read panel
    const explainer = sidebar.append('div')
        .style('background','#fff')
        .style('border','1px solid #e5e7eb')
        .style('border-radius','12px')
        .style('padding','12px')
        .style('box-shadow','0 6px 18px rgba(0,0,0,0.05)')
        .style('font-size','12px')
        .style('line-height','1.45');

    explainer.append('div')
        .style('font-weight','700')
        .style('margin-bottom','8px')
        .text('How to Read');

    [
        '• GPR = Geopolitical Risk Index.',
        '  Higher = more geopolitical tension.',
        '',
        '• Gold/Silver % = monthly return:',
        '  this month vs previous month,',
        '  NOT year-over-year.',
        '',
        'Example:',
        '  May Gold +0.03%',
        '  = 0.03% higher than April.'
    ].forEach(t => explainer.append('div').text(t));

    const cellLayer = svg.append('g').attr('class','cells');

    const csvPath = 'data/Gold-Silver-GeopoliticalRisk_HistoricalData.csv';

    d3.csv(csvPath).then(raw => {
        const parse = d3.timeParse('%Y-%m-%d');
        const pick = (obj, keys) => {
            for (const k of keys) {
                if (obj[k] !== undefined && obj[k] !== null && obj[k] !== '') return obj[k];
            }
            return null;
        };
        const toNum = v => v == null ? null : +String(v).replace(/,/g, '');

        const rows = raw.map(d => {
            const dt = parse(d['DATE'] || d['Date'] || (d['date'] ? String(d['date']).slice(0,10) : ''));
            const goldRet   = toNum(pick(d, ['GOLD_CHANGE_%','GOLD_CHANGE','GOLD_RET','Gold_Change_%']));
            const silverRet = toNum(pick(d, ['SILVER_CHANGE_%','SILVER_CHANGE','SILVER_RET','Silver_Change_%']));
            const gprVal    = toNum(pick(d, ['GPRD','GPR','GPRD_ACT','GPRD_THREAT']));

            return {
                date: dt,
                year: dt ? dt.getFullYear() : null,
                month: dt ? (dt.getMonth() + 1) : null,
                gold:  goldRet,
                silver: silverRet,
                gpr:   gprVal
            };
        }).filter(d => d.date && d.year >= 2000 && d.year <= 2025);

        const byYM = d3.rollups(
            rows,
            v => ({
                gold: d3.mean(v, d=>d.gold),
                silver: d3.mean(v, d=>d.silver),
                gpr: d3.mean(v, d=>d.gpr)
            }),
            d => `${d.year}-${d.month}`
        );

        const grid = [];
        const map = new Map(byYM);
        years.forEach(y=>{
            months.forEach(m=>{
                const key = `${y}-${m}`;
                const obj = map.get(key) || {gold:null, silver:null, gpr:null};
                const gold = +obj.gold, asset = +obj.silver;
                let regime = null;
                if (!isNaN(gold) && !isNaN(asset)) {
                    const gs = gold>=0 ? '+' : '-';
                    const as = asset>=0 ? '+' : '-';
                    regime = `${gs}${as}`;
                }
                grid.push({
                    year:y, month:m,
                    gold, asset,
                    gpr: obj.gpr,
                    regime
                });
            });
        });

        const x = d3.scaleBand().domain(years).range([margin.left, w-margin.right]).paddingInner(0.1);
        const y = d3.scaleBand().domain(months).range([margin.top, h-margin.bottom]).paddingInner(0.1);

        const gx = svg.append('g').attr('transform',`translate(0,${margin.top-10})`);
        gx.selectAll('text')
            .data(years)
            .enter().append('text')
            .attr('x', d => x(d) + (x.bandwidth()/2))
            .attr('y', 0)
            .attr('text-anchor','middle')
            .style('font-size','11px')
            .text(d=>d);

        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const gy = svg.append('g').attr('transform',`translate(${margin.left-8},0)`);
        gy.selectAll('text')
            .data(months)
            .enter().append('text')
            .attr('x', 0)
            .attr('y', d => y(d) + (y.bandwidth()/2) + 4)
            .attr('text-anchor','end')
            .style('font-size','12px')
            .style('font-weight','600')
            .text(d=>monthNames[d-1]);

        const cells = cellLayer.selectAll('rect.qcell')
            .data(grid)
            .enter().append('rect')
            .attr('class','qcell')
            .attr('rx', 7).attr('ry', 7)
            .attr('x', d=> x(d.year) )
            .attr('y', d=> y(d.month) )
            .attr('width', x.bandwidth())
            .attr('height', y.bandwidth())
            .style('fill', d => d.regime ? regimeColor[d.regime] : '#e5e7eb')
            .style('stroke', '#1f2937')
            .style('stroke-width', d => gprStrokeWidth(d.gpr))
            .on('mousemove', (event,d)=>{
                const html = `
          <div style="font-weight:700; margin-bottom:4px">${monthNames[d.month-1]} ${d.year}</div>
          <div><b>Gold</b> ${formatPct(d.gold)}</div>
          <div><b>Silver</b> ${formatPct(d.asset)}</div>
          <div><b>GPR</b> ${gprBucket(d.gpr)} ${isFinite(d.gpr)?`(${d.gpr.toFixed(1)})`:''}</div>
        `;
                tooltip.html(html)
                    .style('opacity',1)
                    .style('transform','translateY(-8px)')
                    .style('left', (event.clientX+14)+'px')
                    .style('top',  (event.clientY+14)+'px');
            })
            .on('mouseleave', ()=>{
                tooltip.transition().duration(120).style('opacity',0);
            });

// === Selections for different insight states ===
        const plusPlusCells = cells.filter(d => d.regime === '++');   // green
        const blueCells     = cells.filter(d => d.regime === '--');   // blue
        const orangeCells   = cells.filter(d => d.regime === '+-');   // orange only
        const highGprCells  = cells.filter(d => gprBucket(d.gpr) === 'High');

        function resetInsightStyles() {
            cells
                .style('opacity', 1)
                .style('filter', null)
                .style('stroke-dasharray', null)
                .style('stroke-width', d => gprStrokeWidth(d.gpr));
        }

        function dimAllCells() {
            cells
                .style('opacity', 0.18)
                .style('filter', null)
                .style('stroke-dasharray', null)
                .style('stroke-width', d => gprStrokeWidth(d.gpr));
        }

        function highlightStep(stepIndex) {
            dimAllCells();

            // 0: Gold & Silver move together in most months (green & blue blocks).
            if (stepIndex === 0) {
                plusPlusCells
                    .style('opacity', 1)
                    .style('filter', 'url(#softGlow)');
                blueCells
                    .style('opacity', 1)
                    .style('filter', 'url(#softGlow)');
            }

            // 1: Divergences are rarer and often Gold ↑, Silver ↓ (orange blocks).
            if (stepIndex === 1) {
                orangeCells
                    .style('opacity', 1)
                    .style('stroke-dasharray', '4 2')
                    .style('filter', null);
            }

            // 2: High GPR (thick borders) tends to coincide with stronger Gold performance.
            if (stepIndex === 2) {
                highGprCells
                    .style('opacity', 1)
                    .style('stroke-width', d => gprStrokeWidth(d.gpr) + 2)
                    .style('filter', null);
            }
        }

// === Insight ===
        const insightMessages = [
            'Gold & Silver move together in most months (green & blue blocks).',
            'Divergences are rarer and often Gold ↑, Silver ↓ (orange blocks).',
            'High GPR (thick borders) tends to coincide with stronger Gold performance.'
        ];

        let msgIndex = 0;

        function cycleMessages() {
            if (!insightsOn) return;

            // highlight according to insignts
            highlightStep(msgIndex);

            const text = insightMessages[msgIndex];
            msgIndex = (msgIndex + 1) % insightMessages.length;

            insightToast.interrupt()
                .style('opacity', 0)
                .text(text)
                .transition().duration(200)
                .style('opacity', 1)
                .transition().delay(6600).duration(600)
                .style('opacity', 0)
                .on('end', () => {
                    if (insightsOn) {
                        setTimeout(cycleMessages, 600);
                    }
                });
        }

        insightBtn.on('click', () => {
            insightsOn = !insightsOn;
            if (insightsOn) {
                insightBtn.text('✨ Hide Insights');
                msgIndex = 0;
                cycleMessages();
            } else {
                insightBtn.text('🔮 Reveal Insights');
                resetInsightStyles();
                insightToast.interrupt().style('opacity', 0);
            }
        });

        function formatPct(x){
            if (x==null || !isFinite(x)) return 'N/A';
            return (x>=0?'+':'') + x.toFixed(2) + '%';
        }
    });
}