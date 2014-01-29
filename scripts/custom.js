
/*
 * gets called when News is clicked. validate city and zipcode for non-empty.
 * Construct geoString for news and weather string for weather query.
 * get json using yql for news and weather. Parse json, populate corresponding sections
 * on news and weather pages.
 * 
 * */
function searchHandler() {
    var zipCode = $.trim($("#zipCode").val());
    var city = $.trim($("#city").val());
    var doSearch = true;
    var geoString = "";
    var weatherString = "";
    var state = "";
    
    $("#errMsg").text("");
    $("#news").text("");
    $("#weather").text("");
    
    if(zipCode.length == 0 && city.length == 0) {
    	$("#errMsg").append("<span>Please enter zip code OR city and state</span>");
    	doSearch = false;
    	$("#zipCode").focus();
    } 
    else if (zipCode.length > 0) {
    	geoString = zipCode;
    	weatherString = zipCode;
    	saveToLocalStorage("recent", zipCode);
    	
    } else if(city.length > 0){
        state= $("#state").val();
    	//Cambridge,+MA
    	geoString = city + "%2C%2B" + state  ;
    	weatherString = state + "%2F" + city;
    	saveToLocalStorage("recent", city + "|" + state);
    }
    
    if(doSearch) {
    	displayRecentSearch("recent");
		//get news
    	var newsUrl = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%20%3D%20'http%3A%2F%2Fnews.google.com%2Fnews%3Fgeo%3D" + geoString + "%26output%3Drss'&format=json&callback=?";
		var xHr = $.getJSON(newsUrl ,
				{},
				function(data) {
						$("#news_location").text("");
						$("#news_location").text(zipCode + " " + city + " " + state);
					    $.each(data.query.results.item, function(i,item){
					      	
					      $("#news").append("<div><a href='" + item.link + "'>" + item.title + "</a></div>");
					    }
					  );
					  });
		  
		//get weather
		  var weatherUrl = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D'http%3A%2F%2Frss.wunderground.com%2Fauto%2Frss_full%2F" + weatherString + ".xml%3Funits%3Denglish'&format=json&callback=?"
		  $.getJSON(weatherUrl ,
				{},
				function(data) {
					$("#weather_location").text("");
					$("#weather_location").text(zipCode + " " + city + " " + state);							
				    $.each(data.query.results.item, function(i,value){				    	  
					      $("#weather").append("<div><a href='" + value.link + "'>" + value.title + "</a></div>").
					      append("<div>"+ value.description +"</div>");
				    });
				});
		  $("#loading").text("");
		$.mobile.changePage("#newsPage");
    }
}

/*clean this field's content when focus is moved to another field*/
function clean(cleanupField) {
	var fieldId = "#" + cleanupField;
	$(fieldId).val("");
	
}


///placeholder function, does not get called right now
 function onError(xHr, status ) {
	$("#result").html("Error Calling: " + settings.url + "<br />HTPP Code: " + request.status);
 }
 
 /*
  * dave to local storage, handle duplicates so that they are not added twice.
  * Only keep 5 recent searches..
  * */
 function saveToLocalStorage(key, value) {
     if(!supports_web_storage()) {
         
         return;
     }
    
     var values = localStorage.getItem(key);
     //values = (values != null && values.indexOf(";") > -1 )?values.split(";"):new Array(); //getting array
     if(values != null && values.indexOf(";") != -1) {
    	 values = values.split(";");
     } 
     else if(values != null && values.indexOf(";") == -1 ) {
    	 var oneElemArray = new Array();
    	 oneElemArray.unshift(values);
    	 values = oneElemArray;
     } 
     else {
    	 values = new Array();
     }

     //if length is 5, add a new element at the beginning of the array and remove last element
     if(values.length == 5 && jQuery.inArray(value, values) == -1) {
    	 values.pop();
     }
     //add new elem if it's not there already
     if(jQuery.inArray(value, values) == -1){
     	values.unshift(value);
 	 }
     
     localStorage.setItem(key, values.join(";"));
 }
 
 /**
  * display recent searches drop down. handle when it's one or more elements.
  * */
 function displayRecentSearch(key) {
	 var values = localStorage.getItem(key);
     values = (values.indexOf(";") > -1 )?values.split(";"):values; //getting array
     var selectStr = "<select name='recentSearchSelect' id='recentSearchSelect' onchange='recentSearchSelected();'>";
     selectStr += "<option value='--'>[Select recent search]</option>"
     //it's array, loop through
     if(jQuery.type(values) == "string") {
    	 selectStr += "<option value='" + values +"'>" + values.replace("|", ", ") + "</option>";
     } 
     else if(jQuery.type(values) == "array") {
    	 
    	 for(var i=0; i<values.length; i++) {
    		 selectStr += "<option value='" + values[i] +"'>" + values[i].replace("|", ", ") + "</option>";
    	 }
  	 }
     selectStr += "</select>";
    
     $("#recentSearch").html(selectStr);
 }
 
 /**
  * gets called when recent search drop-down is clicked.
  * */
 function recentSearchSelected() {
	 //get selected element, pass through to search handler
	var recentSelected= $("#recentSearchSelect").val();
	if(recentSelected == "--") return;
	
	//city state
	if(recentSelected.indexOf("|") != -1) {
		var cityStateArray = recentSelected.split("|");
		$("#city").val(cityStateArray[0]);
		$("#state").val(cityStateArray[1]);
	}
	//zipCode
	else {
		$("#zipCpde").val(recentSelected);
	}
	searchHandler();
 }
 
 ///geo section
 
 // perform geo lookup, but only if the geolocation object exists
 function getCurrentLocation() {
     if(navigator.geolocation){
        try {
        	navigator.geolocation.getCurrentPosition(locationHandler, locationErrHandler);
        	 $("#loading").html("Please wait....<img src='styles/loader.gif'/>");
        }
        catch(err) {
        	alert("Error: " + err);
        }
     }
     else {
         alert("Geolocation not supported by your browser!");
     }
 }

 // geolocation error handler
 function locationErrHandler(err) {
	 //todo... neeed better handling
     alert("Error #" + err.code + ": " + err.message);
 }
 
 
//callback function        
 function locationHandler(pos) {
	  // display data
	 var geocoder = new GClientGeocoder();
	 geocoder.getLocations(new GLatLng( pos.coords.latitude, pos.coords.longitude), getAddress);
 }
 
 /*
  *  callback on GLatLng, gets zipcode based on lat, lon. calls searchHandler once successful.
  * */
 function getAddress(response) {
	 if (!response || response.Status.code != 200) {
		    alert("\"" + address + "\" not found");
	  } else {
		  
	    var place = response.Placemark[0];
	    var zipCode = place.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.PostalCode.PostalCodeNumber;
	    $("#zipCode").val(zipCode);
	    searchHandler();
	  }
 }
 
 
 /**
  * handling geo errors, need to replace alerts with something else
  * */
 function handleErrors(error)  
 {  
     switch(error.code)  
     {  
         case error.PERMISSION_DENIED: alert("user did not share geolocation data");  
         break;  

         case error.POSITION_UNAVAILABLE: alert("could not detect current position");  
         break;  

         case error.TIMEOUT: alert("retrieving position timed out");  
         break;  

         default: alert("unknown error");  
         break;  
     }  
 }  

 
 function supports_web_storage() {
     try {
         return 'localStorage' in window && window['localStorage'] !== null;
     } catch (e) {
         return false;
     }
 }



 
 