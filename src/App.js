import './App.css';
import React from "react";
import UploadReport from "./components/UploadReport";
import ReportList from "./components/ReportList";

function App() {
  return (
    <div className="App">
      <UploadReport />
      <ReportList />
    </div>
  );
}

export default App;
