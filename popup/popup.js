/**
 * CSS to hide everything on the page,
 * except for elements that have the "beastify-image" class.
 */
const hidePage = `body > :not(.beastify-image) {
    display: none;
  }`;

/**
* Listen for clicks on the buttons, and send the appropriate message to
* the content script in the page.
*/
function listenForClicks() {
    document.addEventListener("click", (e) => {

        /**
        * Insert the page-hiding CSS into the active tab,
        * then get the beast URL and
        * send a "beastify" message to the content script in the active tab.
        */
        function beastify(tabs) {
            browser.tabs.insertCSS({ code: hidePage }).then(() => {
                const url = 2.5;
                browser.tabs.sendMessage(tabs[0].id, {
                    command: "beastify",
                    beastURL: url,
                });
            });
        }


        /**
        * Just log the error to the console.
        */
        function reportError(error) {
            console.error(`Could not beastify: ${error}`);
        }

        /**
        * Get the active tab,
        * then call "beastify()" or "reset()" as appropriate.
        */
        if (e.target.tagName !== "BUTTON" || !e.target.closest("#popup-content")) {
            // Ignore when click is not on a button within <div id="popup-content">.
            return;
        } else {
            browser.tabs
                .query({ active: true, currentWindow: true })
                .then(beastify)
                .catch(reportError);
        }
    });
}

/**
* There was an error executing the script.
* Display the popup's error message, and hide the normal UI.
*/
function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute VideoSpeedChanger content script: ${error.message}`);
}

/**
* When the popup loads, inject a content script into the active tab,
* and add a click handler.
* If we couldn't inject the script, handle the error.
*/
browser.tabs
    .executeScript({ file: "/content_scripts/VideoSpeedChanger.js" })
    .then(listenForClicks)
    .catch(reportExecuteScriptError);
