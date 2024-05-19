const logoutButton = document.querySelector('#logout_button');

const logout = () => {
  axios
    .get('/api/v1/users/logout')
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
