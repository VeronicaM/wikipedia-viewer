  <?php
      session_start();
      function getWikiInfo(){
      
           $wikiInfo = file_get_contents("https://".$_GET['lang'].".wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=".urlencode($_GET['search']));
               
           $response = json_decode($wikiInfo);
           return $response;
    }
    function getAutocomplete(){
            $response = file_get_contents("http://".$_GET['lang'].".wikipedia.org/w/api.php?action=opensearch&datatype=jsonp&format=json&search=".$_GET['q']);
            $response = json_decode($response);
           return $response;
    }

    function getTrivia(){
        $categories = array(17,10,19,18,20,22,23,27, 30, 31, 32);
        $category= $categories[rand(0,11)];
        $response = file_get_contents("https://opentdb.com/api.php?amount=".$_GET['num']."&difficulty=easy&type=multiple&encode=url3986&category=".$category);
        $response = json_decode($response,true);
        $_SESSION["trivia"] = $response;
        $result = array();
        for($i=0;$i<count($response["results"]);$i++){
           $result[$i]["question"] = $response["results"][$i]["question"];
           $result[$i]["choices"] = $response["results"][$i]["incorrect_answers"];
           array_push($result[$i]["choices"],$response["results"][$i]["correct_answer"]);
           shuffle($result[$i]["choices"]);
        }
        return json_encode($result);
   }
   function checkTrivia(){
       if($_SESSION["trivia"]["results"][$_GET['triviaId']]["correct_answer"]  == $_GET['triviaAnswer']){
         return true;
       }
       else return $_SESSION["trivia"]["results"][$_GET['triviaId']]["correct_answer"];
   }
   function getImageURL(){
      $response = file_get_contents("https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&format=json&iiprop=url|size&iiurlwidth=120&iiurlheight=120&titles=File:".$_GET['img']);
            $response = json_decode($response);
           return $response;
   }
    if(isset($_GET['autocomplete'])){
      echo json_encode(getAutocomplete()[1]);
    }
    else if(isset($_GET['img'])){
      echo json_encode(getImageURL());
    }
    else if(isset($_GET['trivia'])){
      echo getTrivia();
    }
    else if(isset($_GET['checkTrivia'])){
      echo checkTrivia();
    }
    else {
      echo json_encode(getWikiInfo());  
     } 
?>
