import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";

import {
  useState,
} from "react";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import {
  addTopic,
} from "../../database/repository";


export default function AddTopic() {

  const router = useRouter();

  const params =
    useLocalSearchParams();

  const subjectId =
    Number(params.subjectId);


  const [name, setName] =
    useState("");

  const [error, setError] =
    useState("");


  function saveTopic() {

    const cleanName =
      name.trim();


    if (!cleanName) {

      setError(
        "Topic name is required."
      );

      return;

    }


    if (cleanName.length < 3) {

      setError(
        "Topic name must contain at least 3 characters."
      );

      return;

    }


    if (
      !subjectId ||
      Number.isNaN(subjectId)
    ) {

      setError(
        "Invalid subject."
      );

      return;

    }


    addTopic(
      subjectId,
      cleanName
    );


    setError("");


    router.back();

  }


  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Add Topic
      </Text>


      <Text style={styles.label}>
        Topic Name
      </Text>


      <TextInput

        style={styles.input}

        placeholder="Example: Classification"

        value={name}

        onChangeText={setName}

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

        onPress={saveTopic}

      >

        <Text style={styles.saveButtonText}>
          SAVE TOPIC
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

    </View>

  );

}


const styles =
StyleSheet.create({

  container: {

    flex: 1,

    padding: 20,

    backgroundColor: "#f5f5f5",

  },


  title: {

    fontSize: 28,

    fontWeight: "bold",

    marginBottom: 30,

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


  error: {

    marginBottom: 15,

    fontSize: 14,

    color: "#b91c1c",

  },


  saveButton: {

    backgroundColor: "#2563eb",

    padding: 15,

    borderRadius: 8,

    alignItems: "center",

  },


  saveButtonText: {

    color: "white",

    fontWeight: "bold",

    fontSize: 16,

  },


  cancelButton: {

    marginTop: 15,

    padding: 15,

    alignItems: "center",

  },


  cancelButtonText: {

    color: "#555",

    fontSize: 16,

  },

});