const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export default class WushuChallengeSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
    static DEFAULT_OPTIONS = {
        actions:{
            cycleHealthBox: this._cycleHealthBox
        },
        form: {
                submitOnChange: true,
                closeOnSubmit: false,
        },
        position:{
            width:500,
            height:400,
            left:120
        },
        tag:"form",
        window:{
            title:"WUSHU.ui.titles.actor",
            contentClasses:['scrollable','standard-form'],
            resizable:true
        }
    }

    get title() {
        let itemtype = this.document.type;
        return `Wushu ${game.i18n.localize(this.options.window.title)}: ${game.i18n.localize("WUSHU.items."+itemtype)}`
    }
    
    static PARTS = {
        header: {
            template: "systems/wushu/templates/actorsheets/header.hbs"
        },
        challenge: {
            template: "systems/wushu/templates/actorsheets/challengesheet.hbs"
        }
    }

    static async _rollTrait(e,elem) {
        e.preventDefault();
        let item = this.actor.items.get(elem.dataset.itemId);
        await item._rollItemDice();
    }

    static async _cycleHealthBox(e,elem){
        e.preventDefault();
        await this.actor.system._cycleHealthBox(elem.dataset.pos, elem.dataset.value)
    }


}