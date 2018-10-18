(function() {
    if(window.QAParser) return;

    window.QAParser = class QAParser extends Parser {
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
})();