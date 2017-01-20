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
        $_SESSION['trivia'] = array();
        $categories = array(10,17,18,19,20,22,23,27,30,31,32);
        $categories_names = array("Books","Scientists","Computers","Mathematics","Mythology","Geography","History","Animals","Electronics","Anime","Animation");
        $result = array();
        for($i=0;$i<$_GET["num"];$i++){
           $randomNum = rand(0,10);
           $categoryNum= $categories[$randomNum];
           $categoryName = $categories_names[$randomNum];
           $response = file_get_contents("https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple&encode=url3986&category=".$categoryNum);
           array_push($_SESSION["trivia"], $response);
           $response = json_decode($response,true);

           if($_GET['lang']!=="en"){
              $question = translateYandex($response["results"][0]["question"]);
           }else{
               $question= $response["results"][0]["question"];
           }
  
           $result[$i]["question"] = $question;
           if($_GET['lang']!=="en"){
              $result[$i]["choices"] = array();
             for($j=0;$j<count($response["results"][0]["incorrect_answers"]);$j++){ 

                 array_push($result[$i]["choices"],translateYandex($response["results"][0]["incorrect_answers"][$j])); 
             }
              array_push($result[$i]["choices"],translateYandex($response["results"][0]["correct_answer"]));
           }
           else{
            $result[$i]["choices"] = $response["results"][0]["incorrect_answers"];
            array_push($result[$i]["choices"],$response["results"][0]["correct_answer"]);
           }
           shuffle($result[$i]["choices"]);
           $result[$i]["category"] = $categoryName;
        }
        return json_encode($result);
   }

   function translateYandex($t=""){

     $url = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170117T100740Z.47998d3b7c7cf041.d2ad568069da066ac21c64c7ec4f74d251d46251&text=".$t."&lang=".$_GET['lang']."&format=plain";
       $response = file_get_contents($url);
        $response = $response;
        return $response;
   }
   function checkTrivia(){
        $question = json_decode($_SESSION["trivia"][$_GET['triviaId']],true); 
        $answer = urldecode($question['results'][0]['correct_answer']); 
        $check = 0;
        if($_GET['lang']!=="en"){
              $answer = translateYandex($answer);
            //  $ans = substr($_GET['triviaAnswer'],strpos($_GET['triviaAnswer'],'text'));
              $check = strpos($answer,$_GET['triviaAnswer']) > 0; 
        }
        else{
          $check = $answer == $_GET['triviaAnswer'];   
        }
       if( $check == 1){
         return json_encode("correct");
       }
       else{
         return json_encode("incorrect") ;
       } 
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
