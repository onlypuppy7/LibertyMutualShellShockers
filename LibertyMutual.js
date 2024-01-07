// ==UserScript==
// @name         LibertyMutualV1 For Shell Shockers
// @version      1.0.0
// @author       onlypuppy7
// @description  Enhanced Client.
// @match        https://shellshock.io/*
// @grant        none
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.6.4.min.js
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
    document.addEventListener("DOMContentLoaded", function () {
        //CANVAS
        var canvas = document.createElement('canvas');
        canvas.id = 'drawingCanvas';
        canvas.style.cssText = 'position: absolute; top: 0; left: 0; pointer-events: none;';
        document.body.appendChild(canvas);
    
        ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    //VAR STUFF
    let ss,ctx
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
        getVar("YOURPLAYER","&&([a-zA-Z]+)\\.grenadeCountdown<=0\\)this\\.cancelGrenade")

        console.log('%cLIBERTYMUTUAL INJECTION STAGE 2: INJECT VAR RETRIEVAL FUNCTION', 'color: yellow; font-weight: bold; font-size: 1.2em; text-decoration: underline;');
        match=js.match(/\.engine\.runRenderLoop\(function\(\)\{([a-zA-Z]+)\(/);
        replace(`\.engine\.runRenderLoop\(function\(\)\{${match[1]}\(`,`.engine.runRenderLoop(function (){${match[1]}(),window["${functionNames.retrieveFunctions}"]({${injectionString}}`);
        console.log('%cSuccess! Variable retrieval hooked.', 'color: green; font-weight: bold;');

        replace("Not playing in iframe", "LIBERTYMUTUAL ACTIVE!");
        return js;
    };

    createAnonFunction("retrieveFunctions",function(vars) { ss=vars ; F.LIBERTYMUTUAL() });

    createAnonFunction("LIBERTYMUTUAL",function() {
        console.log(ss.PLAYERS[0].x);
        F.DRAWLOOP()
    });
    createAnonFunction("DRAWLOOP",function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        F.drawBox(
            {x: window.innerWidth/2,y: window.innerHeight/2}, //center
            {width: 30, height: 120}, //dimensions
            1, //size
        );
        ss.PLAYERS.forEach(PLAYER=>{
            if (PLAYER&&PLAYER.hp>0) {
                const directionVector={
                    x: PLAYER.x-ss.YOURPLAYER.x,
                    y: PLAYER.y-ss.YOURPLAYER.y,
                    z: PLAYER.z-ss.YOURPLAYER.z,
                }
                F.drawBox(
                    {x: (window.innerWidth/2)+(5*F.calculateYaw(directionVector)),y: (window.innerHeight/2)+(5*F.calculatePitch(directionVector))}, //center
                    {width: 30, height: 120}, //dimensions
                    1, //size
                );
            };
        });
    });
    createAnonFunction("drawBox", function(center, dimensions, size, color) {
        ctx.beginPath();
        ctx.rect(center.x - (size*(dimensions.width/2)), center.y - (size*(dimensions.height/2)), size*dimensions.width, size*dimensions.height);
        ctx.strokeStyle = "blue";
        ctx.lineWidth = size;
        ctx.stroke();
    });
    createAnonFunction("setPrecision",function (value) { return Math.floor(value * 8192) / 8192 }); //required precision
    createAnonFunction("calculateYaw",function (pos) {
        return F.setPrecision(Math.mod(Math.atan2(pos.x,pos.z), Math.PI2));
    });
    createAnonFunction("calculatePitch",function (pos) {
        return F.setPrecision(-Math.atan2(pos.y,Math.hypot(pos.x,pos.z))%1.5);
    });
})();