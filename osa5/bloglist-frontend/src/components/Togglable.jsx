import { forwardRef, useImperativeHandle, useState } from 'react'

const Togglable = forwardRef(function Togglable({ buttonLabel, children }, ref) {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => setVisible(v => !v)
  useImperativeHandle(ref, () => ({ toggleVisibility }))

  return (
    <div>
      {!visible && (
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      )}

      {visible && (
        <div>
          <div data-testid="inner">{children}</div>
          <button onClick={toggleVisibility}>cancel</button>
        </div>
      )}
    </div>
  )
})

export default Togglable
