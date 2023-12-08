import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const useStationsStore = defineStore('stations', () => {
  const stations = ref([]);
  const names = ref({});
  const trips = ref([]);

  const updateNames = () => {
    stations.value.forEach(element => {
      names.value[element.LocationSignature] = element.AdvertisedLocationName
    });
  }

  const getName = (signature) => {
    return  names.value[signature]
  };

  const isFutureDate = (dateString) => {
    if (dateString == undefined || dateString == '' ) {
      return false;
    }
    let date = new Date(dateString);
    return date > (new Date());
  }
  
  const stationHasPassed = (announcement) => {
    if (announcement) {
      if (announcement.Canceled) {
        return true;
      }
      if (announcement.TimeAtLocation) {
        return true;
      }
      if (isFutureDate(announcement.AdvertisedTimeAtLocation)) {
        return false;
      }
      if (isFutureDate(announcement.PlannedEstimatedTimeAtLocation)) {
        return false;
      }
      if (isFutureDate(announcement.EstimatedTimeAtLocation)) {
        return false;
      }
    }
    return true;
  }
  return {stations, updateNames, getName, names, trips, stationHasPassed }
});

export default useStationsStore;
