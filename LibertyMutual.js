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
    //VAR STUFF
    let ss
    let F=[];
    let functionNames=[];

    //scrambled... geddit????
    const getScrambled=function(){return Array.from({length: 10}, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('')}
    const createAnonFunction=function(name,func){
        const funcName=getScrambled();
        window[funcName]=func;
        F[name]=window[funcName];
        functionNames[name]=funcName
    };

    const applyLibertyMutual = function(js) {
        const vars=[];
        let injectionString="";
        const getVar=function(name,regex){
            const varName=eval(new RegExp(regex)+`.exec(js)[1]`);
            vars[name]=varName;
            injectionString=injectionString+name+": "+varName+",";
            console.log('%cFound var! Saved '+varName+' as '+name, 'color: green; font-weight: bold;');
        };
        const replace=function(oldThing,newThing){js=js.replace(oldThing,newThing)};

        console.log('%cATTEMPTING TO START LIBERTYMUTUAL', 'color: magenta; font-weight: bold; font-size: 1.5em; text-decoration: underline;');
        console.log('%cLIBERTYMUTUAL INJECTION STAGE 1: GATHER VARS', 'color: yellow; font-weight: bold; font-size: 1.2em; text-decoration: underline;');
        getVar("PLAYERS","\\]\\.actor&&\\(([a-zA-Z]+)\\[")

        console.log('%cLIBERTYMUTUAL INJECTION STAGE 2: INJECT VAR RETRIEVAL FUNCTION', 'color: yellow; font-weight: bold; font-size: 1.2em; text-decoration: underline;');
        match=js.match(/\.engine\.runRenderLoop\(function\(\)\{([a-zA-Z]+)\(/);
        replace(`\.engine\.runRenderLoop\(function\(\)\{${match[1]}\(`,`.engine.runRenderLoop(function (){${match[1]}(),window["${functionNames.retrieveFunctions}"]({${injectionString}}`);
        console.log('%cSuccess! Variable retrieval hooked.', 'color: green; font-weight: bold;');

        replace("Not playing in iframe", "LIBERTYMUTUAL ACTIVE!");
        return js;
    };

    createAnonFunction("retrieveFunctions",function(vars) { ss=vars ; window[functionNames.LIBERTYMUTUAL]() });

    createAnonFunction("LIBERTYMUTUAL",function() {
        console.log(ss.PLAYERS[0].x);
    });
})();
