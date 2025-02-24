export const registerSettings = function() {

   /* game.settings.registerMenu("wushu", "settingsMenu", {
        name: "WUSHU.SETTINGS.MENU.menuname",
        label: "WUSHU.SETTINGS.MENU.menulabel",
        hint: "WUSHU.SETTINGS.MENU.menuhint",
        icon: "fas fa-bars",
        type: WushuSettingsMenu,
        restricted:true
    });*/
    
    game.settings.register("wushu","prefs",{
        scope:"world",
        config:false,
        type: Object,
        default: {
            diceType: "D6",
            healthName: "Health",
            aDiceName: "Attack",
            dDiceName: "Defense",
            nemesisName: "Nemesis",
            mookName: "Mook",
            baseHealth: 3,
            useFeatures: true,
            useCategories: true,
            useSpecials:true
        }
    })
    
}