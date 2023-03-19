const baseurl = "http://127.0.0.1:8000/api/v1/";
const baseimageurl = "http://127.0.0.1:8000/storage/";

// GLobal Functions

const ExecuteGetAPI = async (api_url) => {
  try{
    return await axios(api_url);
  }catch(error){
    console.log(error);
  }
}

const ExecutePostAPI = async (api_url, api_data, api_token = null, api_token_type = null) => {
  try{
    return await axios.post(
      api_url,
      api_data,
      {
        Headers:{
          'Content-Type' : 'application/json',
          'Accept' : 'application/json',
          'Authorization' : api_token_type + " " + api_token
        }
      }
    );
  }catch(error){
    console.log(error);
  }
}

const PostRegistrationData = async (event, register_url, profile_picture) => {
  event.preventDefault();
  const name = document.getElementById("Name").value;
  const email = document.getElementById("Email").value;
  const password = document.getElementById("Password").value;
  const confirm_password = document.getElementById("Confirm-password").value;
  const age = document.getElementById("Age").value;
  const gender_id = document.getElementById("Gender").value;
  const location = document.getElementById("Location").value;


  if(password == confirm_password){
    let data = new FormData();
    data.append('name', name);
    data.append('email', email);
    data.append('password', password);
    data.append('age', age);
    data.append('gender_id', gender_id);
    data.append('location', location);
    data.append('profile_picture', profile_picture);
    
    const response = await ExecutePostAPI(register_url, data);
    console.log(response);
    if(response.data.status == "User Added!"){
      window.location.href = "login.html";
      console.log(response.data.status);
    }else{
      console.log("Email Already Exists!");
    }
  }else{
    console.log("Not the same password");
  }
}

const PostLoginData = async (event, login_url) => {
  console.log('hgello');
  event.preventDefault();
  const email = document.getElementById("Email").value;
  const password = document.getElementById("Password").value;

  const data = new FormData();
  data.append('email', email);
  data.append('password', password);

  const response = await ExecutePostAPI(login_url, data);
  console.log(response);
  sessionStorage.setItem("token", response.data.access_token);
  sessionStorage.setItem("token_type", response.data.token_type);
}


// Page Functions

const LoadRegister = async () => {
  const register_url = baseurl + "signup";
  const register_button = document.getElementById("Register-button");

  const profile_picture_input = document.getElementById("Profile-picture");
  let profile_picture = '';

  profile_picture_input.addEventListener("change", function(){
    const reader = new FileReader();
    reader.addEventListener("load",() => {
      profile_picture = reader.result;
      console.log(profile_picture); 
    });
    reader.readAsDataURL(this.files[0]);
  });
  

  register_button.addEventListener("click", (event) => PostRegistrationData(event, register_url, profile_picture));

}

const LoadLogin = () => {
  const login_url = baseurl + "auth/login";
  const login_button = document.getElementById("Login-button");

  login_button.addEventListener("click", (event) => PostLoginData(event, login_url));
}