const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export default class WushuActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
    static DEFAULT_OPTIONS = {
        actions:{
            editImage:this._onEditImage,
            addItem:this._addItem,
            deleteItem:this._deleteItem,
            editItem:this._editItem,
            rollTrait:this._rollTrait,
            cycleHealthBox: this._cycleHealthBox,
            incHealth: this._increaseHealth,
            decHealth: this._decreaseHealth,
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
            default: console.log("Couldn't find the part")
        }

    }

    /** @override */
    async _prepareContext(options) {
        const data = foundry.utils.deepClone(this.actor.system);
        data.config = CONFIG.wushu;
        data.settings = game.settings.get("wushu","prefs");
        data.actor = this.actor;
        data.enrichedStory = await TextEditor.enrichHTML(this.actor.system.backstory);
        if(this.actor.type != "mook") {
            data.traits = this.actor.items.filter(i => i.type === "trait");
            data.specials = this.actor.items.filter(i => i.type === "special");
            data.setbacks = this.actor.items.filter(i => i.type === "setback");          
        }

        if(this.actor.type === "mook" || this.actor.type === "nemesis") {
            data.enrichedGMNotes = await TextEditor.enrichHTML(this.actor.system.gm_notes);
        }
       
        console.log("Data in prepareContext: ", data);
        return data;
    }

    static async _rollTrait(e, elem) {
        e.preventDefault();
        let item = this.actor.items.get(elem.dataset.itemId);
        await item._rollItemDice();
    }

    static async _increaseHealth(e,elem) {
        e.preventDefault();
        await this.actor.system._increaseHealth();
    }

    static async _decreaseHealth(e, elem) {
        e.preventDefault();
        await this.actor.system._decreaseHealth();
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

    static async _editItem(event, element) {
        event.preventDefault();
        let itemId = element.dataset.itemId;
        let item = this.actor.items.get(itemId);
        console.log("Item to edit: ", item);
        await item.sheet.render(true);

    }

    static async _addItem(event, element) {
        event.preventDefault();
        let loc = "EW.items.new."+element.dataset.type;
        await Item.create({name:game.i18n.localize(loc), type:element.dataset.type}, {parent:this.actor, renderSheet:true});

    }

    static _deleteItem(event, element) {
        event.preventDefault();
        
        let itemId = element.dataset.itemId;

        let d = new Dialog({
        title: "Delete This Item?",
        content: "<p>Are you sure you want to delete this item?</p>",
        buttons: {
            one: {
            icon: '<i class="fas fa-check"></i>',
            label: "Yes",
            callback: () => { 
                let itemToDelete = this.actor.items.get(itemId);
                itemToDelete.delete();
            }
            },
            two: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: () => { return; }
            }
        },
        default: "two",
        render: html => console.log("Register interactivity in the rendered dialog"),
        close: html => console.log("This always is logged no matter which option is chosen")
        });
        d.render(true);

      }


}