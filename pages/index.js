import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Papa from "papaparse"
import { useEffect, useState } from 'react'
// import { writeOnFile } from '../Util/utility'
// import file from '../public/DVD-testing.csv'
export default function Home() {
  const [benchmark, setBenchmark] = useState()
  const [metric, setMetric] = useState()
  const [BatchUnit, setBatchUnit] = useState(100)
  const [BatchID, setBatchID] = useState(100)
  const [BatchSize, setBatchSize] = useState(100)
  const [DataType, setDataType] = useState()
  const formvalid=benchmark && metric && BatchUnit && BatchID && BatchSize && DataType;
  const submitHanlder = async (e) => {
    e.preventDefault();
    if(formvalid){
      const survey={
        Benchmark_Type:benchmark,
        Workload_Metric:metric,
        Batch_Unit:BatchUnit,
        Batch_ID:BatchID,
        Batch_Size:BatchSize,
        Data_Type:DataType
      }
      const data = await fetch('/api/test',{
        method:"POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(survey)
      })
      
      const response = await data.json()
      // writeOnFile(response)
      console.log(response)
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.card}>
      <h2>This is the second assignment</h2>
        <form className={styles.form} onSubmit={(e)=>submitHanlder(e)}>
          <div className={styles.formcontroller}>
            <h3>What type of benchmark:</h3>
            <div className={styles.inputgroup}>
              <input type={'radio'} name='Benchmark_Type' value="DVD" checked={benchmark === "DVD"} onChange={(e)=>setBenchmark(e.currentTarget.value)} />
              <label htmlFor='DVD'>DVD store</label>
            </div>
            <div className={styles.inputgroup}>
              <input type={'radio'} name='Benchmark_Type' value="NDBench" checked={benchmark === "NDBench"} onChange={(e)=>setBenchmark(e.currentTarget.value)} />
              <label htmlFor='NDB'>NDBench</label>
            </div>
          </div>
          <div className={`${styles.formcontroller} ${styles.workload}`}>
            <h3>What type of workload metric:</h3>
            <div className={styles.inputgroup}>
              <input type={'radio'} name='Workload_Metric' value="CPUUtilization_Average" checked={metric === "CPUUtilization_Average"} onChange={(e)=>setMetric(e.currentTarget.value)} />
              <label htmlFor='DVD'>CPU</label>
            </div>
            <div className={styles.inputgroup}>
              <input type={'radio'} name='Workload_Metric' value="MemoryUtilization_Average" checked={metric === "MemoryUtilization_Average"} onChange={(e)=>setMetric(e.currentTarget.value)}/>
              <label htmlFor='NDB'>Memory</label>
            </div>
            <div className={styles.inputgroup}>
              <input type={'radio'} name='Workload_Metric' value="NetworkIn_Average" checked={metric === "NetworkIn_Average"} onChange={(e)=>setMetric(e.currentTarget.value)} />
              <label htmlFor='NDB'>NetworkIn</label>
            </div>
            <div className={styles.inputgroup}>
              <input type={'radio'} name='Workload_Metric' value="NetworkOut_Average" checked={metric === "NetworkOut_Average"} onChange={(e)=>setMetric(e.currentTarget.value)}/>
              <label htmlFor='NDB'>NetworkOut</label>
            </div>
          </div>
          <div className={styles.formcontroller}>
            <h3>The number of batch unit</h3>
            <div className={styles.inputgroup}>
              <label htmlFor='Batch_Unit'>Batch Unit</label>
              <input type={'number'} id="Batch_Unit" name='Batch_Unit'  value={BatchUnit} onChange={(e)=>setBatchUnit(e.currentTarget.value)} min={1}/>
            </div>
          </div>
          <div className={styles.formcontroller}>
            <h3>The number of batch ID</h3>
            <div className={styles.inputgroup}>
              <label htmlFor='Batch_ID'>Batch ID</label>
              <input type={'number'} name='Batch_ID' id='Batch_ID' value={BatchID} onChange={(e)=>setBatchID(e.currentTarget.value)} min={1} />
            </div>
          </div>
          <div className={styles.formcontroller}>
            <h3>The number of batch size</h3>
            <div className={styles.inputgroup}>
              <label htmlFor='Batch_Size'>batch size</label>
              <input type={'number'} name='Batch_Size' id='Batch_Size'  value={BatchSize} onChange={(e)=>setBatchSize(e.currentTarget.value)} min={1} />
            </div>
          </div>
          <div className={styles.formcontroller}>
            <h3>What type of data type:</h3>
            <div className={styles.inputgroup}>
              <input type={'radio'} name='Data_Type' value="training" onChange={(e)=>setDataType(e.currentTarget.value)} checked={DataType === "training"} />
              <label htmlFor='Training_Data'>Training Data</label>
            </div>
            <div className={styles.inputgroup}>
              <input type={'radio'} name='Data_Type' value="testing" onChange={(e)=>setDataType(e.currentTarget.value)} checked={DataType === "testing"} />
              <label htmlFor='Testing_Data'>Testing Data</label>
            </div>
          </div>
          <button  type="submit" className={`${formvalid ? styles.btn : styles.disable}`} disabled={!formvalid} >Submit</button>
        </form>
      </div>
    </div>
  )
}
