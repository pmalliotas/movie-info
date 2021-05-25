const token = window.localStorage.getItem('token');

if (token) {
	document.getElementById('avatar').href = 'index.html';
    $("#rec").show();
	document.getElementById('avatar').addEventListener('click', () => {
		window.localStorage.removeItem('token');
	});
} else if (!token) {
}
