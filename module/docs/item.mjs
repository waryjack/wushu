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
        // formula is (xd6cs<rating)
        let aFormula = atk + "d6cs<=" + this.system.rating;
        let dFormula = def + "d6cs<=" + this.system.rating;
        
        let atkRoll = new Roll(aFormula);
        let defRoll = new Roll(dFormula);
        
        await atkRoll.evaluate();
        await defRoll.evaluate();

        aSux = atkRoll.total;
        dSux = defRoll.total;
        await this._sendRollToChat(aSux, dSux);

    }

    async _sendRollToChat(a, d) {
        // render the template
        // create the chatmessage
        // include rolls for DSN
    }

    async _promptTraitRoll() {
        let atk = 0;
        let def = 0;
        // render template
        // create dialog prompt (I hope)
        // pull data
        return {
            atk: atkSplit,
            def: defSplit
        }
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