$(function () 
 {
          
	 $(".searchbox").autocomplete({
		source: function (request, response) {
		 jQuery.getJSON(
			"./functions.php?autocomplete=true&q="+request.term,
			function (data) {
			   response(data);
			}
		 );
		},
		minLength: 3,
		select: function (event, ui) {
		   getWikiInfo(ui.item.value);	
		   return false;
		}
	 });

	$(".searchbox").autocomplete("option", "delay", 100);
	  
	  
	  $(document).ready(function(){
		    $('.searchbox').keyup(function(e){
			      if(e.keyCode == 13)
				    {
				       getWikiInfo(e.currentTarget.value);
				    }
			});
			$("#randomWikis").click(function(e){
 				getRandomWikis();
			});
			$("#refresh").click(function(e){
 				 $("#wikiInfo").html("");
 				 $(".searchbox").val("");
			});
	  });
	 
	   


	function getWikiInfo(query){
			$.getJSON("./functions.php?search="+query, function(result){
				console.log('result',result);
				  $("#container").removeClass("beforeSearch").addClass("afterSearch");
			      let template = $("#searchResults").html();
			      let compiledTemplate = Handlebars.compile(template);
			      $("#wikiInfo").html(compiledTemplate(result));
			});
	}
	
	 function getRandomWikis(){
	 	      let template = $("#randomResults").html();
		      let compiledTemplate = Handlebars.compile(template);
		       let mockA = Array.apply(null, Array(30)).map(function (x, i) { return i; });
		       let placeholder = {wikis:mockA};
		      $("#wikiInfo").html(compiledTemplate(placeholder));
	 }

     
    
     
});
