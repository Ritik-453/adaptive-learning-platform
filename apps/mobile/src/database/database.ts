import { Platform } from "react-native";


let db: any;


if (Platform.OS === "web") {

    db = require("./database.web").db;

}
else {

    db = require("./database.native").db;

}


export { db };