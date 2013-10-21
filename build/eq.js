(function () {
  var eqs = [];
  var eqsLength = 0;

  //////////////////////////////
  // Debounce
  // Returns a function, that, as long as it continues to be invoked, will not be triggered. The function will be called after it stops being called for N milliseconds. If `immediate` is passed, trigger the function on the leading edge, instead of the trailing.
  //////////////////////////////
  var debounce = function (func, wait, immediate) {
    var timeout;
    return function () {
      var context = this, args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  };

  //////////////////////////////
  // Window Load
  //
  // Grab all DOM elements with an `eq-pts` attribute
  // Find how many items there are
  // Save both to annon-scoped variables
  //
  // Loop over each and pass to eqState
  //////////////////////////////
  window.onload = function () {
    eqs = document.querySelectorAll('[eq-pts]');
    eqsLength = eqs.length;

    eqStates();
  };

  //////////////////////////////
  // Window Resize
  //
  // Loop over each `eq-pts` element and pass to eqState
  //////////////////////////////
  window.onresize = debounce(function () {
    console.time("Dom update");
    eqStates();
    console.timeEnd("Dom update");
  }, 20);


  var eqStates = function () {
    // Read offset width of all nodes
    var width = [], eqPtsValues = [], eqPts, i;
    for (i = 0; i < eqsLength; i++) {
      width.push(eqs[i].offsetWidth);
      eqPts = {};
      try {
        eqPts = JSON.parse(eqs[i].getAttribute('eq-pts'));
      }
      catch (e) {
        console.log('Invalid JSON. Remember to wrap your attribute in single quotes (\') and your keys in double quotes (")');
      }
      eqPtsValues.push(eqPts);
    }

    // Update nodes
    for (i = 0; i < eqsLength; i++) {

      // Quick fix to get the copied code working:
      var objWidth = width[i];
      var obj = eqs[i];
      eqPts = eqPtsValues[i];

      // Copied from eqState
      var eqStates = Object.keys(eqPts);
      var eqPtsLength = eqStates.length;

      var firstKey = eqStates[0];
      var lastKey = eqStates[eqPtsLength - 1];

      if (objWidth < eqPts[firstKey]) {
        obj.removeAttribute('eq-state');
      }
      else if (objWidth >= eqPts[lastKey]) {
        obj.setAttribute('eq-state', lastKey);
      }
      else {
        for (var j = 0; j < eqPtsLength; j++) {
          var thisKey = eqStates[j];
          var nextKey = eqStates[j + 1];

          if (j === 0 && objWidth < eqPts[thisKey]) {
            obj.removeAttribute('eq-state');
            break;
          }

          if (nextKey === undefined) {
            obj.setAttribute('eq-state', thisKey);
            break;
          }

          if (objWidth >= eqPts[thisKey] && objWidth < eqPts[nextKey]) {
            obj.setAttribute('eq-state', thisKey);
            break;
          }
        }


      }

    }
  };

})();