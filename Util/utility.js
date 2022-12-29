import { promises as fs } from 'fs'

import Papa from "papaparse"
export const writeOnFile = (data) => {
  fs.appendFile('output.json', JSON.stringify(data))
  
}
export const readingFile = async (typeOfFile, typeOfData) => {
  const c = `C:\\Users\\sseif\\OneDrive\\Desktop\\Data\\${typeOfFile}-${typeOfData}.csv`
  const d = await fs.readFile(c, 'utf8')
  const data = Papa.parse(d, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      const data = results.data
      return data
    },
  });
  return data;
}
export const dividingData = (Batch_Unit, array, newArray) => {
  if (array.length == 0) {
    return newArray;
  }
  else {
    newArray.push(array.splice(0, Batch_Unit))
    return dividingData(Batch_Unit, array, newArray);
  }
}
export const subStringArray = (batchID, batchSize, array) => {
  const newArray = [];
  const returnedArray = array.splice(batchID, batchSize);
  returnedArray.forEach(element => {
    newArray.push(...element)
  });
  return newArray;
}
export const sort = (array, workload) => {
  const a = array.sort((a, b) => {
    if (parseInt(a[workload] )> parseInt(b[workload])) return 1;
    else return -1;
  })
  return a;
}
export const percentile = (percent, array,workload_metric) => {
  const sortedArray=sort(array,workload_metric)
  const max=sortedArray[sortedArray.length-1][`${workload_metric}`]
  const calculatedPercentile=max-((max* percent) / 100)
  const resutl=[...sortedArray].filter(p=>p[`${workload_metric}`] >= calculatedPercentile)[0]
  return resutl[`${workload_metric}`]
}

const average = (nums, workload) => {
  const n = nums.reduce((a, b) => {
    return a += parseFloat(b[workload])
  }, 0)
  return n;
}
export const analyticsHandler = (element, array, workload, obj) => {
  if (element === "avg") {
    const avg = average(array, workload)
    obj[`avg_${workload}`] = avg / array.length;
  }
  if (element === "min") {
    const sortedArray = sort(array, workload)
    obj[`min_${workload}`] = sortedArray[0][workload];
  }
  if (element === "max") {
    const sortedArray = sort(array, workload)
    obj[`max_${workload}`] = sortedArray[sortedArray.length - 1][workload];
  }
  if (element === "std") {
    const math = require('mathjs')
    const loadedData = array.map((item) => parseInt(item[workload]))
    console.log(loadedData)
    const std = math.std(loadedData)
    obj[`std_${workload}`] = std
  }
  return obj
}