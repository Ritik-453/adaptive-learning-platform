import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
} from "react-native";

import {
  useCallback,
  useState,
} from "react";

import {
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import {
  getSubjectById,
  getTopicsBySubject,
  deleteTopic,
} from "../../database/repository";


export default function SubjectDetails() {

  const router = useRouter();

  const params =
    useLocalSearchParams();

  const subjectId =
    Number(params.subjectId);


  const subject: any =
    getSubjectById(subjectId);


  const [topics, setTopics] =
    useState<any[]>([]);


  function loadTopics() {

    const data =
      getTopicsBySubject(
        subjectId
      ) as any[];

    setTopics(data);

  }


  useFocusEffect(

    useCallback(() => {

      loadTopics();

    }, [subjectId])

  );


  function performDelete(
    id: number
  ) {

    deleteTopic(id);

    loadTopics();

  }


  function confirmDelete(
    id: number,
    name: string
  ) {

    // WEB
    if (Platform.OS === "web") {

      const confirmed =
        window.confirm(
          `Delete topic "${name}"?`
        );

      if (confirmed) {

        performDelete(id);

      }

      return;

    }


    // ANDROID / IOS
    Alert.alert(

      "Delete Topic",

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

    <View style={styles.container}>

      <Text style={styles.title}>
        {subject.name}
      </Text>


      {
        subject.description
        ?
        (
          <Text style={styles.description}>
            {subject.description}
          </Text>
        )
        :
        null
      }


      <View style={styles.topicHeader}>

        <Text style={styles.sectionTitle}>
          Topics
        </Text>


        <Pressable

          style={styles.addButton}

          onPress={() =>
            router.push({
              pathname: "/subjects/add-topic",
              params: {
                subjectId:
                  String(subjectId),
              },
            })
          }

        >

          <Text style={styles.addButtonText}>
            + Add Topic
          </Text>

        </Pressable>

      </View>


      <FlatList

        data={topics}

        keyExtractor={(item) =>
          item.id.toString()
        }

        contentContainerStyle={
          topics.length === 0
            ? styles.emptyListContainer
            : undefined
        }

        ListEmptyComponent={

          <Text style={styles.emptyText}>
            No topics available.
          </Text>

        }

        renderItem={({ item }) => (

          <View style={styles.topicCard}>

            <View style={styles.topicInfo}>

              <Text style={styles.topicName}>
                {item.name}
              </Text>


              {
                item.mastery_score !== undefined
                ?
                (
                  <Text style={styles.masteryText}>
                    Mastery: {item.mastery_score}%
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

              <Text style={styles.deleteButtonText}>
                Delete
              </Text>

            </Pressable>

          </View>

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


  title: {

    fontSize: 28,

    fontWeight: "bold",

    marginBottom: 8,

  },


  description: {

    fontSize: 16,

    color: "#666",

    marginBottom: 25,

  },


  topicHeader: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 15,

  },


  sectionTitle: {

    fontSize: 22,

    fontWeight: "bold",

  },


  addButton: {

    backgroundColor: "#2563eb",

    paddingVertical: 9,

    paddingHorizontal: 12,

    borderRadius: 8,

  },


  addButtonText: {

    color: "white",

    fontWeight: "bold",

  },


  topicCard: {

    backgroundColor: "white",

    padding: 16,

    borderRadius: 10,

    marginBottom: 12,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

  },


  topicInfo: {

    flex: 1,

    marginRight: 12,

  },


  topicName: {

    fontSize: 17,

    fontWeight: "600",

  },


  masteryText: {

    marginTop: 5,

    fontSize: 14,

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


  emptyListContainer: {

    flexGrow: 1,

  },


  emptyText: {

    marginTop: 20,

    textAlign: "center",

    color: "#777",

  },


  errorText: {

    marginTop: 50,

    textAlign: "center",

    fontSize: 18,

    color: "#b91c1c",

  },

});