// Wood Fence Calculator - Helper Functions
// This file contains helper functions for the Wood Fence Calculator

// Update total length from pull lengths and gate widths
function updateTotalLengthFromPulls() {
    try {
        const pullLengthInputs = document.querySelectorAll('.pull-length-input');
        let sumOfPulls = 0;
        pullLengthInputs.forEach(input => { 
            sumOfPulls += getInputValue(input.id, true); 
        });
        
        // Add gate widths to the total length
        const gateWidths = getTotalGateWidths();
        const totalLength = sumOfPulls + gateWidths;
        
        const totalLengthElement = document.getElementById('totalLength');
        if (totalLengthElement) {
            totalLengthElement.value = totalLength.toFixed(totalLength % 1 === 0 ? 0 : 2);
            
            // Only call calculateFence if it exists
            if (typeof calculateFence === 'function') {
                calculateFence();
            } else {
                console.warn('calculateFence function not available');
            }
        } else {
            console.warn('totalLength element not found');
        }
    } catch (error) {
        console.error('Error in updateTotalLengthFromPulls:', error);
    }
}

// Generate pull length inputs
function generatePullLengthInputs(count) {
    console.log('generatePullLengthInputs called with count:', count); // Added logging
    const container = document.getElementById('pullLengthsContainer');
    const totalLengthInput = document.getElementById('totalLength');
    container.innerHTML = ''; 
    if (count > 0) {
        totalLengthInput.readOnly = true;
        totalLengthInput.title = "Auto-calculated from pull lengths.";
        for (let i = 0; i < count; i++) {
            const div = document.createElement('div');
            if (window.innerWidth >= 768 && count % 2 !== 0 && i === count -1) { 
                div.className = 'md:col-span-2';
            }
            const defaultValue = (i === 0) ? '100' : ''; // Set default to 100 for the first input
            div.innerHTML = `<label for="pullLength_${i+1}" class="text-sm font-medium text-gray-700">Pull ${i+1} Length (ft):</label>
                           <input type="number" id="pullLength_${i+1}" class="pull-length-input mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2" value="${defaultValue}" min="0" step="any" oninput="updateTotalLengthFromPulls()">`; 
            container.appendChild(div);
        }
    } else {
        totalLengthInput.readOnly = false;
        totalLengthInput.title = "Enter total linear length.";
    }
    if (count > 0) { 
        updateTotalLengthFromPulls(); 
    } else { 
        calculateFence(); 
    }
}

// Handle number of stretches change
function handleNumStretchesChange() {
    console.log('handleNumStretchesChange called'); // Added logging
    generatePullLengthInputs(getInputValue('numStretches'));
}

// Generate gate width inputs
function generateGateWidthInputs(gateTypePrefix, count) {
    const containerId = `${gateTypePrefix}GateWidthsContainer`;
    const container = document.getElementById(containerId);
    if (!container) return; 
    container.innerHTML = ''; 
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        if (window.innerWidth >= 768 && count % 2 !== 0 && i === count -1) { 
            div.className = 'md:col-span-2';
        }
        const defaultWidth = gateTypePrefix === 'single' ? 3 : (gateTypePrefix === 'double' ? 6 : 10);
        div.innerHTML = `<label for="${gateTypePrefix}GateWidth_${i+1}" class="text-sm">Width for ${gateTypePrefix.charAt(0).toUpperCase() + gateTypePrefix.slice(1)} Gate ${i+1} (ft):</label>
                       <input type="number" id="${gateTypePrefix}GateWidth_${i+1}" class="gate-width-input mt-1 block w-full p-2" min="0" step="any" value="${defaultWidth}" oninput="updateTotalLengthFromPulls()">`;  
        container.appendChild(div);
    }
    updateTotalLengthFromPulls(); 
}

// Handle number of single gates change
function handleNumSingleGatesChange() {
    generateGateWidthInputs('single', getInputValue('numSingleGates'));
}

// Handle number of double gates change
function handleNumDoubleGatesChange() {
    generateGateWidthInputs('double', getInputValue('numDoubleGates'));
}

// Handle number of sliding gates change
function handleNumSlidingGatesChange() {
    generateGateWidthInputs('sliding', getInputValue('numSlidingGates'));
}

