import { db } from "./database";


export function getSubjects(): any[] {

    return db.getAllSync(
        "SELECT * FROM subjects"
    );

}