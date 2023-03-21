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
        headers:{
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
  event.preventDefault();
  const email = document.getElementById("Email").value;
  const password = document.getElementById("Password").value;

  const data = new FormData();
  data.append('email', email);
  data.append('password', password);

  const response = await ExecutePostAPI(login_url, data);
  if(response == undefined){
    alert("Wrong Email or Password!");
  }else{
    sessionStorage.setItem("token", response.data.access_token);
    sessionStorage.setItem("token_type", response.data.token_type);
    window.location.href = "index.html";
  }
}

const ToggleNavbar = () => {
  const navbar = document.getElementsByTagName("nav");
  for(let i=0; i<navbar.length; i++){
    navbar[i].classList.toggle("Disabled");
  }
}

const CheckUser = async () => {
  const index_url = baseurl + "auth/me";
  const token = sessionStorage.getItem("token");
  const token_type = sessionStorage.getItem("token_type");
  const response = await ExecutePostAPI(index_url, null, token, token_type);
  if(response != undefined){
    ToggleNavbar();

    return {
      id: response.data.id,
      age: response.data.age,
      email: response.data.email,
      gender_id: response.data.gender_id,
      location: response.data.location,
      name: response.data.name,
      profile_picture: response.data.profile_picture
    }
  }else{
    return "Failed";
  }
}

const ChangeTheButton = (response) => {
  if(response != "Failed"){
    const buttons = document.getElementsByClassName("Get-started-button");
    buttons[0].classList.add("Disabled");
    buttons[1].classList.remove("Disabled");
  }
}

const GetAllUsers = async (gender_id, id) => {
  const getusers_url = baseurl + "getallusers/";
  const data = new FormData();
  data.append("gender_id", gender_id);
  const response = await ExecutePostAPI(getusers_url, data);
  console.log(response.data.users);
  PrintUsers(response.data.users, id);
  
}

const PrintUsers = (users, id) => {
  const users_block = document.getElementById("user-list");
  for(let i=0; i<users.length; i++){
    const users_section = document.createElement("div");
    users_section.classList.add("user");
    users_block.insertAdjacentElement("beforeend", users_section);

    const users_information_section = document.createElement("div");
    users_information_section.classList.add("user-info");
    users_section.insertAdjacentElement("beforeend", users_information_section);
    PrintUserInformations(users[i], users_information_section);

    const users_actions_section = document.createElement("div");
    users_actions_section.classList.add("user-actions");
    users_section.insertAdjacentElement("beforeend", users_actions_section);
    users_actions_section.innerHTML = `
      <button class="favorite" id="fav-${users[i].id}"><i class="far fa-heart"></i></button>
      <button class="block" id="blc-${users[i].id}"><i class="fas fa-ban"></i></button>
      <button class="message" id="msg-${users[i].id}"><i class="far fa-envelope"></i></button>
    `
  }
  AssignActionButtons(id);
}

const AssignActionButtons = (id) => {
  const fav_buttons = document.getElementsByClassName("favorite");
  const blc_buttons = document.getElementsByClassName("block");
  const msg_buttons = document.getElementsByClassName("message");
  for(let i=0; i<fav_buttons.length; i++){
    fav_buttons[i].addEventListener("click", (event) => FavoriteUser(event, id));
    blc_buttons[i].addEventListener("click", (event) => BlockUser(event, id));
    msg_buttons[i].addEventListener("click", (event) => MessageUser(event, id));
  }
}


const PrintUserInformations = (user, users_information_section) => {
  const image= document.createElement("img");
  const name = document.createElement("h3");
  const age = document.createElement("p");
  const email = document.createElement("p");
  const location = document.createElement("p");

  image.src = baseimageurl + user.profile_picture;
  name.textContent = user.name;
  age.textContent = user.age;
  email.textContent = user.email;
  location.textContent = user.location;

  users_information_section.insertAdjacentElement("beforeend", image);
  users_information_section.insertAdjacentElement("beforeend", name);
  users_information_section.insertAdjacentElement("beforeend", age);
  users_information_section.insertAdjacentElement("beforeend", email);
  users_information_section.insertAdjacentElement("beforeend", location);
}

