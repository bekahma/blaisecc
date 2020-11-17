import * as React from 'react';
import {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import {PassMarkers, StopMarkers, PassLines, Popups} from './Markers';
import {Token} from './Token';
import './index.css';

class Root extends Component {
	constructor(props) {
	super(props);
		this.state = {
		  viewport: {
			latitude: 45.5130674543,
			longitude: -73.5724840797,
			zoom: 15.5,
			bearing: 0,
			pitch: 0
		  }
	};
	}

	render() {
		return (
			<MapGL
				{...this.state.viewport}
				width="100vw"
				height="100vh"
				mapStyle="mapbox://styles/mapbox/dark-v9"
				onViewportChange={viewport => this.setState({viewport})}
				mapboxApiAccessToken={Token}
			>
				{PassLines}
				{PassMarkers}
				{StopMarkers}
				{Popups}
			</MapGL>
		);
	}
  
	/*async componentDidMount(){
        this.renderMyData();
    }
	
	renderMyData(){
        fetch('https://your url')
            .then((response) => response.json())
            .then((responseJson) => {
              this.setState({ data : responseJson })
            })
            .catch((error) => {
              console.error(error);
            });
    }*/
}

document.body.style.margin = 0;
render(<Root />, document.body.appendChild(document.createElement('div')));