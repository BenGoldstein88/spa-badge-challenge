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

      var target = $("#teacher-list");
      // var wrap = document.createElement('div')
      // wrap.appendChild(target.cloneNode(true));
      var source = target.innerHTML;
      var template = Handlebars.compile(source);
      var context = {teachers: teachersList}
      Handlebars.registerHelper('list', function(items, options) {
        var out = "<ul>";

        for(var i=0, l=items.length; i<l; i++) {
          out = out + "<li>" + options.fn(items[i]) + "</li>";
        }

        return out + "</ul>";
      });
      var html = template(context);
      $("#teachers-list").innerHTML = html;

    },
    fail: function (response) {console.log('fail' + response)}
  });

// Hide teacher index

})
