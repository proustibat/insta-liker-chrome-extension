chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");

        if (request.greeting) {
            console.log("Service worker received greeting: ", request.greeting)
            sendResponse({farewell: "Well received! Goodbye!"});
        }
    }
);
