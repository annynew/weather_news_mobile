This is a short summary of the 1st assignment.

Technologies, libraries
- I have used jqueryMobil.js library for look and feel, organizing content using their data structures, 
  which allowed me to use their Back and home navigation controls, as well as sliding pages.
- jquery for ajax calls, and getting json back from YQL queries, as well as few operation on array and html manipulation
- google maps API, which I am using for reverse lookup for the current location, look at geo section in custom.js file.

Flow

- user can type in zipcode, in which case City field gets cleared when. Accordigly when user moves focus to city, zipcode
  field gets clean.
  
- user can type in city and select state. 

- user can click News button, if zipcode or curt are empty error message (Required fields) will be displayed.

- Once News is clicked searchHandler() function gets called. It does the following:
   -validate city and zipcode for non-empty.
   - Construct geoString for news and weather string for weather query.
   - get json using yql for news and weather. Parse json, populate corresponding sections
     on news and weather pages.
   - also saves recent searches as zipcode or city, state and populates recentSearch section. duplicate rows are not
     added. Only 5 recent searches are stored.
   
- user can click Current location
  - will lookup current location using google API and do reverse lookup to get zipcode. call searchHandler() once it's retrieved.
  - I added loading icon, to let user know that server is retrieving data, it appears once Current Location is clicked and disappears 
    once News are loaded.
   
 - user can select from recent search drop-down, which will trigger loading of news and navigating to news page.
 
   few things that I could do to build on what's now:
   - handle situations when there is no json returned, so far it just would display empty page
   - convert zipcodes into city, state using google API so that recent search drop down would display city states only.
   - handle timeouts and server errors.