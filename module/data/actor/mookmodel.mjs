const {
    HTMLField, SchemaField, NumberField, StringField, BooleanField, FilePathField, ObjectField
  } = foundry.data.fields;

export default class WushuMookData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      img: new FilePathField({required:false, categories: ["IMAGE"]}),
      backstory: new HTMLField({required:true, initial:""}),
      gm_notes: new HTMLField({required:true, initial:""}),
      threat: new NumberField({integer:true, required:true, initial:1, min:0}) // maybe do healthboxes here? no, use skulls and remove them
    }
  }
}