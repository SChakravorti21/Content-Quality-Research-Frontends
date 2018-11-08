(function() {
    if(window.AnswerbagParser) return;
    
    window.AnswerbagParser = class AnswerbagParser extends QAParser {
        constructor() {
            super();
            this.answer_list_path = '.member_answer > ul > li';
        }

        getQuestion() {
            const question_path = '.banner_container .q-text';
            const question_description_path = '.banner_container .q-description';

            const question = document.querySelector(question_path).innerText; 
            const description = document.querySelector(question_description_path).innerText; 

            return `${question} ${description}`;
        }

        getAnswers() {
            const username_path = '.img_holder > a > strong';
            const answer_path = '.main_text > .text_holder';
            const upvotes_path = '.like_container_left';

            let answers = [];
            document.querySelectorAll(this.answer_list_path).forEach(element => {
                if(element.className === 'comments' || element.id === 'adsense')
                    return;

                answers.push({
                    username: element.querySelector(username_path).innerText,
                    answer: element.querySelector(answer_path).innerText,
                    upvotes: Number.parseInt(element.querySelector(upvotes_path).innerText)
                });
            });

            return answers;
        }

        getParsedAnswerbagPage() {
            return {
                question: this.getQuestion(),
                answers: this.getAnswers()
            }
        }
    }
})();