type Subject = {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
};


type Topic = {
  id: number;
  subject_id: number;
  name: string;
  mastery_score: number;
  created_at?: string;
};


class WebDatabase {

  private subjectStorageKey =
    "adaptive_learning_subjects";

  private topicStorageKey =
    "adaptive_learning_topics";


  // ==========================================
  // SUBJECT STORAGE
  // ==========================================

  private getSubjects(): Subject[] {

    if (
      typeof window === "undefined" ||
      !window.localStorage
    ) {
      return [];
    }


    const stored =
      window.localStorage.getItem(
        this.subjectStorageKey
      );


    if (!stored) {
      return [];
    }


    try {

      return JSON.parse(stored);

    }
    catch {

      return [];

    }

  }


  private saveSubjects(
    subjects: Subject[]
  ) {

    if (
      typeof window === "undefined" ||
      !window.localStorage
    ) {
      return;
    }


    window.localStorage.setItem(
      this.subjectStorageKey,
      JSON.stringify(subjects)
    );

  }


  // ==========================================
  // TOPIC STORAGE
  // ==========================================

  private getTopics(): Topic[] {

    if (
      typeof window === "undefined" ||
      !window.localStorage
    ) {
      return [];
    }


    const stored =
      window.localStorage.getItem(
        this.topicStorageKey
      );


    if (!stored) {
      return [];
    }


    try {

      return JSON.parse(stored);

    }
    catch {

      return [];

    }

  }


  private saveTopics(
    topics: Topic[]
  ) {

    if (
      typeof window === "undefined" ||
      !window.localStorage
    ) {
      return;
    }


    window.localStorage.setItem(
      this.topicStorageKey,
      JSON.stringify(topics)
    );

  }


  // ==========================================
  // EXEC
  // ==========================================

  execSync(query: string) {

    console.log(
      "WEB SQL:",
      query
    );

  }


  // ==========================================
  // RUN
  // INSERT / DELETE
  // ==========================================

  runSync(
    query: string,
    params: any[] = []
  ) {

    console.log(
      "WEB SQL:",
      query,
      params
    );


    // ========================================
    // INSERT SUBJECT
    // ========================================

    if (
      query.includes(
        "INSERT INTO subjects"
      )
    ) {

      const subjects =
        this.getSubjects();


      let name =
        params[0];

      let description =
        params[1];


      // Seed subject
      if (!name) {

        if (
          query.includes(
            "Machine Learning"
          )
        ) {

          name =
            "Machine Learning";

          description =
            "Artificial Intelligence and ML Concepts";

        }

      }


      if (!name) {
        return;
      }


      const nextId =

        subjects.length > 0

          ? Math.max(
              ...subjects.map(
                subject =>
                  subject.id
              )
            ) + 1

          : 1;


      subjects.push({

        id: nextId,

        name,

        description:
          description || "",

        created_at:
          new Date().toISOString(),

      });


      this.saveSubjects(
        subjects
      );


      return;

    }


    // ========================================
    // DELETE SUBJECT
    // ========================================

    if (
      query.includes(
        "DELETE FROM subjects"
      )
    ) {

      const id =
        Number(params[0]);


      const subjects =
        this.getSubjects();


      const updatedSubjects =
        subjects.filter(
          subject =>
            subject.id !== id
        );


      this.saveSubjects(
        updatedSubjects
      );


      /*
      Also remove topics belonging
      to deleted subject.
      */

      const topics =
        this.getTopics();


      const updatedTopics =
        topics.filter(
          topic =>
            topic.subject_id !== id
        );


      this.saveTopics(
        updatedTopics
      );


      return;

    }


    // ========================================
    // INSERT TOPIC
    // ========================================

    if (
      query.includes(
        "INSERT INTO topics"
      )
    ) {

      const topics =
        this.getTopics();


      /*
      Normal addTopic():

      params[0] = subjectId
      params[1] = topic name
      */

      if (
        params.length >= 2
      ) {

        const subjectId =
          Number(params[0]);

        const name =
          String(params[1]);


        const nextId =

          topics.length > 0

            ? Math.max(
                ...topics.map(
                  topic =>
                    topic.id
                )
              ) + 1

            : 1;


        topics.push({

          id: nextId,

          subject_id:
            subjectId,

          name,

          mastery_score: 0,

          created_at:
            new Date().toISOString(),

        });


        this.saveTopics(
          topics
        );


        return;

      }


      /*
      Seed topics

      Existing database seed:

      (1,'Supervised Learning'),
      (1,'Classification'),
      (1,'Regression')
      */

      if (
        query.includes(
          "Supervised Learning"
        )
      ) {

        if (topics.length === 0) {

          topics.push(

            {
              id: 1,
              subject_id: 1,
              name:
                "Supervised Learning",
              mastery_score: 0,
              created_at:
                new Date().toISOString(),
            },

            {
              id: 2,
              subject_id: 1,
              name:
                "Classification",
              mastery_score: 0,
              created_at:
                new Date().toISOString(),
            },

            {
              id: 3,
              subject_id: 1,
              name:
                "Regression",
              mastery_score: 0,
              created_at:
                new Date().toISOString(),
            }

          );


          this.saveTopics(
            topics
          );

        }

      }


      return;

    }


    // ========================================
    // DELETE TOPIC
    // ========================================

    if (
      query.includes(
        "DELETE FROM topics"
      )
    ) {

      const id =
        Number(params[0]);


      const topics =
        this.getTopics();


      const updated =
        topics.filter(
          topic =>
            topic.id !== id
        );


      this.saveTopics(
        updated
      );


      return;

    }

  }