const GetFilteredUsers = async (event, gender_id, id) => {
  event.preventDefault();
  let getusers_url = "";
  const age = document.getElementById("age").value;
  const location = document.getElementById("location").value;

  if(age != ""){
    if(location != ""){
      getusers_url += baseurl + `getallusers/${age}/${location}`;
    }else{
      getusers_url += baseurl + `getallusers/${age}`;
    }
  }else if(location != ""){
    getusers_url += baseurl + `getallusers/${location}`;
  }else{
    getusers_url += baseurl + `getallusers/`;
  }

  if(getusers_url != ""){
    const data = new FormData();
    data.append("gender_id", gender_id);
    const response = await ExecutePostAPI(getusers_url, data);
    RemoveNotNeededUsers();
    PrintUsers(response.data.users, id);
  }
}

const RemoveNotNeededUsers = () => {
  const users_in_site = document.querySelectorAll(".user");
  users_in_site.forEach(user =>{
    user.remove();
  });
}

const GetSearchedUsers = async (event, gender_id, id) => {
  event.preventDefault();
  let getusers_url = baseurl + `getallusers/`;
  const name = document.getElementById("name").value;

  const data = new FormData();
  data.append("gender_id", gender_id);
  data.append("name", name);
  const response = await ExecutePostAPI(getusers_url, data);
  
  RemoveNotNeededUsers();
  PrintUsers(response.data.users, id);
}

const FavoriteUser = async (event, id) => {
  const favorite_user_url = baseurl + "favorite";
  let favorited_user_id_list = event.currentTarget.id;
  favorited_user_id_list = favorited_user_id_list.split("-");
  let favorited_user_id = +favorited_user_id_list[1];

  const data = new FormData();
  data.append("user_who_favorited_id", id);
  data.append("favorited_user_id",favorited_user_id);

  const response = await ExecutePostAPI(favorite_user_url, data);
  alert(response.data.status);
}

const BlockUser = async (event, id) => {
  const blocked_user_url = baseurl + "block";
  let blocked_user_id_list = event.currentTarget.id;
  blocked_user_id_list = blocked_user_id_list.split("-");
  let blocked_user_id = +blocked_user_id_list[1];

  const data = new FormData();
  data.append("user_who_blocked_id", id);
  data.append("blocked_user_id",blocked_user_id);

  const response = await ExecutePostAPI(blocked_user_url, data);
  alert(response.data.status);
}

const MessageUser = async (event, id) => {
  const message_user_url = baseurl + "message";
  let receiver_id_list = event.currentTarget.id;
  receiver_id_list = receiver_id_list.split("-");
  let receiver_id = +receiver_id_list[1];
  let message = prompt("Write your message!");
  if(message != null && message != "") {
    const data = new FormData();
    data.append("sender_id", id);
    data.append("receiver_id",receiver_id);
    data.append("message", message);
  
    const response = await ExecutePostAPI(message_user_url, data);
    alert(response.data.status);
  }
}

const GetAllBlocks = async (id) => {
  const get_blocks_url = baseurl + "getallblocks";
  const blocked_user_id = id;
  const blocks_section = document.getElementById("Blocks-section");

  const data = new FormData();
  data.append("blocked_user_id", blocked_user_id);
  const response = await ExecutePostAPI(get_blocks_url, data);
  PrintNotifications(response.data.blocks, blocks_section, response, id);
}

const GetAllFavorites = async (id) => {
  const get_favorites_url = baseurl + "getallfavorites";
  const favorited_user_id = id;
  const favorites_section = document.getElementById("Favorites-section");

  const data = new FormData();
  data.append("favorited_user_id", favorited_user_id);
  const response = await ExecutePostAPI(get_favorites_url, data);
  PrintNotifications(response.data.favorites, favorites_section, response, id);
}

const PrintNotifications = (notification_list, notification_section, response, id) => {
  for(let i=0; i<notification_list.length; i++){
    let notification = document.createElement("div");
    notification.classList.add("Notification");
    notification_section.insertAdjacentElement("afterbegin", notification);
    PrintNotificationContents(notification_list[i], notification, response, id);
  }
}

