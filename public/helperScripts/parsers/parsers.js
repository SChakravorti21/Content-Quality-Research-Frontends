(function() {
    if(window.Parser) return;

    window.Parser = class Parser {
        constructor() {}
    
        DOMToString() {
            var element = document.getElementsByTagName('body')[0];
            var ret_string = element.innerText || element.textContent;
            return ret_string;
        };
    }
})();