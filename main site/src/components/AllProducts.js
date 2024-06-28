import React, { useMemo } from 'react'
import axios from 'axios';
import "../components/css/AllProducts.css"
import { useRef, useState, useEffect } from 'react';
import VanillaTilt from 'vanilla-tilt';

const AllProducts = (props) => {
  const [search_shoes, set_search_shoes] = useState("")
  const tiltRefs = useRef([]);

  const [show_filter, set_show_filter] = useState(false)
  const [price_range, set_price_range] = useState(150)
  const [checkAll, setCheckAll] = useState(true);
  const [checkAll1, setCheckAll1] = useState(true);
  const [categories, setCategories] = useState([
    { name: "All", checked: true },
    { name: "Sneakers", checked: true },
    { name: "Sports", checked: true },
    { name: "Casual", checked: true }
  ]);
  const [search_product, set_search_product] = useState("")
  const [type_filter, set_type_filter] = useState("All")
  const [price_filter, set_price_filter] = useState(60)
  const [catagori_filter, set_catagori_filter] = useState(["All", "Featured", "New"])

  const [categories1, setCategories1] = useState([
    { name: "Featured", checked: false },
    { name: "New", checked: false },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const headers = {
          Authorization: `Bearer ${props.token}`,
        };
        const response = await axios.get('https://shoes-website-fastapi.onrender.com/shoes', { headers });

        console.log(response)
        props.set_all_shoes_data(response.data)


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [props.hitflag]);



  const handleCheckAll = () => {
    setCheckAll(!checkAll);
    const updatedCategories = categories.map(category => ({
      ...category,
      checked: !checkAll
    }));
    setCategories(updatedCategories);
  };
  const handleCheckAll1 = () => {
    setCheckAll1(!checkAll1);
    const updatedCategories1 = categories1.map(category => ({
      ...category,
      checked: !checkAll1
    }));
    setCategories1(updatedCategories1);
    
    // Update the catagori_filter state based on the "All" checkbox status
    if (!checkAll1) {
      // If "All" is checked, set catagori_filter to contain only "All"
      set_catagori_filter(["All"]);
    } else {
      // If "All" is unchecked, update catagori_filter state based on the checked categories
      const checkedCategories = updatedCategories1.filter(category => category.checked).map(category => category.name);
      // Filter out "All" from the checked categories and update the catagori_filter state
      set_catagori_filter(checkedCategories.filter(category => category !== "All"));
    }
};

  // Function to handle click on individual category checkbox
  const handleCategoryChange = (name) => {
    const updatedCategories = categories.map(category =>
      category.name === name ? { ...category, checked: !category.checked } : category
    );
    setCategories(updatedCategories);
    setCheckAll(updatedCategories.every(category => category.checked));

  };
  const handleCategoryChange1 = (name) => {
    const updatedCategories1 = categories1.map(category =>
        category.name === name ? { ...category, checked: !category.checked } : category
    );
    setCategories1(updatedCategories1);
    setCheckAll1(updatedCategories1.every(category => category.checked));

    const checkedCategories = updatedCategories1.filter(category => category.checked).map(category => category.name);

    // Update the catagori_filter state based on the checked categories
    set_catagori_filter(checkedCategories);
};



  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);

  };

  // Generate an array of page numbers


  const searchBarRef = useRef(null);
  const [isFixed, setIsFixed] = useState(false);
  const startIndex = (currentPage - 1) * 12; // Assuming 12 items per page
  const endIndex = Math.min(startIndex + 12, props.all_shoes_data.length);
  const filteredShoes = useMemo(() => {
    const filteredByTypeAndPriceAndCategory = props.all_shoes_data.filter(shoe => {
        // Filter by shoe type, category, and price range
        const passesTypeFilter = type_filter === "All" || shoe.shoes_category === type_filter;

        // Check if any category other than "All" is checked
        const isAnyCategoryChecked = catagori_filter.some(category => category !== "All");

        // If no category other than "All" is checked, include all shoes
        const passesCategoryFilter = !isAnyCategoryChecked || catagori_filter.includes(shoe.shoes_type);

        const passesPriceFilter = shoe.price > 0 && shoe.price <= price_range;

        return passesTypeFilter && passesCategoryFilter && passesPriceFilter;
    });

    // Apply slice filter based on startIndex and endIndex
    const data = filteredByTypeAndPriceAndCategory.slice(startIndex, endIndex).filter((element) => {
        return search_product.toLowerCase() === "" ? element : element.name.toLowerCase().includes(search_product.toLowerCase());
    });
    return data;
}, [props.all_shoes_data, price_range, startIndex, endIndex, type_filter, catagori_filter, search_product,props.hitflag]);



    // Apply slice filter based on startIndex and endIndex

  const pageNumbers = [];
  const number_of_pages = Math.ceil(props.all_shoes_data.length / 12)
  for (let i = 1; i <= number_of_pages; i++) {
    pageNumbers.push(i);
  }



  useEffect(() => {
    tiltRefs.current = tiltRefs.current.slice(0, filteredShoes.length);

    filteredShoes.forEach((_, index) => {
      const tiltRef = tiltRefs.current[index];
      if (tiltRef && tiltRef.current) {
        initializeTilt(tiltRef.current);
      }
    });

    return () => {
      tiltRefs.current.forEach((tiltRef) => {
        if (tiltRef && tiltRef.current) {
          VanillaTilt.init(tiltRef.current);
        }
      });
    };
  }, [filteredShoes, props.hitflag]);


  const initializeTilt = (element) => {
    const options = {
      max: 45,
      speed: 400,
      glare: true,
      'max-glare': 0.5
    };
    VanillaTilt.init(element, options);
  };
  const deactive_all_products_page = () => {

    props.set_load_overlay_active(true)
    props.set_active_all_product_page_show("")
    props.set_fitem_active(0)


    setTimeout(() => {
      props.set_load_overlay_active(false)
    }, 1000)
  }
  const active_cart=()=>{
    props.set_load_overlay_active(true)
    props.set_active_cart_page_show("cart")
    
    
    setTimeout(()=>{
      props.set_load_overlay_active(false)
    },1000)}
  return (
    <div className={`all_products_page ${props.active_all_product_page_show === "all_products" ? "active_all_products_page" : ""}`} ref={searchBarRef} >
      <i onClick={deactive_all_products_page} className="fa-solid fa-arrow-left close_all_products_page_button"></i>
      <div className='all_products_image_outer_container'>

        <div className="all_products_image_container">
          <div className="layer_all_product">
            <h5 className='all_products_page_main_heading'> <span>EXPLORE</span> OUR COLLECTION</h5>
            <p>Step into Style: Explore our diverse collection of premium footwear, curated to suit every taste and occasion</p>
            <div className="all_deals_button" >
              <h1>View Deals</h1>

            </div>
            <i className="fa-solid fa-angle-down down_all_product"></i>
          </div>



        </div>
      </div>
      <div className="list_product_outer_container">
        <div className={`filter_shoes_container ${show_filter === true ? "active_filter_shoes_container" : ""}`}>
          <i onClick={() => { set_show_filter(false) }} className="fa-solid fa-xmark close_filter_container_button"></i>
          <h1 className='filter_shoes_heading'>Filter <span>Shoes</span></h1>
          <div className="filter_shoes_content_container">
            <div className="filter_criteria1">
              <h3 className='filter_criteria1_heading'>TYPE</h3>
              <div className="radio_group">
                <label className='radio'>
                  <input type="radio" value="All" onClick={(e) => set_type_filter(e.target.value)} name="gender" defaultChecked="checked" />
                  All
                  <span></span>
                </label>
                <label className='radio'>
                  <input type="radio" value="Mens" onClick={(e) => set_type_filter(e.target.value)} name="gender" />
                  Mens
                  <span></span>
                </label>

                <label className='radio'>
                  <input type="radio" value="Womens" onClick={(e) => set_type_filter(e.target.value)} name="gender" />
                  Womens
                  <span></span>
                </label>

                <label className='radio'>
                  <input type="radio" value="Unisex" onClick={(e) => set_type_filter(e.target.value)} name="gender" />
                  Unisex
                  <span></span>
                </label>
              </div>
            </div>

            <div className="filter_criteria2">
              <h3 className='filter_criteria2_heading'>PRICE</h3>
              <div className="price_range">
                <div className="price_range_value">
                  <h5>Range: <span>60$ - {price_range}$</span></h5>

                </div>

                <div className="range_field">
                  <div className="value left">60$</div>
                  <div className='price_range_input_container'>
                    <div className='background_bar_range'></div>

                    <span style={{ width: `${((price_range - 60) / (155 - 60)) * 100}%` }}></span>
                    <input type="range" min="60" max="150" defaultValue={150} onChange={(e) => { set_price_range(e.target.value) }} />

                  </div>

                  <div className="value right">150$</div>

                </div>
              </div>

            </div>
            <div className="filter_criteria3">
              <h3 className='filter_criteria3_heading'>CATAGORIE</h3>
              <div className="catagorie_container">
                <label className='catagorie_check_box'>
                  <span></span>
                  <input type="checkbox" checked={checkAll}
                    onChange={handleCheckAll} />
                  All
                </label>
                <label className='catagorie_check_box'>
                  <span></span>
                  <input type="checkbox" checked={categories[1].checked}
                    onChange={() => handleCategoryChange(categories[1].name)} />
                  Sneakers
                </label>
                <label className='catagorie_check_box'>
                  <span></span>
                  <input type="checkbox" checked={categories[2].checked}
                    onChange={() => handleCategoryChange(categories[2].name)} />
                  Sports
                </label>
                <label className='catagorie_check_box'>
                  <span></span>
                  <input type="checkbox" checked={categories[3].checked}
                    onChange={() => handleCategoryChange(categories[3].name)} />
                  Casual
                </label>
              </div>
            </div>
            <div className="filter_criteria4">
              <h3 className='filter_criteria4_heading'>STYLE</h3>

              <div className="catagorie_container">
                
                <label className='catagorie_check_box'>
                  <span></span>
                  <input type="checkbox" checked={categories1[0].checked}
                    onChange={() => handleCategoryChange1(categories1[0].name)} />
                  New
                </label>
                <label className='catagorie_check_box'>
                  <span></span>
                  <input type="checkbox" checked={categories1[1].checked}
                    onChange={() => handleCategoryChange1(categories1[1].name)} />
                  Featured
                </label>

              </div>

            </div>
          </div>
        </div>
        <div className="all_products_listing_outer_container">

          <div className="all_products_heading_container">

            <h5 className="product_listing_main_heading"><span>{type_filter}</span> Shoes</h5>

            <div className="all_products_cart_item_content">
              <div className="all_products_item_count">{props.cart_items.length}</div>
              <i  onClick={active_cart} className="fa-solid fa-cart-shopping cart-item"></i>

            </div>
          </div>
          <div className={`search_outer_container ${isFixed === true ? 'fixed' : ''}`}  >
            <div className="search_container">
              <i className="fa-solid fa-magnifying-glass search_icon"></i>
              <input value={search_product} onChange={(e) => set_search_product(e.target.value)} type="text" className="search_product" />

            </div>
            <i class="fa-solid fa-sliders filter_icon" onClick={() => { set_show_filter(true) }}></i>
          </div>
          <div className="main_all_product_container">
            {filteredShoes.map((element, index) => {
              const tiltRef = tiltRefs.current[index] || React.createRef();
              tiltRefs.current[index] = tiltRef;

              return (
                <div key={index} ref={tiltRef} className="product_card_container">





                  <div className="product_card" onClick={() => { props.get_particular_shoes(element.id, element.shoes_category) }}>

                    <h4 className='price_tag'>{element.price}$</h4>

                    <i className="fa-solid fa-heart heart"></i>
                    <img className="card_image" src={element.product_image}></img>
                    <div className="card_content">

                      <h3>{element.name}</h3>

                      <h4>{element.shoes_category} Running Shoes</h4>
                      <h5 className="featured_stock_heading" style={{ color: element.shoes_stock !== 0 ? "green" : "red" }}>{element.shoes_stock !== 0 ? "In Stock" : "Out Of Stock"}</h5>
                      <div className="stars_container">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                      </div>

                    </div>
                    
                    <div className="circle"></div>

                  </div>
                  <div className="card_button_container">
                      <button onClick={() => props.add_to_cart(element.id, element.name,9,1)} className='card_button1'>Add To Cart <span><i class="fa-solid fa-cart-shopping"></i></span></button>

                    </div>




                </div>)
            })}
          </div>

          <div className="cart_mobile_product_container1">
            {filteredShoes.map((element, index) => {
              return (
                <div key={index} className="mobile_shoes_container1">
                  <i onClick={() => props.add_to_cart(element.id, element.name,9,1)} class="fa-solid fa-bag-shopping shopping_bag"></i>

                  <i className="fa-solid fa-heart heart "></i>
                  <div className="mobile_shoes_image_container">
                    <div className='product_cart_container'>
                      <div className="cart_image_container">
                        <img className="product_image" src={`${element.product_image}`} />
                      </div>




                    </div>

                  </div>
                  <div className="mobile_shoes_content_container">
                    <h4 className='mobile_shoes_name'>{element.name}</h4>
                    <h5 className='mobile_shoes_type'>{element.shoes_category} Running Shoes</h5>
                    <div className="stars_container1">
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                    </div>


                    <h4 className='mobile_shoes_price'>${element.price}</h4>
                    <h4 className="stock_heading" style={{ color: element.shoes_stock !== 0 ? "green" : "red" }}>{element.shoes_stock !== 0 ? "In Stock" : "Out Of Stock"}</h4>
                    <div className="buy_product" >
                      <h5 onClick={() => { props.get_particular_shoes(element.id, element.shoes_category) }}>Buy Now</h5>

                    </div>

                    <div className="mobile_shoes_bottom_container">





                    </div>

                  </div>


                </div>
              )
            })
            }
          </div>
          <div className="pagination_all_product_container">
            <span className='left_page_button'><i onClick={() => { setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage) }} class="fa-solid fa-angle-left"></i></span>

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`main_pagination_buttons ${currentPage === page ? "active_page_button" : ""}`}
                disabled={currentPage === page}
              >
                {page}
              </button>
            ))}

            <span className='right_page_button'><i onClick={() => { setCurrentPage(currentPage < number_of_pages ? currentPage + 1 : currentPage) }} class="fa-solid fa-angle-right"></i></span>
          </div>
        </div>
      </div>



    </div>
  )
}

export default AllProducts
