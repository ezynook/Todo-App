<?php
  $conn = new SQLite3('todo.db');
  date_default_timezone_set("Asia/Bangkok");
  $dt = date("Y-m-d H:i:s");
  if (!$conn) {
    echo "Error Connection";
  }
  if (isset($_POST['type'])) {

    $type = $_POST['type'];

    if ($type == 'save') {
      $query = $conn->exec("
        INSERT INTO
          todo_list (todo, status, username, datetime, is_delete)
        VALUES
          ('{$_POST['todo']}', 0, '{$_POST['username']}', '{$dt}', 0)
      ");
      $selectQuery = "SELECT * FROM todo_list WHERE username = '{$_POST['username']}' AND is_delete = 0 ORDER BY `status` ASC";
      $result = $conn->query($selectQuery);
      $data = [];
      while ($row = $result->fetchArray()) {
        $data[] = array(
          "id" => $row['id'],
          "todo" => $row['todo'],
          "datetime" => $row['datetime']
        );
      }
      if ($query) {
        echo json_encode([
          'message' => 'success',
          'result' => $data
        ]);
        $conn->close();
      }
    }
    if ($type == 'get') {
      $selectQuery = "SELECT * FROM todo_list WHERE username = '{$_POST['username']}' AND is_delete = 0 ORDER BY `status` ASC";
      $result = $conn->query($selectQuery);
      $data = [];
      if ($result) {
        while ($row = $result->fetchArray()) {
          $data[] = array(
            "id" => $row['id'],
            "todo" => $row['todo'],
            "datetime" => $row['datetime'],
            "status" => $row['status']
          );
        }
        echo json_encode([
          'message' => 'success',
          'result' => $data
        ]);
      } else {
        echo json_encode([
          'message' => 'success',
          'result' => "No Data Available"
        ]);
      }
      $conn->close();
    }
    if ($type == 'delete') {
      $query = $conn->exec("UPDATE todo_list SET is_delete = 1 WHERE id=".$_POST['id']);
      if ($query) {
        echo json_encode(['message' => 'success']);
        $conn->close();
      }
    }
    if ($type == 'edit') {
      $query = $conn->exec("UPDATE todo_list SET todo = '{$_POST['todo']}', `datetime` = '{$dt}' WHERE id=".$_POST['id']);
      if ($query) {
        echo json_encode(['message' => 'success']);
        $conn->close();
      }
    }
    if ($type == 'mark-read') {
      $result = $conn->query("SELECT `status` FROM todo_list WHERE id = '{$_POST['id']}' AND is_delete = 0");
      $row = $result->fetchArray();
      if ($row['status'] == 0) {
        $query = $conn->exec("UPDATE todo_list SET `status` = 1 WHERE id=".$_POST['id']);
      } else {
        $query = $conn->exec("UPDATE todo_list SET `status` = 0 WHERE id=".$_POST['id']);
      }
      if ($query) {
        echo json_encode([
          'message' => 'success',
          "value" => intval($row['status'])
        ]);
        $conn->close();
      }
    }
    if ($type == 'login') {
      $password = base64_encode($_POST['password']);
      $sql = "SELECT COUNT(*) AS count FROM users WHERE username = '{$_POST['username']}' AND `password` = '{$password}'";
      $countResult = $conn->querySingle($sql);
      if ($countResult > 0) {
        $selectQuery = "SELECT username FROM users WHERE username = '{$_POST['username']}'";
        $result = $conn->query($selectQuery);
        $row = $result->fetchArray();
        echo json_encode([
          "message" => "success",
          "username" => $row['username']
        ]);
      } else {
        echo json_encode([
          "message" => "fail",
          "username" => null
        ]);
      }
      $conn->close();
    }
    if ($type == 'add-user') {
      $passwd = base64_encode($_POST['password']);
      $sql = "
        INSERT INTO
          users (username, password)
        VALUES ('{$_POST['username']}', '{$passwd}')
      ";
      $query = $conn->exec($sql);
      if ($query) {
        echo json_encode(["message" => "success"]);
      } else {
        echo json_encode(["message" => "fail"]);
      }
      $conn->close();
    }
    if ($type == 'truncate') {
      $q1 = $conn->exec("UPDATE todo_list SET is_delete = 1 WHERE username = '{$_POST['username']}'");
      // $q2 = $conn->exec("DELETE FROM sqlite_sequence WHERE name='todo_list'");
      if ($q1) {
        echo json_encode(["message" => "success"]);
      } else {
        echo json_encode(["message" => "Error Truncate Table"]);
      }
    }
    if ($type == 'count') {
        $selectQuery = "SELECT COUNT(*) AS total FROM todo_list WHERE is_delete = 0";
        $result = $conn->query($selectQuery);
        $row = $result->fetchArray();
        echo json_encode(["message" => "success", "result" => $row['total']]);
    }
    $conn->close();
  }
?>