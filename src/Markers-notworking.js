//import {Component} from 'react';
//import update from 'react-addons-update';
import {Source, Marker, Layer, Popup} from 'react-map-gl';
import Stops from './stops.json';
import Passengers from './passengers.json';
import RedMarker from './img/red_marker.png';
import BlueMarker from './img/blue_marker.png';
//import {Token} from './Token';

const MarkerSize = 30;
const OffsetLeft=-15;
const OffsetTop=-20;


/*export const StopMarkers = Stops.map(stop =>
	<Marker latitude={stop.lat} longitude={stop.lon} offsetLeft={OffsetLeft} offsetTop={OffsetTop}>
		<img alt='Bus Stop Marker' src={BlueMarker} width={MarkerSize} height={MarkerSize} />
	</Marker>
	);*/

export const PassMarkers = Passengers.map(pass =>
	<Marker latitude={pass.lat} longitude={pass.lon} offsetLeft={OffsetLeft} offsetTop={OffsetTop}>
		<img alt='Passenger Marker' src={RedMarker} width={MarkerSize} height={MarkerSize} />
	</Marker>
	);

export const PassLines = Passengers.map(function(pass){
	// getting closest stop to current passenger
	var len = 1.0;
	var lat = 0.0;
	var lon = 0.0;
	Stops.forEach(stop => {
		var nlat = pass.lat-stop.lat;
		var nlon = pass.lon-stop.lon;
		var nlen = Math.sqrt(nlat*nlat+nlon*nlon);
		if(nlen < len){
			len = nlen;
			lat = stop.lat;
			lon = stop.lon;
		}
		return;
	});
	
	// generate and return object
	return (<Source type='geojson' data={{
				type: 'Feature',
				geometry: {
					coordinates:[
						[lon,lat],
						[pass.lon,pass.lat]
					],
					type: 'LineString'
				}
			}}>
				<Layer
					type='line'
					layout={{
						'line-join': 'round',
						'line-cap': 'round'
					}}
					paint={{
						'line-width': 5,
						'line-color': '#00ccad'
				}} />
			</Source>);
});

// I need popups as a component rather than a static object, so this code turned out to be useless.
// Disregard previous comment, static stuff works

function generate(){
	var coordMatch = Passengers.map(pass => {
		var len = 1.0;
		var lat = 0.0;
		var lon = 0.0;
		Stops.forEach(stop => {
			var nlat = pass.lat-stop.lat;
			var nlon = pass.lon-stop.lon;
			var nlen = Math.sqrt(nlat*nlat+nlon*nlon);
			if(nlen < len){
				len = nlen;
				lat = stop.lat;
				lon = stop.lon;
			}
			return;
		});
		return {'stop': {'lat':lat, 'lon':lon}}
	});
	var popups = Stops.map(stop => {
		var count = 0;
		coordMatch.forEach(coords => {
			// console.log(coords.stop);
			// console.log(stop);
			if(coords.stop.lat === stop.lat && coords.stop.lon === stop.lon){
				count++;
				// console.log(coords.stop);
				// console.log(stop);
			}
			return;
		});
		return (
		<Marker latitude={stop.lat} longitude={stop.lon} offsetLeft={OffsetLeft} offsetTop={OffsetTop}>
			<img alt='Bus Stop Marker' src={BlueMarker} width={MarkerSize} height={MarkerSize} />
			<Popup
			latitude={stop.lat}
			longitude={stop.lon}
			closeButton={false}
			closeOnClick={false}
			onClose={() => this.setState({showPopup: false})}
			anchor="bottom" 
			//dynamicPosition={false}
			//offsetTop={OffsetTop}
			>
				<div>{count}</div>
			</Popup>
		</Marker>);
	});
	//console.log(popups);
	return popups;
};

export const Popups = generate();

