export default function Filter({ value, onChange }) {
  return (
    <div>
      find countries <input value={value} onChange={onChange} />
    </div>
  )
}
