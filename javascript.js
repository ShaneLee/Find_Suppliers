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
    var supplierName = suppliers[i].name;
    var number = suppliers[i].number;
    var services = suppliers[i].services;
    var areas = suppliers[i].areas;
    var status = suppliers[i].status;
    var notes = suppliers[i].notes;

    for (var j = 0; j < services.length; j++) {
      var service = services[j];
      if (service !== serviceSelected) {
       continue;
      }
      else {
          for (var k = 0; k < areas.length; k++) {
            var area = areas[k];
            if (area !== areaSelected) {
              continue;
            }
            else {
              count++
              var note = notes[j];
              var listItem = document.createElement("li");
              listItem.className = "list";
              container.appendChild(listItem);
              if (note != "") {
                listItem.innerHTML = supplierName + " - " + number + " " +
                captialiseFirstLetter(status) + "<br /><br />" + note;
              }
              else {
                listItem.innerHTML = supplierName + " - " + number + " " +
                captialiseFirstLetter(status);
              }

            }
        }
      }
    }
  }
  console.log(count + " suppliers sourced");
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

          notSorted.sort(function(a,b) {return (a.overall_rating > b.overall_rating) ? -1 : ((b.overall_rating > a.overall_rating) ? 1 : 0);} );

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

function printSuppliers() {

  var service = document.getElementById("service").value;
  var area = document.getElementById("area").value;

  var output = "Suppliers for " + service + " in " + area + ": <br />" +
    "Test supplier - 01753 693 001 <br /><br /><br />Second Supplier - " +
    " 01258 654 500<br /><br /><br /> Third Supplier - 0121 852 4668";

  document.write(output);
}

function captialiseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
