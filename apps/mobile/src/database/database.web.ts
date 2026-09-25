class WebDatabase {

data:any[] = [];


execSync(query:string){

console.log(
"WEB SQL:",
query
);

}



runSync(
query:string,
params:any[] = []
){

console.log(
query,
params
);


// simulate insert

if(query.includes("subjects")){

this.data.push({

id:this.data.length+1,

name:params[0] || "Machine Learning"

});

}

}



getAllSync(query:string){

return this.data;

}



getFirstSync(query:string){

return {

count:this.data.length

};

}


}


export const db =
new WebDatabase();