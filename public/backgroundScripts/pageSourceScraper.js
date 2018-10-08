class PageSourceScraper {

    constructor(contentScripts = [
        "libs/jquery.min.js", 
        "helperScripts/parsers/Parser.js",
        "helperScripts/modifiers/Modifier.js", 
        "helperScripts/parsers/QAParser.js", 
        "helperScripts/parsers/BrainlyParser.js", 
        "helperScripts/modifiers/BrainlyModifier.js", 
        "helperScripts/parsers/WikiParser.js",
        "helperScripts/parsers/AnswersParser.js", 
        "helperScripts/parseDocument.js"
    ]) {
        this.contentScripts = contentScripts;
    }

    requestSource() {
        const self = this;
        if(!location.href.includes('chrome://')) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                self.injectAllScripts(tabs[0].id, self.contentScripts);
            });
        }
    }

    injectAllScripts(tab_id, script_list) {
        const self = this;
        chrome.tabs.executeScript(tab_id, { file: script_list[0] }, () => {
            if(script_list.length > 0) {
                self.injectAllScripts(tab_id, script_list.slice(1));
            }
        });
    }

}