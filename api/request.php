<?php 
include 'connect.php';

$url =  $_SERVER['PHP_SELF'];	
$url = explode("/", $url);

if(isset($url[4]))
$service = $url[4];

if(isset($url[5]))
$method = $url[5];


$data = file_get_contents('php://input');

switch($service)
{
	case "categories":
	categories($method,$mysqli,$data);
	break;

	case "sub_categories":
	sub_categories($method,$mysqli,$data);
	break;

	case "products":
	product($method,$mysqli,$data);
	break;

	case "upload":
	uploadImage($method,$mysqli,$data);
	break;

	case "login":
	login($method,$mysqli,$data);
	break;

	case "contacts":
	contacts($method,$mysqli,$data);
	break;

	default :
	echo "Don't do this";
	break;
}

function getCount($mysqli,$table){
	$query = "SELECT COUNT(*) FROM $table";
	$result = $mysqli->query($query) or die($mysqli->error.__LINE__);
	$row =  $result->fetch_row();
	$total =  $row[0];
	return $total;	
}

function getAll($mysqli,$data,$query,$table){
	// Find out how many items are in the table
	$total =  getCount($mysqli,$table);
	// How many items to list per page
		 $limit = 10;
	// How many pages will there be
		 $pages = ceil($total / $limit);
	// What page are we currently on?
		 $page = $data['page'];
	// Calculate the offset for the query
		 $offset = ($page - 1)  * $limit;

		 if(!$query){
			 $query = "SELECT * from $table order by _id limit ? offset ?";
		 }

		 $stmt=$mysqli->prepare($query);
		 $stmt->bind_param('ss', $limit,$offset);
		 $stmt->execute();
		 $result = $stmt->get_result();
		 $contacts = mysqli_fetch_all ($result, MYSQLI_ASSOC);

		$myObj = new \stdClass();
		$myObj->result = $contacts;
		$myObj->totalCount = $total;
		
		return $myObj;

}

function contacts($method,$mysqli,$data)
{
	$data = json_decode($data, true);
	
	if ($method=="getAll")
	{
		$query=null;
		$sendObj = getAll($mysqli,$data,$query,'contacts');
		echo json_encode($sendObj);
	}

	if ($method=="getOne")
	{

		$stmt = $mysqli->prepare('SELECT * FROM contacts WHERE _id = ?');
		$stmt->bind_param('s', $data['_id']);
		$stmt->execute();
		$result = $stmt->get_result();
		$json = mysqli_fetch_all ($result, MYSQLI_ASSOC);
		echo json_encode($json );
	}

	if ($method=="create")
	{

		//Getting the data 
		$name = $data['name'];
		$number = $data['number'];
		$email = $data['email'];
		$address = $data['address'];
	
		$stmt = $mysqli->prepare('INSERT INTO contacts (name, number, email, address) VALUES (?, ?, ?, ?)');
		$stmt->bind_param('ssss', $name,$number,$email,$address);
		$result = $stmt->execute();
		echo json_encode($result);
	}

	if ($method=="delete")
	{

		$id = $data['id'];
		$stmt = $mysqli->prepare('DELETE FROM contacts WHERE _id = ?');
		$stmt->bind_param('s', $id);
		$result = $stmt->execute();
		echo json_encode($result);
	}

	if($method=="update")
	{
		$query = "UPDATE contacts SET";
		$comma = " ";
		$id = $data['_id'];
		$whitelist = array(
			'name',
			'number',
			'email',
			'address'
		);

		foreach($data as $key => $val) {
			if( ! empty($val) && in_array($key, $whitelist)) {
				$query .= $comma . $key . " = '" . $mysqli->real_escape_string(trim($val)) . "'";
				$comma = ", ";
			}
		}
		$query .= " where _id = ?";
		$stmt = $mysqli->prepare($query);
		$stmt->bind_param('s', $id);
		$result = $stmt->execute();

		echo $result;
	}

}

