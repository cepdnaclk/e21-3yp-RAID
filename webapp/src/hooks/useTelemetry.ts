import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface CrackEvent {
  id?: string | number;
  gps?: any;
  media?: any;
  [key: string]: any; // Allow other properties returned by the backend
}

export function useTelemetry(deviceId: string, sensorId: string) {
  const [liveCracks, setLiveCracks] = useState<CrackEvent[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // 1. Fetch Historical Data (Cold Path)
    fetch(`http://localhost:8080/api/cracks/${deviceId}/${sensorId}`)
      .then(res => res.json())
      .then(data => setLiveCracks(data.reverse()))
      .catch(err => console.error("Historical fetch error:", err));

    // 2. Establish Real-Time Connection (Hot Path)
    const stompClient = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/raid-websocket"),
      reconnectDelay: 5000,
      
      onConnect: () => {
        setIsConnected(true);
        console.log(`Connected to telemetry stream: ${deviceId}/${sensorId}`);

        stompClient.subscribe(`/topic/cracks`, (message) => {
            const rawData = JSON.parse(message.body);

            if (rawData.deviceId !== deviceId || rawData.sensorId !== sensorId) {
              return;
            }
            
            // DEFENSIVE PROGRAMMING: Ensure the payload always has the nested objects
            // even if the hardware failed to send them.
            const safeCrackEvent = {
                ...rawData,
                gps: rawData.gps || null,
                media: rawData.media || null
            };

            setLiveCracks(prev => [safeCrackEvent, ...prev].slice(0, 100));
        });
      },
      onDisconnect: () => setIsConnected(false),
      onStompError: (err) => console.error("Broker error:", err)
    });

    stompClient.activate();

    return () => {
        stompClient.deactivate();
        setIsConnected(false);
    };
  }, [deviceId, sensorId]);

  return { liveCracks, isConnected };
}





/*
==================== useTelemetry HOOK ====================

1. PURPOSE:
- Fetches historical crack data from REST API
- Streams real-time crack data using WebSocket (STOMP + SockJS)
- Combines both into a single live dashboard dataset

2. INPUTS:
- deviceId: ID of the IoT device
- sensorId: ID of the sensor

3. STATE:
- liveCracks: stores all crack events (newest first, max 100)
- isConnected: shows WebSocket connection status

4. COLD PATH (REST API):
- Fetches past stored crack data from backend
- Reverses data to show newest first

5. HOT PATH (WEBSOCKET):
- Connects to /raid-websocket using SockJS
- Subscribes to /topic/cracks and filters by deviceId/sensorId
- Receives real-time crack updates

6. DATA HANDLING:
- Parses incoming JSON messages
- Adds missing fields safely (gps, media)
- Prepends new events to state

7. OPTIMIZATION:
- Keeps only latest 100 records to avoid memory issues

8. CLEANUP:
- Disconnects WebSocket when component unmounts or dependencies change

9. OUTPUT:
- liveCracks: combined historical + real-time data
- isConnected: connection status indicator

===================================================================
*/

