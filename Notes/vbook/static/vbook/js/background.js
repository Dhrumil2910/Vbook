var opened = false;
var panel = 0;

chrome.browserAction.onClicked.addListener(function() {
    // Allow only one instance
    if (!opened) {
        opened = true;
        chrome.windows.create({
                url: "index.html",
                type: "popup",
                focused: true,
                width: 450,
                height: 700
            },
            function(window) { panel = window.id }
        )
    }

    // Focus on clicking the extension icon
    else if (opened) { chrome.windows.update(panel, { focused: true }) }
    // Remove when remo
    chrome.windows.onRemoved.addListener(function(windowId) {
        if (windowId == panel) {
            panel = 0;
            opened = false;
        }
    });
});
