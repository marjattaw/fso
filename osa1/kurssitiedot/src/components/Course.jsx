
const Header = ({ name }) => <h2>{name}</h2>

const Part = ({ part }) => (
  <li>
    {part.name} {part.exercises}
  </li>
)

const Content = ({ parts }) => (
  <ul>
    {parts.map(p => (
      <Part key={p.id} part={p} />
    ))}
  </ul>
)

const Total = ({ parts }) => {

  const total = parts
    .map(p => p.exercises)
    .reduce((a, b) => a + b, 0)
  return <p><strong>total of {total} exercises</strong></p>
}

const Course = ({ course }) => {
  const { name, parts } = course
  return (
    <section>
      <Header name={name} />
      <Content parts={parts} />
      <Total parts={parts} />
    </section>
  )
}

export default Course
