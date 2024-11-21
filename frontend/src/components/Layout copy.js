//import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthenticator, Button, Heading, View } from '@aws-amplify/ui-react';


import logo from './logo4.svg';
//import './App.css';
//import axios from 'axios';
import {
  usePlaidLink,
  PlaidLinkOptions,
  PlaidLinkOnSuccess,
} from 'react-plaid-link';
import { PlaidLink } from 'react-plaid-link';
//import './PlaidLinkComponent.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
//import '@aws-amplify/ui-react/styles.css';
import { Line } from 'react-chartjs-2';
import { v4 as uuidv4 } from 'uuid';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

   
// Manually Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Visual component box to Question
function AddSituation({ note, setNote, setApiMessage, setChartData, sessionId }) {
  function handleNoteChange(e) {
    setNote(e.target.value);
  }

  async function handleSubmit() {
    if (note.trim() === '') {
      alert('Please enter a valid situation.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_ENDPOINT}src`, {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'session-id': sessionId,  // Pass the session_id in the headers
        },
        body: JSON.stringify({ situation: note }),
      });

      const responseData = await response.json();

    if (response.ok) {
      console.log('Situation added successfully');
      setApiMessage(responseData.message); // Update the apiMessage state with the recommendation message

      // Validate and set chartData
      console.log("chartData before setting:", responseData.chartData);
    if (
        responseData.chartData &&
        Array.isArray(responseData.chartData.labels) &&
        Array.isArray(responseData.chartData.values) &&
        responseData.chartData.labels.length > 0 &&
        responseData.chartData.values.length > 0
      ) {
        console.log("Setting chartData to:", responseData.chartData);
        setChartData({
          labels: responseData.chartData.labels,
          values: responseData.chartData.values,
        });
      } else {
        console.error('Invalid chart data format');
        setChartData(null); // Set to null if data is invalid
      }
      } else {
        console.error('Failed to add situation');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    setNote(''); // Reset input field
  }

  return (
    <div className="container p-3">
      <div className="input-group mb-3 p-3"  style={{ whiteSpace: 'normal', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Add Your Financial Situation"
          aria-label="Question"
          aria-describedby="basic-addon2"
          value={note}
          onChange={handleNoteChange}
        />
        <button onClick={handleSubmit} className="btn btn-outline-success btn-lg" type="button">
          Submit
        </button>
      </div>
    </div>
  );
}

// Visual component box to output
function SituationOutput({ apiMessage }) {
  return (
     <div className="container">
      <div className=" p-3 m-3" style={{ whiteSpace: 'normal', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
        {apiMessage}
      </div>
    </div>
  );
}

// Component to display a dynamic investment outcome chart
function InvestmentChart({ chartData }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  const data = {
    labels: chartData && chartData.labels ? chartData.labels : [],
    datasets: [
      {
        label: 'Investment Outcome',
        data: chartData && chartData.values ? chartData.values : [],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="container">
      {chartData && chartData.labels && chartData.values && chartData.labels.length > 0 && chartData.values.length > 0 ? (
        <Line data={data} options={options} />
      ) : (
        <p>No data to display yet. Submit a financial situation.</p>
      )}
    </div>
  );
}

function Disclaimer() {
  return (
    <div className="container">
      <p>
        <strong>Disclaimer:</strong> The investment outcomes presented are hypothetical and based on assumptions. Actual results may vary. Please consult a financial advisor.
      </p>
    </div>
  );
}



export default function Layout() {
  const [note, setNote] = useState('');
  const [apiMessage, setApiMessage] = useState(''); // State for the API message
  const [chartData, setChartData] = useState(null); // State for the chart data
  const [sessionId, setSessionId] = useState(''); // State to hold the session ID
 
  const { route, signOut, user } = useAuthenticator((context) => [
    context.route,
    context.signOut,
    context.user
  ]);
  const navigate = useNavigate();

  function logOut() {
    signOut();
    navigate('/login');
  }



  return (
  
    <div className="App d-flex flex-row vh-100">
        {/* Logo Container on the Left */}
        <div className="App-logo text-white p-4 d-flex flex-column justify-content-center" style={{ width: '30%' }}>
          <img src={logo} className="App-logo mb-3" alt="logo" />
          <p className="fs-4">Take Charge of Your Own Financial Security</p>
          <p className="fs-4">Use our tools to understand and optimize your financial decisions</p>
        </div>

        {/* Main Content on the Right */}
        <div className="d-flex flex-column flex-grow-1 gap-4 p-4">
          {/* AddSituation Component */}
          <div className="card shadow-sm p-4">
            <h2 className="text-primary">Add Your Financial Situation</h2>
            <AddSituation
              note={note}
              setNote={setNote}
              setApiMessage={setApiMessage}
              setChartData={setChartData}
              sessionId={sessionId}
            />
          </div>

          {/* SituationOutput Component */}
          <div className="card shadow-sm p-4">
            <h2 className="text-primary">Situation Output</h2>
            <SituationOutput apiMessage={apiMessage} />
          </div>
          <div className="card shadow-sm p-4">   
            <nav>
              <Button onClick={() => navigate('/')}>Home</Button>
              {route !== 'authenticated' ? (
                <Button onClick={() => navigate('/login')}>Login</Button>
              ) : (
                <Button onClick={() => logOut()}>Logout</Button>
              )}
            </nav>
            { /*<Heading level={3}>Signin to Get the Support You Deserve</Heading>*/}
            <View style={{backgroundColor: 'blue'}} >
              <Heading level={3}>Signin For A Personalized Review</Heading>
              {route === 'authenticated' ? `Welcome ${user.signInDetails?.loginId}`: ''}
            </View> 
            <Outlet />

          </div> 
          {/* InvestmentChart Component */}
          <div className="card shadow-sm p-4">
              <h2 className="text-primary">Investment Outcome Chart</h2>
              <InvestmentChart chartData={chartData} />
            
            {/* Small Print Disclaimer */}
            <p className="text-muted mt-3" style={{ fontSize: '0.9rem' }}>
            <strong>Disclaimer:</strong> The investment outcomes presented are hypothetical and based on assumptions.
            Actual results may vary.
            </p>
          </div>     
   

        </div>



      
    </div> 
  );
}
