function deleteCookie(cookieName) {
  document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
function setCookie(name, value, daysToExpire) {
  var expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + daysToExpire);

  var cookie = name + "=" + encodeURIComponent(value) + "; expires=" + expirationDate.toUTCString() + "; path=/";

  document.cookie = cookie;
}
function checkCookieExists(cookieName) {
  var cookies = document.cookie.split('; ');
  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      if (cookie.indexOf(cookieName + '=') === 0) {
          return true;
      }
  }

  return false;
}
function getCookieValue(cookieName) {
  var cookies = document.cookie.split('; ');
  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      if (cookie.indexOf(cookieName + '=') === 0) {
          return cookie.substring(cookieName.length + 1);
      }
  }

  return null;
}
function fetch_table() {
  if (!checkCookieExists("username")) {
    $.notify("Please Login !", "error");
    return false;
  }
  $.ajax({
    type: "post",
    url: "../Server/api.php",
    data: {
      username: getCookieValue("username"),
      type: 'get'
    },
    dataType: "json",
    success: function (response) {
      if (response.message == 'success') {
        var html = "";
        var hash = "";
        var hash2 = "";
        var edit = "";
        var del = "";
        if (response.result.length === 0) {
          $("#mytable").css("display", "table");
          $("#todo-list").html(`<div align="center"><b class="text-danger">No Data Available</b></div>`);
        } else {
          $.each(response.result, function (k, v) { 
            if (v.status == 1) {
              hash = "text-decoration-line-through text-success";
              hash2 = "checked";
              edit = 'disabled="disabled"';
              del = 'disabled="disabled"';
            }else{
              hash = null;
              hash2 = null;
              edit = null;
              del = null;
            }
            var momentDate = moment(v.datetime, "YYYY-MM-DD HH:mm:ss");
            var formattedDate = momentDate.format("DD/MM/YYYY HH:mm:ss");
             html += `
              <tr>
                <td>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="mark-read" value="${v.id}" ${hash2}>
                  </div>
                </td>
                <td id="txttodo-${v.id}" class="txt-edit-${v.id} ${hash}">${v.todo}</td>
                <td align="right">
                <button class="btn btn-sm btn-outline-primary txtdt">${formattedDate}</button>
                <button
                    type="button"
                    data-id=${v.id}
                    data-todo="${v.todo}"
                    id="btn-edit"
                    ${edit}
                    class="btn btn-outline-warning btn-sm btn-edit-${v.id}">
                    <i class="fa-solid fa-pen"></i>
                    Edit
                </button>
                <button
                      type="button"
                      data-id=${v.id}
                      data-todo="${v.todo}"
                      id="btn-delete"
                      ${del}
                      class="btn btn-outline-danger btn-sm btn-delete-${v.id}">
                      <i class="fa-solid fa-trash-can"></i>
                      Delete
                  </button>
                </td>
            </tr>
             `;
          });
          $("#mytable").css("display", "table");
          $("#todo-list").html("");
          $("#todo-list").append(html);
          $(".remove-all").css("display", "table");
        }
      }
    }
  });
}
function count_total() {
  $.ajax({
    type: "post",
    url: "Server/api.php",
    data: {type: 'count'},
    dataType: "json",
    success: function (response) {
      if (response.message == "success") {
        $("#count_todo").html(`
          <button type="button" class="btn btn-light position-relative">
            Total Task
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
              ${response.result}
              <span class="visually-hidden">unread messages</span>
            </span>
          </button>
        `);
      }
    }
  });
}

function checkTheme(){
  let theme = localStorage.getItem("todo-theme");
  if (theme == 'dark') {
      $("#theme").removeClass("btn-light");
      $("#theme").addClass("btn-dark");
      $("#theme").html(`<i class="fa-solid fa-moon"></i>`);
      $("#myul").addClass("bg-dark text-white");
      $("html").attr("data-bs-theme", "dark");
      localStorage.setItem("todo-theme", "dark");
  } else {
      $("#theme").removeClass("btn-dark");
      $("#theme").addClass("btn-light");
      $("#myul").addClass("bg-white text-dark");
      $("#theme").html(`<i class="fa-regular fa-moon"></i>`);
      $("html").removeAttr("data-bs-theme");
      localStorage.setItem("todo-theme", "light");
  }
}

function loadProgress(int) {
  resetToDefaults();
  topbar.show();
  setTimeout(function () {
      $('.main-content').fadeIn('slow');
      topbar.hide();
  }, int);
}

function resetToDefaults() {
  topbar.config({
      autoRun: true,
      barThickness: 3,
      barColors: {
          '0': 'rgba(26,  188, 156, .9)',
          '.25': 'rgba(52,  152, 219, .9)',
          '.50': 'rgba(241, 196, 15,  .9)',
          '.75': 'rgba(230, 126, 34,  .9)',
          '1.0': 'rgba(211, 84,  0,   .9)'
      },
      shadowBlur: 10,
      shadowColor: 'rgba(0,   0,   0,   .6)',
      className: 'topbar'
  });
}