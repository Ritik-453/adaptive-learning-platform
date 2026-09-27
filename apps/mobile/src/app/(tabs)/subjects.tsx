import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";

import {
  useCallback,
  useState,
} from "react";

import {
  useFocusEffect,
  useRouter,
} from "expo-router";

import {
  getSubjects,
  deleteSubject,
} from "../../database/repository";


export default function Subjects() {

  const router = useRouter();

  const [subjects, setSubjects] =
    useState<any[]>([]);


  function loadSubjects() {

    const data: any =
      getSubjects();

    setSubjects(data);

  }


  useFocusEffect(

    useCallback(() => {

      loadSubjects();

    }, [])

  );


  function performDelete(
    id: number
  ) {

    deleteSubject(id);

    loadSubjects();

  }


  function confirmDelete(
    id: number,
    name: string
  ) {

    // WEB
    if (Platform.OS === "web") {

      const confirmed =
        window.confirm(
          `Delete "${name}"?`
        );

      if (confirmed) {

        performDelete(id);

      }

      return;

    }


    // ANDROID / IOS
    Alert.alert(

      "Delete Subject",

      `Are you sure you want to delete "${name}"?`,

      [

        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Delete",
          style: "destructive",

          onPress: () => {

            performDelete(id);

          },

        },

      ]

    );

  }


  return (

    <View style={styles.container}>

      <View style={styles.header}>

        <Text style={styles.title}>
          Subjects
        </Text>


        <Pressable

          style={styles.addButton}

          onPress={() =>
            router.push("/add-subject")
          }

        >

          <Text
            style={styles.addButtonText}
          >
            + Add Subject
          </Text>

        </Pressable>

      </View>


      <FlatList

        data={subjects}

        keyExtractor={(item) =>
          item.id.toString()
        }

        ListEmptyComponent={

          <Text style={styles.emptyText}>

            No subjects available.

          </Text>

        }

        renderItem={({ item }) => (

          <Pressable
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/subjects/[subjectId]",
                  params: {
                    subjectId: String(item.id),
                  },
                })
              }
            >

            <View style={styles.cardContent}>

              <View style={styles.subjectInfo}>

                <Text
                  style={styles.subjectName}
                >
                  {item.name}
                </Text>


                {
                  item.description
                  ?
                  (
                    <Text
                      style={styles.description}
                    >
                      {item.description}
                    </Text>
                  )
                  :
                  null
                }

              </View>


              <Pressable

                style={styles.deleteButton}

                onPress={() =>
                  confirmDelete(
                    item.id,
                    item.name
                  )
                }

              >

                <Text
                  style={styles.deleteButtonText}
                >
                  Delete
                </Text>

              </Pressable>

            </View>

          </Pressable>

        )}

      />

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


  header: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 20,

  },


  title: {

    fontSize: 28,

    fontWeight: "bold",

  },


  addButton: {

    backgroundColor: "#2563eb",

    paddingVertical: 10,

    paddingHorizontal: 14,

    borderRadius: 8,

  },


  addButtonText: {

    color: "white",

    fontWeight: "bold",

  },


  card: {

    backgroundColor: "white",

    padding: 16,

    marginBottom: 12,

    borderRadius: 10,

  },


  cardContent: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

  },


  subjectInfo: {

    flex: 1,

    marginRight: 12,

  },


  subjectName: {

    fontSize: 18,

    fontWeight: "bold",

  },


  description: {

    marginTop: 5,

    color: "#666",

  },


  deleteButton: {

    backgroundColor: "#dc2626",

    paddingVertical: 8,

    paddingHorizontal: 12,

    borderRadius: 7,

  },


  deleteButtonText: {

    color: "white",

    fontWeight: "600",

  },


  emptyText: {

    marginTop: 30,

    textAlign: "center",

    color: "#777",

  },

});