const {
    HTMLField, SchemaField, NumberField, StringField, BooleanField, FilePathField, ObjectField
  } = foundry.data.fields;

export default class WushuChallengeData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new HTMLField({required:true, initial:""}),
            consequence: new HTMLField({required:true, initial:""}),
            gm_notes: new HTMLField({required:true, initial:""}),
            goal: new NumberField({required:true, initial:0, integer:true, min:0}),
            threat: new NumberField({required:true, initial:0, integer:true, min:0}),
            time_limit: new NumberField({required:true, initial:1, integer:true, min:0})
        }
    }

}