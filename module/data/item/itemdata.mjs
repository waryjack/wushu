const {
    HTMLField, SchemaField, NumberField, StringField, BooleanField, FilePathField, ObjectField
  } = foundry.data.fields;

export default class WushuItemData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            img: new FilePathField({required:false, categories:["IMAGE"]}),
            rating: new NumberField({integer:true, required:true, min:1, max:5}),
            category: new StringField({required:true, initial:""}),
            description: new HTMLField({required:true, initial:""}),
            features: new HTMLField({required:true, initial:""}),
        }
    }

    /** @override */
    prepareBaseData() {
        super.prepareBaseData();
    }

    prepareDerivedData() {
        super.prepareDerivedData();
    }
}