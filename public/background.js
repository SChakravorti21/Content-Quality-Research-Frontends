let popupWindowManager = new PopupWindowManager();
let pageSourceScraper = new PageSourceScraper();

chrome.tabs.onUpdated.addListener(function(activeInfo) {
    pageSourceScraper.requestSource();
});

function sendCollectedData(payload) {
    console.log(payload)

    if(!payload.brainly_data || payload.brainly_data.all_answers.length < 1)
        return;
    
    console.log('sending to server');
    $.ajax({
        type: 'POST',
        url: 'http://ugc-django-server.herokuapp.com/reliability/generate_report',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        // The Django server expects JSON payloads as a String then parses it using json.loads(payload)
        data: JSON.stringify(payload),
        success: function(response) {
            console.log(response);
            popupWindowManager.updatePopupWindow(payload, response);
        },
        failure: function(response) {
            console.log(response);
        }
    })
}

chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "get_source") {
        if(chrome.runtime.lastError || request.error) {
            console.log(request.error);
        } else {
            console.log('got source');
            sendCollectedData(request.data);
        }
    }
});