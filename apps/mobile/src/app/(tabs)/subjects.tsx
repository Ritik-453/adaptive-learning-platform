import {
View,
Text,
FlatList
}
from "react-native";


import {getSubjects}
from "../../database/repository";


export default function Subjects(){


const subjects:any =
getSubjects();



return (

<View>


<FlatList

data={subjects}

keyExtractor={(item)=>item.id.toString()}


renderItem={({item})=>(

<Text>

{item.name}

</Text>

)}

/>


</View>

);


}