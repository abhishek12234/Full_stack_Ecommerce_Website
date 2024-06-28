import logo from './logo.svg';
import './App.css';
import Cart from './components/Cart';
import UserLogin from './components/UserLogin';
import { useState, useEffect} from 'react'
import axios from 'axios';
import Navbar from './components/Navbar';

import Orders from './components/Orders';
import FeaturedProducts from './components/FeaturedProducts';
import Alert from './components/Alert';
import Discount from './components/Discount';
import About from './components/About';
import Contact from './components/Contact';
import MobileMenu from './components/MobileMenu';
import WhyUS from './components/WhyUS';
import AllProducts from './components/AllProducts';
import MyCheckouts from './components/MyCheckouts';
import Profile1 from './components/Profile1';
import ProductDetail from './components/ProductDetail';
const { Country, State, City } = require('country-state-city');


function App() {
  const [refresh_checkout,set_refresh_checkout]=useState(false)
  const [token, settoken] = useState(localStorage.getItem('user_token') !== null ? JSON.parse(localStorage.getItem("user_token")) : "")
  const [profile,set_profile]=useState(false)
  const [cart_show,set_cart_show]=useState(false)
  const [active_cart_page_show,set_active_cart_page_show]=useState("")
  const [active_about_page_show,set_active_about_page_show]=useState("")
  const [active_all_product_page_show,set_active_all_product_page_show]=useState("")
  const [active_orders_page_show,set_active_orders_page_show]=useState("")
  const [cart_items, set_cart_items] = useState([])
  const [shoes_names,set_shoes_names]=useState([])
  const [showalert,set_show_alert]=useState(false)
  const [alert_message,set_alert_message]=useState("")
  const [nave_background,set_nave_background]=useState(false)
  const [enter_flag,set_enter_flag]=useState(false)
  const [open_mobile_menu,set_open_mobile_menu]=useState(false)
  
  const [scrollPosition, setScrollPosition] = useState(0);
  const [load_overlay_active,set_load_overlay_active]=useState(false)
  const [active_loader,set_active_loader]=useState(false)
  const [get_user_email,set_user_email]=useState("")
  const [user_address,set_user_adress]=useState("")
  const [get_user_name,set_user_name]=useState("")
  const [get_user_phone_number,set_user_phone_number]=useState("")
  const [hitflag,set_hitflag]=useState(false)

  const [selected_country, setSelected_country] = useState("Select Country")
  const [selected_state, setSelected_state] = useState("Select State")
  const [selected_city, setSelected_city] = useState("Select City")
  const [Selected_street, setSelected_street] = useState("")
  const [country_options,set_country_options]=useState([])
  const [states_options,set_states_options]=useState([])
  const [city_options,set_city_options]=useState([])
  const [open_productdetail_page,set_productdetail_page]=useState(false)
  const [particular_shoes,set_particular_shoes]=useState([])
  const [particular_shoes_category,set_particular_shoes_category]=useState([])
  const [fitem_active,set_fitem_active]=useState(0)
  const [active_size, set_active_size] = useState(9)
  const [productdetail_quantity,set_productdetail_quantity]=useState(1)

  const [all_shoes_data, set_all_shoes_data] = useState([]);
  useEffect(()=>{
    console.log(particular_shoes_category)

  },[particular_shoes])
  
  
  const get_particular_shoes=async(id,category)=>{
    try{
      
      
      set_load_overlay_active(true)
      set_productdetail_page(true)

    
      setTimeout(()=>{
        set_active_size(9)
      set_productdetail_quantity(1)
       
        set_particular_shoes(...all_shoes_data.filter((element)=>element.id===id))
        set_particular_shoes_category(all_shoes_data.filter((element)=>element.shoes_category===category && element.id!==id))
      },400)
    setTimeout(()=>{
      set_load_overlay_active(false)
      
    },1000)
    }catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  
  
  useEffect(()=>{
    set_country_options(Country.getAllCountries().map(country => ({ name: country.name, isoCode: country.isoCode })));
      
      const indiaStates = (selected_country !== "Select Country" && selected_country!==undefined)? State.getStatesOfCountry(Country.getAllCountries().find(country => country.name === selected_country).isoCode):[];

      set_states_options(indiaStates.map(state => (
          state.name)
      ))
  
      const cities = (selected_state !== "Select State" && selected_state!==undefined)? City.getCitiesOfState(Country.getAllCountries().find(country => country.name === selected_country).isoCode, State.getAllStates().find(state => state.name === selected_state).isoCode):[];
  
      set_city_options(cities.map(city => city.name));



    
  
  },[selected_country,selected_city,selected_state])
  
  
  
  
  const add_to_cart=async (id,name,size,quantity)=>{
    if (!shoes_names.includes(name)){
      try {
      
         const headers = {
          Authorization: `Bearer ${token}`,
        };
        
        const cart_data = {
          id:id,
          size:size,
          product_quantity: quantity
        };
        set_active_loader(true)
        const response = await axios.post(`https://shoes-website-fastapi.onrender.com/add_item_cart`,cart_data, { headers });

        set_active_loader(false)
        if (response.data.status!=="out of stock"){
       
         set_cart_items(prevData => [...prevData, response.data])
         set_shoes_names([...shoes_names,response.data.product_name])
         set_show_alert(false)
         set_show_alert(true)
         set_alert_message("Item Added in Cart")
         setTimeout(() => {
    
          set_show_alert(false)
        },2000);
      }else{
        set_show_alert(true)
      
      set_alert_message("Item Out Of Stock")
      setTimeout(() => {
  
        set_show_alert(false)
      },2000);

      }

       
        
      
       
  
       
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      

    } else{
      console.log("already exist")
      set_show_alert(false)
      
      set_show_alert(true)
      
      set_alert_message("Item Already in Cart")
      setTimeout(() => {
  
        set_show_alert(false)
      },2000);
    }

   
  }
  const sections = [
    { id: 'home_section', label: 'Section 1' },
    { id: 'contact_section', label: 'Section 2' },
    { id: 'featured_section', label: 'Section 1' },
  
    
    // Add more section objects as needed
  ];

  const [activeSection, setActiveSection] = useState(sections[0].id);

  useEffect(() => {
    try{
    const handleScroll = () => {
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = document.getElementById(section.id);
        try{
        const rect = element.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
          setActiveSection(section.id);
          break;
        }
        }catch{

        }

      
      }
    };
    

    window.addEventListener('scroll', handleScroll);
    

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }catch{
    
  }
  }, []);
 
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      setScrollPosition(scrollTop);
    };
  
    document.addEventListener('scroll', handleScroll);
  
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(()=>{
    if (scrollPosition>=5 && enter_flag===true){
      set_nave_background(true)
      set_enter_flag(false)
    }else if (scrollPosition<5){
      set_nave_background(false)
      set_enter_flag(true)
  
    }
    
  },[scrollPosition])
  
  useEffect(() => {
    const onBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, []);

  
  const active_load_overlay_conatiner=()=>{
    set_load_overlay_active(true)
    
    setTimeout(()=>{
      set_load_overlay_active(false)
    },1600)}
 
  return (
    <div className={`main_website_container`} id="main">
      
        <Alert alert_message={alert_message} showalert={showalert} set_show_alert={set_show_alert}/>
        <div className={`loader_container ${active_loader===true?"show_loader":""}`}>
          <div className="loader_inner_container">
        <span className="loader"></span>
        </div>
      </div>
        <div className={`login_page ${token!==""?"hide_login":""}`}>
      <UserLogin set_active_loader={set_active_loader} showalert={showalert} set_alert_message={set_alert_message} set_show_alert={set_show_alert}token={token} settoken={settoken}/>
      </div>
      
         {token &&<> 
         <Profile1 set_profile={set_profile} profile={profile} set_alert_message={set_alert_message} set_show_alert={set_show_alert} set_active_loader={set_active_loader} city_options={city_options} set_city_options={set_city_options} states_options={states_options} set_states_options={set_states_options} country_options={country_options} set_country_options={set_country_options} Selected_street={Selected_street} setSelected_street={setSelected_street} selected_city={selected_city} setSelected_city={setSelected_city} selected_state={selected_state} setSelected_state={setSelected_state} selected_country={selected_country} setSelected_country={setSelected_country} get_user_phone_number={get_user_phone_number} set_user_phone_number={set_user_phone_number} get_user_name={get_user_name} set_user_name={set_user_name} get_user_email={get_user_email} set_user_email={set_user_email} user_address={user_address}  set_user_adress={set_user_adress} token={token} settoken={settoken} />
         <div className={`User_page ${profile===true?"disable_main_webite_pointer":""}`}>
         
          <MobileMenu  set_active_cart_page_show={set_active_cart_page_show} set_active_about_page_show={set_active_about_page_show} set_active_all_product_page_show={set_active_all_product_page_show} set_active_orders_page_show={set_active_orders_page_show} load_overlay_active={load_overlay_active} set_load_overlay_active={set_load_overlay_active} open_mobile_menu={open_mobile_menu} set_open_mobile_menu={set_open_mobile_menu}/>

          
            <div className={`load_overlay ${load_overlay_active===true?"active_load_overlay":""}`}></div>
           <Navbar  set_active_cart_page_show={set_active_cart_page_show} set_active_about_page_show={set_active_about_page_show} set_active_all_product_page_show={set_active_all_product_page_show} set_active_orders_page_show={set_active_orders_page_show}fitem_active={fitem_active} set_fitem_active={set_fitem_active} activeSection={activeSection} cart_items={cart_items} set_active_loader={set_active_loader}  set_open_mobile_menu={set_open_mobile_menu} load_overlay_active={load_overlay_active} set_load_overlay_active={set_load_overlay_active}  nave_background={nave_background}  set_nave_background={set_nave_background}token={token} settoken={settoken} shoes_names={shoes_names} set_shoes_name={set_shoes_names} set_profile={set_profile} profile={profile}/>
           <Cart set_load_overlay_active={set_load_overlay_active} set_active_loader={set_active_loader}  set_hitflag={set_hitflag}  hitflag={hitflag} set_profile={set_profile} profile={profile} token={token} settoken={settoken} />
           <About set_fitem_active={set_fitem_active} set_load_overlay_active={set_load_overlay_active} active_about_page_show={active_about_page_show} set_active_about_page_show={set_active_about_page_show} />
           <WhyUS/>
           <ProductDetail active_size={active_size} set_active_size={set_active_size} productdetail_quantity={productdetail_quantity} set_productdetail_quantity={set_productdetail_quantity} set_show_alert={set_show_alert} showalert={showalert} set_alert_message={set_alert_message} get_particular_shoes={get_particular_shoes} particular_shoes_category={particular_shoes_category} all_shoes_data={all_shoes_data} set_all_shoes_data={set_all_shoes_data} add_to_cart={add_to_cart} particular_shoes={particular_shoes} set_load_overlay_active={set_load_overlay_active} open_productdetail_page={open_productdetail_page} set_productdetail_page={set_productdetail_page}/>
           <MyCheckouts set_fitem_active={set_fitem_active} refresh_checkout={refresh_checkout} set_active_loader={set_active_loader} add_to_cart={add_to_cart} set_hitflag={set_hitflag}  hitflag={hitflag} set_load_overlay_active={set_load_overlay_active} active_orders_page_show={active_orders_page_show} set_active_orders_page_show={set_active_orders_page_show} token={token} settoken={settoken}/>
           <AllProducts set_active_cart_page_show={set_active_cart_page_show} cart_items={cart_items} set_fitem_active={set_fitem_active} all_shoes_data={all_shoes_data} set_all_shoes_data={set_all_shoes_data} get_particular_shoes={get_particular_shoes}  set_hitflag={set_hitflag}  hitflag={hitflag}set_load_overlay_active={set_load_overlay_active} active_all_product_page_show={active_all_product_page_show} set_active_all_product_page_show={set_active_all_product_page_show} add_to_cart={add_to_cart} token={token} settoken={settoken}/>
           <FeaturedProducts refresh_checkout={refresh_checkout}   get_particular_shoes={get_particular_shoes} set_load_overlay_active={set_load_overlay_active} open_productdetail_page={open_productdetail_page} set_productdetail_page={set_productdetail_page} set_hitflag={set_hitflag}  hitflag={hitflag} set_active_loader={set_active_loader} add_to_cart={add_to_cart} shoes_api={'https://shoes-website-fastapi.onrender.com/featured_shoes'} heading1={"BEST SELLING"}  heading2={"FEATURED COLLECTION"} set_alert_message={set_alert_message} set_show_alert={set_show_alert} shoes_names={shoes_names} set_shoes_name={set_shoes_names} cart_items={cart_items} set_cart_items={set_cart_items} token={token}/>
           <FeaturedProducts refresh_checkout={refresh_checkout}  get_particular_shoes={get_particular_shoes}  set_load_overlay_active={set_load_overlay_active} open_productdetail_page={open_productdetail_page} set_productdetail_page={set_productdetail_page} set_hitflag={set_hitflag}  hitflag={hitflag} set_active_loader={set_active_loader} add_to_cart={add_to_cart} shoes_api={"https://shoes-website-fastapi.onrender.com/new_shoes"} heading1={"NEWLY ADDED"}  heading2={"NEWEST COLLECTION"} set_alert_message={set_alert_message} set_show_alert={set_show_alert} shoes_names={shoes_names} set_shoes_name={set_shoes_names} cart_items={cart_items} set_cart_items={set_cart_items} token={token}/>
           <Discount/>
           <Contact/>
          
        
          
          <Orders set_fitem_active={set_fitem_active} hitflag={hitflag} refresh_checkout={refresh_checkout} set_refresh_checkout={set_refresh_checkout} set_show_alert={set_show_alert} showalert={showalert} set_alert_message={set_alert_message}set_active_loader={set_active_loader} set_user_adress={set_user_adress} user_address={user_address} active_cart_page_show={active_cart_page_show} set_active_cart_page_show={set_active_cart_page_show} set_load_overlay_active={set_load_overlay_active}  shoes_names={shoes_names} set_shoes_name={set_shoes_names} set_cart_items={set_cart_items} cart_items={cart_items} token={token} />

          
          </div>
          </>
}

         
          
        
      
    </div>
  );
}

export default App;
