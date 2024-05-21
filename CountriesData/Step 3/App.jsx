import React, { useEffect, useState } from 'react';
// Importa React e la funzione useState da React
import axios from 'axios'



const FilterForm = (props) => {
  return (
    <div>Find countries: <input 
    type = 'text'
    value = {props.searchItem} 
    onChange={(e) => {props.setSearchItem(e.target.value)
    props.setSelectedCountry(null)}}/></div>
  )
}




const App = () => {
  const [countries, setCountries] = useState([])
  const [searchItem, setSearchItem] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [filteredCountries, setFilteredCountries] = useState(null)
  const [weather, setWeather] = useState(null)
  const [apiError, setApiError] = useState(null)

  useEffect(() => {
    if (searchItem.trim()==="") {
      setCountries([])
      return
    }
    const fetchCountry = async () => {
      try {
        const url = `https://restcountries.com/v3.1/name/${searchItem}`
        const response = await axios.get(url)
        console.log(response.data)
        setCountries(response.data)
        setSelectedCountry(null)
        setWeather(null)
        if (response.data.length === 1) {
          const capital = response.data[0].capital
          fetchWeatherData(capital)
        }
      } catch (error){
        console.error('Error fetching data', error.data)
      }
    }
    fetchCountry()
  }, [searchItem])
  
  const fetchWeatherData = async (capital) => {
    try {
      const apiKey = import.meta.env.VITE_SOME_KEY
      // const v3 =`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${apiKey}`
      const v2_5 =`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
      const weatherResponse = await axios.get(v2_5)
      setWeather(weatherResponse.data)
      setApiError(null)
    } catch(error){
      console.error('Error fetching weather data ', error.data)
      setWeather(null)
      setApiError('Failed to fetch weather data')
    }
  }

    const renderLanguages = (languages) => {
      if(Array.isArray(languages)){
        return languages.join(", ")
      } else if (typeof languages === 'object'){
          return Object.values(languages).join(', ')
      }else 
          return 'Unknown'
    }

    const handleCountryButton = (country) => {
      setSelectedCountry(country)
      console.log(selectedCountry.name.common)
      const capital = country.capital
      fetchWeatherData(capital)
  }

  return (
    <div>
      <h2>Country Information App</h2>
      <FilterForm setSearchItem= {setSearchItem} setSelectedCountry={setSelectedCountry} />

      
        {countries.length <=10  && countries.length >1 &&( <div>
          <h2>Matching Countries:</h2>
          <ul>{countries.map(country=> (
            <li key={country.name.common}>{country.name.common}<button onClick={() => handleCountryButton(country)}>
              show country data</button></li>
          ))}</ul>
        </div>) }

        {countries.length === 1 &&( // found only 1 result
          <div>
            <ul>
              {countries.map ( country => (
                <li key={country.name.common}><p>
                  <h2>{country.name.common}</h2>
                  <p>capital {country.capital}</p>
                  <p>area {country.area}</p>
                  
                  <h3>languages</h3>
                  {countries[0].languages && renderLanguages(countries[0].languages)}
                  </p>
                  <p>Flag:</p>
                  {
                    <img src={countries[0].flags.png} alt={countries[0].flags.alt}></img>
                  }
                  <h2>Weather in {countries[0].capital}</h2>
                  {weather && (<div>
                   <p>Temperature: {weather.main.temp}°C</p>
                   <p>Humidity: {weather.main.humidity}</p>
                   <p>Wind Speed: {weather.wind.speed}</p>
                   <p>Weather Description: {weather.weather[0].description}</p>
                   {weather.weather[0].icon&&
                   (<p>Weather Icon: <img alt = 'Weather Icon' src={`http://openweathermap.org/im/wn/${weather.weather[0].icon}.png`} ></img></p>)}
                   </div>
                   )}

                </li>
              ))}
            </ul>
          </div>
        )}
        {countries.length<=10&&searchItem!==''&&selectedCountry&&( //selected country
          <div>
            
            <p> 
                <h2>{selectedCountry.name.common}</h2>
                <p>capital {selectedCountry.capital}</p>
                <p>area {selectedCountry.area}</p>
                
                <h3>languages</h3>
                {selectedCountry.languages && renderLanguages(selectedCountry.languages)}
                </p>
                <p>Flag:</p>
                {
                  <img src={selectedCountry.flags.png} alt={selectedCountry.flags.alt}></img>
                }
          <h2>Weather in {selectedCountry.capital}</h2>
          {weather && (<div>
                   <p>Temperature: {weather.main.temp}°C</p>
                   <p>Humidity: {weather.main.humidity}</p>
                   <p>Wind Speed: {weather.wind.speed}</p>
                   <p>Weather Description: {weather.weather[0].description}</p>
                   {weather.weather[0].icon&&
                   (<p>Weather Icon: <img alt = 'Weather Icon' src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} ></img></p>)}
                   </div>
                   )}
            
        </div>
        )}
        {countries.length >10&&(
          <div>Countries found are more than 10.</div>
        )}
        
    </div>
  )

}

export default App
// Esporta il componente App
