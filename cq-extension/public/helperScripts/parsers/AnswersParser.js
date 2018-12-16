(function() {
    if(window.AnswersParser) return;
    
    window.AnswersParser = class AnswersParser extends QAParser {
        constructor() {
            super('span.title_text', 'div.answer_wrapper');
        }

        getParsedAnswersPage() {
            return {
                question: this.getQuestion(),
                all_answers: [{
                    content: this.getTopAnswer(),
                    author: 0,
                    info_content: 0,
                    info_author: 0
                }]
            }
        }
    }
})();