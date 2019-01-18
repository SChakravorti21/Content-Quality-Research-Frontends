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

# Folder Structures
It is useful to know how the code is structured in order to find pieces that need to be changed or updated.

Frontend:
```
cq-extension
    build -- the generated build folder that can be installed in Chrome
    public -- the Chrome extension code for scraping and making API calls
        backgroundScripts -- utility scripts for handling scraping and window management
        helperScripts -- contains all scrapers/page modifiers
            modifiers -- as a design choice, we modify the look of some pages (Brainly), the modifier can be found here
            parsers -- contains all parsers, to add a new one create a new parser here following the format of the others
            parseDocument.js -- decides how to perform parsing and communicates with background.js
        background.js -- detects when a new page is loaded and initiates scraping
        index.html -- the root HTML file which the React app is rendered inside
        manifest.json -- details about the Chrome extension, such as permissions and app name/version
    src -- The React application for rendering the extension UI
    package.json -- lists the React app's dependencies
```

Backend:
```
QAServer -- the Django app
    QAServer
        settings.py -- the configuration file for the Django app to run appropriately
        urls.py -- defines the URLs used by this application
        wsgi.py -- defines a WSGI configuration for deploying the server
    model_interface
        urls.py -- defines the prime URL which the frontend makes the request to
        views.py -- contains logic for handling endpoint request and communicating with statistical models
    regression
        CQTool.py -- the main regression script that calculate feature scores
        bad_words.txt -- a list of words considered taboo when calculating scores
        calculate_features.py -- utility script for generating features used by regression script
        format_answers.py -- another utility script
        t.xlsx -- the training dataset
Pipfile -- defines the Django application's dependencies
Procfile -- defines the configuration to run the server in Heroku once it is deployed
nltk.txt -- lists some nltk dependencies the backend uses
runtime.txt -- specifies the Python runtime for Heroku
```

# Usage and Installation
Installing the Chrome application is straightforward. Run `npm run build` inside the `cq-extension` folder, which will create a generated `build` folder. In Chrome, complete the following steps:
1. Go to `chrome://extensions/`
2. Click `Load unpacked` in the top left
3. Select the generated `build` folder
4. The extension is now installed! Go to any of the implemented UGC pages to ensure that an extension window pops up.

Setting up the backend is a bit more complicated. We've used `pipenv` to manage dependencies, so be sure to install that first.
1. Inside the server folder (whatever you named it when cloning the repo), create a `pipenv` virtual environment by running `pipenv install`. This will additionally install all dependencies.
2. Run `pipenv shell` to activate the virtual environment
3. Copy the contents of `Procfile` and paste it into your shell
4. The server should be up and running on `localhost:8000`

## Deploying to Heroku
In order to deploy the application to Heroku, follow these steps:
1. Install the `heroku` CLI, log in through the CLI with your credentials
2. Navigate to the server folder, and enter `heroku create`. This will set up a Heroku project for you.
3. Make any modifications necessary, and commit those changes through git.
4. After using `git commit -m` to complete the commit, call `git push heroku master`
4. Heroku will deploy the application for you. Finally, check what you Heroku project's base URL is through the Heroku website, and update the URL in the frontend's `background.js` to reflect that.
5. Reload the extension in Chrome to use the new Heroku deployment.

# Development Tips

## Creating a new parser
You may want to create a new parser if the extension needs to target a new site, so here are some steps to follow when doing so:
1. Inside `cq-extenion/public/helperScripts/parsers`, create a JS file for your parser (ideally name it `{SiteName}Parser.js` for consistency)
2. The parser should be structured like this to ensure it functions properly:
```JavaScript
// Define the parser in an anonymous function to guard the definition,
// otherwise the parser will be defined on the window multiple times
(function() {
    // Define the parser only if this has not already been done
    if(window.ParserName)
        return;
        
    // The parser can extend QAParser to receive some functionality out-of-the-box,
    // but it does not strictly need to extend QAParser to function correctly
    window.ParserName = class ParserName extends QAParser {
        constructor() {
            ...
        }
        
        // A function like this can be called by parseDocument.js to scrape
        // the page content
        getParsedSiteNamePage() {
            // This is the type of data expected by the backend:
            // A JSON array called "all_answers" which contains JSON objects of the format below.
            // Additional content can be included aside from what is specified for development/debugging purposes
            return {
                all_answers: [
                    {
                        content: (String -- the UGC that will be scored),
                        author: (String -- the author name),
                        info_content: (boolean -- whether any contextual data about the content is known),
                        info_author: (boolean -- whether any contextual data about the author is known)
                    }
                ]
            }
        }
    }
})() // Make sure to call the anonymous function, otherwise the parser will never be defined
```
3. Now that the parser is created, add its path to `contentScripts` in the constructor of `PageSourceScraper`. This will ensure that the scraper (which is a content script) gets injected at runtime.
4. Inside `parseDocument.js`, create logic to initialize and use the parser based on the site URL. This script is pretty self-explanatory as the same is done for several other parsers.
5. This is all the setup necessary! To test the parser, add `console.log` statements or use Chrome DevTools as appropriate, and visit a page that the parser is supposed to scrape.
