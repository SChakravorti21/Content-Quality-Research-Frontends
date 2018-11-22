(function() {
    if(window.RedditParser) return;
    
    window.RedditParser = class RedditParser extends QAParser {
        constructor() {
            super('a.title', 'div.md-container', 'div.score.unvoted');
            this.answer_selectors = [
                '.commentarea .comment[itemprop="acceptedAnswer"] > .entry.unvoted',
                '.commentarea .comment[itemprop="suggestedAnswer"] > .entry.unvoted'
            ]
        }

        getTimesGilded(answer_node, gild_path) {
            const gild_elem = answer_node.querySelector(`.gilding-bar ${gild_path}`);
            if(!gild_elem)  return 0;

            return Number.parseInt(gild_elem.getAttribute('data-count'))
        }
        
        getBody() {
            const body_node = document.querySelectorAll(this.answer_class)[1];
            return (body_node) ? body_node.innerText : '';
        }

        getKarma(answer_node) {
            const karma_elem = answer_node.querySelector('.score.unvoted');
            return Number.parseInt(karma_elem.getAttribute('title'));
        }

        getAnswers() {
            let all_answers = [];
            this.answer_selectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(answer_node => {
                    const username_elem = answer_node.querySelector('.tagline .author');
                    const body_elem = answer_node.querySelector('.usertext-body .md');
                    
                    all_answers.push({
                        username: username_elem.innerText,
                        answer: body_elem.innerText,
                        upvotes: this.getKarma(answer_node),
                        silver: this.getTimesGilded(answer_node, 'span.gilded-gid1-icon'),
                        gold: this.getTimesGilded(answer_node, 'span.gilded-gid2-icon')
                    })
                })
            })

            return all_answers;
        }

        getParsedRedditPage() {
            return {
                title: this.getQuestion(),
                body: this.getBody(),
                all_answers: this.getAnswers()
            }
        }

    }
})();