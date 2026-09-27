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



// ==========================================
// CONTENT SOURCE REPOSITORY
// ==========================================


// READ ALL CONTENT SOURCES FOR A SUBJECT
export function getContentSourcesBySubject(
  subjectId: number
) {

  return db.getAllSync(
    `
    SELECT *
    FROM content_sources
    WHERE subject_id = ?
    ORDER BY id DESC
    `,
    [subjectId]
  );

}


// CREATE CONTENT SOURCE
export function addContentSource(
  subjectId: number,
  title: string,
  sourceType: string = "TEXT"
) {

  return db.runSync(
    `
    INSERT INTO content_sources
    (
      subject_id,
      title,
      source_type
    )
    VALUES (?,?,?)
    `,
    [
      subjectId,
      title,
      sourceType
    ]
  );

}


// DELETE CONTENT SOURCE
export function deleteContentSource(
  id: number
) {

  // First remove all chunks
  // belonging to this content source.
  db.runSync(
    `
    DELETE FROM content_chunks
    WHERE source_id = ?
    `,
    [id]
  );


  // Then remove the content source.
  db.runSync(
    `
    DELETE FROM content_sources
    WHERE id = ?
    `,
    [id]
  );

}


// GET SINGLE CONTENT SOURCE
export function getContentSourceById(
  id: number
) {

  return db.getFirstSync(
    `
    SELECT *
    FROM content_sources
    WHERE id = ?
    `,
    [id]
  );

}


// ==========================================
// CONTENT CHUNK REPOSITORY
// ==========================================


// READ ALL CHUNKS FOR ONE CONTENT SOURCE
export function getContentChunksBySource(
  sourceId: number
) {

  return db.getAllSync(
    `
    SELECT *
    FROM content_chunks
    WHERE source_id = ?
    ORDER BY chunk_order ASC, id ASC
    `,
    [sourceId]
  );

}


// CREATE CONTENT CHUNK
export function addContentChunk(
  sourceId: number,
  topicId: number | null,
  chunkText: string,
  chunkOrder: number = 0
) {

  db.runSync(
    `
    INSERT INTO content_chunks
    (
      source_id,
      topic_id,
      chunk_text,
      chunk_order
    )
    VALUES (?,?,?,?)
    `,
    [
      sourceId,
      topicId,
      chunkText,
      chunkOrder
    ]
  );

}


// DELETE CONTENT CHUNK
export function deleteContentChunk(
  id: number
) {

  db.runSync(
    `
    DELETE FROM content_chunks
    WHERE id = ?
    `,
    [id]
  );

}


// GET SINGLE CONTENT CHUNK
export function getContentChunkById(
  id: number
) {

  return db.getFirstSync(
    `
    SELECT *
    FROM content_chunks
    WHERE id = ?
    `,
    [id]
  );

}