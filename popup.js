// URL base for WolframAlpha queries.
var waQueryURL = 'http://www.wolframalpha.com/input/?i=';

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

// Clear the popup display.
function clearDisplay()
{
  clear($('wolframAlphaResponses'));
  clear($('linkToWolframAlpha'));
  clear($('progressDisplay'));
  clear($('alertMessage'));
}

// Progress animation. 
function showProgress() {
  // Clear the previous results.
  clearDisplay();
  // Show a progress wheel.
  var progressDisplay = $('progressDisplay');
  var progress = document.createElement('img');
  progress.src = 'computing.gif';
  progressDisplay.appendChild(progress);
}

// Load the results of the previous user query.
function loadPrev()
{
  var prevSearch = localStorage.prevSearch;
  if (prevSearch) {
    console.log('found saved: ' + prevSearch);
    $('userQuery').value = prevSearch;
  }
  var prevResponseHTML = localStorage.prevResponseHTML;
  if (prevResponseHTML) {
    $('wolframAlphaResponses').innerHTML = prevResponseHTML;
  }
  var prevLinkHTML = localStorage.prevLinkHTML;
  if (prevLinkHTML) {
    $('linkToWolframAlpha').innerHTML = prevLinkHTML;
  }
  var prevAlertHTML = localStorage.prevAlertHTML;
  if (prevLinkHTML) {
    $('alertMessage').innerHTML = prevAlertHTML;
  }
}

// Function that does all of the work of querying WolframAlpha.
function queryWA()
{
  queryURL = waQueryURL + encodeURIComponent($('userQuery').value);
  var req = new XMLHttpRequest();
  req.addEventListener('loadstart', showProgress, false);
  req.open("GET", queryURL, true);
  req.onload = function (e) {
    if (req.readyState === 4 && req.status === 200) {
      // Clear the progress bar.
      clearDisplay();
      // Parts of the display that will be manipulated.
      var wolframAlphaResponses = $('wolframAlphaResponses');
      var responseLink = $('linkToWolframAlpha');
      var alertNotice = $('alertMessage');
      // Parse and display results from WolframAlpha.
      respXML = new DOMParser().parseFromString(req.responseText, 'text/html');
      var pods = respXML.getElementsByClassName('pod');
      for (var i=0; i<pods.length; i++) {
        // Only interested in elements that are just members of the 'pod' class.
        if (pods[i].className != 'pod ') {
          continue;
        }
        var images = pods[i].getElementsByTagName('img');
        var title = pods[i].getElementsByTagName('h2')[0].innerText;
        var pod = document.createElement('li');
        pod.innerHTML = title + '<br>';
        for (var j=0; j<images.length; j++) {
          var child = document.createElement('img');
          child.src = images[j].getAttribute('src');
          pod.appendChild(child);
        }
        wolframAlphaResponses.appendChild(pod);
      }
      // Handle case where we have zero results.
      if (pods.length == 0) {
        var alertNotice = $('alertMessage');
        var zeroResultsNotice = document.createElement('h4');
        zeroResultsNotice.innerText = 'Sorry, there were zero results returned \
          by Wolfram Alpha.';
        alertNotice.appendChild(zeroResultsNotice);
      }
      var link = document.createElement('a');
      link.setAttribute('href', queryURL);
      link.setAttribute('target', '_blank');
      link.innerHTML = 'Link to WolframAlpha Result Page';
      responseLink.appendChild(link);
      localStorage.prevResponseHTML = wolframAlphaResponses.innerHTML;
      localStorage.prevAlertHTML = alertNotice.innerHTML;
      localStorage.prevLinkHTML = responseLink.innerHTML;
    }
  };
  req.send(null);
  localStorage.prevSearch = $('userQuery').value;
  console.log('saved ' + localStorage.prevSearch);
}

// Execution entry point.
document.addEventListener('DOMContentLoaded', 
  function () 
  {
    loadPrev();
    $('userQuery').addEventListener('keypress', 
      function () { 
        if (event.keyCode == 13) { event.preventDefault(); queryWA(); }
      });
  }
);
