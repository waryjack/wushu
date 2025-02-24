const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export default class WushuActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
    static DEFAULT_OPTIONS = {
        actions:{
            editImage:this._onEditImage,
            rollTrait:this._rollTrait,
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
        hero: {
            template: "systems/wushu/templates/actorsheets/hero.hbs"
        },
        mook: {
             template: "systems/wushu/templates/actorsheets/mook.hbs"
        },
        nemesis: {
            template: "systems/wushu/templates/actorsheets/nemesis.hbs"
        }
    }

    /** @override */
    _configureRenderOptions(options){
        super._configureRenderOptions(options);

        options.parts = ['header'];
        if (this.document.limited) return;

        console.log("This Document Type: ", this.document.type);
        switch(this.document.type) {
            case "hero":
                options.parts.push("hero");
                break;
            case "nemesis":
                options.parts.push("nemesis");
                break;
            case "mook":
                options.parts.push("mook");
                break;
            default: options.parts.push("hero");
                     break;
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

    static async _onEditImage(){
        if (target.nodeName !== "IMG") {
            throw new Error("The editImage action is available only for IMG elements.");
          }
          const attr = target.dataset.edit;
          const current = foundry.utils.getProperty(this.document._source, attr);
          const defaultArtwork = this.document.constructor.getDefaultArtwork?.(this.document._source) ?? {};
          const defaultImage = foundry.utils.getProperty(defaultArtwork, attr);
          const fp = new FilePicker({
            current,
            type: "image",
            redirectToRoot: defaultImage ? [defaultImage] : [],
            callback: path => {
              target.src = path;
              if (this.options.form.submitOnChange) {
                const submit = new Event("submit");
                this.element.dispatchEvent(submit);
              }
            },
            top: this.position.top + 40,
            left: this.position.left + 10
          });
          await fp.browse();
    }



}