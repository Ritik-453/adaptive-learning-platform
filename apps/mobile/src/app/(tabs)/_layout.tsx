import { Tabs } from "expo-router";


export default function TabLayout(){

return (

<Tabs>

<Tabs.Screen
name="index"
options={{
title:"Home"
}}
/>


<Tabs.Screen
name="subjects"
options={{
title:"Subjects"
}}
/>


<Tabs.Screen
name="quiz"
options={{
title:"Quiz"
}}
/>


<Tabs.Screen
name="progress"
options={{
title:"Progress"
}}
/>


<Tabs.Screen
name="settings"
options={{
title:"Settings"
}}
/>


</Tabs>

);

}