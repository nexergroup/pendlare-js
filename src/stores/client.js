import useStationsStore from './stations';

const apiUrl = 'https://api.trafikinfo.trafikverket.se/v2/data.json';
const apiKey = '707695ca4c704c93a80ebf62cf9af7b5'; //'2d0a80dffd1c4a54a9885177ba7311fd';
const getAllStations = () => {
    let query = {
        type: 'TrainStation',
        version: 1.4,
        limit: 1000,
        orderby: 'AdvertisedLocationName'
    };
    let filters = [
        {
            op: 'EQ',
            name: "Advertised",
            value: "true"
        }
    ]
    let payload =  preparePayload(query, filters);
    fetch(apiUrl,payload).then(response => {
        response.json().then(data => {
            let result = data.RESPONSE.RESULT[0].TrainStation;
            let store = useStationsStore();
            store.stations = result.sort((a,b)=> a.AdvertisedLocationName > b.AdvertisedLocationName);
            store.updateNames();
        });
    });
};

const getStationDepartures = (signature) => {
    let store = useStationsStore();
    store.trips = [];
    let payload =  stationDeparturePayload(signature);
    fetch(apiUrl,payload).then(response => {
        response.json().then(data => {
            let result = data.RESPONSE.RESULT[0].TrainAnnouncement;
            store.trips = result;
        });
    });
}
const getStationArrivals = (signature) => {
    let store = useStationsStore();
    store.trips = [];
    let payload =  stationArrivalPayload(signature);
    fetch(apiUrl,payload).then(response => {
        response.json().then(data => {
            let result = data.RESPONSE.RESULT[0].TrainAnnouncement;
            store.trips = result;
        });
    });
}

function getStops(trainId){
    let store = useStationsStore();
    store.stopData = {
        firstAnnouncement: {}, 
        lastAnnouncement: {}, 
        nextArrival: {},
        nextDeparture: {},
        stops: []
    } ;
    let payload = trainStopsPayload(trainId);
    fetch(apiUrl,payload).then(response => {
        response.json().then(data => {
            let result = data.RESPONSE.RESULT[0].TrainAnnouncement;
            let scheduleDate = result[0].ScheduledDepartureDateTime;
            let stops = {};
            for(let i = 0; i < result.length; i++) {
                let stop = result[i];
                if(!stops[stop.LocationSignature]) {
                    stops[stop.LocationSignature] = {LocationSignature: stop.LocationSignature, 'Ankomst': false, Avgang: false};
                }
                stops[stop.LocationSignature][stop.ActivityType] = stop;
            }

            let nextArrival = {};
            let nextDeparture = {};
            result.filter((announcement)=> announcement.ActivityType == 'Ankomst').some((announcement) => {
                if(!store.stationHasPassed(announcement)) {
                    nextArrival = announcement;
                    return true;
                }
            });

            result.filter((announcement)=> announcement.ActivityType == 'Avgang').some((announcement) => {
                if(!store.stationHasPassed(announcement)) {
                    nextDeparture = announcement;
                    return true;
                }
            });
            store.stopData = {
                firstAnnouncement: result[0], 
                lastAnnouncement: result[result.length - 1], 
                nextArrival: nextArrival,
                nextDeparture: nextDeparture,
                stops: stops
            } ;
        }).catch((error) => {console.error(error)});
    });
}

const getConnections = (sourceSignature, destinationSignature) => {
    let departurePayload = stationDeparturePayload(sourceSignature);
    fetch(apiUrl, departurePayload).then(response => {
        response.json().then(data => {
            let departures = data.RESPONSE.RESULT[0].TrainAnnouncement;
            let arrivalPayload = stationArrivalPayload(destinationSignature);
            fetch(apiUrl, arrivalPayload).then(response => {
                response.json().then(data => {
                    let arrivals = data.RESPONSE.RESULT[0].TrainAnnouncement;
                    let result = departures.filter((departure) => arrivals.some((arrival) => arrival.AdvertisedTrainIdent == departure.AdvertisedTrainIdent && departure.AdvertisedTimeAtLocation < arrival.AdvertisedTimeAtLocation))
                    let store = useStationsStore();
                    store.trips = result;
                });
            }).catch((error) => {console.error(error)} );
        })
    }).catch((error) => {console.error(error)} );
}

