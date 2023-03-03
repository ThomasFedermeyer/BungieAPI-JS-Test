


// API KEY
// 
// NOTE: 
//    I dont care about hiding it since it set to public on the 
//    application board and it has no power unlike my other one :)
// 
const apiKey = "242e5a42ff81470eb55c3c604864a019";

/**
 * # looks up the PlayerInfo given Username and UserNameCode #
 * @param {*} UserName The Player Name (test#000 - > test)
 * @param {*} UserNameCode The Player Code (test#000 - > 000)
 */
function ValidatePlayer(UserName, UserNameCode){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayerByBungieName/-1/", true);
    xhr.setRequestHeader("X-API-Key", apiKey);
    xhr.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            var json = JSON.parse(this.responseText);
            var response = json.Response;
            var succes = false;
            // 
            // Finds first vaild membershipId
            // 
            // NOTE:
            //    All membershipId for the user work fine Bungie is just 
            //    quirky and give each platform thier own membershipId 🤷
            // 
            for(thing in response) {
                try{
                    membershipId = response[thing].membershipId 
                    membershipType= response[thing].membershipType
                    //    
                    // NOTE:
                    //  lookUserCharacterData shoudnt be called yet only using it for testing
                    // 
                    lookUserCharacterData(membershipType, membershipId)
                    succes = true;
                    break;
                }   
                catch{
                    console.log("Nothing was found");
                }
            }

            // prints either success or failure based if there is a vaild user with the id
            if(succes == true){
                // ############################################################################
                // #                                                                          #
                // #    PASS INFO TO THE NEXT SCREEN AND RUN lookUserCharacterData ON LOAD    #
                // #                                                                          #
                // ############################################################################
                console.log("success on: " + UserName + "#" + UserNameCode + "\n"
                        + "    membershipId: " + membershipId + "\n"
                        + "    membershipType: " + membershipType);
            }
            else{
                console.log("Failure on: " + UserName + "#" + UserNameCode);
            }
        }
    }
    xhr.send(JSON.stringify({'displayName': UserName, 'displayNameCode': UserNameCode}));
}

/**
 * # looks up the character info given type and ID #
 * @param {*} membershiptype The Player membershiptype (you get it from ValidatePlayer)
 * @param {*} membershipId The Player membershipId (you get it from ValidatePlayer)
 */
function lookUserCharacterData(membershiptype, membershipId){
    let URL = "https://www.bungie.net/Platform/Destiny2/" + membershipType + "/Profile/" + membershipId + "/?components=200"
    var xhr = new XMLHttpRequest();
    xhr.open("GET", URL, true);
    xhr.setRequestHeader("X-API-Key", apiKey);
    xhr.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            var json = JSON.parse(this.responseText);
            var response = json.Response;
            parsePlayerInfo(response);
        }
    }  
    xhr.send();
}


/**
 * # parses the the important character info from the players info
 * @param {*} playerResponse resonse from lookUserCharacterData
 */
function parsePlayerInfo(playerResponse) {
    let character = playerResponse.characters.data;
    var charactersInfo = [];
    var index = 0
    var characterclass;

    // matches the classhash to class name
    for(thing in character){
        let classHash = character[thing].classHash;
        if(classHash == 2271682572) {
            characterclass = "Warlock";
        }
        else if(classHash == 671679327) {
            characterclass = "Hunter";
        }
        else if(classHash == 3655393761) {
            characterclass = "Titan";
        }
        characterJson = {
            "Class": characterclass,
            "Light":character[thing].light,
            "emblemBackgroundPath": "https://www.bungie.net" + character[thing].emblemBackgroundPath
        }
        charactersInfo.push(characterJson)
    }
    console.log(charactersInfo);
    // ##################################################################
    // #                                                                #
    // #   CALL FUNCTION TO UPDATE PLAYER BANNERS WITH characterInfo    #
    // #                                                                #
    // ##################################################################
}
    




// ##################################################################
// #                                                                #
// #                   ---------TESTS---------                      #
// #                                                                #
// ##################################################################
function test(){
   
    // 
    // NOTE:
    //    the logs are out of order because the requests are async but 
    //    there will only be one check at a time in the final priduct
    // 
     // VALID USERNAME
    ValidatePlayer("TStarWars", "8313");
    ValidatePlayer("lazicclan", "6089");

    // INVALID USERNAME
    ValidatePlayer("TStarWars", "1234");
    ValidatePlayer("thisIsNotAUserName", "0000");
}

test()