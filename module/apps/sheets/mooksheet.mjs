const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export default class WushuMookSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
    static DEFAULT_OPTIONS = {
        actions:{
            editImage:this._onEditImage,
            cycleHealthBox: this._cycleHealthBox,
            incThreat: this._increaseThreat,
            decThreat: this._decreaseThreat
        },
        form: {
                submitOnChange: true,
                closeOnSubmit: false,
        },
        position:{
            width:340,
            height:460,
            left:120
        },
        tag:"form",
        window:{
            title:"WUSHU.ui.dialogs.titles.actor",
            contentClasses:['scrollable','standard-form'],
            resizable:true
        }
    }

    get title() {
        let type = this.document.type;
        return `Wushu ${game.i18n.localize(this.options.window.title)}: ${game.i18n.localize("WUSHU.characters."+type)}`
    }
    
    static PARTS = {
        header: {
            template: "systems/wushu/templates/actorsheets/header.hbs"
        },
        mook: {
             template: "systems/wushu/templates/actorsheets/mook.hbs"
        }
    }

    /** @override */
    async _prepareContext(options) {
        const data = foundry.utils.deepClone(this.actor.system);
        data.config = CONFIG.wushu;
        data.settings = game.settings.get("wushu","prefs");
        data.actor = this.actor;
        
        return data;
    }

    static async _increaseThreat(e,elem) {
        e.preventDefault();
        await this.actor.system._increaseThreat();
    }

    static async _decreaseThreat(e, elem) {
        e.preventDefault();
        await this.actor.system._decreaseThreat();
    }


    static async _cycleHealthBox(e, elem){
        e.preventDefault();
        console.log(elem.dataset);
        await this.actor.system._cycleHealthBox(elem.dataset.track, elem.dataset.pos, elem.dataset.state)
    }

    static async _onEditImage(_event, target) {
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