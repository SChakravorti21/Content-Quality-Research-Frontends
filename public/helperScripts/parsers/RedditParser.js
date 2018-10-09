(function() {
    if(window.RedditParser) return;
    
    window.RedditParser = class RedditParser extends QAParser {
        constructor() {
            super('a.title', 'div.md-container', 'div.score.unvoted');
        }

        getParsedRedditPage() {
            return {
                title: this.getQuestion(),
                body: this.getTopAnswer(),
                score: this.getAnswerVotes()
            }
        }

        getTopAnswer() {
            let answer_node = document.querySelectorAll(this.answer_class)[1];
            return (answer_node) ? answer_node.innerText : '';
        }
    }
})();