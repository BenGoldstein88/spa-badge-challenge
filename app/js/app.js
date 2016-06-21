$.ready( function() {
  // Do Ajax call to spa badge
  // Parse return JSON object and print it as list items

  // Teachers-list
  $.ajax({
    url: "http://spa-badge-api.herokuapp.com/teachers",
    type: "GET",
    success: function(response) {
      var teacherString = "<ul>"
      var teachersListJSON = response.currentTarget.response
      var teachersList = JSON.parse(teachersListJSON)
      for (i = 0; i < teachersList.length; i++){
        teacherString += "<li><a href='teachers/" + teachersList[i].id+ "'>" + teachersList[i].name + "</a></li>"
      }
      teacherString += "</ul>"
      $("#teachers_list").innerHTML = teacherString;
    },
    fail: function (response) {console.log('fail' + response)}
  });
})
