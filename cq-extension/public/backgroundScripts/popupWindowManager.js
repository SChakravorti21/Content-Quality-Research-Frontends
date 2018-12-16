class PopupWindowManager {

    constructor(width = 400, height = 800) {
        this.windowId = null;
        this.popupTabId = 0;

        this.windowWidth = width;
        this.windowHeight = height;
    }

    createPopupWindow() {
        const self = this;
        chrome.windows.create({
            url: "index.html",
            type: "popup",
            left: window.screen.availWidth - this.windowWidth,
            top: 0,
            width: this.windowWidth,
            height: this.windowHeight
        }, function(window) {
            self.windowId = window.id;
    
            // Get the tab id as well
            chrome.tabs.query(
                { 'windowId': self.windowId }, 
                (tabs) => self.popupTabId = tabs[0].id
            );
        });
    }

    updatePopupWindow(collected_data, response) {
        console.log('updating window')
        
        const self = this;
        chrome.storage.local.set(
            { 'collected': collected_data, 'response': response }, 
            function() {
                chrome.tabs.reload(self.popupTabId, function() {
                    // The popup window no longer exists, create it
                    if(chrome.runtime.lastError)
                        self.createPopupWindow();
            });
        });
    }

}