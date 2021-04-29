import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'
import { Grid } from '@material-ui/core' 


const Chart = () => {
  const [chartData, setChartData] = useState({})
  const [labels, setLabels] = useState([])
  const [data, setData] = useState([])
  const [backgroundColor, setBackgroundColor] = useState([])


  const getVacations = async () => {
    const res = await fetch('https://vacationweb.herokuapp.com/vacation')
    const { vacations } = await res.json() 
    const labelsArr = []
    const dataArr = []
    const backgroundArr = []
    vacations.forEach(vacation => {
      if(vacation.Follows.length !== 0) {
        labelsArr.push(vacation.destination)
        dataArr.push(vacation.Follows.length)
        backgroundArr.push("#" + ((1<<24)*Math.random() | 0).toString(16))
      }  
  })
  setLabels(labelsArr)
  setData([...dataArr,0])
  setBackgroundColor(backgroundArr)
}

  useEffect(() => {
    getVacations()
  },[])

  const chart = () => {
    setChartData({
      labels,
      datasets: [{
        label:'Vacation follows chart',
        fontColor: 'black',
        data,
        backgroundColor,
        borderColor :'#fff',
        borderWidth : 2,
        hoverBorderColor : '#000'
      }],

  })
}

  useEffect(() => {
    chart()
  }, [backgroundColor])

  return (
    <Grid container>
      <Grid item xs={10} md={8} style={{margin:'50px auto'}}>
        <Bar data={chartData} options={{
          responsive: true,
          title:{ text:'Vacation follows chart', display:true},
         
        }}/>
      </Grid>
    </Grid>
  )
}

export default Chart