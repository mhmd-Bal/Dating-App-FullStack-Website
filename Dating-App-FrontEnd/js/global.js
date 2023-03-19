const baseurl = "http://localhost/";

// GLobal Functions

const ExecuteGetAPI = async (api_url) => {
  try{
    return await axios(api_url);
  }catch(error){
    console.log(error);
  }
}

const ExecutePostAPI = async (api_url, api_data) => {
  try{
    return await axios.post(api_url, api_data);
  }catch(error){
    console.log(error);
  }
}


// Page Functions