/*
Ended up using CSS for hover event, this is all unneeded

class Popups extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showPopup: [],
		};
	}
	
	render(){
		var idx = 0;
		var stops = Stops.map(stop => {
			//this.state.showPopup.push(false);
			var marker = (
			<div
				//id={idx}
				onMouseOver={() =>
					{
						console.log(this.state);
						console.log(this.state.showPopup[idx]);
						this.setState(update(this.state, {showPopup: {[{props.id}]: {$set: true}}}));
						console.log(idx);
						// console.log(this.state);
					}
				}
				onMouseOut={() =>
					{
						// console.log(this.state.showPopup[idx]);
						this.setState(update(this.state, {showPopup: {[{props.id}]: {$set: true}}}));
						// console.log(idx);
					}
				}
			>
				<Marker
					key={'stop'+idx}
					id={idx}
					latitude={stop.lat}
					longitude={stop.lon}
					offsetLeft={OffsetLeft}
					offsetTop={OffsetTop}
				>
					<img alt='Bus Stop Marker' src={BlueMarker} width={MarkerSize} height={MarkerSize} />
				</Marker>
			//</div>
			);
			idx++;
			return marker;
		});
		// console.log(this.state);
		var coordMatch = Passengers.map(pass => {
			var len = 1.0;
			var lat = 0.0;
			var lon = 0.0;
			Stops.forEach(stop => {
				var nlat = pass.lat-stop.lat;
				var nlon = pass.lon-stop.lon;
				var nlen = Math.sqrt(nlat*nlat+nlon*nlon);
				if(nlen < len){
					len = nlen;
					lat = stop.lat;
					lon = stop.lon;
				}
				return;
			});
			return {'stop': {'lat':lat, 'lon':lon}}
		});
		idx = 0;
		var popups = Stops.map(stop => {
			var count = 0;
			coordMatch.forEach(coords => {
				// console.log(coords.stop);
				// console.log(stop);
				if(coords.stop.lat === stop.lat && coords.stop.lon === stop.lon){
					count++;
					// console.log(coords.stop);
					// console.log(stop);
				}
				return;
			});
			//console.log(this.state);
			//console.log(this.state.showPopup[idx]);
			var pop = (this.state.showPopup[idx]&&
			(<Popup key={'popup'+idx}
				latitude={stop.lat}
				longitude={stop.lon}
				closeButton={true}
				closeOnClick={false}
				//onClose={() => this.setState(update(this.state, {showPopup: {[idx]: {$set: false}}}))}
				anchor="bottom" 
				dynamicPosition={false}
				offsetTop={OffsetTop}
				>
					<div>{count}</div>
				</Popup>));
			idx++;
			//console.log(pop);
			return pop;
		});
		// console.log(popups);
		return stops.concat(popups);
	}
}

export default Popups;
*/

/*
This code requires asynchronous delay which I cannot research and implement in time

export async const PassLines = Passengers.map(function(pass){
	var len = 1.0;
	var lat = 0.0;
	var lon = 0.0;
	Stops.forEach(function(stop){
		var nlat = pass.lat-stop.lat;
		var nlon = pass.lon-stop.lon;
		var nlen = Math.sqrt(nlat*nlat+nlon*nlon);
		if(nlen < len){
			len = nlen;
			lat = stop.lat;
			lon = stop.lon;
		}
	});
	var coords = String(pass.lon)+','+String(pass.lat)+';'+String(lon)+','+String(lat);
	var url = "https://api.mapbox.com/directions/v5/mapbox/walking/"+coords+"?alternatives=false&geometries=geojson&steps=false&access_token="+Token;
	var tags = fetch(url).then(res => res.json().then(data =>
			<Source type='geojson' data={{
				type: 'Feature',
				geometry: data.routes[0].geometry
			}}>
				<Layer
					type='line'
					layout={{
						'line-join': 'round',
						'line-cap': 'round'
					}}
					paint={{
						'line-width': 10,
						'line-color': '#00ccad'
				}} />
			</Source>
			
		));
	console.log(tags);
	return <div />;
}); */

/*
This is all the work that went into above function, which unfortunately did not work.

const shortest = Passengers.map(function(pass){
	var len = 1.0;
	var lat = 0.0;
	var lon = 0.0;
	Stops.forEach(function(stop){
		var nlat = pass.lat-stop.lat;
		var nlon = pass.lon-stop.lon;
		var nlen = Math.sqrt(nlat*nlat+nlon*nlon);
		if(nlen < len){
			len = nlen;
			lat = stop.lat;
			lon = stop.lon;
		}
	});
	return coords = String(pass.lon)+','+String(pass.lat)+';'+String(lon)+','+String(lat);
});

const coordinates = shortest.map(coords =>
	fetch("https://api.mapbox.com/directions/v5/mapbox/walking/"+coords+"?alternatives=false&geometries=geojson&steps=false&access_token="+Token).then(function(res){
		console.log(res.json());
		res.json().then(data =>
			data.routes[0].geometry
		);
	}
	)	
);

export const PassLines = coordinates.map(coords =>
	<Source type='geojson' data={{
		type: 'Feature',
		geometry: {coords}
	}}>
		<Layer
			type='line'
			layout={{
				'line-join': 'round',
				'line-cap': 'round'
			}}
			paint={{
				'line-width': 10,
				'line-color': '#00ccad'
		}} />
	</Source>
);*/