  <?php
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
    else {
      echo json_encode(getWikiInfo());  
     } 
?>
