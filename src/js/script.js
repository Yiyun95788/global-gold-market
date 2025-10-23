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