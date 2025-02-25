const {
    HTMLField, SchemaField, NumberField, ArrayField, BooleanField, FilePathField, ObjectField
  } = foundry.data.fields;
import WushuActorData from "./basemodel.mjs";

export default class WushuMookData extends WushuActorData {
  static defineSchema() {
    return {
      img: new FilePathField({required:false, categories: ["IMAGE"]}),
      backstory: new HTMLField({required:true, initial:""}),
      gm_notes: new HTMLField({required:true, initial:""}),
      threat: new SchemaField({
        rating: new NumberField({integer:true, required:true, initial:3, min:0}), // maybe do healthboxes here? no, use skulls and remove them
        boxes: new ArrayField(new NumberField(), {required:true, initial:[0,0,0]})
      })
    }
  }

   /** @override */
   prepareDerivedData() {
    // Keep health boxes and health rating the same; if they're equal
    // nothing happens
    while (this.threat.boxes.length < this.threat.rating) {
      this.threat.boxes.push(0)
    } 
    
    while (this.threat.boxes.length > this.threat.rating) {
      this.threat.boxes.shift()
    }

    if(this.threat.boxes.reduce((sum, v) => sum + v, 0) == this.threat.boxes.rating) {
      this.threat.oof = true;
    }

  }

  async _increaseThreat() {
    let ch = this.threat.rating + 1;
    await this.actor.update({"system.threat.rating":ch});
  }

  async _decreaseThreat() {
    let ch = this.threat.rating - 1;
    await this.actor.update({"system.threat.rating":ch});
  }
}