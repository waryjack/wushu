const {
    HTMLField, SchemaField, NumberField, StringField, BooleanField, FilePathField, ObjectField
  } = foundry.data.fields;
import WushuActordata from "./basemodel.mjs";

export default class WushuNemesisData extends WushuActorData {
    static defineSchema() {
        const baseSchema = super.defineSchema();
        return {
            ...baseSchema,
            gm_notes: new HTMLField({required:true, initial:""})
        }
    }

}