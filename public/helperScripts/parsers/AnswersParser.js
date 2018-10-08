(function() {
    if(window.AnswersParser) return;
    
    window.AnswersParser = class BrainlyParser extends QAParser {
        constructor() {
            super('span.title_text', 'div.answer_wrapper');
        }

        getParsedAnswersPage() {
            return {
                question: this.getQuestion(),
                answer: this.getTopAnswer() 
            }
        }
    }
})();