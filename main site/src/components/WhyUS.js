import React from 'react'
import "../components/css/WhyUs.css"
const WhyUS = () => {
  return (
    <div className='whyus_outer_container'>
        <div className='whyus_heading_container'>
        <h4 className='whyus_main_heading'>Why Choose <span>Us?</span></h4>
        <h4 className='whyus_tag_line'>Experience the Difference: Elevating Your Every Step with Unrivaled Comfort, Style, and Quality</h4>
        </div>
        <div className="whyus_content_container">
            <div className="whyus_box1">
            <i class="fa-solid fa-feather-pointed"></i>
            <h4>Quality And Comfort</h4>
            <p>Experience unparalleled Quality and Comfort with our shoes. Crafted with precision and designed for your ultimate satisfaction, our footwear ensures both luxury and ease every step of the way. Feel the difference
                 with each stride, as our commitment to excellence elevates your comfort to new heights</p>

            </div>

            <div className="whyus_box1">
            <i class="fa-solid fa-globe"></i>
            <h4>Design And Build</h4>
            <p>Experience the epitome of contemporary style fused with innovative craftsmanship. Our meticulously designed shoes blend sleek aesthetics with advanced engineering, ensuring unparalleled durability and comfort. 
                Elevate your wardrobe with footwear that embodies modern elegance and premium quality</p>
            </div>

            <div className="whyus_box1">
            <i class="fa-solid fa-layer-group"></i>
            <h4>Variety and Selection</h4>
            <p>Explore boundless options with our curated variety and selection. From timeless 
                classics to contemporary trends, find the perfect fit for your style and comfort needs. Discover quality craftsmanship and diverse sizes for every foot, ensuring a personalized experience with every step.</p>

            </div>
        </div>

      
    </div>
  )
}

export default WhyUS
