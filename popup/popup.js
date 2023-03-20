document.addEventListener("DOMContentLoaded", async () => {
    const sendMessageButton = document.getElementById("sendMessage");
    const openConnectionButton = document.getElementById("openConnection");

    /**
     * SENDING A MESSAGE WHEN CLICKING A BUTTON ON POPUP
     * Content is listening to the message, and will send a response
     */
    sendMessageButton.addEventListener('click', async () => {
        document.getElementsByTagName('body')[0].style.backgroundColor = "pink"

        let queryOptions = { active: true, currentWindow: true };
        let tabs = await chrome.tabs.query(queryOptions);

        // Send a message that will be received by content
        chrome.tabs.sendMessage(
            tabs[0].id,
            { message: "Hello world, here is popup" },
            ({message}) => {
                console.log("Popup received a message: ", message);
            }
        );
    })


    /**
     * LIKES POSTS ON FEED WHEN CLICKING THE BUTTON ON POPUP
     * Open a connection, received by content that will do the job
     */
    openConnectionButton.addEventListener("click", async () => {
        // Query tab
        let queryOptions = { active: true, currentWindow: true };
        let tabs = await chrome.tabs.query(queryOptions);

        // Open up connection
        const port = chrome.tabs.connect(tabs[0].id, {
            name: "likes",
        });

        // Get input value
        port.postMessage({
            message: "Hi! Here is popup! Please like last feed posts."
        });

        port.onMessage.addListener(function ({message}) {
            console.log("Response from content: ", message)
        });
    })
})

