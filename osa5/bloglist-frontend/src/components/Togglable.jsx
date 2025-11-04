import { useState, forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef(function Togglable({ buttonLabel, children }, ref) {
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => setVisible(v => !v)

  useImperativeHandle(ref, () => ({ toggleVisibility }))

  return (
    <div style={{ margin: '12px 0' }}>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <div style={{ marginTop: 8 }}>
          <button onClick={toggleVisibility}>cancel</button>
        </div>
      </div>
    </div>
  )
})

export default Togglable