function login($method,$mysqli,$data)
{
	// echo $data;
	$data = json_decode($data,true);
	// print_r $data;
	if($method=="login")
	{
		$username = $data['username'];
		// echo $username;
		$password = $data['password'];
		$loginResponse = array();
		$stmt=$mysqli->prepare('SELECT * FROM user_details where user_name = ?');
		$stmt->bind_param('s', $username);
		$stmt->execute();
		$result = $stmt->get_result();
		if ($result->num_rows === 1)
		{
			$user_details = mysqli_fetch_all ($result, MYSQLI_ASSOC);
			json_encode($user_details);
			if (password_verify($password, $user_details[0]['user_pass']))
			{	
				json_encode($user_details[0]['access_level']);
				$loginResponse = array('access' => $user_details[0]['access_level'],'success' => 'true');
				echo json_encode($loginResponse);
		}
			else
			{
				$loginResponse = array('success' => 'false');
				echo json_encode($loginResponse);
			}	
				
		}
		else
		{
			$loginResponse = array('success' => 'false');
			echo json_encode($loginResponse);
		}
		

	}

	if($method=="register")
	{
		$username = $data['username'];
		$password = $data['password'];
		$access = $data['access'];
		$password_hash = password_hash($password,PASSWORD_DEFAULT);
		$stmt = $mysqli->prepare('INSERT INTO user_details(user_name,user_pass,access_level) values (?, ?, ?)');
				$stmt->bind_param('sss',$username,$password_hash,$access);
				$result = $stmt->execute();
				if($result)
					echo $result;
				else
				{
					echo "Theres some problem inserting the new raw material";
					
				}
	}

}


function categories($method,$mysqli,$data)
{
	$data = json_decode($data, true);
	
	if ($method=="getAll")
	{
		if($data && $data['page']){
			$query = null;
			$sendObj = getAll($mysqli,$data,$query,'categories');
			echo json_encode($sendObj);
		}else{
			$query="select * from categories";
			$result = $mysqli->query($query) or die($mysqli->error.__LINE__);
			$json = mysqli_fetch_all ($result, MYSQLI_ASSOC);
			echo json_encode($json );
		}
	
	}

	if ($method=="getOne")
	{

		$stmt = $mysqli->prepare('SELECT * FROM categories WHERE _id = ?');
		$stmt->bind_param('s', $data['_id']);
		$stmt->execute();
		$result = $stmt->get_result();
		$json = mysqli_fetch_all ($result, MYSQLI_ASSOC);
		echo json_encode($json );

		// echo "pp";
		// $query="select * from categories where _id=" + $data['_id'];
		// echo $query;
		// $result = $mysqli->query($query) or die($mysqli->error.__LINE__);
		// $json = mysqli_fetch_all ($result, MYSQLI_ASSOC);
		// echo json_encode($json );
	}

	if ($method=="create")
	{

		//Getting the data 
		$name = $data['name'];
		$priority = $data['priority'];
	
		$stmt = $mysqli->prepare('INSERT INTO categories (name, priority) VALUES (?, ?)');
		$stmt->bind_param('ss', $name,$priority);
		$result = $stmt->execute();
		echo json_encode($result);
	}

	if ($method=="delete")
	{

		$id = $data['id'];
		$stmt = $mysqli->prepare('DELETE FROM categories WHERE _id = ?');
		$stmt->bind_param('s', $id);
		$result = $stmt->execute();
		echo json_encode($result);
	}

	if($method=="update")
	{
		$query = "UPDATE categories SET";
		$comma = " ";
		$id = $data['_id'];
		$whitelist = array(
			'name',
			'priority'
		);

		foreach($data as $key => $val) {
			if( ! empty($val) && in_array($key, $whitelist)) {
				$query .= $comma . $key . " = '" . $mysqli->real_escape_string(trim($val)) . "'";
				$comma = ", ";
			}
		}
		$query .= " where _id = ?";
		$stmt = $mysqli->prepare($query);
		$stmt->bind_param('s', $id);
		$result = $stmt->execute();

		echo $result;
	}

}

