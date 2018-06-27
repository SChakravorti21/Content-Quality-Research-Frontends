class Parser {
    constructor() {}

    DOMToString() {
        var element = document.getElementsByTagName('body')[0];
        var ret_string = element.innerText || element.textContent;
        return ret_string;
    };
}

class QAParser extends Parser {
    constructor(question_class, answer_class, upvotes_class, rep_class, date_class) {
        super();

        this.question_class = question_class;
        this.answer_class = answer_class;
        this.upvotes_class = upvotes_class;
        this.rep_class = rep_class;
        this.date_class = date_class;
    }

    getQuestion() {
        let question_node = document.querySelector(this.question_class);
        return (question_node) ? question_node.innerText : '';
    };

    getTopAnswer() {
        let answer_node = document.querySelector(this.answer_class);
        return (answer_node) ? answer_node.innerText : '';
    };

    getAnswerVotes() {
        let upvotes_node = document.querySelector(this.upvotes_class);
        return (upvotes_node) ? parseFloat(upvotes_node.innerText) : 0;
    };

    singleAnswerRep(selector) {
        var ret_val = 1;
        $(selector).each(function (index) {
            let text = $(this).text();
            text = text.replace(',', '');
            var val = parseFloat(text);
            if (val > 1) {
                ret_val = val;
                if (text.endsWith('k') || text.endsWith('K'))
                    ret_val *= 1000;
                return false;
            }
        });
        return ret_val;
    };

    getAnswererReputation(rep_is_text) {
        if (rep_is_text) {
            let reps_node = document.querySelector(this.rep_class);
            return (reps_node) ? reps_node.innerText : '';
        } else {
            return this.singleAnswerRep(this.rep_class);
        }
    };

    getDateCreated() {
        var ret_date = '';
        $(this.date_class).each(function (index) {
            $.each(this.attributes, function () {
                if (this.specified) {
                    var possibleDate = Date.parse(this.value);
                    if (possibleDate) {
                        ret_date = possibleDate;
                        return false;
                    }
                }
            });
            if (ret_date)
                return false;
        });
        return ret_date;
    };

    getDateCreatedNode() {
        let date_node = document.querySelector(this.date_class);
        return date_node;
    }
}

class BrainlyParser extends QAParser {
    constructor() {
        // The answer case class and selector extensions are stored for later use
        // in getting all answers and their data in a cleaner manner since the 
        // extensions can be applied to every answer node.
        let base_answer_class = '.brn-answer ';
        let answer_extension = '.sg-text.js-answer-content';
        let upvotes_extension = '.sg-rate-box__rate';
        let rep_extension = '.sg-breadcrumb-list__element .sg-link--gray';

        super('.brn-question .sg-text',
            base_answer_class + answer_extension,
            base_answer_class + upvotes_extension,
            base_answer_class + rep_extension,
            '.brn-question .sg-content-box__content .sg-link--disabled time'
        );

        // Cannot use 'this' until super constructor is called
        this.base_answer_class = base_answer_class;
        this.answer_extension = answer_extension;
        this.anonymous_answer_extension = this.answer_extension + '.js-answer-content'
        this.upvotes_extension = upvotes_extension;
        this.rep_extension = rep_extension;
        this.num_upvotes_extension = '.sg-rate-box__counter-item-dynamic';
        this.thanks_extension = '.sg-label__number'
        this.subject_extension = '.brn-question .sg-breadcrumb-list span';
    }

    /**
     * Gets all the relevant data from a page if it is a Brainly Q&A page.
     * This data includes:
     *  The original question asked, and the time it was posted.
     *  The top answer to the question (i.e. the one that Brainly's 
     *      algorithm chose to be shown at the top, which might
     *      not take the contents of the answer into account)
     *  With the top answer, its rating, number of upvotes, and 
     *      number of times other users have thanked the answerer 
     *      for the answer.
     *  A list of ALL the answers, including the top answer. All of these
     *      answers contain the same information as the top answer.  
     */
    getParsedBrainlyPage() {
        // Create object to return
        var parsed_data = {
            question: this.getQuestion(),
            subject: this.getSubject()
        };

        // The page has a <time> node with 3 datetime attributes, so we can
        // use one of those instead of parsing it ourselves.
        let date_node = this.getDateCreatedNode();
        parsed_data.date = (date_node) ? date_node.getAttribute('data-timestamp') : 0;

        // Get all answers, and separate the top answer for convenience
        parsed_data.all_answers = this.getAllAnswers();
        parsed_data.top_answer = parsed_data.all_answers[0];

        return parsed_data;
    }

    getSubject() {
        let subject_node = document.querySelectorAll(this.subject_extension)[1];
        return (subject_node) ? subject_node.innerText : '';
    }

    /**
     * Iterates through all answers on the page to collect their data, as described 
     * in getParsedBrainlyPage().
     */
    getAllAnswers() {
        var answer_list = [];
        // Gets a list of all of the answer nodes.
        let all_answer_nodes = document.querySelectorAll(this.base_answer_class);

        // For each answer node, parse the relevant data
        all_answer_nodes.forEach(answer_node => {
            var text = answer_node.querySelector(this.answer_extension).innerText;
            // Edge case for anonymous answerers, the selectors are a bit different
            if (text === 'Brainly User') {
                text = answer_node.querySelector(this.anonymous_answer_extension).innerText;
            }

            var rep = 'Brainly User';
            try {
                rep = answer_node.querySelectorAll(this.rep_extension)[1].innerText;
            } catch (e) {
                //ignore, if it can't be parsed it's most likely the 'Brainliest Answer'
            }

            // These are numerical values, hence they use a convenience method
            // to parse the nodes' text as floats.
            let upvotes = this.parseFloatWithSelector(answer_node, this.upvotes_extension);
            let num_upvotes = this.parseFloatWithSelector(answer_node, this.num_upvotes_extension);
            let num_thanks = this.parseFloatWithSelector(answer_node, this.thanks_extension);

            // Create answer data object to represent the answer in the answer list
            let answer_data = {
                question: this.getQuestion(),
                subject: this.getSubject(),
                text: text,
                rating: upvotes,
                reputation: rep,
                num_upvotes: num_upvotes,
                num_thanks: num_thanks
            };

            answer_list.push(answer_data);
        });

        return answer_list;
    }

    /**
     * Given an element, applies querySelector on the element to get
     * a nested element and parse it to a float.
     * @param {Element} element : parent element containing sub-element
     * @param {string} selector : selector to apply
     */
    parseFloatWithSelector(element, selector) {
        let node = element.querySelector(selector);
        return node ? parseFloat(node.innerText) : 0;
    }
}

class WikiParser extends Parser {
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