(function() {
    if(window.RedditParser) return;
    
    window.RedditParser = class RedditParser extends QAParser {
        constructor() {
            super('a.title', 'div.md-container', 'div.score.unvoted');
        }

        getTimesGilded(gild_path) {
            const gild_elem = document.querySelector(`.top-matter .gilding-bar ${gild_path}`);
            if(!gild_elem)  return 0;

            return Number.parseInt(gild_elem.getAttribute('data-count'))
        }
        
        getBody() {
            const body_node = document.querySelectorAll(this.answer_class)[1];
            return (body_node) ? body_node.innerText : '';
        }

        getPostKarma() {
            const karma_elem = document.querySelector('div.score.unvoted');
            return Number.parseInt(karma_elem.getAttribute('title'));
        }

        getParsedRedditPage() {
            return {
                title: this.getQuestion(),
                body: this.getBody(),
                score: this.getPostKarma(),
                silver: this.getTimesGilded('span.gilded-gid1-icon'),
                gold: this.getTimesGilded('span.gilded-gid2-icon')
            }
        }

    }
})();