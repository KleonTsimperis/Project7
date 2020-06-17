import React from 'react';
import ReactMapboxGl, {
  Layer, Feature,
  Popup,
  Marker,
  ZoomControl,
  RotationControl,
} from 'react-mapbox-gl';
import { MdStar } from 'react-icons/md';
import Data from './Data';



const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoiYWtpbnllbWkxNDcyIiwiYSI6ImNrMXoyNW92dDBsZ2UzaG12Mm9xNGhmdGcifQ.RlIm2uIf_39XH1hbaG4C7A',
});
const StyledPopup = {
  background: "white",
  color: "#3f618c",
  fontSize: 10 ,
  fontWeight: 400,
  padding: "5px",
  borderRadius: "2px",
  width: '25em'

}
const flyToOptions = {
  speed: 0.8
};
const mapStyle = {
  flex: 1
};

let index = 0; 

class MapGL extends React.Component {
  state = {
    longitude: 100.869281,
    latitude: 12.906024,
    loading: true,
    restuarant: [],
    restaurant: {},
    data: [],
    restaurant: undefined,
    fitBounds: undefined,
    center: [],
    addReview: ''
  };

 
  onNameChange = event => {
    this.setState({
      name: event.target.value,
    });
  };

  addItem = () => {
    const { addReview, restaurant } = this.state;
    let newb = restaurant.reviews.concat({
      rating: 5,
      title: addReview
  })
    this.setState(prev => ({
      restaurant: {
        ...prev.restaurant,
        ratings: newb
      }
    }));
   
  };
 markerClick = (restaurant) => {
   console.log(restaurant)
    this.setState({
      center:[this.state.longitude, this.state.latitude],
      restaurant
    });
  };

 onStyleLoad = (map) => {
    const { onStyleLoad } = this.props;
    return onStyleLoad && onStyleLoad(map);
  };

  onDrag = () => {
    if (this.state.data) {
      this.setState({ data: undefined });
    }
  };


  handInputSubmit = (e) => {
    e.preventDefault()
    console.log("Hello World")
  };
  _onClickMap = (map, evt)=> {
    console.log(evt.lngLat);
    this.setState(prev => ({
      data: [
        ...prev.data,
        {
          name: '',
          address: '',
          latitude: evt.lngLat.wrap().latitude,
          longitude: evt.lngLat.wrap().longitude,
          photo: {
            images: {
              small: {
                url: ''
              }
            }
          },
          reviews: [],
        },
      ],
    }))
  }
    
  componentDidMount() {
    fetch("https://tripadvisor1.p.rapidapi.com/restaurants/list?restaurant_tagcategory_standalone=10591&lunit=km&restaurant_tagcategory=10591&limit=30&currency=USD&lang=en_US&location_id=293919", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
		"x-rapidapi-key": "c25632a82cmshe1eea9b7f4ebb7ep15df2ejsn56f040c948d9"
	}
})
.then(raw => raw.json())
.then(response => this.setState({data:response.data}))
.catch(err => {
	console.log(err);
});
  }
  render() {
    const image = new Image();
    image.src=`${require('../marker.png')}`
    const images= ['marker', image];
    const layoutLayer = { 'icon-image': 'marker' }
    const { items, addReview, zoom, restaurant, data } = this.state;
    return (
      <Map
        onClick={this._onClickMap}
        onStyleLoad={this.onMapLoad}
        center={[this.state.longitude, this.state.latitude]}
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: '140vh',
          width: '64vw',
        }}
        >
        <div className="sidebarStyle">
          <div>
            Longitude: {this.state.longitude} | Latitude: {this.state.latitude} | Zoom:
            {this.state.zoom}
          </div>
        
        </div>

        <Layer type="symbol" id="marker" layout={layoutLayer} images={images}>
          {data.map((item, index) =>
          <Feature coordinates={[item.longitude, item.latitude]} 
          key={index}
          onClick={() => this.markerClick(item)}
          />
          )}
    </Layer>
          
      {restaurant &&(
          <Popup
            key={restaurant.id}
            anchor="bottom-right"
            coordinates={[restaurant.longitude, restaurant.latitude]}
            onClick={() => this.handtoggle}
            style={StyledPopup}
           >
              
            <div>
              <img src={restaurant.photo.images.small.url} width="193px" height="250" />
              <h4>{restaurant.name} </h4>
              <p> {restaurant.address}</p>
              <div className="d-flex ">
                <input
                  value={addReview} onChange={this.onNameChange}
                  className="form-control"
                  type="text"
                  placeholder="Add your review"
                />
                <button className="btn btn-success" onClick={this.addItem}>Add</button>
              </div>
            {restaurant.reviews && restaurant.reviews.length ? restaurant.reviews.map(item => 
              <li>
                  {item.title} <MdStar />
                  {item.rating}
                </li>
            ): null}           
                
          
            </div>
          
          </Popup>
         
        )} 
        
        

        <ZoomControl />
        <RotationControl />
      </Map>
    );
  }
}

export default MapGL;
