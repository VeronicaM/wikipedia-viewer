$(function () 
 {
     let lang="",
	     isRandom =false,
	     searchTerm="",
	     languages=["en","fr","ru","sv","ja","ro","it","es"];
     

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

  
	  
	  $(document).ready(function(){
		    $('.searchbox').keyup(function(e){
			      if(e.keyCode == 13)
				    {
				       getWikiInfo(e.currentTarget.value);
				    }
			});
		
		//	$('body').css("background-image","url('public/images/newspaper_texture"+Math.round((Math.random()*4+1))+".jpg')");
			//identify user preffered language
			lang = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
			if(languages.indexOf(lang) >=0){
				$("#"+lang).addClass("active");
			}
			else{
			   lang ="en";
			   $("#"+lang).addClass("active");	
			}
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

			Handlebars.registerHelper('multiple_of_3', function(a,opts) {
					    if(a % 3 ==0 && a!==0)
					    	  return opts.fn(this);
						    else
						        return opts.inverse(this);
					});
		  Handlebars.registerHelper('applyClass', function(string) {
			    if (string.length > 30) {
			        return new Handlebars.SafeString('<h4 class="longTitle">' +string+ '</h4>');
			    }
			    return new Handlebars.SafeString('<h4 class="shortTitle">' +string+ '</h4>');
			});
	  });
	 
	function reset(){
		 $("#wikiInfo").html("");
 		 $(".searchbox").val("");
 		 $(".searchInput").css("top","50%");
 		 $("#wikiInfo").css("opacity","0");			  
 		 searchTerm = "";
 		 isRandom = false;	
	}   

	function getWikiInfo(query){
			$.getJSON("./functions.php?search="+query+"&lang="+lang, function(result){
				  animateWikiInfo();
				  $("#container").removeClass("beforeSearch").addClass("afterSearch");
			      let template = $("#searchResults").html();
			      let compiledTemplate = Handlebars.compile(template);
			      $("#wikiInfo").html(compiledTemplate(result));
			       $(".extract").mCustomScrollbar({ scrollbarPosition: "inside",autoHideScrollbar: true, });
			       $('.book').on('click', function(e){
			       if(e.currentTarget.className.indexOf("unflippable") < 0){
				     $(this).toggleClass('flipped');
				     // if($(this).className.indexOf('flipped') <0){
				     // 	 $(this).css("animate","flip 1s linear reverse");
				     // }
				    let me = this;
				    me.children[1].className= me.className == 'book flipped'? "appear":'pic';	
				    me.children[2].className = me.children[1].src.indexOf("#") >= 0 ? "loading setVisible":"loading loaded";
				    let checkLength = me.previousElementSibling.children[0].children[0].textContent.length > 30;
				    let newClass = checkLength ? " short":" long";   
				    me.previousElementSibling.children[1].className += newClass;
				       $.getJSON("./functions.php?img="+this.attributes[1].nodeValue,function(result){
				       	
	 					let key = Object.keys(result.query.pages)[0];
	 					let source ="",orientation="landscape";
	 					try{
	 				       source = result.query.pages[key].imageinfo[0].thumburl;
	 				       if(result.query.pages[key].imageinfo[0].height >result.query.pages[key].imageinfo[0].width ){
	 				       		orientation="portrait";
	 				       }	
	 					}catch(ex){
	 						source = "public/images/cat.png";
	 					}
	 					
	 					me.children[1].src=source;	
	 					if(me.children[1].src.indexOf("#") < 0){
	 					   me.children[2].className = "loading loaded";
	 					}
	 				    me.children[1].className= me.children[1].className +" "+orientation;
	 				});	
				    
				  }
				
				  });  
			});
	}
	function animateWikiInfo(){
		 $(".searchInput").css("top","10%");
		 $("#wikiInfo").css("opacity","1");  	
	}
	 function getRandomWikis(){
	 		  isRandom = true;
	 	      let template = $("#randomResults").html();
		      let compiledTemplate = Handlebars.compile(template);
		       let mockA = Array.apply(null, Array(5)).map(function (x, i) { return {
		       	         lang:lang,
		       	         top:Math.round(Math.random()*200+100),
		       	         left:Math.round(Math.random()*700+150),
		       	         rotation: Math.round(Math.random()*30+10)
		       	      }; });
		      
		       let placeholder = {wikis:mockA};
		      $("#wikiInfo").html(compiledTemplate(placeholder));
		    	animateWikiInfo();
		      $(".draggable").draggable();
	 }
   
});
