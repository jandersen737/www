<?php
	session_start();
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	
	<head>
	
		<meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
		
		<title>virPONG logout</title>

	</head>

	<body>

		<?php
			session_destroy();
			header('Location:login_form.php');
		?>

	</body>

</html>
