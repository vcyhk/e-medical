# E-Medical
In the E-Medical, we will mainly use blockchain to process the transaction between patient and doctor, the doctor needs to have the patient’s permission to view and edit the medical history.
## Wireframe
![wireframe](wireframe.jpeg)

## Requirement
### Golang
Install golang from [https://golang.org/dl/](https://golang.org/dl/)
### node
Install node from [https://nodejs.org/en/](https://nodejs.org/en/)
### MongoDB Atlas
Set up the MongoDB Atlas, then paste the URL in main.go

## Configuration
Edit mongo db uri from main.go file. And install all npm packages for web app. Using command:
```
cd webapp
npm install
```

## Running
Run the following command to start the server.
```
go run main.go
```

Run the following command to start the webapp.
```
npm run start
```
