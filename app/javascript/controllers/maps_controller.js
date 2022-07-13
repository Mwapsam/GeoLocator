import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ["field", "map", "latitude", "longitude"];

    connect() {
        if (typeof (google) !== "undefined") {
            this.initializeMap();
        }
    }

    initializeMap() {
        this.map()
        this.marker()
        this.autocomplete()
    }

    map() {
        if (this._map === undefined) {
            this._map = new google.maps.Map(this.mapTarget, {
                center: new google.maps.LatLng(
                    this.latitudeTarget.value,
                    this.longitudeTarget.value
                ),
                zoom: 17
            });
        }
    return this._map
    }
    marker() {
        if (this._marker === undefined) {
            this._marker = new google.maps.Marker({
                map: this.map(),
                anchorPoint: new google.maps.Point(0, 0),
                draggable: true
            });
            let maplocation = {
                lat: parseFloat(this.latitudeTarget.value),
                lng: parseFloat(this.longitudeTarget.value)
            }
            this._marker.setPosition(maplocation);
            this._marker.setVisible(true);
        }
        return this._marker
    }
    autocomplete() {
        if (this._autocomplete === undefined) {
            this._autocomplete = new google.maps.places.Autocomplete(
                this.fieldTarget
            );
            this._autocomplete.bindTo("bounds", this.map());
            this._autocomplete.setFields(["geometry", "address_components", "icon", "name"]);
            this._autocomplete.addListener("place_changed", this.locationChanged.bind(this));
        }
        return this._autocomplete
    }

    locationChanged() {
        let place = this.autocomplete().getPlace();
        if (!place.geometry) {
            return;
        }
        this.map().fitBounds(place.geometry.viewport);
        this.marker().setPosition(place.geometry.location);
        this.marker().setVisible(true);

        this.latitudeTarget.value = place.geometry.location.lat();
        this.longitudeTarget.value = place.geometry.location.lng();
    }

    preventSubmit(e) {
        if (e.key === "Enter") {
            e.preventDefault();
        }

    }
}