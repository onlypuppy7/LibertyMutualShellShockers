// ==UserScript==
// @name         LibertyMutualV1 For Shell Shockers
// @version      1.0.0
// @author       onlypuppy7
// @description  Enhanced Client.
// @match        https://shellshock.io/*
// @grant        none
// @run-at       document-start
// @icon         https://github.com/onlypuppy7/LibertyMutualShellShockers/blob/main/scripticon.jpg?raw=true
// ==/UserScript==

(function () {
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRGetResponse = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'response');
    let shellshockjs
    XMLHttpRequest.prototype.open = function(...args) {
        const url = args[1];
        if (url && url.includes("js/shellshock.js")) {
            shellshockjs = this;
        };
        originalXHROpen.apply(this, args);
    };
    Object.defineProperty(XMLHttpRequest.prototype, 'response', {
        get: function() {
            if (this===shellshockjs) {
                return applyLibertyMutual(originalXHRGetResponse.get.call(this));
            };
            return originalXHRGetResponse.get.call(this);
        }
    });

    const getScrambled=function(){return Array.from({length: 10}, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('')}
    
    



    const applyLibertyMutual = function(js) {
        const vars=[];
        const getVar=function(name,regex){
            const varName=eval(new RegExp(regex)+`.exec(js)[1]`);
            vars[name]=varName;
            console.log('%cFound var! Saved '+varName+' as '+name, 'color: green; font-weight: bold;');
        };
        const replace=function(oldThing,newThing){js=js.replace(oldThing,newThing)};

        console.log('%cLIBERTYMUTUAL INJECTION STAGE 1: GATHER VARS', 'color: yellow; font-weight: bold; font-size: 1.2em; text-decoration: underline;');
        getVar("PLAYERS","\\]\\.actor&&\\(([a-zA-Z]+)\\[")

        replace("Not playing in iframe", "LIBERTYMUTUAL ACTIVE");
        return js;
    };



})();
