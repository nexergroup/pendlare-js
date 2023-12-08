import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
const useOptionsStore = defineStore('options', () => {
    let temporaryStorage = {}
    const getItem = (option, default_value) => {
        if(localStorage) {
            if (localStorage.getItem(option) === null) {
                setItem(option, default_value);
            }
            return localStorage.getItem(option);
        } else {
            if (temporaryStorage[option] === undefined) {
                temporaryStorage[option] = default_value;
            }
            return temporaryStorage[option];
        }
    } 

    const setItem = (option, value) => {
        if (localStorage){
            localStorage.setItem(option, value);
        } else {
            temporaryStorage[option] = value;
        }
    }

    return { getItem, setItem }
  });
  
  export default useOptionsStore;
  