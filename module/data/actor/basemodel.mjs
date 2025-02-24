const {
    HTMLField, SchemaField, NumberField, ArrayField, BooleanField, FilePathField
  } = foundry.data.fields;

export default class WushuActorData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      img: new FilePathField({required:false, categories: ["IMAGE"]}),
      backstory: new HTMLField({required:true, initial:""}),
      health: new SchemaField({
        rating:new NumberField({required:true, initial:3, min:0, integer:true}),
        boxes: new ArrayField(new NumberField(), {required:true, initial:[0,0,0]}),
        oof: new BooleanField({required:true, initial:false, nullable:false})
      })
    }
  }

  /** @override */
  prepareBaseData() {
    super.prepareBaseData();
  }

  /** @override */
  prepareDerivedData() {
    // Keep health boxes and health rating the same; if they're equal
    // nothing happens
    while (this.health.boxes.length < this.health.rating) {
      this.health.boxes.push(0)
    } 
    
    while (this.health.boxes.length > this.health.rating) {
      this.health.boxes.shift()
    }

    if(this.health.boxes.reduce((sum, v) => sum + v, 0) == this.health.boxes.rating) {
      this.health.oof = true;
    }
  }

  async _cycleHealthBox(track, pos,value) {
    this[track].boxes[pos] = (value === 1) ? 0 : 1;
  }
}

