import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'

import Header from '../Header'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apiProductStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const ProductItemDetails = () => {
  const [productDetails, setProductDetails] = useState([])
  const [productStatus, setProductStatus] = useState(apiProductStatus.initial)
  const [similarProducts, setSimilarProductsData] = useState([])

  const getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  const getProductDetails = async props => {
    const {match} = props
    const {params} = match
    const {id} = params
    setProductStatus(apiProductStatus.inProgress)
    const jwtToken = Cookies.get('jwt_token')
    const apiurl = `https://apis.ccbp.in/products/:${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiurl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = getFormattedData(fetchedData)
      const updatedSimilarProductsData = fetchedData.similar_products.map(
        eachSimilarProduct => getFormattedData(eachSimilarProduct),
      )
      setProductDetails(updatedData)
      setProductStatus(apiProductStatus.success)
      setSimilarProductsData(updatedSimilarProductsData)
    } else {
      setProductStatus(apiProductStatus.failure)
    }
  }

  useEffect(() => {
    getProductDetails()
  })

  const renderSuccessStatus = () => {
    ;<div className="product-details">
      {productDetails.map(eachItem => (
        <div className="product-details-container-top">
          <img
            src={eachItem.imageUrl}
            className="product-detail-image"
            alt="product"
          />

          <div className="product-details-container-bottom">
            <h1 className="product-details=header">{eachItem.title}</h1>
            <p className="price">{eachItem.price}</p>
            <p className="stars">{eachItem.rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              className="detail-image"
              alt="star"
            />
            <p className="review-ratings">{eachItem.totalReviews}</p>
          </div>
        </div>
      ))}
    </div>
  }
  const renderFailureStatus = () => (
    <div className="product-details-failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  const renderLoader = () => {
    ;<div className="loader-products-details">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  }

  const renderElements = () => {
    switch (productStatus) {
      case apiProductStatus.success:
        return renderSuccessStatus()
      case apiProductStatus.failure:
        return renderFailureStatus()
      case apiProductStatus.inProgress:
        return renderLoader()
      default:
        return null
    }
  }

  return (
    <div className="product-details-container">
      <Header />
      {renderElements()}
    </div>
  )
}

export default ProductItemDetails
