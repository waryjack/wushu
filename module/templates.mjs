export const preloadHandlebarsTemplates = async function () {
    return loadTemplates([
        "systems/wushu/templates/partials/descriptionblock.hbs",
        "systems/wushu/templates/partials/featureblock.hbs",
        "systems/wushu/templates/partials/gmnotesblock.hbs",
        "systems/wushu/templates/partials/healthblock.hbs",
        "systems/wushu/templates/partials/setbackblock.hbs",
        "systems/wushu/templates/partials/specialblock.hbs",
        "systems/wushu/templates/partials/storyblock.hbs",
        "systems/wushu/templates/partials/threatblock.hbs",
        "systems/wushu/templates/partials/traitblock.hbs"

    ])
}