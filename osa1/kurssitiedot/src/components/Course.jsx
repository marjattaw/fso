// Course.jsx
// Vastaa yhden kurssin nimen ja osien renderöinnistä (ei vielä totals).

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

const Course = ({ course }) => {
  const { name, parts } = course
  return (
    <section>
      <Header name={name} />
      <Content parts={parts} />
    </section>
  )
}

export default Course
