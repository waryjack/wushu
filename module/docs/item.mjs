import WushuMessenger from "../apps/interaction/messenger.mjs";

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
        if (this.type != "trait") return;
        let chatData = {};
        let rollData = this.getRollData();
        rollData.traitname = this.name;

        // prompt here
        const breakdown = await WushuMessenger.rollPrompt(this.getRollData());
        console.log(breakdown);

        if(breakdown.scab) {
            // formula is $kl1
            let formula = this.system.rating+"d6kl1";
            let scabRoll = new Roll(formula);
            await scabRoll.evaluate();
            console.log(scabRoll.total);
            let outcome = "";
            switch(scabRoll.total){
                case 1: outcome = "Solid success. Good work!"; break;
                case 2: outcome = "Good success. Mission (barely) accomplished."; break;
                case 3: outcome = "Success with a cost."; break;
                case 4: outcome = "Garden variety failure."; break;
                case 5: outcome = "Embarrassing failure."; break;
                case 6: outcome = "Disastrous failure.";break;
                default: outcome = "Unable to determine outcome."
            }
            chatData = {
                scab:true,
                trait:this.name,
                rating: this.system.rating,
                rolls:[scabRoll],
                highest:scabRoll.total,
                outcome:outcome,
                tooltip: new Handlebars.SafeString(await scabRoll.getTooltip())
            }

        } else {
            // formula is (xd6cs<rating)


            let aFormula = breakdown.atk + "d6cs<=" + this.system.rating;
            let dFormula = breakdown.def + "d6cs<=" + this.system.rating;
            
            let atkRoll = new Roll(aFormula);
            let defRoll = new Roll(dFormula);
            
            await atkRoll.evaluate();
            await defRoll.evaluate();


            let  aSux = atkRoll.total;
            let dSux = defRoll.total;
            chatData = {
                scab:false,
                trait:this.name,
                rating: this.system.rating,
                rolls:[atkRoll,defRoll],
                aRolled: breakdown.atk,
                dRolled: breakdown.def,
                aSuccess:aSux,
                dSuccess:dSux,
                aTip: new Handlebars.SafeString(await atkRoll.getTooltip()),
                dTip: new Handlebars.SafeString(await defRoll.getTooltip())
            }
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