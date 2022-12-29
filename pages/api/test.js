import { readingFile } from "../../Util/utility";
import dbConnect from '../../lib/mongo'
import DVDTesting from "../../models/DVDTesting";
import DVDTraining from "../../models/DVDTraining";
import NDBenchTesting from "../../models/NDBenchTesting";
import NDBenchTraining from "../../models/NDBenchTraining";
import { sum } from "mathjs";
import mongoose from "mongoose";
export default async function handler(req, res) {
    const method = req.method;
    if (method === "GET") {
        await dbConnect();
        const file = await readingFile("DVD", "training")
        /// after reading data we can change the inputs to 'DVD' or 'testing'
        /// to read the next files
        const dataFile = await file.data;
        await DVDTesting.insertMany(dataFile)
        await DVDTraining.insertMany(dataFile)
        await NDBenchTesting.insertMany(dataFile)
        await NDBenchTraining.insertMany(dataFile)
        return res.status(200).json({ data: response })
    }
    if (method === "POST") {
        await dbConnect();
        const body = req.body;
        const Benchmark_Type = body.Benchmark_Type
        const Data_Type = body.Data_Type
        let dataBase = null;
        const finalizedDB = `${Benchmark_Type}${Data_Type}`
        if (finalizedDB === "DVDtesting")
            dataBase = DVDTesting
        else if (finalizedDB === "DVDtraining")
            dataBase = DVDTraining
        else if (finalizedDB === "NDBenchtraining")
            dataBase = NDBenchTraining
        else
            dataBase = NDBenchTesting
        const numberOfItems = parseInt(body.Batch_Unit);
        const Batch_Size = parseInt(body.Batch_Size)
        const pageNumber = body.Batch_ID;
        const skip = numberOfItems * (pageNumber - 1)
        const workload = body.Workload_Metric.toString()
        console.log(workload)
        ////////////////////////////////////////////////////////////////////
        const min = await dataBase.aggregate([
            { $skip: skip },
            { $limit: Batch_Size * numberOfItems },
            { $group: { _id: workload, min: { $min: `$${workload}`}} },
        ]);
        // const min = await dataBase.aggregate([
        //     { $skip: skip },
        //     { $limit: Batch_Size * numberOfItems },
        //     { $group: { _id: workload, min: { $min: `$${workload}`} , count: { $sum: 1 } } },
        //     { $project: { value: { _id: "$_id",count: "$count", min:"$min" } } }
        // ]);
        db.adminCommand( { getLog:'global'} ).log.forEach(x => {print(x)})
        const max = await dataBase.aggregate([
            { $skip: skip },
            { $limit: Batch_Size * numberOfItems },
            { $group: { _id: workload, max: { $max: `$${workload}` } } }
        ]);
        const std = await dataBase.aggregate([
            { $skip: skip },
            { $limit: Batch_Size * numberOfItems },
            { $group: { _id: workload, std: { $stdDevPop: `$${workload}` } } }
        ]);
        console.log(std)
        const median = await dataBase.aggregate([
            { $skip: skip },
            { $limit: Batch_Size * numberOfItems },
            {$sort:{ [`${workload}`] : 1}},
            { $skip: parseInt(Batch_Size * numberOfItems / 2) },
            { $limit: 1},
            {$project:{[`${workload}`] : 1}}
        ]);
        return res.status(200).json({ "response": {min,max, median, std} })

    }
}