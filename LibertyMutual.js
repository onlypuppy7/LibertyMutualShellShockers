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

    const applyLibertyMutual = function(js) {
        const vars=[];
        const getVar=function(name,regex){
            const funcName = eval(new RegExp(regex)+`.exec(script)[1]`);
            // vars[name]=
        };
        const replace=function(oldThing,newThing){js=js.replace(oldThing,newThing)};

        replace("Not playing in iframe", "LIBERTYMUTUAL ACTIVE");
        return js;
    };



})();
