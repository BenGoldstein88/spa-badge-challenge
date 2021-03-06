var newBadgeHandler = function() {

  $('.add-badge').on('submit', function(event) {
    event.preventDefault();
    var newBadgeForm = $("#add-new-badge");
    var newBadgeData = serialize(newBadgeForm);
    var newUrl = newBadgeForm.getAttribute('action') + "?" + newBadgeData
    $.ajax({
      url:  newUrl,
      type: 'POST',
      success: function(response){
        console.log(response.currentTarget.response)
        console.log("success")
        var teacherID = JSON.parse(response.currentTarget.response).teacher_id;
        var teacherURL = 'http://spa-badge-api.herokuapp.com/teachers/' + teacherID
        var type = 'GET'
        $.ajax({
          url: teacherURL,
          type: type,
          success: function(response){
            var teacher = JSON.parse(response.currentTarget.response);
            // $('#teachers-list').hide();
            $('#teacher-header').innerHTML = '';
            $('#teacher-badges').innerHTML = '';
            showTeacherHeader(teacher);
            showTeacherBadges(teacher);
          },
          fail: function(response) {
            console.log('ERROR' + response)
          }
        })


      },
      fail: function (response) {console.log('fail' + response)}
    })
  })
}
var showTeacherHeader = function(teacher){
  var target = $("#teacher-header-script");
  var source = target.innerHTML;
  var template = Handlebars.compile(source);
  var context = {teacher: teacher};
  var html = template(context);
  $("#teacher-header").innerHTML = html;
}

var showTeacherBadges = function(teacher){
  var target = $("#teacher-badges-script");
  var source = target.innerHTML;
  var template = Handlebars.compile(source);
  var context = {teacher:teacher}
  var html = template(context);
  $("#teacher-badges").innerHTML = html;
  newBadgeHandler();
}

var clickTeacherHandler = function(){
  $('.teacher').on('click', function(event){
    event.preventDefault();
    $.ajax({
      url: this.href ,
      type: 'get',
      success: function(response){
        var teacher = JSON.parse(response.currentTarget.response);
        $('#teachers-list').hide();
        showTeacherHeader(teacher);
        showTeacherBadges(teacher);
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
      var teachersListJSON = response.currentTarget.response
      var teachersList = JSON.parse(teachersListJSON)
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
