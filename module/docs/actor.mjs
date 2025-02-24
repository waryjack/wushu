export default class WushuActor extends Actor {
    prepareBaseData(){
        super.prepareBaseData();
      }
    
    prepareDerivedData(){
        super.prepareDerivedData();
    }

    get health(){
        return this.system.health.rating;
    }

    get oof() {
        return this.system.health.oof;
    }
}