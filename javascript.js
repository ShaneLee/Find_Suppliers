let count = 0;

function loadJSon() {
  var request = new XMLHttpRequest();
  var requestURL = 'data.json';
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();
  request.onload = function() {
    var suppliers = request.response;
    showSuppliers(suppliers);
  }
}
document.addEventListener('keypress', function (e) {
  if (13 == e.keyCode) {
    loadJSon();
  }
});


function showSuppliers(jsonObj) {
  var container = document.getElementById("container");
  var suppliers = jsonObj['suppliers'];

  var suppliersSelected = {};

  var serviceSelected = document.getElementById("service").value;
  var areaSelected = document.getElementById("area").value;

  var divToHide = document.getElementById("boxes")

  sortSuppliers(suppliers);
  divToHide.className = "hide";
  for (var i = 0; i < suppliers.length; i++) {
    // var supplier_id = suppliers[i].supplier_id;
    var supplierName = suppliers[i].name;
    var number = suppliers[i].number;
    var services = suppliers[i].services;
    var areas = suppliers[i].areas;
    var status = suppliers[i].status;
    var notes = suppliers[i].notes;
    var stop = suppliers[i].stop;

    for (var j = 0; j < services.length; j++) {
      var service = services[j];
      if (service.toUpperCase() !== serviceSelected.toUpperCase()) {
       continue;
      }
      else {
          for (var k = 0; k < areas.length; k++) {
            var area = areas[k];
            if (area.toUpperCase() !== areaSelected.toUpperCase()) {
              continue;
            }
            else {
              count++
              var note = notes[j];
              var listItem = document.createElement("li");
              listItem.className = "list";
              container.appendChild(listItem);
              if (note != "") {
                listItem.innerHTML = upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(supplierName)) + " - " + number + " " +
                captialiseFirstLetter(status) + "<br /><br />" + note;
              }
              else {
                // issue_link = " <a href='../issue/" + supplier_id + "'>Report Error</a>"
                listItem.innerHTML = upperCaseFirstLetter(
                  lowerCaseAllWordsExceptFirstLetters(supplierName)) +
                   " - " + number + " " +
                captialiseFirstLetter(status);
              }

            }
        }
      }
    }
  }
  var summary = document.createElement("li");
  summary.className = "list";
  container.insertBefore(summary, container.childNodes[0]);
  summary.innerHTML = "Searched for: " + serviceSelected +
   "<br /> Area: " + areaSelected + "<br /> " + count + " suppliers sourced";
}

function upperCaseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerCaseAllWordsExceptFirstLetters(string) {
    return string.replace(/\w\S*/g, function (word) {
        return word.charAt(0) + word.slice(1).toLowerCase();
    });
}



function sortSuppliers(notSorted) {

  for (var i = 0; i < notSorted.length; i++) {
    var num_issues_reported = notSorted[i].rating.num_issues_reported;
    var price = notSorted[i].rating.price;
    var num_times_on_stop = notSorted[i].rating.num_times_on_stop;
    var avalibility = notSorted[i].rating.avalibility;
    var supplierRating =
      rateSuppliers(num_issues_reported, price, num_times_on_stop, avalibility);

    notSorted[i].overall_rating = supplierRating;
    if (i > 0) {
      if (notSorted[i].overall_rating != notSorted[i-1].overall_rating) {

          notSorted.sort(function(a,b)
          {return (a.overall_rating > b.overall_rating) ? -1 :
            ((b.overall_rating > a.overall_rating) ? 1 : 0);} );

      }
    }
  }

}

function rateSuppliers(num_issues_reported, price,
  num_times_on_stop, avalibility) {
    return calculateAverage((num_issues_reported * -1), price,
      (num_times_on_stop * -1), (avalibility * -1));
}

function calculateAverage(a, b, c, d) {
  return (a + b + c + d) / 4;
}


function captialiseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
