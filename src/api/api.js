import axios from "axios";

const initAPI = async (method, endpoint, data, token) => {
    // const router = useRouter()
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    
    let check = endpoint.includes('products-categories') 
    || endpoint.includes('products') 
    || endpoint.includes('consultants/')
    || endpoint.includes('pages')
    || endpoint.includes('blogs')
    console.log(check)
    const config = {
      method: method,
      maxBodyLength: Infinity,
      url: endpoint.includes('http') ? endpoint : baseUrl + endpoint,
      headers: { 
        'Content-Type': check ? 'multipart/form-data' : 'application/json',
        'Authorization': token !== null ? `Bearer ${token}` : null
      },
      data : data !== null ? data : null
    };
  
    try {
      const response = await axios.request(config)
      // if(response.status == '401' && localStorage.getItem('userData')){
      //   localStorage.clear()
      //   router.go()
      // }
      return response
    } catch (error) {
      if (error.response && error.response.status === 401 && localStorage.getItem('userData')) {
        console.log(`rugi dong`)
        localStorage.clear()
        // router.go()
      } else {
        throw error;
      }
    }
  }
  
  export default initAPI