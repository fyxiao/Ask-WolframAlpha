// A developer API key that you can get from http://products.wolframalpha.com/api/
var apiKey = '<provide your API key here>'
// The base URL for WolframAlpha queries.
var waAPIURL = 'http://api.wolframalpha.com/v2/query?appid=' + apiKey + '&input='
// Public URL for wolframAlpha response page.
var waPublicURL = 'http://www.wolframalpha.com/input/?i=';

// Avoid typing 'getElementById()'.
var $ = function(id)
{
  return document.getElementById(id);
}

// Clear the child nodes of parent.
function clear(parent)
{
  while (parent.firstChild)
    parent.removeChild(parent.firstChild);
}

// Function that does all of the work of querying WolframAlpha.
function queryWA()
{
  // Create and send request to WolframAlpha
  queryURL = waAPIURL + encodeURIComponent(document.getElementById('userQuery').value);
  publicQueryURL = waPublicURL + encodeURIComponent($('userQuery').value);
  var req = new XMLHttpRequest();
  req.open("GET", queryURL, true);
  // Handle the response
  req.onload = function (e) {
    if (req.readyState === 4) {
      if (req.status === 200) {
        var responseDisplay = $('wolframAlphaResponses');
        var responseLink = $('linkToWolframAlpha');
        clear(responseDisplay);
        clear(responseLink);
        var pods = req.responseXML.getElementsByTagName('pod');
        // The responses are divided into pods which we process individually
        for (var i=0; i<pods.length; i++) {
          var images = pods[i].getElementsByTagName('img');
          var title = pods[i].getAttribute('title');
          var pod = document.createElement('li');
          pod.innerHTML = title + '<br>';
          for (var j=0; j<images.length; j++) {
            var child = document.createElement('img');
            child.src = images[j].getAttribute('src');
            pod.appendChild(child);
          }
          responseDisplay.appendChild(pod);
        }
        // Provide a link to the WolframAlpha response page
        var link = document.createElement('a');
        link.setAttribute('href', publicQueryURL);
        link.setAttribute('target', '_blank');
        link.innerHTML = 'Link to WolframAlpha Response';
        $('linkToWolframAlpha').appendChild(link);
      } 
    } 
  };
  req.send(null);
}

// Execution entry point.
document.addEventListener('DOMContentLoaded', 
  function () 
  {
    $('userQuery').addEventListener('keypress', 
      function () { if (event.keyCode == 13) { event.preventDefault(); queryWA(); } });
  }
);


