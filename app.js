localStorage.clear()

//clear show panel for the next search
function clear_it(){
    document.getElementById("name").innerHTML = ""
    document.getElementById("blog").innerHTML = ""
    document.getElementById("location").innerHTML = ""
    document.getElementById("bio").innerHTML = ""
    document.getElementById("language").innerHTML = ""
}

//check if input is empty and set a default value to show it is empty
function checkEmpty(input){
    if(input==null || input==""){
        input = "---"
    }
    return input
}


async function do_something(){
    //get the username in the input box
    var username = document.getElementById("username").value
    //parsed data
    let user_data = ""
    if(navigator.onLine){ 
        //get user from local storage
        user_item = localStorage.getItem(username)
        //check if user is in the local storage
        if(user_item!=null){
            //user was in local storage
            user_data = user_item
            console.log("username found in local storage")
        }
        else{
            // user was not in the local storage 

            // api address to get user information
            var user_api = "https://api.github.com/users/" + username

            // getting user information from api
            let response = await fetch(user_api)

            //check if input username is valid
            if(response.status == 404){
                //username not found

                //showing error picture
                document.getElementById('profile').src = 'no-results.png'
                clear_it()
                document.getElementById("bio").innerHTML = "User Does Not Exist :(("
                return
            }

            //internet connection error
            if(response.status!= 200){
                //showing error picture
                document.getElementById('profile').src = "error.png"
                clear_it()
                document.getElementById("bio").innerHTML = "No Internet Connection"
            }
            
            //converting recieved response to Json
            let json_response = await response.json();

            //converting Json format to string
            user_data = JSON.stringify(json_response)

            // var fullname = user_data.name
            localStorage.setItem(username,user_data)
            console.log("read from github")
        }

        //parsing string data
        user_data = JSON.parse(user_data)
                    
        // api address to get username repositories
        var repository_api = `https://api.github.com/users/${username}/repos?per_page=5&sort=pushed`

        //getting username repositories
        var repositories_response = await fetch(repository_api)

        //converting the response to json format
        const user_repositories = await repositories_response.json()
        
        //Array to store languages that user used 
        const user_languages = []; 
        
        //the language that user has been used the most
        var most_used_language = ''

        //loop on user repositories
        for (let i = 0; i < user_repositories.length; i++) { 
            //get the ith repository
            const obj = user_repositories[i];
            const langs = await fetch(obj.languages_url)
            const lang = await langs.json()

             // add languages to array
            user_languages.push(lang);
        }

        let max = -1;
        let language = '';

        // get most used language
        for (let j = 0; j < user_languages.length; j++) {
            const obj = user_languages[j]; // get languages
            for (const key in obj) { // loop through languages
                if (obj.hasOwnProperty(key)) { // check if language is in object
                    const value = obj[key]; // get value of language
                    if (value > max) { // check if value is greater than max
                        max = value; // set max to value
                        language = key; // set max_lang to key
                    }
                }
            }
        }

        //set the most used language
        most_used_language = language
        console.log(most_used_language)
                        

        //setting user fields
        var name = user_data.name
        var blog = user_data.blog
        var location = user_data.location
        var image_address = user_data.avatar_url
        var user_bio = user_data.bio

        // check if there is /n in user bio
        if (user_bio != null){
            user_bio = user_bio.replace(/(?:\r\n|\r|\n)/g, "<br>");
        }

        //showing user informations
        document.getElementById("profile").src = image_address
        name = checkEmpty(name)
        document.getElementById("name").innerHTML = "Name : " + name
        console.log(blog=="")
        blog = checkEmpty(blog)
        document.getElementById("blog").innerHTML = "Blog : " + blog
        location = checkEmpty(location)
        document.getElementById("location").innerHTML = "Location : " + location
        user_bio = checkEmpty(user_bio)
        document.getElementById("bio").innerHTML = "Bio : " + user_bio
        most_used_language = checkEmpty(most_used_language)
        document.getElementById("language").innerHTML = "Most used language : " + most_used_language
                    

    }
    else{
        document.getElementById('profile').src = "error.png"
        clear_it()
    }
}