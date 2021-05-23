

// login infor
const userNameInput = document.querySelector("#username");
const pwdInput = document.querySelector("#password");

// behavior
const loginSubmit = document.querySelector("button[type='submit']");

// used function
function login() {
  const username = userNameInput.value;
  const password = pwdInput.value;

  const user = {
    username,
    password
  };
  console.log(user);
  axios.post(`${url}admin/signin`, user)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    })

}




//* main program
loginSubmit.addEventListener('click', login);