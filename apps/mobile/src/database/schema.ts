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