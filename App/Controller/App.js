$(document).ready(function () {
  count_total();
  if (!checkCookieExists("username")) {
    $(".main-content").hide();
    $("#loginModal").modal("show");
    $('#btn-login').attr("disabled", false);
    $('#btn-login').html(`<i class="fa-solid fa-right-to-bracket"></i> Login`);
    $("#username").focus();
  } else {
    $("#my_login").text(`Todo List Loged in: (${getCookieValue("username")})`);
    $(".main-content").show();
  }
  $("#btn-login").click(function(e) {
    if ($("#username").val().length == 0) {
      Swal.fire("Username is empty", "Please insert username", "error");
      $("#username").focus();
      e.preventDefault();
      return;
    }
    if ($("#password").val().length == 0) {
      Swal.fire("Password is empty", "Please insert password", "error");
      $("#password").focus();
      e.preventDefault();
      return;
    }
    $(this).attr("disabled", true);
    $(this).text("Wait ...");
    var params = {
      username: $("#username").val(),
      password: $("#password").val(),
      type: 'login'
    }
    $.ajax({
      type: "post",
      url: "../Server/api.php",
      data: params,
      dataType: "json",
      success: function (response) {
        if (response.message == 'success') {
          Swal.fire({
            title: "Successfully",
            text: `Logged Success: ${response.username}`,
            icon: "success"
          });
          $("#loginModal").modal("hide");
          $("#username").val("");
          $("#password").val("");
          $("#title-header").text("Todo List (" + response.username + ')');
          setCookie("username", response.username, 14);
          $(".main-content").show();
          fetch_table();
        } else {
          Swal.fire({
            title: "Failed",
            text: `Logged Failed: ${response.username}`,
            icon: "error"
          });
          $("#username").focus();
          $("#username").val("");
          $("#password").val("");
          $("#btn-login").attr("disabled", false);
          $("#btn-login").html(`<i class="fa-solid fa-right-to-bracket"></i> Login`);
          $(".main-content").hide();
        }
      }
    });
  });
  $("#btn-logout").click(function() {
    Swal.fire({
      title: "Are you sure?",
      text: "Logout",
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCookie("username");
        $("#title-header").html(`Todo List <a href="#" class="text-white" data-bs-toggle="modal" data-bs-target="#loginModal">(Please Login now!)</a>`);
        $('#btn-login').attr("disabled", false);
        $('#btn-login').html(`<i class="fa-solid fa-right-to-bracket"></i> Login`);
        $(".main-content").hide();
        $("#loginModal").modal("show");
      }
    });
  });
  $("#password").change(function() {
    $("#btn-login").click();
  });
});
$(document).ready(function () {
  fetch_table();
  $('#todo').keydown(function(event) {
    if (event.which === 13) {
      if (!checkCookieExists("username")) {
        $.notify("Please Login !", "error");
        return false;
      }
      if ( $(this).val().length === 0 ) {
        Swal.fire("Please insert todo", "Login Now !", "error");
        return false;
      } 
      var params = {
        todo: $(this).val(),
        type: 'save',
        username: getCookieValue("username")
      };
      $.ajax({
        type: "post",
        url: "../Server/api.php",
        data: params,
        dataType: "json",
        success: function (response) {
          if (response.message == 'success') {
            var html = "";
            var hash = "";
            var hash2 = "";
            var edit = "";
            var del = "";
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
            $("#todo").val('');
            $("#todo").addClass("is-invalid");
            $.notify(`Saved Successfully`, 'success');
            $(".remove-all").css("display", "table");
            fetch_table(); //New Fetching
          }
        }
      });
    }
  });
  $(document).on('click', '#btn-edit', function(e) {
    e.preventDefault();
    var id = $(this).data('id');
    var todo = $(this).data('todo');
    var idx = `#txttodo-${id}`
    var btn_val = $.trim($(this).text())
    if ( btn_val == "Edit" ) {
      $(idx).html(`<input type="text" class="form-control txt-edit-${id}" id="txtedit" data-id=${id} value="${todo}">`);
      $(this).removeClass("btn-outline-warning");
      $(this).addClass("btn-outline-success");
      $(this).html(`<i class="fa-solid fa-floppy-disk"></i> Save`)
    }else{
      $(idx).html(`<td id="txttodo-${id}" class="txt-edit-${id}">${todo}</td>`);
      $(this).removeClass("btn-outline-success");
      $(this).addClass("btn-outline-warning");

      $(this).html(`<i class="fa-solid fa-pen"></i> Edit`);
    }
  });
  $(document).on('change', '#txtedit', function(){
    var todo = $(this).val();
    var id = $(this).data('id');
    var idx = `#txttodo-${id}`
    $("#edit-message").text(todo);
    $.ajax({
      type: "post",
      url: "../Server/api.php",
      data: {
        id: id,
        todo: todo,
        type: 'edit'
      },
      dataType: "json",
      success: function (response) {
        if (response.message == 'success') {
          $.notify(`Saved ${todo}`, 'success');
          $(idx).html(`<td id="txttodo-${id}" class="txt-edit-${id}">${todo}</td>`);
          $(this).removeClass("btn-outline-success");
          $(this).addClass("btn-outline-warning");
          $(this).text("Edit");
          $("#edit-message").text("");
          $.notify(`Edited ${todo} Successfully`, 'success');
          fetch_table();
        }
      }
    });
  });
  $(document).on('click', '#btn-delete', function(e) {
    e.preventDefault();
    var todo = $(this).data('todo');
    Swal.fire({
      title: "Are you sure?",
      text: `Delete: ${todo}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          type: "post",
          url: "../Server/api.php",
          data: {
            id: $(this).data('id'),
            type: 'delete'
          },
          dataType: "json",
          success: function (response) {
            if (response.message == 'success') {
              $.notify(`Deleted ${todo} Successfully`, 'success');
              fetch_table();
            }
          }
        });
        Swal.close();
      }else{
        Swal.close();
      }
    });
  });
  $(document).on('click', '#mark-read', function(e){
    var id = $(this).val();
    $.ajax({
      type: "post",
      url: "../Server/api.php",
      data: {
        id: id,
        type: 'mark-read'
      },
      dataType: "json",
      success: function (response) {
        if (response.message == 'success') {
          if (response.value === 1) {
            $.notify("Mark Enabled", "success")
          } else {
            $.notify("Mark Disabled", "error")
          }
            fetch_table();
        }
      }
    });
  });
  $("#btn-save-user").click(function (e) {
    
    if ( $("#add_username").val().length === 0 ) {
      Swal.fire("Username is blank", "Please insert password", "error");
      e.preventDefault();
      return false;
    }
    if ( $("#add_password").val().length === 0 ) {
      Swal.fire("Password is blank", "Please insert password", "error");
      e.preventDefault();
      return false;
    }
    $("#btn-save-user").attr("disabled", true);
    $("#btn-save-user").text("Please wait ...");
    var params = {
      username: $("#add_username").val(),
      password: $("#add_password").val(),
      type: 'add-user'
    }
    $.ajax({
      type: "post",
      url: "../Server/api.php",
      data: params,
      dataType: "json",
      success: function (response) {
        if (response.message == 'success') {
          $("#add_username").val("");
          $("#add_password").val("");
          Swal.fire("Added Users", `Added: ${params.username}`, "success");
          $("#adduserModal").modal("hide");
        } else {
          $("#add_username").val("");
          $("#add_password").val("");
          Swal.fire("Add User Error", "", "error");
          $("#adduserModal").modal("hide");
        }
      }
    });
  });
  $("#btn-add-user").click(function() {
    $("#btn-save-user").attr("disabled", false);
    $("#btn-save-user").text("Save");
    $("#adduserModal").modal("show");
  });
  $("#mark-delete-all").click(function() {
    Swal.fire({
      title: "Delete All Todo?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        $.ajax({
          type: "post",
          url: "../Server/api.php",
          data: {type: 'truncate'},
          dataType: "json",
          success: function (response) {
            if (response.message == 'success') {
              Swal.fire("Truncate All todo", "Successfully", "success");
              fetch_table();
              $("#mark-delete-all").prop("checked", false);
              $(".remove-all").css("display", "none");
              Swal.close();
            } else {
              console.log(response.message);
            }
          }
        });
      } else {
        $(this).prop("checked", false);
        Swal.close();
      }
    });
  });
  $("#todo").focusin(function (e) { 
    e.preventDefault();
    $(this).addClass("is-invalid");
  });
  $("#todo").keyup(function (e) { 
    e.preventDefault();
    if ( $(this).val().length > 0 ) {
      $(this).removeClass("is-invalid");
      $(this).addClass("is-valid");
    } else {
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
    }
  });
  //Add User
  $("#add_username").focusin(function (e) { 
    e.preventDefault();
    $(this).addClass("is-invalid");
  });
  $("#add_username").keyup(function (e) { 
    e.preventDefault();
    if ( $(this).val().length > 0 ) {
      $(this).removeClass("is-invalid");
      $(this).addClass("is-valid");
    } else {
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
    }
  });
  $("#add_password").focusin(function (e) { 
    e.preventDefault();
    $(this).addClass("is-invalid");
  });
  $("#add_password").keyup(function (e) { 
    e.preventDefault();
    if ( $(this).val().length > 0 ) {
      $(this).removeClass("is-invalid");
      $(this).addClass("is-valid");
    } else {
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
    }
  });
  //Login
  $("#username").focusin(function (e) { 
    e.preventDefault();
    $(this).addClass("is-invalid");
  });
  $("#username").keyup(function (e) { 
    e.preventDefault();
    if ( $(this).val().length > 0 ) {
      $(this).removeClass("is-invalid");
      $(this).addClass("is-valid");
    } else {
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
    }
  });
  $("#password").focusin(function (e) { 
    e.preventDefault();
    $(this).addClass("is-invalid");
  });
  $("#password").keyup(function (e) { 
    e.preventDefault();
    if ( $(this).val().length > 0 ) {
      $(this).removeClass("is-invalid");
      $(this).addClass("is-valid");
    } else {
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
    }
  });

});