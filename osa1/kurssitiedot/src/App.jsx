import Course from "./components/Course"

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        { id: 1, name: 'Fundamentals of React', exercises: 10 },
        { id: 2, name: 'Using props to pass data', exercises: 7 },
        { id: 3, name: 'State of a component', exercises: 14 },
        { id: 4, name: 'Redux', exercises: 11 },
      ],
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        { id: 1, name: 'Routing', exercises: 3 },
        { id: 2, name: 'Middlewares', exercises: 7 },
      ],
    },
  ]

  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map(course => (
        <Course key={course.id} course={course} />
      ))}
    </div>
  )
}

export default App
