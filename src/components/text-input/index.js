import React from 'react'
import PropTypes from 'prop-types'

const TextInput = ({
  input: { value, type, onChange },
  meta: { valid, touched, error },
  placeholder,
  ...rest
}) => (
  <div className="TextInput" {...rest}>
    <input
      className="input"
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...rest}
    />
    {/* T O D O: Display meta data */}
    {console.log(`valid: ${valid}`, `touched: ${touched}`, `error: ${error}`)}
  </div>
)

TextInput.propTypes = {
  // Redux Form
  input: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func
  }).isRequired,
  meta: PropTypes.shape({
    valid: PropTypes.bool,
    touched: PropTypes.bool,
    error: PropTypes.string
  }).isRequired,

  // State
  placeholder: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired
}

export default TextInput
