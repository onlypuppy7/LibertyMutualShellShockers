// ==UserScript==
// @name         Shell Shockers Basic Aimbot + ESP: LibertyMutualV1
// @namespace    https://github.com/onlypuppy7/LibertyMutualShellShockers/
// @license      GPL-3.0
// @version      1.3.1
// @author       onlypuppy7
// @description  UPDATED FOR 0.50.0! Fed up of a popular script injecting ads into your game? Need a simple script to modify or use? FOSS ESP, Tracers and Aimbot. Hold right mouse button to aimlock.
// @match        https://shellshock.io/*
// @grant        none
// @run-at       document-start
// @icon         https://github.com/onlypuppy7/LibertyMutualShellShockers/blob/main/scripticon.jpg?raw=true
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://cdn.jsdelivr.net/npm/babylonjs@7.15.0/babylon.min.js
// ==/UserScript==

//Usage: Hold right mouse button to aimlock
//This script is more of a template than a functioning tool. If you're modifying this, you can add a GUI to start!

(function () {
    let originalReplace = String.prototype.replace;

    String.prototype.originalReplace = function() {
        return originalReplace.apply(this, arguments);
    };

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
    }, true);

    document.addEventListener('mouseup', function(event) {
        if (event.button === 2) {
            RMB = false;
        }
    }, true);

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
    const fetchTextContent = function(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false); // Make the request synchronous
        xhr.send();
        if (xhr.status === 200) {
            return xhr.responseText;
        } else {
            console.error("Error fetching text content. Status:", xhr.status);
            return null;
        };
    };

    const applyLibertyMutual = function(js) {

        let hash = CryptoJS.SHA256(js).toString(CryptoJS.enc.Hex);
        let clientKeys;
        onlineClientKeys = fetchTextContent("https://raw.githubusercontent.com/StateFarmNetwork/client-keys/main/libertymutual_"+hash+".json"); //credit: me :D

        if (onlineClientKeys == "value_undefined" || onlineClientKeys == null) {
            let userInput = prompt('Valid keys could not be retrieved online. Enter keys if you have them. Join the StateFarm Network Discord server to generate keys! https://discord.gg/HYJG3jXVJF', '');
            if (userInput !== null && userInput !== '') {
                alert('Aight, let\'s try this. If it is invalid, it will just crash.');
                clientKeys = JSON.parse(userInput);
            } else {
                alert('You did not enter anything, this is gonna crash lmao.');
            };
        } else {
            clientKeys = JSON.parse(onlineClientKeys);
        };

        H = clientKeys.vars;

        let injectionString="";
        
        const modifyJS = function(find,replace) {
            let oldJS = js;
            js = js.originalReplace(find,replace);
            if (oldJS !== js) {
                console.log("%cReplacement successful! Injected code: "+replace, 'color: green; font-weight: bold; font-size: 0.6em; text-decoration: italic;');
            } else {
                console.log("%cReplacement failed! Attempted to replace "+find+" with: "+replace, 'color: red; font-weight: bold; font-size: 0.6em; text-decoration: italic;');
            };
        };

        console.log('%cATTEMPTING TO START LIBERTYMUTUAL', 'color: magenta; font-weight: bold; font-size: 1.5em; text-decoration: underline;');
        const variableNameRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
        for (let name in H) {
            deobf = H[name];
            if (variableNameRegex.test(deobf)) {
                injectionString = `${injectionString}${name}: (() => { try { return ${deobf}; } catch (error) { return "value_undefined"; } })(),`;
            } else {
                alert("Message from the LibertyMutual Devs: WARNING! The keys inputted contain non-variable characters! There is a possibility that this could run code unintended by the LibertyMutual team, although possibly there is also a mistake. Do NOT proceed with using this, and report to the LibertyMutual developers what is printed in the console.");
                console.log("REPORT THIS IN THE DISCORD SERVER:", clientKeys);
                const crashplease = "balls";
                crashplease = "balls2";
            };
        };
        console.log(injectionString);
        console.log('%cLIBERTYMUTUAL INJECTION: INJECT VAR RETRIEVAL FUNCTION AND MAIN LOOP', 'color: yellow; font-weight: bold; font-size: 1.2em; text-decoration: underline;');
        modifyJS(H.SCENE+'.render',`window["${functionNames.retrieveFunctions}"]({${injectionString}},true)||${H.SCENE}.render`);
        console.log('%cSuccess! Variable retrieval and main loop hooked.', 'color: green; font-weight: bold;');
        modifyJS(`{if(${H.CULL})`,`{if(true)`);
        console.log('%cSuccess! Cull inhibition hooked.', 'color: green; font-weight: bold;');
        modifyJS("Not playing in iframe", "LIBERTYMUTUAL ACTIVE!");
        // console.log(js);
        console.log(H);
        return js;
    };

    createAnonFunction("retrieveFunctions",function(vars) { ss=vars ; F.LIBERTYMUTUAL() });

    createAnonFunction("LIBERTYMUTUAL",function() {
        // globalSS = ss;
        
        ss.PLAYERS.forEach(PLAYER=>{
            if (PLAYER.hasOwnProperty("ws")) {
                ss.MYPLAYER = PLAYER
            };
        });

        H.actor = findKeyWithProperty(ss.MYPLAYER,H.mesh);

        let TARGETED;
        let CROSSHAIRS=new BABYLON.Vector3();
        CROSSHAIRS.copyFrom(ss.MYPLAYER[H.actor][H.mesh].position);

        // eye level
        CROSSHAIRS.y += 0.4;
        const forwardOffset = -5; 
        const yaw = ss.MYPLAYER[H.yaw];
        const pitch = -ss.MYPLAYER[H.pitch];
        const forwardX = Math.sin(yaw) * Math.cos(pitch);
        const forwardY = Math.sin(pitch);
        const forwardZ = Math.cos(yaw) * Math.cos(pitch);
        CROSSHAIRS.x += forwardX * forwardOffset;
        CROSSHAIRS.y += forwardY * forwardOffset;
        CROSSHAIRS.z += forwardZ * forwardOffset;

        const timecode=Date.now();
        let minValue=99999;
        ss.PLAYERS.forEach(PLAYER=>{
            if (PLAYER) {
                PLAYER.timecode=timecode;
                //Partial credit for enemy player filtering: PacyTense. Also just common sense.
                if ((PLAYER!==ss.MYPLAYER) && ((ss.MYPLAYER.team==0)||(PLAYER.team!==ss.MYPLAYER.team))) {
                    //ESP CODE
                    if ((!PLAYER.generatedESP)) {
                        //Credit for box from lines code: AI. ChatGPT prompt: "how can i create a box out of lines in babylon.js?"
                        //ESP BOXES
                        const boxSize = {width: 0.4, height: 0.65, depth: 0.4};
                        const vertices = [
                            new BABYLON.Vector3(-boxSize.width / 2, 0, -boxSize.depth / 2),
                            new BABYLON.Vector3(boxSize.width / 2, 0, -boxSize.depth / 2),
                            new BABYLON.Vector3(boxSize.width / 2, 0 + boxSize.height, -boxSize.depth / 2),
                            new BABYLON.Vector3(-boxSize.width / 2, 0 + boxSize.height, -boxSize.depth / 2),
                            new BABYLON.Vector3(-boxSize.width / 2, 0, boxSize.depth / 2),
                            new BABYLON.Vector3(boxSize.width / 2, 0, boxSize.depth / 2),
                            new BABYLON.Vector3(boxSize.width / 2, 0 + boxSize.height, boxSize.depth / 2),
                            new BABYLON.Vector3(-boxSize.width / 2, 0 + boxSize.height, boxSize.depth / 2),
                        ];
                        const lines = [];
                        for (let i = 0; i < 4; i++) {
                            lines.push([vertices[i], vertices[(i + 1) % 4]]);
                            lines.push([vertices[i + 4], vertices[(i + 1) % 4 + 4]]);
                            lines.push([vertices[i], vertices[i + 4]]);
                        };
                        const box = BABYLON.MeshBuilder.CreateLineSystem(getScrambled(), { lines }, PLAYER[H.actor].scene);
                        //ChatGPT prompt: "how can i make an object anchored to another object, change its color, and have it render on top of everything else? babylon.js"
                        box.color = new BABYLON.Color3(1, 1, 1);
                        box.renderingGroupId = 1;
                        box.parent=PLAYER[H.actor][H.mesh];
                        //TRACER LINES
                        const tracers=BABYLON.MeshBuilder.CreateLines('lines', { points: [PLAYER[H.actor][H.mesh].position, CROSSHAIRS] }, PLAYER[H.actor].scene);
                        tracers.color=new BABYLON.Color3(1, 1, 1);
                        tracers.alwaysSelectAsActiveMesh = true;
                        tracers.renderingGroupId=1;
                        
                        PLAYER.box=box;
                        PLAYER.tracers=tracers;
                        PLAYER.generatedESP=true;
                        ESPArray.push([box,tracers,PLAYER]);
                    };
                    //update the lines
                    PLAYER.tracers.setVerticesData(BABYLON.VertexBuffer.PositionKind, [CROSSHAIRS.x, CROSSHAIRS.y, CROSSHAIRS.z, PLAYER[H.actor][H.mesh].position.x, PLAYER[H.actor][H.mesh].position.y, PLAYER[H.actor][H.mesh].position.z]);
                    PLAYER.box.visibility=enableESP;
                    PLAYER.tracers.visibility=(PLAYER[H.playing]&&enableTracers);

                    //AIMBOT CODE
                    //Credit: This section is mostly common sense, and could be made by most decent programmers. It is still worth mentioning PacyTense used a functionally equivalent thing similar to this this before me 4 years ago.
                    const distance=Math.hypot(PLAYER[H.x]-ss.MYPLAYER[H.x], PLAYER[H.y]-ss.MYPLAYER[H.y], PLAYER[H.z]-ss.MYPLAYER[H.z]);

                    if (distance<minValue) {
                        TARGETED=PLAYER;
                        minValue=distance;
                    };
                };
            };
            if (RMB && TARGETED && TARGETED[H.playing]) {
                //3D maths
                const directionVector={
                    [H.x]: -(TARGETED[H.x]-ss.MYPLAYER[H.x]),
                    [H.y]: -(TARGETED[H.y]-ss.MYPLAYER[H.y]-0.05),
                    [H.z]: -(TARGETED[H.z]-ss.MYPLAYER[H.z]),
                };
                ss.MYPLAYER[H.yaw]=F.calculateYaw(directionVector);
                ss.MYPLAYER[H.pitch]=F.calculatePitch(directionVector);
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
        return F.setPrecision(Math.mod(Math.atan2(pos[H.x],pos[H.z]), Math.PI2));
    });
    createAnonFunction("calculatePitch",function (pos) {
        return F.setPrecision(-Math.atan2(pos[H.y],Math.hypot(pos[H.x],pos[H.z]))%1.5);
    });
})();
