import * as SQLite from "expo-sqlite";


export const db =
SQLite.openDatabaseSync(
  "adaptive_learning.db"
);