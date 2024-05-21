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
      } catch (error){
        console.error('Error fetching data', error.data)
      }
    }
    fetchCountry()
  }, [searchItem])

    const renderLanguages = (languages) => {
      if(Array.isArray(languages)){
        return languages.join(", ")
      } else if (typeof languages === 'object'){
          return Object.values(languages).join(', ')
      }else 
          return 'Unknown'
    }

    const handleCountryButton = (country) => {setSelectedCountry(country)
    console.log(selectedCountry.name.common)}

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

        {countries.length === 1 &&(
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
                </li>
              ))}
            </ul>
          </div>
        )}
        {countries.length<=10&&searchItem!==''&&selectedCountry&&( 
          <div>
            
              {selectedCountry.name.common}<p> 
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
