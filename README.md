<h1>Neighborhood Map Project</h1>
This is my project submission for Udacity's Full Stack Web Developer nanodegree's item catalog project. The goal of this project was to develop a single page application featuring a map of a neighborhood that includes highlighted locations, third-party data about those locations, and various ways to browse the content.  
<h2>Demo</h2>
A live demo of the project hosted by heroku is avaliable at https://neighborhood-map-proj.herokuapp.com. Please give the page 20 seconds to startup because the free heroku web dyno goes to sleep after 30 minutes of inactivity.
<h2>Run on your Own</h2>
In order to actually run this website on your own machine you will need to clone this repo. Then, you will need to generate your own API credentials for the Google Maps Javascript API. To do that follow these steps:
<ol>
<li>Go to https://console.developers.google.com/</li>
<li>Click 'Select Project'</li>
<li>Click 'New Project', give your project a name, and click 'Create Project'</li>
<li>Search for the 'Maps Javascript API'and click 'Enable'</li>
<li>Now, click on the 'Credentials' tab, click 'Create credentials', and select 'API Key'</li>
<li>Copy the API key</li>
<li>Go to the <code>index.html</code> file in the cloned repo, find the final script tag with the call to the Maps Javascript API, and replace my API key with the one you just created</li>
</ol>
Once you have created the API key and replaced my API key, you are ready to actually startup the site. All you have to do is open the <code>index.html</code> file in any browser.
<h2>KnockoutJS</h2>
KnockoutJS is an organizational framework that implements Model–View–Viewmodel (MVVM), a software architectural pattern. In my application, KnockoutJS is used to create rich, responsive display and editor user interfaces with a clean underlying data model. 
<h2>3rd Party APIs</h2>
Data from 3rd party APIs is loaded asynchronously with errors handled gracefully. The Google Maps API is used to generate a map of New York City. The Wikipedia API provides additional data about the highlighted locations.
