import React, { useEffect, useState } from 'react';
// Importa React e la funzione useState da React
import axios from 'axios'

/*
Definisce un componente funzionale Names che accetta una prop 
"person" e restituisce il nome della persona */
const Filter = (props) => {
  return (
    <div> {/*Componente */ }
    filter: <input onChange={props.handleFilterChange}/> 
  </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addName}> 
    <div>
      name: <input onChange={props.handleNameChange}/>
    </div>
    <div>
      number: <input onChange={props.handleNumberChange}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

const Persons = (props) => {
  return (
    props.personsToShow.map(
      person => <li>{person.name} {person.number} {person.id}</li>  
    )
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  // Definisce uno stato "persons" con useState, inizializzato con un array contenente un oggetto con il nome "Arto Hellas"
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [showAll, setShowAll] = useState(true)

  // Definisce uno stato "newName" con useState, inizializzato con una stringa vuota
  const hook = () => {
    console.log("effect")
		axios
    .get("http://localhost:3001/persons")
    .then((response)=> {
      console.log("promise fulfilled")
      setPersons(response.data) 
		})
    .catch((error)=> {
      console.error('Error fetching data: ', error)
    })
	}
  
  useEffect(hook,[])
  

  const addName = (event) => {
    event.preventDefault() /* previene che la pagina si riaggiorni. 
    La pagina si riaggiorna ogni volta si submitta.
    */
    console.log (event.target) // Stampa l'evento nel console log

    const nameObject= {
      name: newName,
      number: newNumber,
      id: persons.length+1
    }  // Crea un oggetto contenente il nuovo nome, numero e progressivo
    
    const searchString = nameObject.name // memorizzo il nuovo nome

    const found = persons.some(item => item.name === searchString)
    if (found){
      alert(`${nameObject.name} is aleady in the phonebook.`)
      
    } 
    else{
    setPersons(persons.concat(nameObject))    // Aggiunge il nuovo nome all'array "persons" utilizzando il metodo concat

    setNewName('')
    console.log(found) // should always log false
  }
    // Resettta lo stato "newName" a una stringa vuota
  }
  const handleNameChange = (event) => {
    console.log(event.target.value); // event.target si riferisce al form
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    console.log(event.target.value); // event.target si riferisce al form
    setNewNumber(event.target.value);
  };
  // Definisce una funzione per gestire il cambiamento del nome nell'input
  const handleFilterChange = (event) => {
    console.log(event.target.value); // event.target si riferisce al form
    setNewFilter(event.target.value);
  }

  const personsToShow = showAll
    ? persons.filter(person => person.name.includes(newFilter))
    : persons


  return (
    <div>
      <h2>Filtro</h2>
      <Filter handleFilterChange ={handleFilterChange}/>

      <h2>Phonebook</h2>
      <PersonForm addName = {addName} 
      handleNameChange = {handleNameChange} 
      handleNumberChange = {handleNumberChange} />      

      <h2>Numbers</h2>
      <Persons personsToShow= {personsToShow}/>
      

    </div>
  )
}

export default App
// Esporta il componente App
