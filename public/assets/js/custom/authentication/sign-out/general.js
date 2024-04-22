const logoutButton = document.querySelector('#logout_button');

const logout = () => {
  axios
    .get('/logout')
    .then(response => {
      console.log(response);
      // location.reload(true);
    })
    .catch(error => {
      console.log(error);
    });
};

if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}
