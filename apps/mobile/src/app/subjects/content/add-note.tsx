import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

import {
  useState,
} from "react";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import {
  addContentSource,
  addContentChunk,
  getSubjectById,
  getTopicsBySubject,
} from "../../../database/repository";


export default function AddStudyNoteScreen() {

  const router = useRouter();

  const params =
    useLocalSearchParams();

  const subjectId =
    Number(params.subjectId);


  const subject: any =
    getSubjectById(subjectId);


  const topics: any[] =
    getTopicsBySubject(
      subjectId
    ) as any[];


  const [title, setTitle] =
    useState("");

  const [noteText, setNoteText] =
    useState("");

  const [selectedTopicId, setSelectedTopicId] =
    useState<number | null>(null);

  const [error, setError] =
    useState("");


  function saveNote() {

    const cleanTitle =
      title.trim();

    const cleanNote =
      noteText.trim();


    if (
      !subjectId ||
      Number.isNaN(subjectId)
    ) {

      setError(
        "Invalid subject."
      );

      return;

    }


    if (!cleanTitle) {

      setError(
        "Title is required."
      );

      return;

    }


    if (
      cleanTitle.length < 3
    ) {

      setError(
        "Title must contain at least 3 characters."
      );

      return;

    }


    if (!cleanNote) {

      setError(
        "Study note is required."
      );

      return;

    }


    if (
      cleanNote.length < 10
    ) {

      setError(
        "Study note must contain at least 10 characters."
      );

      return;

    }


    if (
      selectedTopicId === null
    ) {

      setError(
        "Please select a topic."
      );

      return;

    }



    const result: any =
      addContentSource(
        subjectId,
        cleanTitle,
        "USER_NOTE"
      );


    const sourceId =
      Number(
        result?.lastInsertRowId
      );


    if (
      !sourceId ||
      Number.isNaN(sourceId)
    ) {

      if (
        typeof window !== "undefined"
      ) {

        window.alert(
          "Could not create the study note."
        );

      }
      else {

        Alert.alert(
          "Error",
          "Could not create the study note."
        );

      }

      return;

    }


    addContentChunk(
      sourceId,
      selectedTopicId,
      cleanNote,
      1
    );


    setError("");


    router.back();

  }


  if (!subject) {

    return (

      <View style={styles.container}>

        <Text style={styles.errorText}>
          Subject not found.
        </Text>

      </View>

    );

  }


  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.contentContainer
      }
      keyboardShouldPersistTaps="handled"
    >

      <Pressable

        style={styles.backButton}

        onPress={() =>
          router.back()
        }

      >

        <Text style={styles.backButtonText}>
          ← Back
        </Text>

      </Pressable>


      <Text style={styles.title}>
        Add Study Note
      </Text>


      <Text style={styles.subjectText}>
        Subject: {subject.name}
      </Text>


      <Text style={styles.label}>
        Title
      </Text>


      <TextInput

        style={styles.input}

        placeholder="Example: Introduction to Classification"

        value={title}

        onChangeText={(text) => {

          setTitle(text);

          if (error) {
            setError("");
          }

        }}

      />


      <Text style={styles.label}>
        Topic
      </Text>


      {
        topics.length === 0
        ?
        (
          <Text style={styles.noTopicsText}>
            No topics available. Add a topic first.
          </Text>
        )
        :
        (
          <View style={styles.topicList}>

            {
              topics.map((topic) => (

                <Pressable

                  key={topic.id}

                  style={[
                    styles.topicOption,

                    selectedTopicId === topic.id
                      ? styles.topicOptionSelected
                      : null,
                  ]}

                  onPress={() => {

                    setSelectedTopicId(
                      topic.id
                    );

                    if (error) {
                      setError("");
                    }

                  }}

                >

                  <Text
                    style={[
                      styles.topicOptionText,

                      selectedTopicId === topic.id
                        ? styles.topicOptionTextSelected
                        : null,
                    ]}
                  >
                    {topic.name}
                  </Text>

                </Pressable>

              ))
            }

          </View>
        )
      }


      <Text style={styles.label}>
        Study Note
      </Text>


      <TextInput

        style={styles.noteInput}

        placeholder="Enter your study notes here..."

        value={noteText}

        onChangeText={(text) => {

          setNoteText(text);

          if (error) {
            setError("");
          }

        }}

        multiline

        textAlignVertical="top"

      />


      {
        error
        ?
        (
          <Text style={styles.error}>
            {error}
          </Text>
        )
        :
        null
      }


      <Pressable

        style={styles.saveButton}

        onPress={saveNote}

      >

        <Text style={styles.saveButtonText}>
          SAVE NOTE
        </Text>

      </Pressable>


      <Pressable

        style={styles.cancelButton}

        onPress={() =>
          router.back()
        }

      >

        <Text style={styles.cancelButtonText}>
          Cancel
        </Text>

      </Pressable>

    </ScrollView>

  );

}


const styles =
StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: "#f5f5f5",

  },


  contentContainer: {

    padding: 20,

  },


  backButton: {

    alignSelf: "flex-start",

    marginBottom: 15,

  },


  backButtonText: {

    fontSize: 16,

    color: "#2563eb",

    fontWeight: "600",

  },


  title: {

    fontSize: 28,

    fontWeight: "bold",

    marginBottom: 8,

  },


  subjectText: {

    fontSize: 16,

    color: "#666",

    marginBottom: 25,

  },


  label: {

    fontSize: 16,

    fontWeight: "600",

    marginBottom: 8,

  },


  input: {

    backgroundColor: "white",

    borderWidth: 1,

    borderColor: "#ddd",

    borderRadius: 8,

    padding: 12,

    fontSize: 16,

    marginBottom: 20,

  },


  topicList: {

    marginBottom: 20,

  },


  topicOption: {

    backgroundColor: "white",

    borderWidth: 1,

    borderColor: "#ddd",

    borderRadius: 8,

    padding: 12,

    marginBottom: 8,

  },


  topicOptionSelected: {

    borderColor: "#2563eb",

    borderWidth: 2,

  },


  topicOptionText: {

    fontSize: 16,

    color: "#333",

  },


  topicOptionTextSelected: {

    color: "#2563eb",

    fontWeight: "700",

  },


  noTopicsText: {

    color: "#b91c1c",

    marginBottom: 20,

  },


  noteInput: {

    backgroundColor: "white",

    borderWidth: 1,

    borderColor: "#ddd",

    borderRadius: 8,

    padding: 12,

    fontSize: 16,

    minHeight: 220,

    marginBottom: 15,

  },


  error: {

    color: "#b91c1c",

    fontSize: 14,

    marginBottom: 15,

  },


  saveButton: {

    backgroundColor: "#2563eb",

    padding: 15,

    borderRadius: 8,

    alignItems: "center",

  },


  saveButtonText: {

    color: "white",

    fontSize: 16,

    fontWeight: "bold",

  },


  cancelButton: {

    marginTop: 12,

    padding: 15,

    alignItems: "center",

  },


  cancelButtonText: {

    color: "#555",

    fontSize: 16,

  },


  errorText: {

    marginTop: 50,

    textAlign: "center",

    fontSize: 18,

    color: "#b91c1c",

  },

});