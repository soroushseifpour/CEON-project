import { sort } from 'mathjs';
import { analyticsHandler, dividingData, percentile, readingFile, subStringArray, writeOnFile } from '../../Util/utility'
export default async function handler(req, res) {
  const method=req.method
  if(method==="POST"){
    const body = req.body
    const file=await readingFile(body.Benchmark_Type,body.Data_Type)
    const dataFile=await file.data;
    const newDividedArray=dividingData(parseInt(body.Batch_Unit),[...dataFile],[]);
    const selectedArray=subStringArray(parseInt(body.Batch_ID),parseInt(body.Batch_Size),[...newDividedArray])
    const percentiles=body.Analytics;
    const returnedPercentile=[];
    const workload_metric=body.Workload_Metric;
    percentiles.forEach(item => {
      if(item !== "avg" && item !== "std" && item !== "min" && item !== "max")
      returnedPercentile.push(percentile(parseInt(item),[...selectedArray],workload_metric))
      else
      returnedPercentile.push(analyticsHandler(item,[...selectedArray],workload_metric,{}))
    });
    // const s=sort(selectedArray,workload_metric)
    const RFW_ID=`${Math.random()*10}_${workload_metric}ID`
    const last_Batch_ID=parseInt(body.Batch_Unit)+parseInt(body.Batch_Size)
    const  data_samples_requested=selectedArray;
    const data_analytics=returnedPercentile;
    const data={
      RFW_ID,last_Batch_ID,data_samples_requested,data_analytics
    }
    writeOnFile(data)
    res.status(200).json({data:data})
    }
}

