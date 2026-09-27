import { db } from "./database";


// READ ALL SUBJECTS
export function getSubjects(){

    return db.getAllSync(
        `
        SELECT *
        FROM subjects
        ORDER BY id DESC
        `
    );

}



// CREATE SUBJECT
export function addSubject(
    name:string,
    description:string
){

    db.runSync(

        `
        INSERT INTO subjects
        (
            name,
            description
        )

        VALUES (?,?)

        `,

        [
            name,
            description
        ]

    );

}



// DELETE SUBJECT
export function deleteSubject(
    id:number
){

    db.runSync(

        `
        DELETE FROM subjects
        WHERE id=?

        `,

        [
            id
        ]

    );

}



// GET SINGLE SUBJECT
export function getSubjectById(
    id:number
){

    return db.getFirstSync(

        `
        SELECT *
        FROM subjects
        WHERE id=?

        `,

        [
            id
        ]

    );

}




// ==========================================
// TOPIC REPOSITORY
// ==========================================


// READ TOPICS FOR ONE SUBJECT
export function getTopicsBySubject(
  subjectId: number
) {

  return db.getAllSync(

    `
    SELECT *
    FROM topics
    WHERE subject_id = ?
    ORDER BY id DESC
    `,

    [
      subjectId
    ]

  );

}


// CREATE TOPIC
export function addTopic(
  subjectId: number,
  name: string
) {

  db.runSync(

    `
    INSERT INTO topics
    (
      subject_id,
      name
    )

    VALUES (?,?)
    `,

    [
      subjectId,
      name
    ]

  );

}


// DELETE TOPIC
export function deleteTopic(
  id: number
) {

  db.runSync(

    `
    DELETE FROM topics
    WHERE id = ?
    `,

    [
      id
    ]

  );

}


// GET SINGLE TOPIC
export function getTopicById(
  id: number
) {

  return db.getFirstSync(

    `
    SELECT *
    FROM topics
    WHERE id = ?
    `,

    [
      id
    ]

  );

}