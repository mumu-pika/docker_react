import React, { useEffect, useState } from 'react'
import axios from 'axios'

// async functions
const fetchValues = async () => {
  try {
    const values = await axios.get('/api/values/current')
    return values.data
  } catch (e) {
    console.warn(e)
  }
}

const fetchIndexes = async () => {
  try {
    const seenIndexes = await axios.get('/api/values/all')
    return seenIndexes.data
  } catch (e) {
    console.warn(e)
  }
}

// export default
function Fib(props) {
  const [seenIndexes, setSeenIndexes] = useState([]) // 用户输入过的数字
  const [values, setValues] = useState({}) // redis中计算得到结果值
  const [index, setIndex] = useState('') // 输入用户输入的数字

  useEffect(() => {
    let newValue = fetchValues()
    let newIndexes = fetchIndexes()

    // check data
    if (!newValue) setValues(newValue)
    if (!newIndexes) setSeenIndexes([...newIndexes])
  }, [])

  // render values
  // const renderSeenIndexes = (seenIndexes) => {
  //   return (
  //     <div>
  //         seenIndexes.map(number => (<li> {number} </li>))
  //     </div>
  //   )
  // }

  // const renderValues = (values) => {
  //   const entries = []
  //   for (let key in values) {
  //     entries.push(
  //       <div key={key}>
  //         For index {key} I calculate {values[key]}
  //       </div>
  //     )
  //   }
  //   return entries
  // }

  // handler form submit
  const handlerSubmit = async (event) => {
    event.preventDefault()
    await axios.post('/api/values', {
      index: index
    })
    setIndex('')
  }

  return (
    <div>
      <form onSubmit={handlerSubmit}>
        <label>Enter your index: </label>
        <input
          value={index}
          onChange={
            event => setIndex(event.target.value)
          }
          placeholder="Enter a number"
        />
        <button>Submit</button>
      </form>
      <h3>Indexes I have seen:</h3>
      <ul>
        {seenIndexes.map(number => <li> {number} </li>)}
      </ul>
      <h3>Calculated Values:</h3>
      {/* <ul>
        {values.map((value, index) => (<li>For index {values.index} I calculate {value} </li>))}
      </ul> */}
    </div>
  )
}

export default Fib