(function() {
    if(window.StackExchangeParser) return;
    
    window.StackExchangeParser = class StackExchangeParser extends QAParser {
        constructor() {
            super();
            this.answer_list_path = '#answers .answer';
        }

        getQuestion() {
            const question_path = '#question-header a.question-hyperlink';
            const question_description_path = '.question .post-text';

            const question = document.querySelector(question_path).innerText; 
            const description = document.querySelector(question_description_path).innerText; 

            return `${question} ${description}`;
        }

        getAnswers() {
            const username_path = '.user-info .user-details a';
            const answer_path = '.post-text';
            const upvotes_path = '.vote-count-post';

            let answers = [];
            document.querySelectorAll(this.answer_list_path).forEach(element => {
                if(element.className === 'comments' || element.id === 'adsense')
                    return;

                answers.push({
                    username: element.querySelector(username_path).innerText,
                    reputation: this.getReputationForAnswerer(element),
                    answer: element.querySelector(answer_path).innerText,
                    upvotes: Number.parseInt(element.querySelector(upvotes_path).innerText)
                });
            });

            return answers;
        }

        getReputationForAnswerer(answer_node) {
            const reputation_path = 'span.reputation-score';
            const rep_elem = answer_node.querySelector(reputation_path);
            const title_elems = rep_elem.getAttribute('title').split(' ');
            const reputation_text = title_elems[title_elems.length - 1];
            let rep = Number.parseInt(reputation_text.replace(',', ''));

            if(!rep) { // rep === NaN
                rep = Number.parseInt(rep_elem.innerText.replace(',', ''));
            }

            return rep;
        }

        getParsedStackExchangePage() {
            return {
                question: this.getQuestion(),
                all_answers: this.getAnswers()
            }
        }
    }
})();