import React, { useEffect, useState, useRef } from 'react';
import mqtt from 'mqtt/dist/mqtt';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const client = mqtt.connect('wss://915282f0a4ff4b8faac4c20cbefd5c1c.s1.eu.hivemq.cloud:8884/mqtt', {
      username: 'bemore_broker',
      password: 'Mbw38NF9CiaNtxf@',
      protocol: 'wss'
    });

    client.on('connect', () => {
      client.subscribe('ponderada_thiago', (err) => {
        if (!err) {
          console.log('Subscribed to topic');
        }
      });
    });

    client.on('message', (topic, message) => {
      const dbm = parseFloat(message.toString());
      console.log('Received message:', dbm); 
      setData((prevData) => [...prevData, { time: new Date().toLocaleTimeString(), dbm }]);
    });

    return () => {
      client.end();
    };
  }, []);

  useEffect(() => {
    console.log('Data updated:', data); 
    if (chartRef.current) {
      chartRef.current.scrollLeft = chartRef.current.scrollWidth;
    }
  }, [data]);

  return (
    <div className="App">
      <header className="App-header">
        <div ref={chartRef} style={{ overflowX: 'scroll', width: '100%' }}>
          <LineChart
            width={1300 * (data.length / 10)} // Adjust width based on data length
            height={400}
            data={data}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, -100]} allowDataOverflow={true} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="dbm" stroke="#8884d8" activeDot={{ r: 8 }} isAnimationActive={false} />
          </LineChart>
        </div>
      </header>
    </div>
  );
}

export default App;
