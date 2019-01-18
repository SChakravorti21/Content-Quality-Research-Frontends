# What is it?
The Content Quality Extension is a research project allowing users to determine the validity of user-generated content in realtime as they are browsing the Internet. This is implemented as a React Chrome extension that makes API calls to a Django server, where statistical models created using `numpy` and `pandas` are invoked.

# General Architecture
As mentioned previously, there are two parts to this application: the user-facing Chrome extension and the backend Django server. In order to understand how the extension works, it is useful to understand the steps that take place when a user visits a new page:

1. The extension detects that a new page has been loaded through the Chrome Tabs API with an `onUpdated` listener.
2. The extension immediately injects a bunch of JavaScript files into the page using a `PageSourceScraper`.
3. Among these files is one titled `parseDocument.js`, which determines the domain of the page and initializes a scraper object.
4. Since the scraper object has access to the DOM by way of being injected into the browser page, it can access whatever content necessary.
5. Once scraping is complete, `parseDocument` uses the Chrome runtime messaging API to let the background script know that all necessary data has been collected.
    - Note that there is an important distinction between **background scripts** and **content scripts**. Background scripts run "in the browser," and do NOT have access to actual page content. On the other hand, content scripts are injected into specific broswer pages, giving them access to page content. Since background and content scripts live in different parts of the browser, communicating between them requires using something like Chrome's messaging API.
6. `background.js`, having received the message, makes an API call to the Django server to request the feature scores for the collected data. The request URL is `https://ugc-django-server.herokuapp.com/reliability/generate_report` to communicate to the server if it is deployed to Heroku.
    - Keep in mind that this URL will change if you decide to host the server separately yourself on Heroku.
7. The server, having received the frontend's request, processes the feature scores and returns them accordingly to the frontend.
    - This involves calling a bunch of regression methods that work in a generic manner for _any_ user-generated content.
8. The extension background script receives the feature scores and uses a `PopupWindowManager` to update the UI with the new content scores.
    - This essentially force reloads the React app, which communicates with the background script through Chrome's local storage API.
9. The React application performs its rendering, which allows the user to see the content that was extracted and the scores that the regression models generated.
