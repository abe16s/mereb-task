# Sales Data Processor Backend

## Setup and Running

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Run tests:
```bash
npm test
```


## API Endpoints
* POST /upload: Upload CSV file (multipart/form-data with 'file' field)
    response
        ```json
        {
            "success": true,
            "downloadUrl": "/results/<uuid>_result.csv"
        }
        ```
* GET /results/:fileId_result.csv: Download processed results



## Example 

* Input CSV
```
Department Name,Date,Number of Sales
Electronics,2023-08-01,100
Clothing,2023-08-01,200
Electronics,2023-08-02,150
```


* Output CSV
```
Department Name,Total Number of Sales
Electronics,250
Clothing,200
```


## Algorithm Explanation
The CSV processing uses a streaming pipeline to handle large files efficiently:

* Read: Uses fs.createReadStream to read the input CSV file.
* Parse: Uses csv-parse to parse CSV rows into objects, handling quoted fields.
* Transform: A Transform stream aggregates sales by department in memory.
* Write: Writes aggregated results to an output CSV using fs.createWriteStream.
* Pipeline: The stream.pipeline function ensures proper stream handling and error propagation.


### Memory Efficiency Strategy
* Streaming: Processes one record at a time, minimizing memory usage.
* Minimal Storage: Only stores aggregated totals (one number per department) in memory.
* File Handling: Uses UUIDs for unique file names and stores files in Uploads and Results directories.
* Error Handling: Skips invalid records (e.g., non-numeric sales) and logs errors.

### Big O Complexity
* Time Complexity: O(n), where n is the number of records in the CSV.
* Space Complexity: O(d), where d is the number of unique departments (typically much smaller than n).


## Testing
* Framework: Mocha/Chai for unit testing.
* Coverage: Tests the CSVProcessor class for correct aggregation and output generation.
* Setup: Tests create a temporary input CSV and verify the output matches expected results.

Run Tests:
```bash
npm test
```


## project structure
```
backend/
├── src/
│   ├── controllers/
│   │   └── uploadController.ts
│   ├── services/
│   │   └── csvProcessor.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── fileHandler.ts
│   ├── app.ts
│   └── server.ts
├── tests/
│   └── csvProcessor.test.ts
├── package.json
├── tsconfig.json
└── README.md
```