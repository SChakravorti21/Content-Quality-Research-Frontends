(function() {
    if(window.WikiParser) return;

    window.WikiParser = class WikiParser extends Parser {
        constructor() {
            super();
        }
    
        getParsedWikiPage(selector_queries) {
            /**
             * Using the current running list (Array) of headers in increasing
             * specificity, generates a slash-separated concatenation of the headers.
             * @param {Array} stack 
             */
            function generate_headers(stack) {
                var header_string = '';
                stack.forEach(header_element => {
                    header_string += header_element + ' / ';
                });
    
                //Get rid of trailing comma and space
                return header_string.substr(0, header_string.length - 2);
            }
    
            /**
             * Removes unnecessary endings for headings, such as the 'Edit'
             * links for users to modify content.
             * @param {string} header: the header to be parsed 
             */
            function cleanHeader(header) {
                var cleaned = header;
                let edit_text_elements = ['[edit]', 'edit'];
                edit_text_elements.some(edit_text => {
                    if (header.toLowerCase().endsWith(edit_text)) {
                        cleaned = header.substr(0, header.length - edit_text.length);
                        return true;
                    }
                })
    
                return cleaned;
            }
    
    
            // Variables to keep track of the current headers and text content
            // corresponding to them
    
            // Only the page header is an H1 element, but it is never inside
            // the selector's body 
            var headers_stack = ['H1'];
            var headers_text_stack = [document.querySelector('h1').innerText];
            var text_list = []; // list of header-text objects to return
            var running_text = '';
            var all_text_nodes; // all child nodes with relevant text information
    
            // Try all selectors until the one provides the page body
            selector_queries.some(query => {
                if (all_text_nodes = document.querySelector(query)) {
                    return true; // exists out of Array.some() call
                }
            })
    
            // If the text was not retrieved (is null) do not try to parse anything.
            if (!all_text_nodes) {
                return null;
            }
    
            // All children nodes, and the node types we care about for text content 
            let children = all_text_nodes.children;
            let text_nodes = ['P', 'SPAN', 'UL', 'OL', 'DL']
            for (var child_index = 0; child_index < children.length; child_index++) {
                let child = children[child_index];
    
                if (text_nodes.includes(child.nodeName) || child.nodeType === 3) {
                    // Node contains text content, and innerText gives it with the 
                    // formatting seen by the user, allowing it to suffice
                    running_text += child.innerText + ' ';
                } else if (child.nodeName.startsWith('H')) {
                    // Gather the levels of the current and most recent header to compare them
                    // Might have been able to do lexicographical comparison, but this is 
                    // more explicit in my opinion.      
                    var last_headers_index = headers_stack.length - 1;
                    let most_recent_header = headers_stack[last_headers_index];
                    let curr_header_level = parseInt(child.nodeName.charAt(1));
                    let recent_header_level = parseInt(most_recent_header.charAt(1));
    
                    // Before adjusting the headers, push on the text for the current
                    // set of headers, and only push if there actually is text.
                    if (running_text) {
                        text_list.push({
                            header: generate_headers(headers_text_stack),
                            text: running_text
                        })
                    }
    
                    // Keep in mind that a larger header level indicates a more specific
                    // header. Ex, h6 is more specific than h4
                    if (curr_header_level > recent_header_level) {
                        // This means the current header is more specific than the existing one
                        // and can just be tacked onto the current set of headers.
                        headers_stack.push(child.nodeName);
                        headers_text_stack.push(cleanHeader(child.innerText));
                    } else if (curr_header_level < recent_header_level) {
                        // The current header is less specific than the last one, keep
                        // popping until we reach the level of the current one
                        while (headers_stack[last_headers_index] !== child.nodeName) {
                            headers_stack.pop();
                            headers_text_stack.pop();
                            last_headers_index--;
                        }
                        // Update the header's text value even though header level was the same
                        headers_text_stack[last_headers_index] = cleanHeader(child.innerText);
                    } else {
                        // In this case curr_header_level === recent_header_level, so the headers are of the
                        // same level, and the most recent header can simply be replaced
                        headers_text_stack[last_headers_index] = cleanHeader(child.innerText);
                    }
    
                    running_text = '';
                }
            }
    
            return text_list;
        }
    }
})();