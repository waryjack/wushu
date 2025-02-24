const {
    HTMLField, SchemaField, NumberField, StringField, BooleanField, FilePathField, ObjectField
  } = foundry.data.fields;
import WushuActorData from "./basemodel.mjs";

export default class WushuMookData extends WushuActorData {
  static defineSchema() {
    return {
      img: new FilePathField({required:false, categories: ["IMAGE"]}),
      backstory: new HTMLField({required:true, initial:""}),
      gm_notes: new HTMLField({required:true, initial:""}),
      threat: new NumberField({integer:true, required:true, initial:1, min:0}) // maybe do healthboxes here? no, use skulls and remove them
    }
  }
}