// Get total actual gate widths
function getTotalActualGateWidths() {
    let totalWidth = 0;
    document.querySelectorAll('.gate-width-input').forEach(input => {
        totalWidth += getInputValue(input.id, true);
    });
    return totalWidth;
}

// Get total gate widths for total length calculation
function getTotalGateWidths() {
    try {
        const numSingleGates = getInputValue('numSingleGates');
        const numDoubleGates = getInputValue('numDoubleGates');
        const numSlidingGates = getInputValue('numSlidingGates');
        
        let totalGateWidth = 0;
        
        // Add single gate widths
        for (let i = 1; i <= numSingleGates; i++) {
            try {
                totalGateWidth += getInputValue(`singleGateWidth_${i}`, true);
            } catch (error) {
                console.warn(`Error getting single gate width ${i}:`, error);
            }
        }
        
        // Add double gate widths
        for (let i = 1; i <= numDoubleGates; i++) {
            try {
                totalGateWidth += getInputValue(`doubleGateWidth_${i}`, true);
            } catch (error) {
                console.warn(`Error getting double gate width ${i}:`, error);
            }
        }
        
        // Add sliding gate widths
        for (let i = 1; i <= numSlidingGates; i++) {
            try {
                totalGateWidth += getInputValue(`slidingGateWidth_${i}`, true);
            } catch (error) {
                console.warn(`Error getting sliding gate width ${i}:`, error);
            }
        }
        
        return totalGateWidth;
    } catch (error) {
        console.error('Error in getTotalGateWidths:', error);
        return 0;
    }
}

// Get double gate widths
function getDoubleGateWidths() { 
    const widths = [];
    const numDouble = getInputValue('numDoubleGates');
    for (let i = 1; i <= numDouble; i++) {
        widths.push(getInputValue(`doubleGateWidth_${i}`, true));
    }
    return widths;
}

// Get pull lengths
function getPullLengths() { 
    const lengths = [];
    const numPulls = getInputValue('numStretches');
    for (let i = 1; i <= numPulls; i++) {
        lengths.push(getInputValue(`pullLength_${i}`, true));
    }
    return lengths;
}

// Toggle baseboard options
function toggleBaseboardOptions() { 
    const addBaseboardElement = document.getElementById('addBaseboard');
    if (!addBaseboardElement) {
        console.warn('addBaseboard element not found');
        return;
    }
    
    const optionsContainer = document.getElementById('baseboardOptionsContainer');
    if (!optionsContainer) {
        console.warn('baseboardOptionsContainer element not found');
        return;
    }
    
    optionsContainer.style.display = addBaseboardElement.value === 'yes' ? 'grid' : 'none';
}

// Toggle gate post options
function toggleGatePostOptions() { 
    const useDifferentElement = document.getElementById('useDifferentGatePosts');
    if (!useDifferentElement) {
        console.warn('useDifferentGatePosts element not found');
        return;
    }
    
    const optionsContainer = document.getElementById('gatePostOptionsContainer');
    if (!optionsContainer) {
        console.warn('gatePostOptionsContainer element not found');
        return;
    }
    
    optionsContainer.style.display = useDifferentElement.value === 'yes' ? 'grid' : 'none';
}

// Export functions for use in HTML
window.updateTotalLengthFromPulls = updateTotalLengthFromPulls;
window.generatePullLengthInputs = generatePullLengthInputs;
window.handleNumStretchesChange = handleNumStretchesChange;
window.generateGateWidthInputs = generateGateWidthInputs;
window.handleNumSingleGatesChange = handleNumSingleGatesChange;
window.handleNumDoubleGatesChange = handleNumDoubleGatesChange;
window.handleNumSlidingGatesChange = handleNumSlidingGatesChange;
window.getTotalActualGateWidths = getTotalActualGateWidths;
window.getTotalGateWidths = getTotalGateWidths;
window.getDoubleGateWidths = getDoubleGateWidths;
window.getPullLengths = getPullLengths;
window.toggleBaseboardOptions = toggleBaseboardOptions;
window.toggleGatePostOptions = toggleGatePostOptions;
