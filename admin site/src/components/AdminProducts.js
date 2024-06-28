
import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel } from "@tanstack/react-table";
import "../components/css/AdminProducts.css"
import ImageConverter from '../components/ImageConverter'
import Dropdown from './Dropdown';
const AdminProducts = React.memo((props) => {
  const [datanew, setdatanew] = useState([]);
  const [shoes_name, set_name] = useState("")
  const [shoes_price, set_price] = useState(0)
  const [shoes_quantity, set_quantity] = useState(0)
  const [shoes_description, set_description] = useState("")
  const [video_link, set_link] = useState("")
  const [update_row, set_update_row] = useState(0)
  const [search_product, set_search_product] = useState("")
  const [close_add, set_close_add] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null);
  const [shoes_type_drop, set_shoes_type_drop] = useState(0)
  const [shoes_type, set_shoes_type] = useState("Choose type")
  const [shoes_for_drop, set_shoes_for_drop] = useState(0)
  const [shoes_for, set_shoes_for] = useState("Choose type")
  const [imageSrc, setImageSrc] = useState('');
  const [newshoesId, set_newshoesId] = useState(0)
  const [select_category, set_select_catagory] = useState("")
  const [select_type, set_select_type] = useState("")
  const [select_name, set_select_name] = useState("")
  const [select_price, set_select_price] = useState(0)
  const [delete_box, set_delete_box] = useState(false)
  const [delete_product_id, set_delete_product_id] = useState(0)





  const fileInputRef = useRef(null);



  const handleFileChange = (event) => {
    console.log(event.target.files[0], URL.createObjectURL(event.target.files[0]), "--------------")

    const file = event.target.files[0]
    setImageSrc(URL.createObjectURL(file))

    setSelectedFile(file);


  };




  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${props.token}`,
        };
        props.set_table_loader(true)
        const response = await axios.get('https://shoes-website-fastapi.onrender.com/shoes', { headers });
        props.set_table_loader(false)

        setdatanew(response.data)

        console.log(response.data, "-------------");
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [props.hitflag]);


  const data = useMemo(() => datanew.filter((element) => {
    return search_product.toLowerCase() == "" ? element : element.name.toLowerCase().includes(search_product.toLowerCase());
  }), [datanew, search_product]);

  const handleDelete = async (id) => {
    try {

      const headers = {
        Authorization: `Bearer ${props.token}`,
      };
      console.log(datanew)
      props.set_active_loader(true)
      const response = await axios.get(`https://shoes-website-fastapi.onrender.com/delete_shoes/${id}`, { headers });
      props.set_active_loader(false)
      setdatanew(datanew.filter((element) => element.id !== id))
      set_delete_box(false)





    } catch (error) {
      console.error('Error fetching data:', error);
    }

  }

  // Implement your delete logic here



  const updateRow = async (id, category, type, name, price, stock, description) => {

    try {
      const updated_data = {
        name: name,
        price: price,
        shoes_type: type,
        shoes_category: category,
        shoes_stock: stock,
        shoes_description: description

      }
      const headers = {
        Authorization: `Bearer ${props.token}`,
      };
      props.set_active_loader(true)
      const response = await axios.put(`https://shoes-website-fastapi.onrender.com/updateshoes/${id}`, updated_data, { headers });
      props.set_active_loader(false)
      console.log(response)
      setdatanew((prevData) => {
        return prevData.map((element) => {
          return element.id === id ? { ...element, name, price, shoes_type: type, shoes_category: category, shoes_stock: stock, shoes_description: description } : element;
        });
      });


      set_update_row(0)
      set_select_catagory("")
      set_select_name("")
      set_select_price(0)
      set_select_type("")

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const update_initial_values = (id, category, type, name, price) => {
    set_update_row(id)
    set_select_name(name)
    set_select_catagory(category)
    set_select_price(price)
    set_select_type(type)
  }
  console.log(select_name)

  const columns = useMemo(() => [

    {
      header: "Product",
      cell: ({ row }) => {

        return <img className="product_image" src={row.original.product_image} />
      }
    },
    {
      header: "ID",
      accessorKey: "id"
    }

    ,
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => (
        row.original.id === update_row ? (
          <div className="update_name_container">
            <input type="text" className="name_update" defaultValue={row.original.name} />
          </div>
        ) : (
          <span>{row.original.name}</span>
        )
      )
    },
    {
      header: "Stock",
      accessorKey: "shoes_stock",
      cell: ({ row }) => (
        row.original.id === update_row ? (
          <div className="update_name_container">
            <input type="text" className="stock_update" defaultValue={row.original.shoes_stock} />
          </div>
        ) : (
          <span>{row.original.shoes_stock}</span>
        )
      )

    },
    {
      header: "Description",
      accessorKey: "shoes_description",
      cell: ({ row }) => (
        row.original.id === update_row ? (
          <div className="update_name_container">
            <textarea type="text" className="description_update" defaultValue={row.original.shoes_description} />
          </div>
        ) : (
          <div className="description_span_container">
            <span className='description_span'>{row.original.shoes_description}</span>
          </div>
        )
      )

    }
    ,
    {
      header: "Type",
      accessorKey: "shoes_type",
      cell: ({ row }) => {
        if (row.original.id === update_row) {
          ;
          return (
            <div className="drop_down_outermost_container">
              <Dropdown width={"100px"} options={["Featured", "New", "Normal"]} selected={select_type} setSelected={set_select_type} />
            </div>
          );
        } else {
          return (
            <span>{row.original.shoes_type}</span>
          );
        }
      }
    },
    {
      header: "Category",
      accessorKey: "shoes_category",
      cell: ({ row }) => {
        if (row.original.id === update_row) {
          ;
          return (
            <div className="drop_down_outermost_container">
              <Dropdown width={"100px"} options={["Unisex", "Mens", "Womens"]} selected={select_category} setSelected={set_select_catagory} />
            </div>
          );
        } else {
          return (
            <span>{row.original.shoes_category}</span>
          );
        }
      }


    },
    {
      header: "Price",
      accessorKey: "price",
      cell: ({ row }) => (
        row.original.id === update_row ? (
          <div className="update_price_container"><input type="text" className='price_update' defaultValue={row.original.price} /></div>
        ) : (
          <span>{row.original.price}</span>
        )
      )
    },

    {
      header: "Action",
      cell: ({ row }) => (
        row.original.id === update_row ? (
          <div className='update_action_container'>
            <i className="fa-solid fa-check correct_update" onClick={() => { updateRow(row.original.id, select_category, select_type, document.querySelector(".name_update").value, document.querySelector(".price_update").value, document.querySelector(".stock_update").value, document.querySelector(".description_update").value) }}></i>
            <i className="fa-solid fa-xmark wrong_update" onClick={() => set_update_row(0)}></i>
          </div>
        ) : (
          <div className='action_container'>
            <i className="fa-solid fa-trash-can delete_icon" onClick={() => { set_delete_product_id(row.original.id); set_delete_box(true) }}></i>
            <i className="fa-solid fa-pen-to-square update_icon" onClick={() => { update_initial_values(row.original.id, row.original.shoes_category, row.original.shoes_type, row.original.name, row.original.price) }}></i>
          </div>
        )
      ),
    },
  ], [datanew, updateRow, select_category]);



  const addshoes = async (shoes_name, selectedFile, shoes_price, shoes_type, shoes_for, stock, shoes_description, imageSrc) => {


    try {
      const headers = {

        Authorization: `Bearer ${props.token}`,
        'Content-Type': 'multipart/form-data',



      };
      const headers1 = {

        Authorization: `Bearer ${props.token}`




      };




      const form_data = new FormData()


      form_data.append("file", selectedFile)
      props.set_active_loader(true)
      const response_image_link = await axios.post('https://shoes-website-fastapi.onrender.com/createshoesimagelink', form_data, { headers });
      const create_shoes_data = {

        name: shoes_name,
        price: shoes_price,
        product_image: response_image_link.data,
        shoes_category: shoes_for,
        shoes_type: shoes_type,
        shoes_stock: stock,
        shoes_description: shoes_description

      }
      console.log(create_shoes_data)


      const response = await axios.post('https://shoes-website-fastapi.onrender.com/createshoes', create_shoes_data, { headers: headers1 });
      console.log(response_image_link.data)
      props.set_active_loader(false)

      const newElement = {
        id: response.data.id,
        name: shoes_name,
        price: shoes_price,
        product_image: response_image_link.data,
        shoes_category: shoes_for,
        shoes_type: shoes_type,
        shoes_description: shoes_description,
        shoes_stock: stock
      }
      setdatanew(prevData => [...prevData, newElement])
      set_name("")
      set_price("")
      set_shoes_for("Choose Category")
      set_shoes_type("Choose Type")
      set_description("")
      set_quantity("")

      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }


    } catch (error) {
      console.error('Error fetching data:', error);
    }

  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageSize: datanew.length // Set page size to the total number of records
  });




  return (

    <div className={`products_outer_container ${props.current_panel === 0 ? "active_product" : ""}`}>
      <div className={`delete_conformation_outer_container ${delete_box === true ? "active_delete_conformation_outer_container" : ""}`}>
        <div className="delete_conformation">
          <i class="fa-solid fa-circle-xmark" onClick={() => { set_delete_box(false) }}></i>
          <h3 className='delete_conformation_heading'>Delete <span>Product</span></h3>
          <span className='delete_conformation_button' onClick={() => { handleDelete(delete_product_id) }}>DELETE</span>
        </div>
      </div>
      <div className="inner_page">
        <div className="head_product">

          <h1 className='product_heading enamela'>PRODUCT <span>DASHBOARD</span></h1>
          <button onClick={() => { set_close_add(close_add === 0 ? 1 : 0) }} className='add_product_button'>+ New Product</button>
        </div>

        <div className={`add_product_container ${close_add === 0 ? "" : "active-adding-inputs"}`}>
          <div className={`adding-inputs`}>
            <i onClick={() => { set_close_add(close_add === 0 ? 1 : 0) }} className="fa-solid fa-circle-xmark close_add"></i>
            <h3 className='adding_heading enamela'>NEW <span>PRODUCT</span></h3>

            <div className='label_container'>
              <lable className="shoes_label enamela">Shoes Image: </lable>
              <input type='file' name="file" className="image_selector" ref={fileInputRef} onChange={handleFileChange}></input>
            </div>


            <div className='label_container'>
              <lable className="shoes_label enamela">Shoes Name: </lable>
              <input type="text" className="name_selector" value={shoes_name} onChange={(e) => { set_name(e.target.value) }} />
            </div>
            <div className='label_container'>
              <lable className="shoes_label enamela">Shoes Type: </lable>
              <div className='shoes_type_box'>

                <div className="shoes_type_content">
                  <div className={`shoes_type_dropdown ${shoes_type_drop === 1 ? "open_shoes_type_dropdown" : ""}`}>
                    <span onClick={() => { set_shoes_type("Featured"); set_shoes_type_drop(0) }}>Featured</span>
                    <span onClick={() => { set_shoes_type("New"); set_shoes_type_drop(0) }}>New</span>
                    <span onClick={() => { set_shoes_type("Normal"); set_shoes_type_drop(0) }}>Normal</span>





                  </div>
                  <span>{shoes_type}</span><div className="choose_shoes_type" onClick={() => { set_shoes_type_drop(shoes_type_drop === 0 ? 1 : 0); set_shoes_for_drop(0) }}><i class="fa-solid fa-angle-down" ></i></div>
                </div>

              </div>
            </div>
            <div className='label_container'>
              <lable className="shoes_label enamela">Shoes For: </lable>
              <div className='shoes_for_box'>

                <div className="shoes_for_content">
                  <div className={`shoes_for_dropdown ${shoes_for_drop === 1 ? "open_shoes_for_dropdown" : ""}`}>
                    <span onClick={() => { set_shoes_for("Mens"); set_shoes_for_drop(0) }}>Mens</span>
                    <span onClick={() => { set_shoes_for("Womens"); set_shoes_for_drop(0) }}>Womens</span>
                    <span onClick={() => { set_shoes_for("Unisex"); set_shoes_for_drop(0) }}>Unisex</span>




                  </div>
                  <span>{shoes_for}</span><div className="choose_shoes_for" onClick={() => { set_shoes_for_drop(shoes_for_drop === 0 ? 1 : 0); set_shoes_type_drop(0) }}><i class="fa-solid fa-angle-down" ></i></div>
                </div>

              </div>
            </div>

            <div className='label_container'>
              <lable className="shoes_label">Shoes Price: </lable>
              <input type="text" className="price_selector" value={shoes_price} onChange={(e) => { set_price(e.target.value) }} />
            </div>

            <div className='label_container'>
              <lable className="shoes_label">Shoes Quantity: </lable>
              <input type="text" className="quantity_selector" value={shoes_quantity} onChange={(e) => { set_quantity(e.target.value) }} />
            </div>
            <div className='label_container_description'>
              <lable className="shoes_label">Shoes Description: </lable>
              <textarea type="text" className="description_selector" value={shoes_description} onChange={(e) => { set_description(e.target.value) }} />
            </div>


            <div className="buttons_container">
              <button className="admin_buttons" onClick={() => addshoes(shoes_name, selectedFile, shoes_price, shoes_type, shoes_for, shoes_quantity, shoes_description, imageSrc)}>add post</button>

            </div>

          </div>
        </div>


        <div className="search_container">
          <i className="fa-solid fa-magnifying-glass search_icon"></i>
          <input value={search_product} onChange={(e) => set_search_product(e.target.value)} type="text" className="search_product" />

        </div>
        <div className="w3-container">

          <div className={`loader_inner_container1 ${props.table_loader === false ? "loader_inner_container_deactive" : ""}`}>
            <span className="loader"></span>
            <h3 className='loader_heading'>Loading...</h3>
          </div>

          <table className="w3-table-all">
            <thead >
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} >
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className='table_head'>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map(row => (

                <tr key={row.id} className='cell_data'>

                  {row.getVisibleCells().map(cell => (


                    <td key={cell.id} >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}


                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {/*
        <div className="buttons-table">
          <button onClick={() => table.setPageIndex(0)}>First page</button>
          <button disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>previous page</button>
          <button disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>next page</button>
          <button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>last page</button>

                    </div>*/}

        </div>
      </div>
    </div>

  )
}
)
export default AdminProducts
