<?php
	//kill that cache on JS files.
	$cacheBuster = "?cache=".rand();
?>
<!doctype html>
	<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
	<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
	<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
	<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<title></title>

		<meta name="viewport" content="user-scalable=no, initial-scale=1">

		<!-- STYLES + RESET -->
		<link rel="stylesheet" href="src/css/style.css<?php print $cacheBuster; ?>">

		<!-- LIBS -->
		<!--[if lt IE 9]>
			<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->

		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
		<script src="src/js/libs/libraries.js"></script>
		<script src="https://raw.github.com/millermedeiros/js-signals/master/dist/signals.min.js"></script>
		<script src="src/js/libs/path.js"></script>
		<script src="https://raw.github.com/janl/mustache.js/master/mustache.js"></script>

		<!-- LOGIC -->
		<script src="src/js/RSSA.framework.js<?php print $cacheBuster; ?>"></script>


		<script src="src/js/Test.js<?php print $cacheBuster; ?>"></script>
	</head>
	<body>
		<script>
			
		</script>

		<section id="site">
			<!-- dynamic content -->
			<div id="pages">
			</div>
		</section>
	</body>
</html>