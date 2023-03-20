// Send a message, listened by service worker
chrome.runtime.sendMessage({greeting: "hello from content"}, function(response) {
    console.log(response.farewell)
})

// Receive a message
chrome.runtime.onMessage.addListener(function ({message}, sender, sendResponse) {
    console.log("Content received a message: ", message);
    sendResponse({ message: "Here is content, I've received!" });
});


const likePostsOnTheCurrentPage = () => {
    console.log("likePostsOnTheCurrentPage")
    const likeButtonList = Array
        .from(document.querySelectorAll("article section:first-child svg[aria-label='Like']"))
        .filter(svg => getComputedStyle(svg.parentElement).display !== 'none');
    const likeButtonNb = likeButtonList.length;

    likeButtonList.forEach((likeSvg, index) => {
        const likeBtn = likeSvg.closest("button");
        likeBtn.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        likeBtn.click()
    });
}

/**
 * GET THE CONNECTION SENT BY POPUP TO LIKE POSTS FEED
 */
chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name === "likes");
    port.onMessage.addListener(function ({message}) {
        console.log("Content received a connection message: ", message)

        likePostsOnTheCurrentPage();
        for (let i=0; i<10; i++) {
            setTimeout(() => {
                likePostsOnTheCurrentPage();
                setTimeout(() => {
                    try {
                        document.querySelectorAll("article section:first-child svg[aria-label='Like']")[1].scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
                    } catch(e) {
                        const unlikeBtns = document.querySelectorAll("article section:first-child svg[aria-label='Unlike']");
                        const nbUnlikeBtns = unlikeBtns.length;
                        unlikeBtns[nbUnlikeBtns-1].scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
                    }
                }, 3000)
            }, 2000*(i+1))
        }

        port.postMessage({
            message: "Thanks, I liked all the post, or I am doing it right now!"
        });
    });
});


/*

let nbLikers = 0;

const getSection = () => {
    const likersIcons = document.querySelectorAll("span img[draggable='false']")
    const firstIcon = likersIcons[likersIcons.length-1];
    const section = firstIcon.closest("section")
    return section
}
document.querySelector("article [role='link']").click()
setTimeout(() => {
    document.querySelectorAll("time")[1].click()
}, 2000)
setTimeout(() => {
    const section = getSection();
    nbLikers = +(getSection().innerText.match(/\d+/)[0]);
    console.log({nbLikers})
    section.querySelector('a').click()
}, 4000)


let getIndex = () => document.querySelectorAll("[role='dialog'] [role='dialog'] [role='button'] [role='button'] a").length;
let allLinks;
let links = new Set();

const lookForLikers = (timer) => new Promise(resolve => {
    setTimeout(() => {
        allLinks = document.querySelectorAll("[role='dialog'] [role='dialog'] [role='button'] [role='button'] a")
        Array.from(allLinks).forEach(link => {
            links.add(link.href)
        })
        resolve(true)
    }, timer)
})

setTimeout(async () => {
    let stopped = false
    let lastNbLikersCounted = links.size;
    let nbTImesWithSameResults = 0;
    while(!stopped) {
        await lookForLikers(400);

        console.log("getIndex(): ", getIndex());
        allLinks[getIndex()-1].closest("[role='button']").scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

        console.log("links.size: ", links.size);

        if(lastNbLikersCounted === links.size) {
            nbTImesWithSameResults++
        } else {
            nbTImesWithSameResults = 0;
        }

        console.log({nbTImesWithSameResults})

        lastNbLikersCounted = links.size;

        if(links.size >=nbLikers || nbTImesWithSameResults >= 3) {
            stopped = true
        }
    }
    console.log({links})
}, 6000)

*/




