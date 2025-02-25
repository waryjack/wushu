const { DialogV2 } = foundry.applications.api;

export default class WushuMessenger {

    /**
     * @param {String} trait the name of the selected trait
     * @param {Object} data number of dice to roll
     */
    static async rollPrompt(data){
        const promptContent = await renderTemplate(CONFIG.wushu.dialog.traitroll, data)
        const prompt = await DialogV2.wait({
            window: { title: "WUSHU.ui.titles.traitroll"},
                content: promptContent,
                classes: ["wushu-dialog"],
                buttons: [{
                    action:"roll",
                    label:"Roll",
                    default:true,
                    callback: (event, button, dialog) => { return button.form.elements }
                },
                    {
                        action: "cancel",
                        label: "Cancel"
                }],
                submit: result => {
                    console.log("Roll dialog result: ", result);
                    if (result === "cancel") return;
                    return result;
                }
        });

        return {
            atk: prompt.atk.value,
            def: prompt.def.value,
            scab: prompt.scab.checked
        }
    }

    /**
     * @param {Object} chatData object containing trait name and rolls
     */
    static async sendChatMessage(chatData) {
        const chatContent = await renderTemplate(chatData.scab ? CONFIG.wushu.message.scabroll : CONFIG.wushu.message.traitroll, chatData);
        ChatMessage.create({
            user:game.user._id,
            rolls: chatData.rolls,
            speaker:ChatMessage.getSpeaker(),
            content:chatContent
        });
    }
}