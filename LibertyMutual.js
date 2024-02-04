// ==UserScript==
// @name         LibertyMutualV1 For Shell Shockers
// @namespace    https://github.com/onlypuppy7/LibertyMutualShellShockers/
// @license      GPL-3.0
// @version      1.0.6
// @author       onlypuppy7
// @description  FOSS ESP, Tracers and Aimbot. Hold right mouse button to aimlock.
// @match        https://shellshock.io/*
// @grant        none
// @run-at       document-start
// @icon         https://github.com/onlypuppy7/LibertyMutualShellShockers/blob/main/scripticon.jpg?raw=true
// ==/UserScript==

//Usage: Hold right mouse button to aimlock

(function () {
    //Config: if you want to turn off esp, you can.
    //This script is more of a template than a functioning tool. If you're modifying this, you can add a GUI to start!

    const enableESP=true; //turn to false for off
    const enableTracers=true; //turn to false for off

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
    let H={};
    let functionNames=[];
    let ESPArray=[];
    let RMB=false;

    //Credit: AI. ChatGPT prompt: "make javascript tampermonkey code that sets a variable RMB to true while right mouse button is being held"
    document.addEventListener('mousedown', function(event) {
        if (event.button === 2) {
            RMB = true;
        }
    });

    document.addEventListener('mouseup', function(event) {
        if (event.button === 2) {
            RMB = false;
        }
    });

    //scrambled... geddit????
    const getScrambled=function(){return Array.from({length: 10}, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('')}
    const createAnonFunction=function(name,func){
        const funcName=getScrambled();
        window[funcName]=func;
        F[name]=window[funcName];
        functionNames[name]=funcName
    };
    const findKeyWithProperty = function(obj, propertyToFind) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (key === propertyToFind) {
                    return [key];
                } else if (
                    typeof obj[key] === 'object' &&
                    obj[key] !== null &&
                    obj[key].hasOwnProperty(propertyToFind)
                ) {
                    return key;
                };
            };
        };
        // Property not found
        return null;
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
        
        const modifyJS = function(find,replace) {
            let oldJS = js;
            js = js.replace(find,replace);
            if (oldJS !== js) {
                console.log("%cReplacement successful! Injected code: "+replace, 'color: green; font-weight: bold; font-size: 0.6em; text-decoration: italic;');
            } else {
                console.log("%cReplacement failed! Attempted to replace "+find+" with: "+replace, 'color: red; font-weight: bold; font-size: 0.6em; text-decoration: italic;');
            };
        };

        console.log('%cATTEMPTING TO START LIBERTYMUTUAL', 'color: magenta; font-weight: bold; font-size: 1.5em; text-decoration: underline;');

        console.log('%cLIBERTYMUTUAL INJECTION STAGE 1: GATHER VARS', 'color: yellow; font-weight: bold; font-size: 1.2em; text-decoration: underline;');
        //Credit for idea to gather vars: helloworld, PacyTense. Also common sense.
        getVar("PLAYERS", '([a-zA-Z]+)\\[[a-zA-Z]+\\]\\.hp=100');
        getVar("MYPLAYER", '\\),([a-zA-Z]+)\\.pitch=Math\\.clamp\\(');
        getVar("BABYLONJS", '\\),this\\.range=([a-zA-Z]+)\\.');

        console.log('%cLIBERTYMUTUAL INJECTION STAGE 2: INJECT VAR RETRIEVAL FUNCTION AND MAIN LOOP', 'color: yellow; font-weight: bold; font-size: 1.2em; text-decoration: underline;');
        match=js.match(/\.engine\.([a-zA-Z]+)\(\(function\(\)\{!/);
        console.log(match);
        modifyJS('.engine.'+match[1]+'((function(){',`.engine.${match[1]}((function(){if(window["${functionNames.retrieveFunctions}"]({${injectionString}},true)){return};`);
        console.log('%cSuccess! Variable retrieval and main loop hooked.', 'color: green; font-weight: bold;');

        match=js.match(/&&!([a-zA-Z]+)&&function\(\)\{if\(/);
        modifyJS(`{if(${match[1]})`,`{if(true)`);
        console.log('%cSuccess! Cull inhibition hooked.', 'color: green; font-weight: bold;');

        H.playing = js.match(/this\.hp=[a-zA-Z]+\.hp,this\.([a-zA-Z]+)=[a-zA-Z]+\.[a-zA-Z]+,this/)[1];
        H.MeshBuilder = js.match(/\.([a-zA-Z]+)\.CreateLineSystem\("/)[1];
        H.CreateLines = js.match(/\.([a-zA-Z]+)\("yPosMesh",\{points/)[1];

        console.log(H);

        modifyJS("Not playing in iframe", "LIBERTYMUTUAL ACTIVE!");
        return js;
    };

    createAnonFunction("retrieveFunctions",function(vars) { ss=vars ; F.LIBERTYMUTUAL() });

    createAnonFunction("LIBERTYMUTUAL",function() {
        globalSS = ss;

        ss.BABYLONJS.Vector3 = ss.MYPLAYER.constructor.v1.constructor;
        H.actor = findKeyWithProperty(ss.MYPLAYER,"mesh");

        let TARGETED;
        let CROSSHAIRS=new ss.BABYLONJS.Vector3();
        CROSSHAIRS.copyFrom(ss.MYPLAYER[H.actor].mesh.position);
        const horizontalOffset = Math.sin(ss.MYPLAYER[H.actor].mesh.rotation.y);
        const verticalOffset = Math.sin(-ss.MYPLAYER.pitch);
        CROSSHAIRS.x+=horizontalOffset;
        CROSSHAIRS.y+=verticalOffset+0.4;
        CROSSHAIRS.z+=Math.cos(ss.MYPLAYER[H.actor].mesh.rotation.y);

        const timecode=Date.now();
        let minValue=99999;
        ss.PLAYERS.forEach(PLAYER=>{
            if (PLAYER) {
                PLAYER.timecode=timecode;
                //Partial credit for enemy player filtering: PacyTense. Also just common sense.
                if (((PLAYER!==ss.MYPLAYER)&&((!ss.MYPLAYER.team)||(PLAYER.team!==ss.MYPLAYER.team)))) {
                    //ESP CODE
                    if ((!PLAYER.generatedESP)) {
                        //Credit for box from lines code: AI. ChatGPT prompt: "how can i create a box out of lines in babylon.js?"
                        //ESP BOXES
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
                        const box = ss.BABYLONJS[H.MeshBuilder].CreateLineSystem('boxLines', { lines }, PLAYER[H.actor].scene);
                        //ChatGPT prompt: "how can i make an object anchored to another object, change its color, and have it render on top of everything else? babylon.js"
                        box.color = new ss.BABYLONJS.Color3(1, 1, 1);
                        box.renderingGroupId = 1;
                        box.parent=PLAYER[H.actor].mesh;
                        //TRACER LINES
                        const tracers=ss.BABYLONJS[H.MeshBuilder][H.CreateLines]("tracerLines", { points: [PLAYER[H.actor].mesh.position, CROSSHAIRS] }, PLAYER[H.actor].scene);
                        tracers.color=new ss.BABYLONJS.Color3(1, 1, 1);
                        tracers.renderingGroupId=1;
                        
                        PLAYER.box=box;
                        PLAYER.tracers=tracers;
                        PLAYER.generatedESP=true;
                        ESPArray.push([box,tracers,PLAYER]);
                    };
                    //update the lines
                    PLAYER.tracers.setVerticesData(ss.BABYLONJS.VertexBuffer.PositionKind, [CROSSHAIRS.x, CROSSHAIRS.y, CROSSHAIRS.z, PLAYER[H.actor].mesh.position.x, PLAYER[H.actor].mesh.position.y, PLAYER[H.actor].mesh.position.z]);

                    PLAYER.box.visibility=enableESP;
                    PLAYER.tracers.visibility=(PLAYER[H.playing]&&enableTracers);

                    //AIMBOT CODE
                    //Credit: This section is mostly common sense, and could be made by most decent programmers. It is still worth mentioning PacyTense used a functionally equivalent thing similar to this this before me 4 years ago.
                    const distance=ss.BABYLONJS.Vector3.Distance(ss.MYPLAYER,PLAYER);
                    if (distance<minValue) {
                        TARGETED=PLAYER;
                        minValue=distance;
                    };
                };
            };
            if (RMB&&TARGETED&&TARGETED[H.playing]) {
                //3D maths
                const directionVector={
                    x: TARGETED.x-ss.MYPLAYER.x,
                    y: TARGETED.y-ss.MYPLAYER.y,
                    z: TARGETED.z-ss.MYPLAYER.z,
                };
                ss.MYPLAYER.yaw=F.calculateYaw(directionVector);
                ss.MYPLAYER.pitch=F.calculatePitch(directionVector);
            };
        });
        for ( let i=0;i<ESPArray.length;i++) {
            if (ESPArray[i][2] && ESPArray[i][2].timecode==timecode) { //still exists
            } else {
                //Credit for info: AI. ChatGPT prompt: "how can i delete an object in babylon.js?"
                ESPArray[i][0].dispose();
                ESPArray[i][1].dispose();
                ESPArray.splice(i,1);
            };
        };
    });
    createAnonFunction("setPrecision",function (value) { return Math.floor(value * 8192) / 8192 }); //required precision
    createAnonFunction("calculateYaw",function (pos) {
        return F.setPrecision(Math.mod(Math.atan2(pos.x,pos.z), Math.PI2));
    });
    createAnonFunction("calculatePitch",function (pos) {
        return F.setPrecision(-Math.atan2(pos.y,Math.hypot(pos.x,pos.z))%1.5);
    });
})();
