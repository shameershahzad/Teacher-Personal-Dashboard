import React,{useState,useEffect} from 'react'
import "./TimeTable.css"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { API_URL } from "../config";
function TimeTable() {
        const [sendClasses,setsendClasses] = useState([])
        const [selectSection,setselectSection] = useState([])
        const [selectClassValue,setselectClassValue] = useState('')
        const [allTimetableOfClass,setallTimetableOfClass] = useState([])
        const [selectSectionValue,setselectSectionValue] = useState('')
        const [message,setMessage] = useState('')
        const nav = useNavigate()
        const token = localStorage.getItem("token");

  useEffect(() => {
      axios.get(`${API_URL}/class/sendClassesOnTimeTable`,{headers:{Authorization:`Bearer ${token}`}})
      .then((result) => {
        if(result){
          console.log(result)
          setsendClasses(result.data)
        }
        else{
          setMessage("No class found")
        }
      })
      .catch((err) => {
        console.log("Error:",err)
        setMessage("Error fetching data");
      })
    },[token]) 
    
  const handleClass = (e) => {
    const selectClass = e.target.value;
    setselectClassValue(selectClass);

    // Fix: ensure both sides are string and trimmed for matching
    const selectSectionForClass = sendClasses
      .filter(prev => String( prev.class) === String(selectClass))
      .map(item => item.section);

      const uniqueSubjects = [...new Set(selectSectionForClass)]
    setselectSection(uniqueSubjects);
    setallTimetableOfClass([])
  };

  const handleSection = (e) => {
    const section = e.target.value;
    setselectSectionValue(section);

    axios.get(`${API_URL}/times/showTimetable?class=${selectClassValue}&section=${section}`,
      {headers:{Authorization:`Bearer ${token}`}})
      .then((result) => {
        if(result.data.length > 0){
          console.log(result.data)
          setallTimetableOfClass(result.data)  
        }else{
          setMessage(`No time table of class ${selectClassValue}-${section} exist`)
          setselectClassValue('');
          setselectSectionValue('')
          setallTimetableOfClass([])
        }
      }).catch((err) => {
        console.log("Err:",err)
        setMessage("Error fetching data");
      })
  }

  const grouped = {}; //grouped is an empty object that will store all data.
  allTimetableOfClass.forEach(item =>{
    if(!grouped[item.time]){
      grouped[item.time] = {Monday: null,Tuesday:null,Wednesday: null,Thursday: null,Friday: null}
    }
    grouped[item.time][item.day] = {subject:item.subject,_id:item._id};
  })

  const deleteData = (id) => {
   axios.delete(`${API_URL}/times/deleteTimetable/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => {
      setMessage("✅Subject deleted")
      setallTimetableOfClass(prev => prev.filter(item => item._id !== id))
    })
    .catch(err => {
      console.log("Error:",err)
      setMessage("Error occured!");
    })}

  const editData = (id) => {
  nav(`/editTimetable/${id}`)
  }
   useEffect(() => {
     if (message) {
       const timeout = setTimeout(() => setMessage(''), 3000);
       return () => clearTimeout(timeout);
     }
   }, [message]);
  return (
    <>
   {message && (
      <div className="message-popup" style={{ color: message.startsWith("✅") ? "#4CAF50" : "red" }} >
        {message}
      </div>
    )}
      <select className='Dropdown'value = {selectClassValue} onChange={handleClass}  style={{marginTop:"10px",marginLeft:"32%"}}>
        <option value = "" disabled >Select Class</option>
          {[...new Set(sendClasses.map(cls => cls.class))].map((cls, index) => (
    <option key={index} value={cls}>{cls}</option>))}
      </select>
      <select disabled = {!selectClassValue} className='Dropdown' style ={{marginLeft:"80px"}}
      value = {selectSectionValue} onChange={handleSection} >
        <option value="" disabled>Select Section</option>
        {selectSection.map((sec,i) => (
          <option key = {i} value={sec}>{sec}</option>
        ))}
      </select>
      <div className='TableContainer'>
        <table className='table'>
          <thead>
            <tr>
              <th>Time</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
            </tr>
          </thead>
          <tbody>
                {Object.entries(grouped).map(([time,day],index) => (
            <tr key = {index}>
                  <th>{time}</th>
                  <td>{day.Monday && day.Monday._id !== "-" ?
                  ( <span>
                  {day.Monday.subject }
                     <span style={{fontSize:"12px"}} onClick={() => editData(day.Monday._id)}>✏️</span>
                  <span style={{fontSize:"10px"}} onClick = {() => deleteData(day.Monday._id)}>🗑️</span>
                  </span>):("-")}</td>
                  {/* ==================================================================== */}
                  <td>{day.Tuesday && day.Tuesday._id !== "-" ?
                  ( <span >
                    {day.Tuesday.subject }
                     <span style={{fontSize:"12px"}} onClick={() => editData(day.Tuesday._id)}>✏️</span>
                    <span style={{fontSize:"10px",marginLeft:"5px"}} onClick = {() => deleteData(day.Tuesday._id)}>🗑️</span>
                    </span>):("-")}</td>
                  {/* ==================================================================== */}
                  <td>{day.Wednesday && day.Wednesday._id !== "-" ?
                  ( <span>
                    {day.Wednesday.subject}
                     <span style={{fontSize:"12px"}} onClick={() => editData(day.Wednesday._id)}>✏️</span>
                    <span style={{fontSize:"12px",marginLeft:"5px"}}  onClick = {() => deleteData(day.Wednesday._id)}>🗑️</span>
                    </span>):("-")}</td>
                  {/* ==================================================================== */}
                  <td>{day.Thursday && day.Thursday._id !== "-" ?
                  ( <span>
                    {day.Thursday.subject}
                     <span style={{fontSize:"12px"}} onClick={() => editData(day.Thursday._id)}>✏️</span>
                    <span style={{fontSize:"10px",marginLeft:"5px"}}>🗑️</span>
                    </span>):("-")}</td>
                    {/* ==================================================================== */}
                  <td>{day.Friday && day.Friday._id !== "-" ?
                  ( <span >
                    {day.Friday.subject}
                     <span style={{fontSize:"12px"}} onClick={() => editData(day.Friday._id)}>✏️</span>
                    <span style={{fontSize:"10px"}} onClick = {() => deleteData(day.Friday._id)}>🗑️</span>
                    </span>):("-")}</td>
            </tr>
                ))}
          </tbody>
        </table>

      </div>
    </>
  )
}

export default TimeTable