function prepareFilters(filters) { // Recursive function.
    let xmlFilters = '';
    for (let i=0; i < filters.length; i++) {
        if(filters[i].op == 'OR' || filters[i].op == 'AND') {
            xmlFilters += '<' + filters[i].op + '>' +
                            // Recursive call 
                            prepareFilters(filters[i].filters) + 
                            '</' + filters[i].op + '>';
        } else {
            xmlFilters +=  '<' + filters[i].op + ' name="' + filters[i].name + '" value="' + filters[i].value + '" />';
        }
    }
    return xmlFilters;
};
function prepareQuery(query, filters) {
    let xmlQuery = '<QUERY objecttype="' + query.type + '" schemaversion="' + query.version + '"';
    if (query.limit) {
        xmlQuery += ' limit="' + query.limit + '"';
    }
    if (query.orderby) {
        xmlQuery += ' orderby="' + query.orderby + '"';
    }
    xmlQuery += ' >';
    xmlQuery += '<FILTER>' + prepareFilters(filters) + '</FILTER>';
    xmlQuery += '</QUERY>';
    return xmlQuery;
};

function prepareLogin() {
    return '<LOGIN authenticationkey="' + apiKey + '" />';
};

function prepareRequest(query, filters) {
    let xml =  '<REQUEST>' + prepareLogin() + prepareQuery(query,filters) + '</REQUEST>';
    return xml;
};

function preparePayload (query, filters) {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'text/xml'
        },
        body: prepareRequest(query, filters)
    }
};

function stationDeparturePayload(signature) {
    let query = {
        type: 'TrainAnnouncement',
        version: '1.8',
        limit: 500,
        orderby: 'AdvertisedTimeAtLocation'
    };
    let filters = [
        {
            op: 'AND',
            filters: [
                { op: 'EQ', name: 'ActivityType', value: 'Avgang' },
                { op: 'EQ', name: 'Advertised', value: 'true' },
                { op: 'EQ', name: 'LocationSignature', value: signature },
                {
                    op: 'OR',
                    filters: [
                        {
                            op: 'AND',
                            filters: [
                                { op: 'GT', name: 'AdvertisedTimeAtLocation', value: '$dateadd(-00:30:00)'}, // planned in the future
                                { op: 'LT', name: 'AdvertisedTimeAtLocation', value: '$dateadd(10:00:00)'}  // but not in the distant future.
                            ]
                        },
                        {
                            op: 'AND',
                            filters: [
                                { op: 'LT', name: 'AdvertisedTimeAtLocation', value: '$dateadd(10:00:00)'}, // planned in the next few hours.
                                { op: 'GT', name: 'EstimatedTimeAtLocation', value: '$dateadd(-4:00:00)'},  // has an estimate from a certian point in time
                                { op: 'EXISTS', name: 'TimeAtLocation', value: 'false'} // has not departed yet.
                            ]
                        }
                    ]
                }
            ]
        }
    ];
    let payload =  preparePayload(query, filters);
    return payload;
}

function stationArrivalPayload(signature) {
    let query = {
        type: 'TrainAnnouncement',
        version: '1.8',
        limit: 500,
        orderby: 'AdvertisedTimeAtLocation'
    };
    let filters = [
        {
            op: 'AND',
            filters: [
                { op: 'EQ', name: 'ActivityType', value: 'Ankomst' },
                { op: 'EQ', name: 'Advertised', value: 'true' },
                { op: 'EQ', name: 'LocationSignature', value: signature },
                {
                    op: 'OR',
                    filters: [
                        {
                            op: 'AND',
                            filters: [
                                { op: 'GT', name: 'AdvertisedTimeAtLocation', value: '$dateadd(-00:30:00)'}, // planned in the future
                                { op: 'LT', name: 'AdvertisedTimeAtLocation', value: '$dateadd(14:00:00)'}  // but not in the distant future.
                            ]
                        },
                        {
                            op: 'AND',
                            filters: [
                                { op: 'LT', name: 'AdvertisedTimeAtLocation', value: '$dateadd(14:00:00)'}, // planned in the next few hours.
                                { op: 'GT', name: 'EstimatedTimeAtLocation', value: '$dateadd(-4:00:00)'},  // has an estimate from a certian point in time
                                { op: 'EXISTS', name: 'TimeAtLocation', value: 'false'} // has not arrived yet.
                            ]
                        }
                    ]
                }
            ]
        }
    ];
    let payload =  preparePayload(query, filters);
    return payload;
}

function trainStopsPayload(id) {
    let query = {
        type: 'TrainAnnouncement',
        version: '1.3',
        limit: 500,
        orderby: 'AdvertisedTimeAtLocation'
    };
    let filters = [
        {
            'op': 'AND',
            'filters': [
                { op: 'EQ', name: 'AdvertisedTrainIdent', value: id },
                { op: 'EQ', name: 'Advertised', value: 'true' },
                { 
                    op: 'AND',
                    filters: [
                        {op: 'LT', name: 'AdvertisedTimeAtLocation', value: '$DateAdd(14:00:00)'},
                        {op: 'GT', name: 'AdvertisedTimeAtLocation', value: '$DateAdd(-08:00:00)'}
                    ]
                }
            ]
        }
    ];
    let payload = preparePayload(query, filters);
    return payload;
}
export { getAllStations, getStationDepartures, getStationArrivals, getConnections, getStops };