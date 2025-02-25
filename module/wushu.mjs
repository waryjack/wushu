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
    Actors.registerSheet("wushu", apps.WushuActorSheet, {types:["hero","nemesis"], makeDefault:true});
    Actors.registerSheet("wushu", apps.WushuMookSheet, {types:["mook"], makeDefault:true});
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

     // Register handlebar helpers //
    Handlebars.registerHelper('ife', function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper("setting", function(arg){
        // console.warn("Passed Setting Name: ", arg);
        if (arg == "" || arg == "non" || arg == undefined) { return ; }
        return game.settings.get('wushu', 'prefs')[arg];
    });

    Handlebars.registerHelper("proper", function(content) {
        let result = "";

        result = content[0].toUpperCase() + content.substring(1);

        return result;

    });

});