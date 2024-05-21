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
    props.filteredPerson.map(
      person => <li>{person.name} {person.number} {person.id} 
      <button onClick={()=> props.deletePerson(person.id)}>delete</button></li>  
    )
  )
}

const Notification = ({message}) => {
  if (message=== null){
    return null
  }
  return (
    <div className='successMessage'>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  // Definisce uno stato "persons" con useState, inizializzato con un array contenente un oggetto con il nome "Arto Hellas"
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [filteredPerson, setFilteredPerson] = useState([])
  const [successMessage, setSuccessMessage] = useState(null)
  // Definisce uno stato "newName" con useState, inizializzato con una stringa vuota
  const hook = () => { //carica dati
    console.log("effect")
		axios
    .get("http://localhost:3001/persons")
    .then((response)=> {
      console.log("promise fulfilled")
      setPersons(response.data) 
      setFilteredPerson(response.data)
      
		})
    .catch((error)=> {
      console.error('Error fetching data: ', error)
    })
	}

  useEffect(hook,[])
  const hook2  = () => { //add name
    axios
    .post("http://localhost:3001/persons",nameObject)
    .then(response => {
      console.log(response)
      setPersons(persons.concat(response.data))
      setFilteredPerson(filteredPerson.concat(response.data))
      setSuccessMessage(`Added ${nameObject.name} `)
      setTimeout(()=> {
        setSuccessMessage(null)
      },2000)
    .catch((error)=> {
        console.error('Error updating person: ', error)
      })
    
    
    })
    
  }
  const hook3 = (nameObject) => { //replace number
    console.log(nameObject)
    const idReplace = persons.find(person => person.name === nameObject.name).id
    const url = `http://localhost:3001/persons/${idReplace}`
    console.log(url)
    axios
      .put(url,nameObject)
      .then(response => {
        setNewNumber(nameObject.number)
        setFilteredPerson(
          persons.map(person => 
            person.id === idReplace ? nameObject : person)); // aggiorna la lista filtrata
        setSuccessMessage(`Replaced ${nameObject.name} number`)
        setTimeout(()=> {
          setSuccessMessage(null)
        },2000)


      })
    
  }

  const nameObject= {
    name: newName,
    number: newNumber,
    // id: persons.length+1 non va più bene perché va generato nel backend
  }  // Crea un oggetto contenente il nuovo nome, numero e progressivo

  
  const addName = (event) => {
    event.preventDefault() /* previene che la pagina si riaggiorni. 
    La pagina si riaggiorna ogni volta si submitta.
    */
    console.log (event.target) // Stampa l'evento nel console log
    const searchString = nameObject.name // memorizzo il nuovo nome
    const found = persons.some(item => item.name === searchString)
    if (found){
      
      // alert(`${nameObject.name} is aleady in the phonebook.`)
      if(window.confirm(`Esiste già, vuoi aggiornare il numero?`)){
        hook3(nameObject)
      }

    } 
    else{
    hook2() //adding through hook2
    // setPersons(persons.concat(nameObject))    // Aggiunge il nuovo nome all'array "persons" utilizzando il metodo concat
    // setFilteredPerson(filteredPerson.concat(nameObject))
    // setNewName('')
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
  const deletePerson = id => {
    const url = `http://localhost:3001/persons/${id}`
    const newPersons = persons.filter((person) => person.id !== id)
    const personDeleted = persons.find(person => person.id === id)
    
    if(window.confirm(`Delete ${personDeleted.name}?`)){
    axios
      .delete(url)
      .then(
        response => {
          setPersons(newPersons)
          setFilteredPerson(newPersons)
        })
      .catch(error => {
        console.error('Error deleting person: ', error.message)
        console.log(newPersons)
  })}
  }
  // Definisce una funzione per gestire il cambiamento del nome nell'input
  const handleFilterChange = (event) => {
    console.log(event.target.value); // event.target si riferisce al form
    setNewFilter(event.target.value);
    const futureItems = persons.filter(person => 
      person.name.includes(event.target.value))
    setFilteredPerson(futureItems)
    
  }



  return (
    <div>
      <h2>Filtro</h2>
      <Notification message = {successMessage}/>
      <Filter handleFilterChange ={handleFilterChange}/>

      <h2>Phonebook</h2>
      <PersonForm addName = {addName} 
      handleNameChange = {handleNameChange} 
      handleNumberChange = {handleNumberChange} />      

      <h2>Numbers</h2>
      <Persons persons={persons} filteredPerson= {filteredPerson} deletePerson={deletePerson}/>
      

    </div>
  )
}

export default App
// Esporta il componente App
