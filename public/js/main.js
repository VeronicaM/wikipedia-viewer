$(function () 
 {
     var lang="",
         prev_lang="",
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
			$(".languages li > a").click(function(e){
 				lang=e.currentTarget.id;
 				prev_lang=$('.languages a.active')[0].id;
 				$('.languages a').removeClass('active');
 				 $(this).addClass("active");
 				 if(isRandom) {
 				 	getRandomWikis();
 				 }
 				 else if(searchTerm !==""){
 					getWikiInfo(searchTerm);
 				 }

			});
  	    Handlebars.registerHelper('translationCredit', function(question,translated) {
			      var base = '<a href="http://translate.yandex.com/" target="_blank">Powered by Yandex.Translate</a><br/>';
			      return  translated? new Handlebars.SafeString(base+question):new Handlebars.SafeString(question);
			});
			Handlebars.registerHelper('addShelf', function(a,opts) {
				       var multiple = $(window).width() <1286 ? 1:2;
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
			      var base = '<div> <a class="linkT" href="https://'+lang+'.wikipedia.org/wiki/'+title+'" target="_blank"> <div class="positionT"><h4 class="articleTitle">'+title+'</h4></div></a>';
			      return  new Handlebars.SafeString(base+recursiveSplit(extract));
			});
		   Handlebars.registerHelper('getLang', function() {
			    return lang;
			});


            function recursiveSplit(text){
            	var build="", splitted =text.split(" ");
            	var className ="extract";
            	if(splitted.length <=20){
            		return '<div class="extract firstE">'+text+'</div></div>';
            	}
            	else {
            		var i = 20;
	            	for(var split =0; split <= splitted.length; split+=i){
	            		if(split!==0)
	            		{
	            			build+="<div>";
	            		}
	            		else{
	            			className+=" firstE";
	            		}
	            		build += '<div class="'+className+'">'+splitted.slice(split,i).join(" ")+'</div></div>';
	            		
	            		if((i+40) < splitted.length){
	            		   i +=20;
	            		}
	            		else{
	            			return build += '<div></div><div><div class="extract">'+splitted.slice(i).join(" ")+'</div></div>';
	            		}
	            	}
	            	return build;
            	}	
            }
		      enquire.register("screen and (max-width: 1290px)", {
		        match : function() {
		        	if(!isRandom &&searchTerm!=""){
		        	  renderWiki();
		              addEvents();	
		        	} 
		        },
		        unmatch : function() {
		           if(!isRandom&&searchTerm!=""){
		              renderWiki();
		              addEvents();
		           }      
		        }
		    });
	

	  });
	 function renderWiki(){
	       var template = $("#searchResults").html();
	      var compiledTemplate = Handlebars.compile(template);   
	      $("#wikiInfo").html(compiledTemplate(searchItems));	 
	 }
	function reset(){
		 $(".loader").removeClass('show');
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
				 var pageImg = me.querySelectorAll('img')[0]; 	
				    	//set the loading image to appear
				  if(pageImg.src.indexOf('#') >= 0) {
				    me.querySelectorAll('img')[1].className="loading setVisible";
				  } 
				  else{
						  me.querySelectorAll('img')[1].className="loading loaded";
				  }
		      $.getJSON("./functions.php?img="+pageImg.dataset.imagetitle,function(result){
		       	
 					var key = Object.keys(result.query.pages)[0];
 					var source ="",orientation="appear landscape";
 					try{
 				       source = result.query.pages[key].imageinfo[0].thumburl;
 				       if(result.query.pages[key].imageinfo[0].height >result.query.pages[key].imageinfo[0].width ){
 				       		orientation="appear portrait";
 				       }	
 					}catch(ex){
 						source = "public/images/cat.png";
 					}
 				  	 pageImg.src=source;
					 me.querySelectorAll('img')[1].className="loading loaded";
		    	     pageImg.className= pageImg.className+" "+orientation;
				});	
		}	
	}

   function addEvents(){
			        $('[id^=flipper]').map(function(flipper){
			             $("#flipper"+flipper).turn(
				             {
				             	when: {
								turning: function(event, page, pageObject) {
									var me= this;
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
		     animateWikiInfo();       
		     $(".loader").addClass('show'); 
			$.getJSON("./functions.php?search="+query+"&lang="+lang, function(result){
			    	$(".loader").removeClass('show');
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
		 $(".searchInput").css({"top":"7%","left":"10px"}); 	
		 $("#wikiInfo").css("opacity","1");  	

	}
	function isNumber(n) {
 	  return !isNaN(parseFloat(n)) && isFinite(n);
	}
	 function getRandomWikis(){
	 		  isRandom = true;
	 		  animateWikiInfo();
	 		  $('#wikiInfo').html('');
	 		  $(".loader").addClass('show');
	 		  $.getJSON("./functions.php?trivia=true&num=3&lang="+lang, function(result){
	 		  	$(".loader").removeClass('show');
		 	      var template = $("#randomResults").html();
			      var compiledTemplate = Handlebars.compile(template);
			       var mockA = Array.apply(null, Array(3)).map(function (x, i) { 
			       			var question = "",valueQ = decodeURIComponent(result[i].question),translated = false;	
			       	         	try{
			       	         		question=JSON.parse(result[i].question)["text"][0];	
			       	         		valueQ = question;
			       	         		translated=true;
			       	         	}catch(ex){
			       	         		question = valueQ;
			       	         	}
			       	      return {
			       	         lang:lang,
			       	         question:{show:question,value:valueQ,translated:translated},
			       	         choices:result[i].choices.map(function(i){
			       	         	var choice = "",valueC=decodeURIComponent(i);
			       	         	try{
			       	         		choice=JSON.parse(i)["text"][0];
			       	         		valueC = choice;	
			       	         	}catch(ex){
			       	         		choice = decodeURIComponent(i);
			       	         	}

			       	         	   return {id:(Math.random()*100),show:choice,value:valueC};
			       	         	}),
			       	         category: result[i].category
			       	      };
			       	 });
			      
			       var placeholder = {wikis:mockA};
			       $("#wikiInfo").html(compiledTemplate(placeholder));
			    	$('.lock').hover(function() {
					   $(this).toggleClass("fa-unlock-alt");
					});
					$('.overlay').on('click',function(e){
							$(".overlay[data-answered='false']").removeClass("visible");
						$(this).toggleClass("visible");
					})
					$('#wikiInfo').on('click',function(e){
						if(!$(e.target).closest("div").is(".card-container") && !$(e.target).closest("div").is(".overlay"))
						{
						   $(".overlay[data-answered='false']").removeClass("visible");
						}
						
					})
					
			        $(".unlock").on('click',function(e){
			        	e.preventDefault();
			        	var answerInput = this.parentElement.querySelectorAll("input[name='answer']:checked")[0];
			        	var me = this;
			          if (!answerInput) {
						       alert('Nothing is checked!');
					   }
					   else {
					   	  $.getJSON("./functions.php?checkTrivia=true&triviaAnswer="+answerInput.value+"&triviaId="+this.parentElement.dataset.triviaid+"&lang="+lang, function(result){
						      me.parentElement.parentElement.querySelectorAll('.overlay')[0].dataset.answered = true;
						      if(result=="correct"){
						      	  var url = "https://en.wikipedia.org/wiki/Special:RandomInCategory/"+me.parentElement.dataset.category;
						          $(me.parentElement).html('<p class="final success">'+ answerInput.value +' <i class="fa fa-check" aria-hidden="true"></i> <br> <a href="'+url+'" target="_blank"> Wiki '+me.parentElement.dataset.category +'</a></p>'); 
						      }
						      else{
						      	   $(me.parentElement).html('<span class="final wrong">'+answerInput.value+'<i class="fa fa-times" style="padding:10px;" aria-hidden="true"></i></span>');	
						      }
						      
					      });	
					    }
			    			
			    	})
			     
		      });	

	 }
   
});
