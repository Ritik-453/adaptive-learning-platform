import {createTables} from "./schema";
import {seedDatabase} from "./seed";


let initialized = false;


export function initializeDatabase(){

    if(initialized){
        return;
    }


    createTables();

    seedDatabase();


    initialized = true;

}