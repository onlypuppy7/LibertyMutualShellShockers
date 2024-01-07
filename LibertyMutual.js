// ==UserScript==
// @name         LibertyMutualV1 For Shell Shockers
// @namespace    https://github.com/onlypuppy7/LibertyMutualShellShockers/
// @license      GPL-3.0
// @version      1.0.0
// @author       onlypuppy7
// @description  FOSS ESP.
// @match        https://shellshock.io/*
// @grant        none
// @run-at       document-start
// @icon         https://github.com/onlypuppy7/LibertyMutualShellShockers/blob/main/scripticon.jpg?raw=true
// ==/UserScript==

(function () {
    //Credit for script injection code: AI. ChatGPT prompt: "tampermonkey script. how can i make it grab a javascript file as it's loaded. if it detects the javascript file, make it apply modifications to it via regex? using XMLHttpRequest"
    //Credit for idea to use XMLHttpRequest: A3+++
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
    let F=[];
    let functionNames=[];
    let boxArray=[];

    //scrambled... geddit????
    const getScrambled=function(){return Array.from({length: 10}, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('')}
    //Credit for this: me
    const createAnonFunction=function(name,func){
        const funcName=getScrambled();
        window[funcName]=func;
        F[name]=window[funcName];
        functionNames[name]=funcName
    };

    //Credit for idea to use regexes to dynamically create the injected script: helloworld (although it is not a new concept)
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
        getVar("BABYLONJS",";([a-zA-Z]+)\\.Effect\\.ShadersStore=")

        console.log('%cLIBERTYMUTUAL INJECTION STAGE 2: INJECT VAR RETRIEVAL FUNCTION', 'color: yellow; font-weight: bold; font-size: 1.2em; text-decoration: underline;');
        let match=js.match(/\.engine\.runRenderLoop\(function\(\)\{([a-zA-Z]+)\(/);
        replace(`\.engine\.runRenderLoop\(function\(\)\{${match[1]}\(`,`.engine.runRenderLoop(function (){${match[1]}(),window["${functionNames.retrieveFunctions}"]({${injectionString}}`);
        console.log('%cSuccess! Variable retrieval hooked.', 'color: green; font-weight: bold;');

        console.log('%cLIBERTYMUTUAL INJECTION STAGE 3: INJECT CULL STOPPING FUNCTION', 'color: yellow; font-weight: bold; font-size: 1.2em; text-decoration: underline;');
        js = js.replace(`if(${js.match(/playing&&!([a-zA-Z]+)&&/)[1]})`,`if(true)`);
        console.log('%cSuccess! Cull stopping hooked.', 'color: green; font-weight: bold;');

        replace("Not playing in iframe", "LIBERTYMUTUAL ACTIVE!");
        return js;
    };

    createAnonFunction("retrieveFunctions",function(vars) { ss=vars ; F.LIBERTYMUTUAL() });

    createAnonFunction("LIBERTYMUTUAL",function() {
        const timecode=Date.now();
        ss.PLAYERS.forEach(PLAYER=>{
            if (PLAYER) {
                PLAYER.timecode=timecode;
                //Partial credit for player filtering: PacyTense. Also just common sense.
                if ((!PLAYER.generatedESP)&&((PLAYER!==ss.YOURPLAYER)&&(PLAYER.hp>0)&&((!ss.YOURPLAYER.team)||(PLAYER.team!==ss.YOURPLAYER.team)))) {
                    //Credit for box from lines code: AI. ChatGPT prompt: "how can i create a box out of lines in babylon.js?"
                    const boxSize = {width: 0.4, height: 0.65, depth: 0.4};
                    const vertices = [
                        new ss.BABYLONJS.Vector3(-boxSize.width / 2, 0, -boxSize.depth / 2),
                        new ss.BABYLONJS.Vector3(boxSize.width / 2, 0, -boxSize.depth / 2),
                        new ss.BABYLONJS.Vector3(boxSize.width / 2, 0 + boxSize.height, -boxSize.depth / 2),
                        new ss.BABYLONJS.Vector3(-boxSize.width / 2, 0 + boxSize.height, -boxSize.depth / 2),
                        new ss.BABYLONJS.Vector3(-boxSize.width / 2, 0, boxSize.depth / 2),
                        new ss.BABYLONJS.Vector3(boxSize.width / 2, 0, boxSize.depth / 2),
                        new ss.BABYLONJS.Vector3(boxSize.width / 2, 0 + boxSize.height, boxSize.depth / 2),
                        new ss.BABYLONJS.Vector3(-boxSize.width / 2, 0 + boxSize.height, boxSize.depth / 2),
                    ];
                    const lines = [];
                    for (let i = 0; i < 4; i++) {
                        lines.push([vertices[i], vertices[(i + 1) % 4]]);
                        lines.push([vertices[i + 4], vertices[(i + 1) % 4 + 4]]);
                        lines.push([vertices[i], vertices[i + 4]]);
                    };
                    const box = ss.BABYLONJS.MeshBuilder.CreateLineSystem('boxLines', { lines }, PLAYER.actor.scene);
                    //ChatGPT prompt: "how can i make an object anchored to another object, change its color, set its line thickness and have it render on top of everything else?"
                    box.color = new ss.BABYLONJS.Color3(1, 0, 0);
                    box.renderingGroupId = 1;
                    box.thinLineWidth = 2.5;
                    box.parent=PLAYER.actor.mesh;
                    PLAYER.box=box;
                    PLAYER.generatedESP=true;
                    boxArray.push([box,PLAYER]);
                };
            };
        });
        for ( let i=0;i<boxArray.length;i++) {
            if (boxArray[i][1] && boxArray[i][1].timecode==timecode) { //still exists
            } else {
                //Credit for info: AI. ChatGPT prompt: "how can i delete an object in babylon.js?"
                boxArray[i][0].dispose();
                boxArray.splice(i,1);
            };
        };
    });
    // createAnonFunction("setPrecision",function (value) { return Math.floor(value * 8192) / 8192 }); //required precision
    // createAnonFunction("calculateYaw",function (pos) {
    //     return F.setPrecision(Math.mod(Math.atan2(pos.x,pos.z), Math.PI2));
    // });
    // createAnonFunction("calculatePitch",function (pos) {
    //     return F.setPrecision(-Math.atan2(pos.y,Math.hypot(pos.x,pos.z))%1.5);
    // });
})();
