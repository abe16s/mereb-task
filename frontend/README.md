## Sales Data Processor Frontend


### Features

* File Upload: Custom file input.
* Progress Indicator.
* Result Download.


### Setup and Running
1. Install Dependencies:
```bash
npm install
```

2. Start Development Server:
```bash
npm run dev
```


### Example 

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

### Project structure

```
app/
├── components/
│   └── FileUploader.tsx
├── types/
│   └── index.ts
├── page.tsx
├── globals.css
├── layout.tsx
└── favicon.ico
```