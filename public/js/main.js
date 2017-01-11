$(function () 
 {
     let lang="",
	     isRandom =false,
	     searchTerm="",
	     searchItems ="",
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
			 $(".searchbox").val(searchTerm);
		     getWikiInfo(searchTerm);	
		     isRandom =false;
		   return false;
		}
	 });

  
	  
	  $(document).ready(function(){

		    $('.searchbox').keyup(function(e){
			      if(e.keyCode == 13)
				    { 
				       getWikiInfo(e.currentTarget.value);
				       $(this).autocomplete( "close" );
				       isRandom = false;
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
 				isRandom = true; 
 				$('.input-group').css('opacity','0');
			});
			$('#searchWiki').click(function(e){
				reset();	
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

			Handlebars.registerHelper('addShelf', function(a,opts) {
				       let multiple = $(window).width() <1286 || $(window).height() <520 ? 1:2;
					    if(a % multiple ==0 && a!==0)
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
		    Handlebars.registerHelper('splitInPages', function(title,extract) {
			      let base = '<div> <a href="https://'+lang+'.wikipedia.org/wiki/'+title+'" target="_blank"> <h4 class="articleTitle">'+title+'</h4></a>';
			      return  new Handlebars.SafeString(base+recursiveSplit(extract));
			});
		   Handlebars.registerHelper('getLang', function() {
			    return lang;
			});


            function recursiveSplit(text){
            	let build="", splitted =text.split(" ");
            	if(splitted.length <=20){
            		return '<div class="extract">'+text+'</div></div>';
            	}
            	else {
            		let i = 20;
	            	for(let split =0; split <= splitted.length;split+=i){
	            		if(split!==0)
	            		{
	            			build+="<div>";
	            		}
	            		build += '<div class="extract">'+splitted.slice(split,i).join(" ")+'</div></div>';
	            		
	            		if((i+20) < splitted.length)
	            		   i +=20;
	            		else{
	            			return build += '<div></div><div><div class="extract">'+splitted.slice(i).join(" ")+'</div></div>';
	            		}
	            	}
	            	return build;
            	}	
            }
		      enquire.register("screen and (max-width: 1290px)", {
		        match : function() {
		        	if(searchTerm !==""){
		        	  renderWiki();
		              addEvents();	
		        	} 
		        },
		        unmatch : function() {
		           if(searchTerm !==""){
		              renderWiki();
		              addEvents();
		           }      
		        }
		    });
	

	  });
	 function renderWiki(){
	       let template = $("#searchResults").html();
	      let compiledTemplate = Handlebars.compile(template);   
	      $("#wikiInfo").html(compiledTemplate(searchItems));	   
	 }
	function reset(){
		 $("#wikiInfo").html("");
 		 $(".searchbox").val("");
 		 $(".searchInput").css("top","50%");
 		 $("#wikiInfo").css("opacity","0");		
 		 $('.input-group').css('opacity','1');	  
 		 searchTerm = "";
 		 isRandom = false;	
	}   
	function closeBooks(current){
		$('[id^=flipper]').map(function(flipper){
			if(flipper!=current){
			  $("#flipper"+flipper).turn("page", 1);
			}
		});
	}
	function displayWikiImg(flipper,page,me){
			if(page==2){
				closeBooks(flipper);
				 let pageImg = me.querySelectorAll('img')[0]; 	
				    	//set the loading image to appear
				  if(pageImg.attributes[2].nodeValue.indexOf('#') >= 0) {
				    me.querySelectorAll('img')[1].attributes[0].nodeValue="loading setVisible";
				  } 
				  else{
						  me.querySelectorAll('img')[1].attributes[0].nodeValue="loading loaded";
				  }

		      //get the data-imageTitle value to query the image from wikipedia
		       $.getJSON("./functions.php?img="+pageImg.attributes[0].nodeValue,function(result){
		       	
 					let key = Object.keys(result.query.pages)[0];
 					let source ="",orientation="appear landscape";
 					try{
 				       source = result.query.pages[key].imageinfo[0].thumburl;
 				       if(result.query.pages[key].imageinfo[0].height >result.query.pages[key].imageinfo[0].width ){
 				       		orientation="appear portrait";
 				       }	
 					}catch(ex){
 						source = "public/images/cat.png";
 					}
 					//set the source with the identified value
						 pageImg.attributes[2].nodeValue=source;
						 //set the loading image to disappear 
						 me.querySelectorAll('img')[1].attributes[0].nodeValue="loading loaded";
		    	
						//set the class
 				     pageImg.attributes[1].nodeValue= pageImg.attributes[1].nodeValue+" "+orientation;
				});	
		}	
	}

   function addEvents(){
            //	  $(".extract").mCustomScrollbar({ scrollbarPosition: "inside",autoHideScrollbar: true, });
			        animateWikiInfo();
			        $('[id^=flipper]').map(function(flipper){
			             $("#flipper"+flipper).turn(
				             {
				             	when: {
								turning: function(event, page, pageObject) {
									let me= this;
								    displayWikiImg(flipper,page,me);
								  } 
								},
								width: 490,
								height: 290,
								autoCenter: true,
								duration:800
							}
						);	
			        });
   }
	function getWikiInfo(query){
			$.getJSON("./functions.php?search="+query+"&lang="+lang, function(result){
				    searchItems = result;
				    $("#wikiInfo").animate({
				          scrollTop: 0
				     }, 1000);
				    renderWiki();
			     	addEvents();
			     	$("#flipper0").turn("page", 2);
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