const PrintNotificationContents = (notification, notification_border, response, id) => {
  const notification_contents = document.createElement("div");
  notification_contents.classList.add("Notification-content");
  notification_border.insertAdjacentElement("beforeend", notification_contents);
  const created_at_list = notification.created_at;
  let created_at = created_at_list.split("T");
  if("favorites" in response.data){
    notification_contents.innerHTML = `
    <h3>${notification.name} Has Favorited You!</h3>
    <p>${created_at[0]}</p>`;
  }else if("blocks" in response.data){
    notification_contents.innerHTML = `
    <h3>${notification.name} Has Blocked You!</h3>
    <p>${created_at[0]}</p>`;
  }else if("messages" in response.data){
    notification_contents.innerHTML=`
    <h2>${notification.name}</h2>
    <p>${created_at[0]}</p>`;

    const notification_body = document.createElement("div");
    notification_body.classList.add("Notification-body");
    notification_border.insertAdjacentElement("beforeend", notification_body);
    
    notification_body.innerHTML=`
    <p>${notification.message}</p>
    <button class="Reply-btn" id="msg-${notification.sender_id}">Reply</button>`
    AssignReplyButton(id);
  }
}

const AssignReplyButton = (id) => {
  const reply_buttons = document.getElementsByClassName("Reply-btn");
  for(let i=0; i<reply_buttons.length; i++){
    reply_buttons[i].addEventListener("click", (event) => MessageUser(event, id));
  }
}

const GetAllMessages = async(id) => {
  const get_messages_url = baseurl + "getallmessages";
  const receiver_id = id;
  const messages_section = document.getElementById("Messages-section");

  const data = new FormData();
  data.append("receiver_id", receiver_id);
  const response = await ExecutePostAPI(get_messages_url, data);
  PrintNotifications(response.data.messages, messages_section, response, id);
}

const PrintProfileBasicInfo = async (user) => {
  const profile_picture = document.getElementById("Profile-picture");
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const age = document.getElementById("age");
  const location = document.getElementById("location");

  profile_picture.src = baseimageurl + user.profile_picture;
  name.innerHTML = `${user.name}`;
  email.innerHTML = `<strong>Email:</strong> ${user.email}`;
  age.innerHTML = `<strong>Age:</strong> ${user.age}`;
  location.innerHTML = `<strong>Location:</strong> ${user.location}`;
}

const PrintProfileExtraInfo = async (user_info) => {
  const description = document.getElementById("description");
  const pictures_container = document.getElementById("pictures-container");

  description.innerHTML = `${user_info.description}`;
  if(user_info.additional_picture1 != null){
    const additional_picture1 = document.createElement("img");
    additional_picture1.src = baseimageurl + user_info.additional_picture1;
    pictures_container.insertAdjacentElement("beforeend", additional_picture1);
  }
  if(user_info.additional_picture2 != null){
    const additional_picture2 = document.createElement("img");
    additional_picture2.src = baseimageurl + user_info.additional_picture2;
    pictures_container.insertAdjacentElement("beforeend", additional_picture2);
  }
  if(user_info.additional_picture3 != null){
    const additional_picture3 = document.createElement("img");
    additional_picture3.src = baseimageurl + user_info.additional_picture3;
    pictures_container.insertAdjacentElement("beforeend", additional_picture3);
  }

}

const GetProfileBasicInfo = async (gender_id, id) => {
  const getusers_url = baseurl + "getallusers/";
  const data = new FormData();
  data.append("gender_id", gender_id);
  data.append("id", id);
  const response = await ExecutePostAPI(getusers_url, data);
  console.log(response.data.users[0]);
  PrintProfileBasicInfo(response.data.users[0]);
}

const GetProfileExtraInfo = async (user_id) => {
  const get_user_info_url = baseurl + "getuserinfo/";
  const data = new FormData();
  data.append("user_id", user_id);
  const response = await ExecutePostAPI(get_user_info_url, data);
  console.log(response.data.user_info);
  PrintProfileExtraInfo(response.data.user_info);
}

const ResetPassword = async (id) => {
  const reset_password_url = baseurl + "resetpassword/";
  let password = prompt("Give the new password:");
  const data = new FormData();
  data.append("password", password);
  data.append("id", id);
  const response = await ExecutePostAPI(reset_password_url, data);
  if(password != null && password != ""){
    alert(response.data.status);
  }
}

