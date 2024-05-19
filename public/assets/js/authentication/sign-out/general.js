const logoutButton = document.querySelector('#logout_button');

const logout = () => {
  axios
    .get('http://127.0.0.1:8000/api/v1/users/logout')
    .then(res => {
      if (res.data.status === 'success') location.assign('/login');
    })
    .catch(err => {
      console.log(err);
    });
};

if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}
