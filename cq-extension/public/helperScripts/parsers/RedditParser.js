(function() {
    if(window.RedditParser) return;
    
    window.RedditParser = class RedditParser extends QAParser {
        constructor() {
            super('a.title', 'div.md-container', 'div.score.unvoted');
            this.answer_selector = '.commentarea > .sitetable > .comment > .entry.unvoted';
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

        fetchUserKarma(username, errorCallback) {
            return fetch(`https://old.reddit.com/user/${username}/about.json`)
                .then(response => response.json())
                .then(user => user['data']['link_karma'] + user['data']['comment_karma'])
                .catch(status, err => errorCallback(err));
        }

        getAnswers() {
            return new Promise((resolve, reject) => {

                let get_requests = [];
                let all_answers = [];

                document.querySelectorAll(this.answer_selector).forEach(answer_node => {
                    const username_elem = answer_node.querySelector('.tagline .author');
                    const body_elem = answer_node.querySelector('.usertext-body .md');
                    if(!username_elem || !body_elem) return;

                    const username = username_elem.innerText;
                    get_requests.push(this.fetchUserKarma(username, reject));

                    all_answers.push({
                        username: username,
                        upvotes: this.getKarma(answer_node),
                        silver: this.getTimesGilded(answer_node, 'span.gilded-gid1-icon'),
                        gold: this.getTimesGilded(answer_node, 'span.gilded-gid2-icon'),

                        content: body_elem.innerText,
                        author: 1,
                        info_content: 1,
                        info_author: 1
                    });

                });

                Promise.all(get_requests)
                    .then(results => {
                        all_answers.forEach((answer, index) => {
                            answer['user_karma'] = results[index];
                        });
                    })
                    .then(() => resolve(all_answers))
                    .catch(error => reject(error));
            });
        }

        getParsedRedditPage() {
            return this.getAnswers()
                .then(all_answers => {
                    return {
                        title: this.getQuestion(),
                        body: this.getBody(),
                        all_answers: all_answers
                    };
                });
        }

    }
})();