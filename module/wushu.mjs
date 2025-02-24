import * as data from "./data/_exports.mjs";
import * as docs from "./docs/_exports.mjs";
import * as apps from "./apps/_exports.mjs";
import { preloadHandlebarsTemplates } from "./templates.mjs"
import { wushu } from "./config.mjs";
import { registerSettings } from "./settings.mjs";

Hooks.once("init", () => {
    console.log("wushu | Initializing Wushu Open System")

    CONFIG.wushu = wushu; 
    game.wushu = {
        data,
        docs,
        apps,
        registerSettings
    }

    // Register system sheets
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("wushu", apps.WushuActorSheet, {types:["hero","mook","nemesis"], makeDefault:true});
    Actors.registerSheet("wushu", apps.WushuChallengeSheet, {types:["challenge"],makeDefault:true});

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("wushu", apps.WushuItemSheet, {types:["trait","special","setback"], makeDefault:true});

    // Assign datamodels
    Object.assign(CONFIG.Actor.dataModels, {
        hero: data.WushuActorData,
        nemesis: data.WushuActorData,
        mook: data.WushuMookData,
        challenge: data.WushuChallengeData
    });

    Object.assign(CONFIG.Item.dataModels, {
        trait: data.WushuItemData,
        special: data.WushuItemData,
        setback: data.WushuItemData
    })

    // assign document classes
    CONFIG.Actor.documentClass = docs.WushuActor;
    CONFIG.Item.documentClass = docs.WushuItem;

    // settings and templates
    registerSettings();
    preloadHandlebarsTemplates();

});