// const EncodeTheUploadedPicture = (additional_picture_input, additional_picture) => {
//   additional_picture = "";
//   additional_picture_input.addEventListener("change", function(){
//     const reader = new FileReader();
//     reader.addEventListener("load",() => {
//       additional_picture = reader.result;
//     });
//     reader.readAsDataURL(this.files[0]);
//   });
//   console.log(additional_picture);
//   return additional_picture;
// }

const EditProfileExtraInfo = async (event, edit_profile_url, user_id, additional_picture1, additional_picture2, additional_picture3) => {
  event.preventDefault();
  const description = document.getElementById("Description").value;

  const data = new FormData();
  data.append("user_id", user_id);
  if(description != "" && description != null){
    data.append("description", description);
  }
  if(additional_picture1 != ""){
    data.append("additional_picture1", additional_picture1);
  }
  if(additional_picture2 != ""){
    data.append("additional_picture2", additional_picture2);
  }
  if(additional_picture3 != ""){
    data.append("additional_picture3", additional_picture3);
  }

  const response = await ExecutePostAPI(edit_profile_url, data);
  alert(response.data.status);
  window.location.href = "profile.html";
}

const Logout = async () => {
  const reset_password_url = baseurl + "auth/logout";
  const response = await ExecutePostAPI(reset_password_url, null);
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("token_type");

  window.location.href= "index.html";
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

const LoadIndex = async () => {
  const response = await CheckUser();
  ChangeTheButton(response);
}

const LoadBrowse = async () => {
  const {gender_id, id} = await CheckUser();
  const filter_button = document.getElementById("Filter-button");
  const search_button = document.getElementById("Name-search-button");
  GetAllUsers(gender_id, id);
  filter_button.addEventListener("click", (event) => GetFilteredUsers(event, gender_id, id));
  search_button.addEventListener("click", (event) => GetSearchedUsers(event, gender_id, id));
}

const LoadNotification = async () => {
  const {id} = await CheckUser();
  GetAllFavorites(id);
  GetAllBlocks(id);
} 

const LoadInbox = async () => {
  const {id} = await CheckUser();
  GetAllMessages(id);
}

const LoadProfile = async () => {
  const {gender_id, id} = await CheckUser();
  const reset_password_button = document.getElementById("reset-password-btn");
  GetProfileBasicInfo(gender_id, id);
  GetProfileExtraInfo(id);
  reset_password_button.addEventListener("click", () => ResetPassword(id));
}

const LoadEditProfile = async () => {
  const {id} = await CheckUser();
  const edit_profile_url = baseurl + "editprofile";
  const edit_button = document.getElementById("Edit-button");

  const additional_picture1_input = document.getElementById("Additional-picture1");
  let additional_picture1 = '';
  const additional_picture2_input = document.getElementById("Additional-picture2");
  let additional_picture2 = '';
  const additional_picture3_input = document.getElementById("Additional-picture3");
  let additional_picture3 = '';

  // EncodeTheUploadedPicture(additional_picture1_input, additional_picture1);
  // EncodeTheUploadedPicture(additional_picture2_input, additional_picture2);
  // EncodeTheUploadedPicture(additional_picture3_input, additional_picture3);

  additional_picture1_input.addEventListener("change", function(){
    const reader = new FileReader();
    reader.addEventListener("load",() => {
      additional_picture1 = reader.result;
    });
    reader.readAsDataURL(this.files[0]);
  });

  additional_picture2_input.addEventListener("change", function(){
    const reader = new FileReader();
    reader.addEventListener("load",() => {
      additional_picture2 = reader.result;
    });
    reader.readAsDataURL(this.files[0]);
  });

  additional_picture3_input.addEventListener("change", function(){
    const reader = new FileReader();
    reader.addEventListener("load",() => {
      additional_picture3 = reader.result;
    });
    reader.readAsDataURL(this.files[0]);
  });


  edit_button.addEventListener("click", (event) => EditProfileExtraInfo(event, edit_profile_url, id, additional_picture1, additional_picture2, additional_picture3))
}