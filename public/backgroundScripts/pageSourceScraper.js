class PageSourceScraper {

    constructor(contentScripts = [
        "libs/jquery.min.js", 
        "helperScripts/parsers.js", 
        "helperScripts/parseDocument.js"
    ]) {
        this.contentScripts = contentScripts;
    }

    requestSource() {
        const self = this;
        if(!location.href.includes('chrome://')) {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                self.injectAllScripts(tabs[0].id, self.contentScripts);
            });
        }
    }

    injectAllScripts(tab_id, script_list) {
        const self = this;
        chrome.tabs.executeScript(tab_id, { file: script_list[0] }, () => {
            script_list.shift();
            if(script_list.length > 0) {
                self.injectAllScripts(tab_id, script_list);
            }
        });
    }

}