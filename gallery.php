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

		<style>
			#site .gallery-image
			{
				position: absolute;
				z-index: 2;
				width: 100%;
				height: 100%;
				background: rgba(255, 255, 255, .8);
				top: 0px;
				left: 0px;
			}

			#site, #site a, #site h2, #site h1, #site h3
			{
				font-size: 18px;
				font-family: Georgia;
				font-weight: normal;
			}

			#site a
			{
				color: #000000;
			}

			#site a:hover
			{
				text-decoration: none;
			}
			
			#site .gallery-image .gallery-image-wrapper
			{
				position: absolute;
				left: 50%;
				top: 50%;
				visibility: hidden;
			}
			#site ul > li
			{
				float: left;
				padding: 20px;
				cursor: pointer;
				display: inline-block;
				height: 200px;
			}
			#site ul > li img
			{
				width: 150px;
			}

			#site .gallery-text
			{
				width: 40%;
				margin-left: 50px;
				margin-top: 50px;
			}
		</style>
		<!-- STYLES + RESET -->
		<link rel="stylesheet" href="src/css/style.css<?php print $cacheBuster; ?>">
		<link rel="stylesheet" href="src/css/demo.style.css<?php print $cacheBuster; ?>">

		<!-- LIBS -->
		<!--[if lt IE 9]>
			<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->

		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
		<script>window.jQuery || document.write('<script src="src/js/libs/jquery-1.7.1.min.js"><\/script>')</script>

		<script src="https://raw.github.com/millermedeiros/js-signals/master/dist/signals.min.js"></script>
		<script>window.signals || document.write('<script src="src/js/libs/signals.min.js"><\/script>')</script>

		<script src="https://raw.github.com/janl/mustache.js/master/mustache.js"></script>
		<script>window.Mustache || document.write('<script src="src/js/libs/mustache.js"><\/script>')</script>

		<script src="src/js/libs/libraries.js"></script>
		<script src="src/js/libs/path.js"></script>

		<!-- LOGIC -->
		<script src="src/js/RSSA.framework.js<?php print $cacheBuster; ?>"></script>
		<script src="src/js/RSSA.debug.js<?php print $cacheBuster; ?>"></script>
		<script src="src/js/RSSA.default.js<?php print $cacheBuster; ?>"></script>

		<script src="examples/Gallery.js<?php print $cacheBuster; ?>"></script>

		<script>
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', "U-XXXXXX-XX"]);
			_gaq.push(['_trackPageview']);

			(function() {
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();
		</script>
	</head>
	<body>
		<script>
			
		</script>

		<section id="site">
			<!-- dynamic content -->
		</section>
	</body>
</html>