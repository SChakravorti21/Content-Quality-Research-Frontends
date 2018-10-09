(function() {
    if(window.RedditParser) return;
    
    window.RedditParser = class RedditParser extends QAParser {
        constructor() {
            super('a.title', 'div.md-container');
        }

        getParsedRedditPage() {
            return {
                text: this.getQuestion() + " : " + this.getTopAnswer()
            }
        }

        getTopAnswer() {
            let answer_node = document.querySelectorAll(this.answer_class)[1];
            return (answer_node) ? answer_node.innerText : '';
        }
    }
})();