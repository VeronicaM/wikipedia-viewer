$(function () 
 {
     let lang="en",
     isRandom =false,
     searchTerm="";
     

	 $(".searchbox").autocomplete({
		source: function (request, response) {
		 jQuery.getJSON(
			"./functions.php?autocomplete=true&q="+request.term+"&lang="+lang,
			function (data) {
			   response(data);
			   isRandom=false;
			}
		 );
		},
		minLength: 3,
		select: function (event, ui) {
			searchTerm = ui.item.value;
		   getWikiInfo(searchTerm);	
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
 				reset();
			});
			$(".languages a").click(function(e){
 				lang=e.currentTarget.id;
 				$('.languages a').removeClass('active')
 				 $(this).addClass("active");
 				 if(isRandom){
 				 	getRandomWikis();
 				 }
 				 else if(searchTerm !==""){
 					getWikiInfo(searchTerm);
 				 }
			});
	  });
	 
	function reset(){
		 $("#wikiInfo").html("");
 		 $(".searchbox").val("");
 		 searchTerm = "";
 		 isRandom = false;	
	}   

	function getWikiInfo(query){
			$.getJSON("./functions.php?search="+query+"&lang="+lang, function(result){
				  $("#container").removeClass("beforeSearch").addClass("afterSearch");
			      let template = $("#searchResults").html();
			      let compiledTemplate = Handlebars.compile(template);
			      $("#wikiInfo").html(compiledTemplate(result));
			});
	}
	
	 function getRandomWikis(){
	 		  isRandom = true;
	 	      let template = $("#randomResults").html();
		      let compiledTemplate = Handlebars.compile(template);
		       let mockA = Array.apply(null, Array(5)).map(function (x, i) { return {lang:lang}; });
		      
		       let placeholder = {wikis:mockA};
		      $("#wikiInfo").html(compiledTemplate(placeholder));
	 }
   
});
