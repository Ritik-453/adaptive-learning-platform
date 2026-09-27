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


type ContentSource = {
  id: number;
  subject_id: number;
  title: string;
  source_type: string;
  source_url?: string | null;
  file_name?: string | null;
  mime_type?: string | null;
  approval_status: string;
  created_at?: string;
};


type ContentChunk = {
  id: number;
  source_id: number;
  topic_id: number | null;
  chunk_text: string;
  chunk_order: number;
  created_at?: string;
};


class WebDatabase {

  private subjectStorageKey =
    "adaptive_learning_subjects";

  private topicStorageKey =
    "adaptive_learning_topics";

  private contentSourceStorageKey =
    "adaptive_learning_content_sources";

  private contentChunkStorageKey =
    "adaptive_learning_content_chunks";


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
  // CONTENT SOURCE STORAGE
  // ==========================================

  private getContentSources(): ContentSource[] {

    if (
      typeof window === "undefined" ||
      !window.localStorage
    ) {
      return [];
    }


    const stored =
      window.localStorage.getItem(
        this.contentSourceStorageKey
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


  private saveContentSources(
    sources: ContentSource[]
  ) {

    if (
      typeof window === "undefined" ||
      !window.localStorage
    ) {
      return;
    }


    window.localStorage.setItem(
      this.contentSourceStorageKey,
      JSON.stringify(sources)
    );

  }


  // ==========================================
  // CONTENT CHUNK STORAGE
  // ==========================================

  private getContentChunks(): ContentChunk[] {

    if (
      typeof window === "undefined" ||
      !window.localStorage
    ) {
      return [];
    }


    const stored =
      window.localStorage.getItem(
        this.contentChunkStorageKey
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


  private saveContentChunks(
    chunks: ContentChunk[]
  ) {

    if (
      typeof window === "undefined" ||
      !window.localStorage
    ) {
      return;
    }


    window.localStorage.setItem(
      this.contentChunkStorageKey,
      JSON.stringify(chunks)
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
  // ==========================================

  runSync(
    query: string,
    params: any[] = []
  ): any {

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


      return {
        lastInsertRowId: nextId,
        changes: 1,
      };

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


      this.saveSubjects(

        subjects.filter(
          subject =>
            subject.id !== id
        )

      );


      // Remove topics
      const topics =
        this.getTopics();


      this.saveTopics(

        topics.filter(
          topic =>
            topic.subject_id !== id
        )

      );


      // Find content sources for subject
      const sources =
        this.getContentSources();


      const sourceIds =
        sources
          .filter(
            source =>
              source.subject_id === id
          )
          .map(
            source =>
              source.id
          );


      // Remove subject content sources
      this.saveContentSources(

        sources.filter(
          source =>
            source.subject_id !== id
        )

      );


      // Remove chunks belonging to sources
      const chunks =
        this.getContentChunks();


      this.saveContentChunks(

        chunks.filter(
          chunk =>
            !sourceIds.includes(
              chunk.source_id
            )
        )

      );


      return {
        changes: 1,
      };

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


        return {
          lastInsertRowId: nextId,
          changes: 1,
        };

      }


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


      this.saveTopics(

        topics.filter(
          topic =>
            topic.id !== id
        )

      );


      /*
        Keep study material,
        but remove mapping to
        deleted topic.
      */

      const chunks =
        this.getContentChunks();


      const updatedChunks =
        chunks.map(
          chunk => {

            if (
              chunk.topic_id === id
            ) {

              return {
                ...chunk,
                topic_id: null,
              };

            }


            return chunk;

          }
        );


      this.saveContentChunks(
        updatedChunks
      );


      return {
        changes: 1,
      };

    }


    // ========================================
    // INSERT CONTENT SOURCE
    // ========================================

    if (
      query.includes(
        "INSERT INTO content_sources"
      )
    ) {

      const sources =
        this.getContentSources();


      const subjectId =
        Number(params[0]);

      const title =
        String(params[1]);

      const sourceType =
        params[2]
          ? String(params[2])
          : "TEXT";


      const nextId =

        sources.length > 0

          ? Math.max(
              ...sources.map(
                source =>
                  source.id
              )
            ) + 1

          : 1;


      sources.push({

        id: nextId,

        subject_id:
          subjectId,

        title,

        source_type:
          sourceType,

        source_url: null,

        file_name: null,

        mime_type: null,

        approval_status:
          "APPROVED",

        created_at:
          new Date().toISOString(),

      });


      this.saveContentSources(
        sources
      );


      /*
        Important:

        add-note.tsx needs this
        lastInsertRowId.
      */

      return {

        lastInsertRowId:
          nextId,

        changes: 1,

      };

    }


    // ========================================
    // DELETE CONTENT SOURCE
    // ========================================

    if (
      query.includes(
        "DELETE FROM content_sources"
      )
    ) {

      const id =
        Number(params[0]);


      const sources =
        this.getContentSources();


      this.saveContentSources(

        sources.filter(
          source =>
            source.id !== id
        )

      );


      /*
        Also delete chunks belonging
        to this source.
      */

      const chunks =
        this.getContentChunks();


      this.saveContentChunks(

        chunks.filter(
          chunk =>
            chunk.source_id !== id
        )

      );


      return {
        changes: 1,
      };

    }


    // ========================================
    // INSERT CONTENT CHUNK
    // ========================================

    if (
      query.includes(
        "INSERT INTO content_chunks"
      )
    ) {

      const chunks =
        this.getContentChunks();


      const sourceId =
        Number(params[0]);


      const topicId =

        params[1] === null ||
        params[1] === undefined

          ? null

          : Number(params[1]);


      const chunkText =
        String(params[2]);


      const chunkOrder =
        Number(params[3] ?? 0);


      const nextId =

        chunks.length > 0

          ? Math.max(
              ...chunks.map(
                chunk =>
                  chunk.id
              )
            ) + 1

          : 1;


      chunks.push({

        id: nextId,

        source_id:
          sourceId,

        topic_id:
          topicId,

        chunk_text:
          chunkText,

        chunk_order:
          chunkOrder,

        created_at:
          new Date().toISOString(),

      });


      this.saveContentChunks(
        chunks
      );


      return {

        lastInsertRowId:
          nextId,

        changes: 1,

      };

    }


    // ========================================
    // DELETE CONTENT CHUNK
    // ========================================

    if (
      query.includes(
        "DELETE FROM content_chunks"
      )
    ) {

      const value =
        Number(params[0]);


      const chunks =
        this.getContentChunks();


      // Delete every chunk belonging
      // to a content source.
      if (
        query.includes(
          "WHERE source_id"
        )
      ) {

        const updated =
          chunks.filter(
            chunk =>
              chunk.source_id !== value
          );


        const changes =
          chunks.length -
          updated.length;


        this.saveContentChunks(
          updated
        );


        return {
          changes,
        };

      }


      // Delete one chunk by chunk ID.
      if (
        query.includes(
          "WHERE id"
        )
      ) {

        const updated =
          chunks.filter(
            chunk =>
              chunk.id !== value
          );


        const changes =
          chunks.length -
          updated.length;


        this.saveContentChunks(
          updated
        );


        return {
          changes,
        };

      }


      return {
        changes: 0,
      };

    }


    return {
      changes: 0,
    };

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
    // TOPICS
    // ========================================

    if (
      query.includes(
        "FROM topics"
      )
    ) {

      const topics =
        this.getTopics();


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
      ];

    }


    // ========================================
    // CONTENT SOURCES
    // ========================================

    if (
      query.includes(
        "FROM content_sources"
      )
    ) {

      const sources =
        this.getContentSources();


      if (
        query.includes(
          "WHERE subject_id"
        )
      ) {

        const subjectId =
          Number(params[0]);


        return sources

          .filter(
            source =>
              source.subject_id ===
              subjectId
          )

          .sort(
            (a, b) =>
              b.id - a.id
          );

      }


      return [
        ...sources
      ].sort(
        (a, b) =>
          b.id - a.id
      );

    }


    // ========================================
    // CONTENT CHUNKS
    // ========================================

    if (
      query.includes(
        "FROM content_chunks"
      )
    ) {

      const chunks =
        this.getContentChunks();


      if (
        query.includes(
          "WHERE source_id"
        )
      ) {

        const sourceId =
          Number(params[0]);


        return chunks

          .filter(
            chunk =>
              chunk.source_id ===
              sourceId
          )

          .sort(
            (a, b) => {

              if (
                a.chunk_order !==
                b.chunk_order
              ) {

                return (
                  a.chunk_order -
                  b.chunk_order
                );

              }


              return (
                a.id -
                b.id
              );

            }
          );

      }


      return [
        ...chunks
      ];

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
    // CONTENT SOURCE COUNT
    // ========================================

    if (
      query.includes(
        "COUNT(*)"
      ) &&
      query.includes(
        "content_sources"
      )
    ) {

      return {
        count:
          this.getContentSources()
            .length,
      };

    }


    // ========================================
    // CONTENT CHUNK COUNT
    // ========================================

    if (
      query.includes(
        "COUNT(*)"
      ) &&
      query.includes(
        "content_chunks"
      )
    ) {

      return {
        count:
          this.getContentChunks()
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


      return (
        this.getSubjects()
          .find(
            subject =>
              subject.id === id
          )
        || null
      );

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


      return (
        this.getTopics()
          .find(
            topic =>
              topic.id === id
          )
        || null
      );

    }


    // ========================================
    // CONTENT SOURCE BY ID
    // ========================================

    if (
      query.includes(
        "FROM content_sources"
      ) &&
      query.includes(
        "WHERE id"
      )
    ) {

      const id =
        Number(params[0]);


      return (
        this.getContentSources()
          .find(
            source =>
              source.id === id
          )
        || null
      );

    }


    // ========================================
    // CONTENT CHUNK BY ID
    // ========================================

    if (
      query.includes(
        "FROM content_chunks"
      ) &&
      query.includes(
        "WHERE id"
      )
    ) {

      const id =
        Number(params[0]);


      return (
        this.getContentChunks()
          .find(
            chunk =>
              chunk.id === id
          )
        || null
      );

    }


    return null;

  }

}


export const db =
  new WebDatabase();