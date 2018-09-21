function initializeParser(href) {
    if(href.includes('wiki')) {
        return new WikiParser();
    } else if(href.includes('brainly')) {
        return new BrainlyParser();
    } else {
        return new Parser();
    }
}

let hostname = location.hostname;
let site_href = location.href;
let source = hostname.substr(hostname.lastIndexOf(".") + 1);

// Initialize the page parses based on the respective page
// and collect the data that is common for all pages.
var parser = initializeParser(site_href);
var data = {
    //full: parser.DOMToString(),
    href: site_href,
    domain: hostname,
    source: source,
    time: Date.now()
};

try {

    if(site_href.includes('wiki')) {
        data.wiki_data = parser.getParsedWikiPage(['.mw-parser-output', '#mw-content-text']);
    } else if(site_href.includes('brainly')) {
        data.brainly_data = parser.getParsedBrainlyPage();
        new BrainlyModifier().modifyPageSource();
    }

    // Only for printing the JSON so that it can be emailed for reference
    // console.log(JSON.stringify(data))

    chrome.runtime.sendMessage({
        action: "get_source",
        data: data
    });

} catch(error) {
    chrome.runtime.sendMessage({
        action: "get_source",
        'error': error.message
    });

    chrome.runtime.sendMessage({
        action: "get_source",
        data: data
    });
}