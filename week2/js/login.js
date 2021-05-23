console.clear();

// login infor
const userNameInput = document.querySelector("#username");
const pwdInput = document.querySelector("#password");

// behavior
const loginBtn = document.querySelector("button[type='submit']");

// used function
function login(e) {

  // button 標籤預設值是 submit，在沒設定 type=button 的情況下，會自動提交表單，導致接下來的程式碼無法執行
  e.preventDefault();

  const username = userNameInput.value;
  const password = pwdInput.value;

  const user = {
    username,
    password
  };
  // console.log(user);
  axios.post(`${url}admin/signin`, user)
    .then(res => {
      console.log(res);
      // 取出 token 與 expired 資訊
      console.log(this);

      if (res.data.success) {
        const token = res.data.token;
        const expired = res.data.expired;
        // 存入 cookie
        document.cookie = `hexToken=${token}; expired=${new Date(expired)}`;

        swal(res.data.message, "Good job!", "success")
          .then(res => {
            window.location.href = 'product.html';
          })
      } else {
        swal(res.data.message, "Wrong", "error")
      }

    })
    .catch(err => {
      console.log(err);
    })

}




//* main program
loginBtn.addEventListener('click', login);