function sub_categories($method,$mysqli,$data)
{

	$data = json_decode($data, true);

	if ($method=="getAll"){

		if($data && $data['page']){
			$query = "SELECT sub_categories._id ,sub_categories.name AS sub_cat_name, categories._id AS cat_id,categories.name AS cat_name FROM sub_categories LEFT JOIN categories ON sub_categories.category=categories._id order by _id limit ? offset ?";
			$sendObj = getAll($mysqli,$data,$query,'sub_categories');
			echo json_encode($sendObj);
		}else{
			$query="SELECT sub_categories._id ,sub_categories.name AS sub_cat_name, categories._id AS cat_id,categories.name AS cat_name FROM sub_categories LEFT JOIN categories ON sub_categories.category=categories._id";
			$result = $mysqli->query($query) or die($mysqli->error.__LINE__);
			$json = mysqli_fetch_all ($result, MYSQLI_ASSOC);
			echo json_encode($json );
		}
	}else if ($method=="getAllByCat"){
		$category = $data['category'];
		$stmt = $mysqli->prepare('SELECT * FROM sub_categories WHERE category = ?');
		$stmt->bind_param('s', $category);
		$stmt->execute();
		$result = $stmt->get_result();
		$json = mysqli_fetch_all ($result, MYSQLI_ASSOC);
		echo json_encode($json );
	}else if($method=="create"){
		//Getting the data 
		$name = $data['name'];
		$category = $data['category'];
	
		$stmt = $mysqli->prepare('INSERT INTO sub_categories (name, category) VALUES (?, ?)');
		$stmt->bind_param('ss', $name,$category);
		$result = $stmt->execute();
		echo json_encode($result);
	}else {
		if(isset($data['id'])){
			if ($method=="getOneById"){
					$id = $data['id'];
					$stmt = $mysqli->prepare('SELECT sub_categories._id ,sub_categories.name AS sub_cat_name, categories._id AS cat_id,categories.name AS cat_name FROM sub_categories LEFT JOIN categories ON sub_categories.category=categories._id WHERE sub_categories._id = ?');
					$stmt->bind_param('s', $id);
					$stmt->execute();
					$result = $stmt->get_result();
					$json = mysqli_fetch_all ($result, MYSQLI_ASSOC);
					echo json_encode($json );
			}else if ($method=="delete"){
				$id = $data['id'];
				$stmt = $mysqli->prepare('DELETE FROM sub_categories WHERE _id = ?');
				$stmt->bind_param('s', $id);
				$result = $stmt->execute();
				echo json_encode($result);
			}else if($method=="update"){
				$query = "UPDATE sub_categories SET";
				$comma = " ";
				$id = $data['id'];
				$whitelist = array(
					'name',
					'category'
				);
		
				foreach($data as $key => $val) {
					if( ! empty($val) && in_array($key, $whitelist)) {
						$query .= $comma . $key . " = '" . $mysqli->real_escape_string(trim($val)) . "'";
						$comma = ", ";
					}
				}
				$query .= " where _id = ?";
				$stmt = $mysqli->prepare($query);
				$stmt->bind_param('s', $id);
				$result = $stmt->execute();
		
				echo $result;
			}
		}else{
			echo "Parameters are not defined properly\n";
		}
	}
}

