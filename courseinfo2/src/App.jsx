import React from 'react'
import ReactDOM from 'react-dom/client'


const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <p>Number of exercises {sum}</p>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <>
    <Part
      part={parts[0]} 
    />
    <Part
      part={parts[1]} 
    />
    <Part
      part={parts[2]} 
    />      
  </>
const Content2 = ({ parts }) => 
<>
  <Part
    part={parts[0]} 
  />
  <Part
    part={parts[1]} 
  />
  
</>



const Course = ({courses}) => {
  var isId1 = function(course){
    return course.id === 1 
  }
  var isId2 = function(course){
    return course.id === 2 
  }
  var id1 = courses.find(isId1) 
  var id2 = courses.find(isId2) 


  var names = id1.parts.map(function(part){ 
    return part.name + ' '+ part.exercises 
   })
  
  var exercises = id1.parts.map(function(part){
    return part.exercises
  })
  var exercises2 = id2.parts.map(function(part){
    return part.exercises
  })
  const sum = exercises.reduce((s,p)=> s+p,0)
  const sum2 = exercises2.reduce((s,p)=> s+p,0)
  return (<div>
    <Header course = {id1.name}/>
    <div><Content parts = {id1.parts}/></div>
    <div><Total sum = {sum} /></div>
    <Header course = {id2.name}/>
   <div><Content2 parts = {id2.parts}/></div>
   <div><Total sum = {sum2} /></div>


    </div>
  )
}

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  
  
  return <Course courses={courses} />
}

export default App



