import React, { useRef } from 'react';

/* 
  Adds an event listener to the document and triggers a state change if
  the user has selected an area outside of the target. 
*/

export const EditableField = ({
  children,
  initialState = false,
  editIf = true
}) => {
  const [isEditing, setIsEditing] = React.useState(initialState);
  const ref = useRef();

  const checkIfContainsChild = (e) => {
    if (ref.current && !ref.current.contains(e.target) && editIf) {
      setIsEditing(false);
    }
  }

  React.useEffect(() => {
    document.addEventListener('click', checkIfContainsChild, true);
    return () => {
      document.removeEventListener('click', checkIfContainsChild, true);
    }
  })

  return (
    <div ref={ref} className="gf-form-inline" onClick={checkIfContainsChild}>
      {children(isEditing, setIsEditing)}
    </div>
  )
}