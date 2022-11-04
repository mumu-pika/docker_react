import React from 'react'
import { Link } from 'react-router-dom'

function DetailPage(props) {
    return (
      <div>
        <div><p>some pages</p></div>
        <Link to="/"> Go back home</Link>
      </div>
    )
}
export default DetailPage