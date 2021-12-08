const form = document.getElementById("form1");
/**
 * @param {}
 */
function validateemail(){
    var email =document.getElementById("email").value;
    var regex= /^([a-z0-9\.-]+)@([a-z0-9-]+)\.([a-z]{2,8})(.[a-z]{2,8})?$/;
    if(regex.test(email))
    {
        document.getElementById("lbltext").style.visibility="hidden";
        return true;
    }
    else{
        document.getElementById("lbltext").style.visibility="visible";
        document.getElementById("lbltext").style.color="red";
        return false;
    }
}
function validatenewsletter(){
    var newsletter = document.getElementById("name").value;
    var regex1 = /^[A-Za-z .]{3,15}$/
    if(regex1.test(newsletter))
    {
        document.getElementById("lblname").style.visibility="hidden";
        return true;
    }
    else{
        document.getElementById("lblname").style.visibility="visible";
        document.getElementById("lblname").style.color="red";
        return false;
    }
}
function validateurl(){
    var url = document.getElementById("url").value;
    var regex2 = /(http(s)?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    if(regex2.test(url))
    {
        document.getElementById("lblurl").style.visibility="hidden";
        return true;
    }
    else{
        document.getElementById("lblurl").style.visibility="visible";
        document.getElementById("lblurl").style.visibility="red";
        return false;
    }
}
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
var isAnyProblem = false ;
function checkServer() {
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:3000/", false);
        xhr.send();
    } catch(err) {
        console.log(err);
        isAnyProblem = true ;
    }
}
checkServer();


if(!isAnyProblem){
    commonXHR("GET","http://localhost:3000/News").onload = function () {
    var data = this.response;
    for (var i = 0; i < data.length; i++) {
        categoryNames[data[i].type].push(data[i]);
    }
    sur();
};
}
else{
    console.log("down");
    document.getElementsByTagName("body")[0].innerHTML = "Sorry Some problem occured";
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    var validatenewsletterValue = validatenewsletter();
    var validateemailValue = validateemail();
    var validateurlValue = validateurl();
    if(validatenewsletterValue && validateemailValue && validateurlValue){ 
    const formData = new FormData(form);
    var obj = {};
    var date = new Date(); 
    obj["date"] = date.toLocaleString("en-US");
    for (let i of formData) {
        obj[i[0]] = i[1];
    }
    commonXHR("POST","http://localhost:3000/News",JSON.stringify(obj)).onload = function () {
        categoryNames[obj["type"]].push(obj);
        sur();  
    }
}

});

/**
 * @returns {Array} It stores the data
 */
function sur() {
    var data = "";
    for (var i = 0; i < categories.length; i++) {
        data += "<h2>" + categories[i] + "</h2>" + customJoin(customMap(categoryNames[categories[i]])) + "";
    }
    feed.innerHTML = data;
}
/**
 * 
 * @param {Array} getArray 
 * @returns {Array}
 */
function customMap(getArray) {
    var data = [];
    for (var i = 0; i < getArray.length; i++) {
        data.push(
            "<p>" + getArray[i].newsletter + "  "+ " - "+"<a href="+getArray[i].url + " target='_blank'>Click Here</a>" + "<br>" +getArray[i].date+"</p>");
            
    }
    return data;
}
/**
 * 
 * @param {Array} getArray 
 * @returns {Array} Contains the newsletter data
 */

function customJoin(getArray) {
    var data = "";
    for (var i = 0; i < getArray.length; i++) {
        data += getArray[i];
    }
    return data;
}
/**
 * 
 * @param {string} method 
 * @param {string} url 
 * @param {string} body 
 * @returns {array}
 */
function commonXHR(method,url,body){
    var xhr = new XMLHttpRequest();
    xhr.open(method,url);
    xhr.responseType = "json" ;
    xhr.setRequestHeader("content-type","application/json")
    body ? xhr.send(body) : xhr.send() ;
    return xhr  ;
}