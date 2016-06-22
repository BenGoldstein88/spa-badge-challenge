var showTeacherHeader = function(teacher){
  console.log(teacher);

  var target = $("#teacher-header-script");
  var source = target.innerHTML;
  var template = Handlebars.compile(source);
  var context = {teacher: teacher};

  var html = template(context);

  $("#teacher-header").innerHTML = html;


}

// var showTeacherBadges = function(){

// }

var clickTeacherHandler = function(){
  $('.teacher').on('click', function(event){
    event.preventDefault();
    console.log(this.href);
    // debugger;
    $.ajax({
      url: this.href ,
      type: 'get',
      success: function(response){
        // console.log(response);
        var teacher = JSON.parse(response.currentTarget.response);
        $('#teachers-list').hide();
        showTeacherHeader(teacher);

        // showTeacherBadges();
      },
      fail: function (response) {console.log('fail' + response)}
    })

  })
}

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
      console.log(teachersListJSON);
      console.log("$$$$$")
      var teachersList = JSON.parse(teachersListJSON)
      console.log(teachersList);
      var target = $("#teacher-list");
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

      clickTeacherHandler();
    },
    fail: function (response) {console.log('fail' + response)}
  });

  // clickTeacherHandler();
// Hide teacher index
})
