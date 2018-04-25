const API_KEY = ""; //your LibraryThing developer key goes here
function getNewQuote(){
    workId = worklist[getRandomIndex(worklist)];
    fetch('http://www.librarything.com/services/rest/1.1/?method=librarything.ck.getwork&id='+ workId + '&apikey=' + API_KEY)
    .then(res => res.text())
    .then(xmlText => (new window.DOMParser()).parseFromString(xmlText, "text/xml"))
    .then((xmlDoc) => {
        //console.log(xmlDoc);
        let fields = xmlDoc.getElementsByTagName("field");
        let fieldsWithQuotes = getQuotableFields(fields);
        if(fieldsWithQuotes.length > 0){
            let randomField = fieldsWithQuotes[getRandomIndex(fieldsWithQuotes)];
            let selectedField = fields[randomField];
            let factFields = selectedField.getElementsByTagName("fact");
            let randomFactIdx = getRandomIndex(factFields);
            let randomQuote = factFields[randomFactIdx].childNodes[0].nodeValue;
            randomQuoteCleaned = randomQuote.replace(/(\!\[CDATA\[)|(\]\]\>)/g, "");
            document.getElementById("quoteText").innerHTML = randomQuoteCleaned;
            document.getElementById("author").innerText = "- " + getNodeValueFromUniqueXMLTag(xmlDoc, "author");
            document.getElementById("title").innerText = ", " + getNodeValueFromUniqueXMLTag(xmlDoc, "title");
        }
        else{
            console.log("No quotes from that book.")
            getNewQuote();
        }
    }
    )}

function tweetQuote(){
    let quote = document.getElementById("quote").innerText;
    window.open("https://twitter.com/intent/tweet?text=" + quote, '_blank', 'width=500,height=500')
}

function getRandomIndex(iterable){
    return Math.floor(Math.random() * iterable.length);
}

function getQuotableFields(fields){
    let haveQuotes = [];
    for(let i=0;i<fields.length;i++){
        let currentField = fields[i].attributes[1].nodeValue;
        if(['quotations', 'firstwords', 'lastwords'].includes(currentField)){
            haveQuotes.push(i);
        }
    }
    return haveQuotes;
}

function displayQuote(){

}

function getNodeValueFromUniqueXMLTag(xmldoc, tag){
    return xmldoc.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
}