(function() {
    if(window.BrainlyParser) return;
    
    window.BrainlyParser = class BrainlyParser extends QAParser {
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
            this.upvotes_extension = upvotes_extension;
            this.rep_extension = rep_extension;

            this.anonymous_answer_extension = this.answer_extension + '.js-answer-content';
            this.user_extension = '.sg-link[data-url-hash]';
            this.num_upvotes_extension = '.sg-rate-box__counter-item-dynamic';
            this.thanks_extension = '.sg-label__number';
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
                var user;
                // Edge case for anonymous answerers, the selectors are a bit different
                if (text === 'Brainly User') {
                    user = text;
                    text = answer_node.querySelector(this.anonymous_answer_extension).innerText;
                } else {
                    user = answer_node.querySelector(this.user_extension).innerText;
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
                    user: user,
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
})();