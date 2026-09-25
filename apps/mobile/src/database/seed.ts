import {db} from "./database";


export function seedDatabase(){

const result =
db.getFirstSync(
"SELECT COUNT(*) as count FROM subjects"
) as any;


if(result.count === 0){


db.runSync(
`
INSERT INTO subjects
(name,description)

VALUES

(
'Machine Learning',
'Artificial Intelligence and ML Concepts'
)

`
);


db.runSync(

`
INSERT INTO topics
(subject_id,name)

VALUES

(1,'Supervised Learning'),
(1,'Classification'),
(1,'Regression')

`

);


}

}