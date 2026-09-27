import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";

import { useState } from "react";

import { useRouter } from "expo-router";

import {
  addSubject,
} from "../../database/repository";


export default function AddSubject() {

  const router = useRouter();


  const [name, setName] =
    useState("");


  const [description, setDescription] =
    useState("");


  const [error, setError] =
    useState("");


  function saveSubject() {

    const cleanName =
      name.trim();

    const cleanDescription =
      description.trim();


    if (!cleanName) {

      setError(
        "Subject name is required."
      );

      return;

    }


    if (cleanName.length < 3) {

      setError(
        "Subject name must contain at least 3 characters."
      );

      return;

    }


    addSubject(
      cleanName,
      cleanDescription
    );


    setError("");


    router.back();

  }


  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Add Subject
      </Text>


      <Text style={styles.label}>
        Subject Name
      </Text>


      <TextInput

        style={styles.input}

        placeholder="Example: Machine Learning"

        value={name}

        onChangeText={setName}

      />


      <Text style={styles.label}>
        Description
      </Text>


      <TextInput

        style={[
          styles.input,
          styles.descriptionInput,
        ]}

        placeholder="Enter subject description"

        value={description}

        onChangeText={setDescription}

        multiline

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

        onPress={saveSubject}

      >

        <Text style={styles.saveButtonText}>
          SAVE SUBJECT
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


const styles = StyleSheet.create({

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


  descriptionInput: {

    minHeight: 100,

    textAlignVertical: "top",

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