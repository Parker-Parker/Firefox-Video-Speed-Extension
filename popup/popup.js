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
        let url = 2.5;
        function beastify(tabs) {
            // document.querySelector("#playback-speed").getAttribute("value")
            // var url = document.querySelector("#playback-speed").getAttribute("valid");
            // var url = document.querySelector("#playback-speed").classList.contains("valid") ? document.querySelector("#playback-speed").getAttribute("value"):2.5;
            // var url = document.querySelector("#playback-speed").getAttribute("valid") ? document.querySelector("#playback-speed").getAttribute("value"):2.5;
            // url = parseFloat(document.querySelector("#playback-speed").getAttribute("value"));
            temp = document.querySelector("#playback-speed").getAttribute("value");
            url = parseFloat(temp);
            // url = isNaN(url) ? 1 :url;
            // document.querySelector("#playback-speed").setAttribute("value", url+1);
            browser.tabs.sendMessage(tabs[0].id, {
                command: "beastify",
                beastURL: url
            });
            document.querySelector("#debug-thing").setAttribute("innerText", " Temp: "+temp+" TabID: "+tabs[0].id+" url: "+url) 

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
