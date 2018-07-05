chrome.runtime.onInstalled.addListener(function() {
    console.log('The extension was installed');
});

var windowId = null;
var popupTabId = 0;
function createPopupWindow() {
    let width = 400;
    let height = 800;
    chrome.windows.create({
        url: "index.html",
        type: "popup",
        left: window.screen.availWidth - width,
        top: 0,
        width: width,
        height: height
    }, function(window) {
        windowId = window.id;

        // Get the tab id as well
        chrome.tabs.query({'windowId' : windowId}, 
            (tabs) => popupTabId = tabs[0].id);
    });
}

//TODO: Implement update function
function updatePopupWindow(collected_data, response) {
    console.log('updating window')
    // console.log(collected_data)
    chrome.storage.sync.set({'collected': collected_data, 'response': response}, function() {
        chrome.tabs.reload(popupTabId, function() {
            // The popup window no longer exists, create it
            if(chrome.runtime.lastError)
                createPopupWindow();
        });
    });
}

function inject_all_scripts(tab_id, script_list) {
    chrome.tabs.executeScript(tab_id, {file: script_list[0]}, function() {
        script_list.shift();
        if(script_list.length > 0) {
            inject_all_scripts(tab_id, script_list);
        }
    });
}

function requestSource() {
    if(!location.href.includes('chrome://')) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            inject_all_scripts(tabs[0].id, [
                "libs/jquery.min.js", 
                "helper_scripts/parsers.js", 
                "helper_scripts/parse_document.js"
            ]);
        });
    }
}

chrome.tabs.onActivated.addListener(function(activeInfo) {
    console.log('activated');
    requestSource();
});

chrome.tabs.onCreated.addListener(function(activeInfo) {
    console.log('created');
    requestSource();
});

chrome.tabs.onUpdated.addListener(function(activeInfo) {
    console.log('updated');
    requestSource();
});

function sendCollectedData(payload) {
    console.log(payload)

    if(!payload.brainly_data || payload.brainly_data.all_answers.length < 1)
        return;
    
    console.log('sending to server');
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/reliability/generate_report',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        // The Django server expects JSON payloads as a String then parses it using json.loads(payload)
        data: JSON.stringify(payload),
        success: function(response) {
            console.log(response);
            updatePopupWindow(payload, response);
        },
        failure: function(response) {
            console.log(response);
            updatePopupWindow(payload, response);
        }
    })
}

chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "get_source") {
        if(chrome.runtime.lastError || request.error) {
            console.log('not got source')
            console.log(request.error);
        } else {
            console.log('got source')
            // console.log(request.data);
        
            sendCollectedData(request.data)
        }
    } 
    else if(request.action == "get_availability") {
        console.log('got availability')
        console.log(request.data);

        sendTestingData(request.data);
    } 
});