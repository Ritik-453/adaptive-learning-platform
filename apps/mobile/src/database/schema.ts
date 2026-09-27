import { db } from "./database";


export function createTables(){

db.execSync(`

CREATE TABLE IF NOT EXISTS subjects (

id INTEGER PRIMARY KEY AUTOINCREMENT,

name TEXT NOT NULL,

description TEXT,

created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE IF NOT EXISTS topics (

id INTEGER PRIMARY KEY AUTOINCREMENT,

subject_id INTEGER,

name TEXT NOT NULL,

mastery_score INTEGER DEFAULT 0,

created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE IF NOT EXISTS content_sources (

id INTEGER PRIMARY KEY AUTOINCREMENT,

subject_id INTEGER NOT NULL,

title TEXT NOT NULL,

source_type TEXT DEFAULT 'TEXT',

source_url TEXT,

file_name TEXT,

mime_type TEXT,

approval_status TEXT DEFAULT 'APPROVED',

created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (subject_id)
REFERENCES subjects(id)

);


CREATE TABLE IF NOT EXISTS content_chunks (

id INTEGER PRIMARY KEY AUTOINCREMENT,

source_id INTEGER NOT NULL,

topic_id INTEGER,

chunk_text TEXT NOT NULL,

chunk_order INTEGER DEFAULT 0,

created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (source_id)
REFERENCES content_sources(id),

FOREIGN KEY (topic_id)
REFERENCES topics(id)

);


CREATE TABLE IF NOT EXISTS questions (

id INTEGER PRIMARY KEY AUTOINCREMENT,

topic_id INTEGER,

question_text TEXT NOT NULL,

answer TEXT,

difficulty TEXT DEFAULT 'medium'

);


CREATE TABLE IF NOT EXISTS attempts (

id INTEGER PRIMARY KEY AUTOINCREMENT,

question_id INTEGER,

is_correct INTEGER,

attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP

);

`);

}