  // ==========================================
  // GET ALL
  // ==========================================

  getAllSync(
    query: string,
    params: any[] = []
  ) {

    // ========================================
    // SUBJECTS
    // ========================================

    if (
      query.includes(
        "FROM subjects"
      )
    ) {

      const subjects =
        this.getSubjects();


      return [
        ...subjects
      ].sort(
        (a, b) =>
          b.id - a.id
      );

    }


    // ========================================
    // TOPICS BY SUBJECT
    // ========================================

    if (
      query.includes(
        "FROM topics"
      )
    ) {

      const topics =
        this.getTopics();


      /*
      Repository query:

      WHERE subject_id = ?
      */

      if (
        query.includes(
          "WHERE subject_id"
        )
      ) {

        const subjectId =
          Number(params[0]);


        return topics

          .filter(
            topic =>
              topic.subject_id ===
              subjectId
          )

          .sort(
            (a, b) =>
              b.id - a.id
          );

      }


      return [
        ...topics
      ].sort(
        (a, b) =>
          b.id - a.id
      );

    }


    return [];

  }


  // ==========================================
  // GET FIRST
  // ==========================================

  getFirstSync(
    query: string,
    params: any[] = []
  ) {

    // ========================================
    // SUBJECT COUNT
    // ========================================

    if (
      query.includes(
        "COUNT(*)"
      ) &&
      query.includes(
        "subjects"
      )
    ) {

      return {

        count:
          this.getSubjects()
            .length,

      };

    }


    // ========================================
    // TOPIC COUNT
    // ========================================

    if (
      query.includes(
        "COUNT(*)"
      ) &&
      query.includes(
        "topics"
      )
    ) {

      return {

        count:
          this.getTopics()
            .length,

      };

    }


    // ========================================
    // SUBJECT BY ID
    // ========================================

    if (
      query.includes(
        "FROM subjects"
      ) &&
      query.includes(
        "WHERE id"
      )
    ) {

      const id =
        Number(params[0]);


      const subject =
        this.getSubjects()
          .find(
            item =>
              item.id === id
          );


      return subject || null;

    }


    // ========================================
    // TOPIC BY ID
    // ========================================

    if (
      query.includes(
        "FROM topics"
      ) &&
      query.includes(
        "WHERE id"
      )
    ) {

      const id =
        Number(params[0]);


      const topic =
        this.getTopics()
          .find(
            item =>
              item.id === id
          );


      return topic || null;

    }


    return null;

  }

}


export const db =
  new WebDatabase();