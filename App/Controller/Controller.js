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
    Swal.fire("Please Login !", "Login Now !", "error");
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
              hash = "text-decoration-line-through";
              hash2 = "checked";
              edit = 'disabled="disabled"';
              del = 'disabled="disabled"';
            }else{
              hash = null;
              hash2 = null;
              edit = null;
              del = null;
            }
             html += `
              <tr>
                <td>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="mark-read" value="${v.id}" ${hash2}>
                  </div>
                </td>
                <td id="txttodo-${v.id}" class="txt-edit-${v.id} ${hash}">${v.todo}</td>
                <td align="right">
                <span class="badge bg-primary">${v.datetime}</span>
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