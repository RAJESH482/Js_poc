const form = document.getElementById("form1");
const allRegexs = {
    "newsLetter": /^[A-Za-z .]{3,15}$/,
    "email": /^([a-z0-9\.-]+)@([a-z0-9-]+)\.([a-z]{2,8})(.[a-z]{2,8})?$/,
    "urlChecker": /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
};
var categoryNames = {
    "International News": [],
    "National News": [],
    "Andhra News": [],
    "Covid-19 Updates": [],
    "Poltical News": [],
    "Ipl News": []
};
var categories = Object.getOwnPropertyNames(categoryNames);
var feed = document.getElementById("feed");
var isEverythingFine = false;
/**
 * This function checks whether the server is on or off..
 */
function checkServer() {
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:3000/", false);
        xhr.send();
        isEverythingFine = true;
    } catch (err) {
        isEverythingFine = false;
    }
}
checkServer();
if (isEverythingFine) {
    commonXHR("GET", "http://localhost:3000/News").onload = function () {
        var data = this.response;
        for (let i = 0; i < data.length; i++) {
            categoryNames[data[i].type].push(data[i]);
        }
        SaveUntilRefresh();
    };
} else {
    document.getElementsByTagName("body")[0].innerHTML = "Sorry Some problem occured";
}
form.addEventListener("submit", function (e) {
    e.preventDefault();
    var obj = {};
    var date = new Date();
    obj["date"] = date.toLocaleString("en-US");
    var allValid = true;
    var formElements = form.elements;
    for (let i = 0; i < formElements.length; i++) {
        var formElement = formElements[i];
        var datasetIdValue = formElement.dataset.id;
        if (datasetIdValue) {
            allValid = allRegexs[datasetIdValue].test(formElement.value) ? true : false;
            allValid ? document.getElementById(formElement.dataset.error).style.display = "none" : document.getElementById(formElement.dataset.error).style.display = "block";
        }
        if (formElement.name) {
            obj[formElement.name] = formElement.value;
        }
    }
    if (allValid) {
        commonXHR("POST", "http://localhost:3000/News", JSON.stringify(obj)).onload = function () {
            categoryNames[obj["type"]].push(obj);
            SaveUntilRefresh();
        }
    }
});
/**
 * This SaveUntilRefresh function will reduces the GET requests and it also avoids the data erasing after refreshing the page..
 */
function SaveUntilRefresh() {
    var data = "";
    for (let i = 0; i < categories.length; i++) {
        data += `<h2>${categories[i]} </h2> ${categoryNames[categories[i]].map(function(x){
            return  `<p> ${x.newsletter}  - <a href=${x.url} target='_blank'>Click Here</a><br>${x.date}</p>` 
        }).join("")}`;

    }
    feed.innerHTML = data;
}
/** 
 * @param {string} method Here method means either GET method or POST method..
 * @param {string} url  Here the url points to a unique resource ie... News
 * @param {string} body  
 */
function commonXHR(method, url, body) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.responseType = "json";
    xhr.setRequestHeader("content-type", "application/json")
    body ? xhr.send(body) : xhr.send();
    return xhr;
}