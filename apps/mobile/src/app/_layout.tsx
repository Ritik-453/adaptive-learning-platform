import { Stack } from "expo-router";
import { initializeDatabase } from "../database/init";


initializeDatabase();


export default function RootLayout(){

return (

<Stack>

<Stack.Screen
name="(tabs)"
options={{
headerShown:false
}}
/>

</Stack>

);

}