function product($method,$mysqli,$data)
{

		$data = json_decode($data, true);

		// create,getAll
		if ($method=="getAllBySubCat"){
			$stmt = $mysqli->prepare('SELECT * FROM products WHERE sub_categories = ?');
			$stmt->bind_param('s', $sub_cat);
			$stmt->execute();
			$result = $stmt->get_result();
			$json = mysqli_fetch_all ($result, MYSQLI_ASSOC);
			echo json_encode($json );
		}else if ($method=="getAll"){
			if($data && $data['page']){
				$query = "SELECT products._id ,products.name AS prod_name,products.link AS prod_img,products.priority AS prod_priority,products.status AS prod_status,sub_categories.name AS sub_cat_name FROM products LEFT JOIN sub_categories ON products.sub_categories=sub_categories._id order by _id limit ? offset ?";
				$sendObj = getAll($mysqli,$data,$query,'products');
				echo json_encode($sendObj);
			}else{
				$stmt = $mysqli->prepare('SELECT products._id ,products.name AS prod_name,products.link AS prod_img,products.priority AS prod_priority,products.status AS prod_status,sub_categories.name AS sub_cat_name FROM products LEFT JOIN sub_categories ON products.sub_categories=sub_categories._id');
				$stmt->execute();
				$result = $stmt->get_result();
				$json = mysqli_fetch_all ($result, MYSQLI_ASSOC);
				echo json_encode($json );
			}
		}else if($method=="create"){
			//Getting the data 
			$name = $data['name'];
			$sub_categories = $data['sub_categories'];
			$link = $data['link'];
			$status = intval($data['status']);
			$priority = intval($data['priority']);
		
			$stmt = $mysqli->prepare('INSERT INTO products (name, sub_categories, link, status, priority) VALUES (?, ?, ?, ?, ?)');
			$stmt->bind_param('sssss', $name,$sub_categories,$link,$status,$priority);
			$result = $stmt->execute();
			echo json_encode($result);
		}else {
			if(isset($data['id'])){
				if ($method=="getOneById"){
						$id = $data['id'];
						$stmt = $mysqli->prepare('SELECT products._id ,products.name AS prod_name,products.link AS prod_link,products.status AS prod_status,products.priority AS prod_priority, sub_categories._id AS sub_cat_id,sub_categories.name AS sub_cat_name,categories._id AS cat_id,categories.name AS cat_name FROM products LEFT JOIN sub_categories ON products.sub_categories=sub_categories._id LEFT JOIN categories ON sub_categories.category=categories._id  WHERE products._id = ?');
						$stmt->bind_param('s', $id);
						$stmt->execute();
						$result = $stmt->get_result();
						$json = mysqli_fetch_all ($result, MYSQLI_ASSOC);
						echo json_encode($json );
				}else if ($method=="delete"){
					$id = $data['id'];
					$stmt = $mysqli->prepare('DELETE FROM products WHERE _id = ?');
					$stmt->bind_param('s', $id);
					$result = $stmt->execute();
					echo json_encode($result);
				}else if($method=="update"){
					$query = "UPDATE products SET";
					$comma = " ";
					$id = $data['id'];
					$whitelist = array(
						'name',
						'sub_categories',
						'status',
						'link',
						'priority'
					);
			
					foreach($data as $key => $val) {
						if( ! empty($val) && in_array($key, $whitelist)) {
							$query .= $comma . $key . " = '" . $mysqli->real_escape_string(trim($val)) . "'";
							$comma = ", ";
						}
					}
					$query .= " where _id = ?";
					$stmt = $mysqli->prepare($query);
					$stmt->bind_param('s', $id);
					$result = $stmt->execute();
			
					echo $result;
				}
			}else{
				echo "Parameters are not defined properly\n";
			}
		}
}

function uploadImage($method,$mysqli,$data)
{
	define ('SITE_ROOT', realpath(dirname(__DIR__)));


	$target_dir =SITE_ROOT . ("/uploads/") ;
	$name =$_FILES["file"]["name"];
	$target_file = $target_dir . basename($_FILES["file"]["name"]);
	move_uploaded_file($_FILES["file"]["tmp_name"], $target_file);
	echo $_FILES["file"]["name"]; 
	

	// $stmt = $mysqli->prepare('select name,MAX(_ID) from images');
	
	// $result = $stmt->execute();
	
	// echo 


	// echo $target_file;
	// $sql = "INSERT INTO MyData (name,filename) VALUES ('".$name."','".basename($_FILES["file"]["name"])."')";

	// if ($conn->query($sql) === TRUE) {
		
	// } else {
	//    echo "Error: " . $sql . "<br>" . $conn->error;
	// }

}

?>