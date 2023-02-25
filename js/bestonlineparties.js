
//
// Zoom meeting helpers
//

/*
 * Render ZoomMeeting button(s) - ONLY NEEDED ON OWN EVENT PAGES
 */
function updateZoomMeetingButton(eventTsBeginUtc, eventTsEndUtc, reserveUrl, joinUrl) {
    // render
    document.getElementById("zoom_meeting_button").innerHTML =
      renderZoomMeetingButton(eventTsBeginUtc, eventTsEndUtc, reserveUrl, joinUrl);

    // update in a seconds
    setTimeout(function(){ updateZoomMeetingButton(eventTsBeginUtc, eventTsEndUtc, reserveUrl, joinUrl)}, 1*1000);
}

function renderZoomMeetingButton(eventTsBeginUtc, eventTsEndUtc, reserveUrl, joinUrl) {
    console.log("eventTsBeginUtc="+eventTsBeginUtc);
    var beginTsMillis = Date.parse(eventTsBeginUtc);
    var endTsMillis = Date.parse(eventTsEndUtc);
    console.log("beginTsMillis="+beginTsMillis+", endTsMillis="+endTsMillis);
    var now = new Date();
    var secsUntilBegin = Math.round((beginTsMillis-now.getTime()) / 1000);
    console.log("secsUntilBegin="+secsUntilBegin);

    //return renderZoomMeetingButtonWaiting(secsUntilBegin)+"<br>"+renderZoomMeetingButtonJoin(url)+"<br>"+renderZoomMeetingButtonOver();

    if (secsUntilBegin>0) { 
        if (reserveUrl && reserveUrl.trim().length>0) {
            // reservation is possible
            return renderZoomMeetingButtonReserve(reserveUrl, secsUntilBegin)
        } else {
            // waiting
            return renderZoomMeetingButtonWaiting(secsUntilBegin)
        }   
        
    } else if (now.getTime()<endTsMillis) {
        // join possible
        return renderZoomMeetingButtonJoin(joinUrl);
    } else {
        // over
        return renderZoomMeetingButtonOver();
    }
}

function renderZoomMeetingButtonJoin(url) {
    return '<a href="'+url+'" target="_blank" class="zoom_meeting__join"><big><b>Join Zoom Party now</b></big><br>on organizer page</a>';

}

function renderZoomMeetingButtonReserve(url, secs) {
    return '<p><sub>Zoom Party starts in<br>'+countDownsString(secs)+'</sub></p><a href="'+url+'" target="_blank" class="zoom_meeting__reserve"><big><b>Reserve now</b></big><br>on organizer page</a>';
}

function renderZoomMeetingButtonWaiting(secs) {
    return '<div class="zoom_meeting__waiting">Zoom Party starts in<br><b>'+countDownsString(secs)+'</b></div>';
}
function countDownsString(secs) {
    // calculate
    var days = Math.floor(secs / (24*60*60));
    var secsWithoutDays = secs - ((24*60*60)*days);
    var hrs = Math.floor(secsWithoutDays / (60*60));
    var secsWithoutHrs = secsWithoutDays - ((60*60)*hrs);
    var mins =  Math.floor(secsWithoutHrs / 60);
    var secsWithoutMins = secsWithoutHrs - (60*mins);

    // convert to strings
    var hrsS = twoDigits(hrs);
    var minsS = twoDigits(mins);
    var secsS = twoDigits(secsWithoutMins);

    // render
    return days+' days '+hrsS+' hrs '+minsS+' mins '+secsS+' secs';
}
function twoDigits(n) {
    if (n>=0 && n<10) {
        return "0"+n;
    } else {
        return ""+n;
    }
}

function renderZoomMeetingButtonOver() {
    return '<div class="zoom_meeting__over">This Zoom Party is Over!</div>';
}


/*
 * Send form submits
 */
function initSubscribeForm(formId) {
  console.log("initsubscribeForm(formId="+formId+")");

  // get the form elements defined in your form HTML above
  var form = document.getElementById(formId);
  var button = document.getElementById(formId+"-button");
  var status = document.getElementById(formId+"-status");

  // Success and Error functions for after the form is submitted
  function success() {
    console.log("initSubscribeForm.success "+formId);
    form.reset();
    button.style = "display: none ";
    status.innerHTML = "Thank you!";
  }

  function error() {
    console.log("initSubscribeForm.error "+formId);
    status.innerHTML = "Oops! There was a problem.";
  }

  // handle the form submission event
  form.addEventListener("submit", function(ev) {
    console.log("initSubscribeForm.submit "+formId);
    ev.preventDefault();
    var data;
    var emailOrPhone;
    try {
      data = new FormData(form);
      //const myHost = "dance123.club";
      emailOrPhone = data.get('emailOrPhone');
    } catch (exc) {
      // fallback for older browsers
      var inputEmailOrPhone = document.getElementById(formId+"-emailOrPhone");
      emailOrPhone = inputEmailOrPhone.value;
    }
    var secondPostToUrl = form.action; // e.g. "https://formspree.io/xdowyraq" for bestonlineparties
    sendSignupFormViaAjax(formId, data/*:Object*/, emailOrPhone, secondPostToUrl, success, error);
    // OLD:
    //const optionalMailto = "mailto:info@bestonline'+'parties.org?subject=Subscribe-to-Newsletter";
    //const myHost = "bestonlineparties.org";
    //sendSignupFormViaAjaxBestOnlineP(myHost, form.method, form.action, data, formId, optionalMailto, success, error);
  });
}
