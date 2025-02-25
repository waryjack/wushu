const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;

export default class WushuItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
    static DEFAULT_OPTIONS = {
        actions:{
            editImage:this._onEditImage
        },
        form: {
                submitOnChange: true,
                closeOnSubmit: false,
        },
        position:{
            width:400,
            height:400,
            left:120
        },
        tag:"form",
        window:{
            title:"WUSHU.ui.dialogs.titles.item",
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
            template: "systems/wushu/templates/itemsheets/header.hbs"
        },
        trait: {
            template: "systems/wushu/templates/itemsheets/trait.hbs"
        },
        special: {
             template: "systems/wushu/templates/itemsheets/special.hbs"
        },
        setback: {
            template: "systems/wushu/templates/itemsheets/setback.hbs"
        }
    }

    /** @override */
    _configureRenderOptions(options){
        super._configureRenderOptions(options);

        options.parts = ['header'];
        if (this.document.limited) return;

        console.log("This Document Type: ", this.document.type);
        switch(this.document.type) {
            case "trait":
                options.parts.push("trait");
                break;
            case "special":
                options.parts.push("special");
                break;
            case "setback":
                options.parts.push("setback");
                break;
            default:
        }

    }

    /** @override */
    async _prepareContext(options) {
        console.log("This.item: ", this.item);
        console.log("This.parent: ", this.parent);
        const data = foundry.utils.deepClone(this.item.system);
        data.config = CONFIG.wushu;
        data.item = this.item;
        data.enrichedFeats =  await TextEditor.enrichHTML(this.item.system.features);
        data.enrichedDesc = await TextEditor.enrichHTML(this.item.system.description);
        
        console.log("Item sheet context: ", data);
        return data;
    }

    static async _onEditImage(_event, target){
        
        if (element.nodeName !== "IMG") {
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