document.getElementById("cards").style.transform = "none";
document.getElementById("file-upload-form").style.transform = "none";
document.getElementById("youtube-upload-form").style.transform = "none";

function hide_all_cards() {
	document.getElementById(
		"file-upload-form"
	).style.transform = document.getElementById("cards").style.transform =
document.getElementById("youtube-upload-form").style.transform = 
	 
	document.getElementById("hide-all-cards").style.display = "none";
    
}

function showoptions() {
	document.getElementById("hide-all-cards").style.display = "block";

	if (document.getElementById("cards").style.transform == "none")
		document.getElementById("cards").style.transform = "translateY(-190px)";
	else hide_all_cards();
}
function Open(name) {

	if (name == "file") {
		hide_all_cards();
		document.getElementById("hide-all-cards").style.display = "block";

		document.getElementById("cards").style.transform = "translateY(-190px)";
		if (document.getElementById("file-upload-form").style.transform == "none")
			document.getElementById("file-upload-form").style.transform =
				"translateY(-130px)";
		else document.getElementById("file-upload-form").style.transform = "none";
	} else if (name == "youtube") {
		hide_all_cards();
		document.getElementById("hide-all-cards").style.display = "block";

		document.getElementById("cards").style.transform = "translateY(-190px)";

		if (document.getElementById("youtube-upload-form").style.transform == "none")
		document.getElementById("youtube-upload-form").style.transform =
			"translateY(-130px)";
	else document.getElementById("youtube-upload-form").style.transform = "none";
	}
}
