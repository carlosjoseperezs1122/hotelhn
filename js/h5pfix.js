// JavaScript Document
$(document).ready(function() {
	var ancho=window.innerWidth;
	console.log(ancho);
	dimension="width='100%'"
	$("iframe[src*='hvp/embed.php']").wrap("<table align='center' "+dimension+"><tr><td></td></tr></table>");
});