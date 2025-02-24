export default class WushuItem extends Item {
    prepareBaseData(){
        super.prepareBaseData();
      }
    
    prepareDerivedData(){
        super.prepareDerivedData();
    }

     /** @override */
    getRollData() {
        const rollData = this.system ?? {};
        return rollData;
    }

    async _rollItemDice(trait) {
        if (this.parent.type != "trait") return;

        // prompt here
        const breakdown = WushuMessenger.rollPrompt(this.name, this.getRollData());
        
        // formula is (xd6cs<rating)
        let aFormula = atk + "d6cs<=" + this.system.rating;
        let dFormula = def + "d6cs<=" + this.system.rating;
        
        let atkRoll = new Roll(aFormula);
        let defRoll = new Roll(dFormula);
        
        await atkRoll.evaluate();
        await defRoll.evaluate();

        aSux = atkRoll.total;
        dSux = defRoll.total;
        let chatData = {
            trait:this.name,
            rating: this.system.rating,
            rolls:[atkRoll,defRoll],
            aRolled: atk,
            dRolled: def,
            aSuccess:aSux,
            dSuccess:dSux,
            aTip: new Handlebars.SafeString(await atkRoll.getTooltip()),
            dTip: new Handlebars.SafeString(await defRoll.getTooltip())
        }
        await WushuMessenger.sendChatMessage(chatData);

    }

    get rating() {
        return this.system.rating;
    }

    get description() {
        return this.system.description;
    }

    get features() {
        return this.system.features;
    }

}