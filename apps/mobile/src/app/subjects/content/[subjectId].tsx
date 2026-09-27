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
  getContentSourcesBySubject,
  deleteContentSource,
} from "../../../database/repository";


export default function SubjectContentScreen() {

  const router = useRouter();

  const params =
    useLocalSearchParams();

  const subjectId =
    Number(params.subjectId);


  const subject: any =
    getSubjectById(subjectId);


  const [contentSources, setContentSources] =
    useState<any[]>([]);


  function loadContent() {

    if (
      !subjectId ||
      Number.isNaN(subjectId)
    ) {
      return;
    }


    const data =
      getContentSourcesBySubject(
        subjectId
      ) as any[];


    setContentSources(data);

  }

  function performDelete(
    id: number
  ) {

    deleteContentSource(id);

    loadContent();

  }


  function confirmDelete(
    id: number,
    title: string
  ) {

    // WEB
    if (
      Platform.OS === "web"
    ) {

      const confirmed =
        window.confirm(
          `Delete study material "${title}"?`
        );


      if (confirmed) {

        performDelete(id);

      }


      return;

    }


    // ANDROID / IOS
    Alert.alert(

      "Delete Study Material",

      `Are you sure you want to delete "${title}"?`,

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


  useFocusEffect(

    useCallback(() => {

      loadContent();

    }, [subjectId])

  );


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
        Study Material
      </Text>


      <Text style={styles.subjectName}>
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


      <View style={styles.sectionHeader}>

        <Text style={styles.sectionTitle}>
          Content Sources
        </Text>


        <Pressable

          style={styles.addButton}

          onPress={() =>
            router.push({
              pathname:
                "/subjects/content/add-note",

              params: {
                subjectId:
                  String(subjectId),
              },
            })
          }

        >

          <Text style={styles.addButtonText}>
            + Add Note
          </Text>

        </Pressable>

      </View>

      <FlatList

        data={contentSources}

        keyExtractor={(item) =>
          item.id.toString()
        }

        contentContainerStyle={
          contentSources.length === 0
            ? styles.emptyListContainer
            : undefined
        }

        ListEmptyComponent={

          <View style={styles.emptyContainer}>

            <Text style={styles.emptyTitle}>
              No study material yet
            </Text>

            <Text style={styles.emptyText}>
              Study notes and learning material for this subject will appear here.
            </Text>

          </View>

        }

        renderItem={({ item }) => (

          <View style={styles.contentCard}>

            <View style={styles.contentInfo}>

              <Text style={styles.contentTitle}>
                {item.title}
              </Text>


              <Text style={styles.sourceType}>
                Type: {item.source_type || "TEXT"}
              </Text>


              {
                item.approval_status
                ?
                (
                  <Text style={styles.statusText}>
                    Status: {item.approval_status}
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
                  item.title
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

    marginBottom: 5,

  },


  subjectName: {

    fontSize: 20,

    fontWeight: "600",

    color: "#333",

    marginBottom: 5,

  },


  description: {

    fontSize: 15,

    color: "#666",

    marginBottom: 25,

  },


  sectionHeader: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginTop: 15,

    marginBottom: 15,

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


  sectionTitle: {

    fontSize: 22,

    fontWeight: "bold",

  },


  contentCard: {

    backgroundColor: "white",

    padding: 16,

    borderRadius: 10,

    marginBottom: 12,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

  },


  contentInfo: {

    flex: 1,

    marginRight: 12,

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


  contentTitle: {

    fontSize: 18,

    fontWeight: "600",

    marginBottom: 7,

  },


  sourceType: {

    fontSize: 14,

    color: "#555",

  },


  statusText: {

    fontSize: 13,

    color: "#777",

    marginTop: 4,

  },


  emptyListContainer: {

    flexGrow: 1,

  },


  emptyContainer: {

    marginTop: 40,

    alignItems: "center",

    paddingHorizontal: 20,

  },


  emptyTitle: {

    fontSize: 18,

    fontWeight: "600",

    marginBottom: 8,

  },


  emptyText: {

    fontSize: 15,

    color: "#777",

    textAlign: "center",

    lineHeight: 22,

  },


  errorText: {

    marginTop: 50,

    textAlign: "center",

    fontSize: 18,

    color: "#b91c1c",

  },

});