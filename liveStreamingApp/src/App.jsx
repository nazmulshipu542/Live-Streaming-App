import React, { useEffect, useRef } from 'react';
import './App.css';

import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

function randomID(len = 5) {
  const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getUrlParams(url = window.location.href) {
  const urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}

export default function App() {
  const roomID = getUrlParams().get('roomID') || randomID(5);
  const role_str = getUrlParams().get('role') || 'Host';
  const role =
    role_str === 'Host'
      ? ZegoUIKitPrebuilt.Host
      : role_str === 'Cohost'
      ? ZegoUIKitPrebuilt.Cohost
      : ZegoUIKitPrebuilt.Audience;

  const sharedLinks = [
    {
      name: 'Join as audience',
      url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}&role=Audience`,
    },
  ];

  if (role === ZegoUIKitPrebuilt.Host || role === ZegoUIKitPrebuilt.Cohost) {
    sharedLinks.unshift({
      name: 'Join as co-host',
      url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}&role=Cohost`,
    });
  }

  const appID = ; // Replace with your appID
  const serverSecret = ""; // Replace with your serverSecret
  const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
    appID,
    serverSecret,
    roomID,
    randomID(5),
    randomID(5)
  );

  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.LiveStreaming,
          config: { role },
        },
        sharedLinks,
      });
    }
  }, [kitToken, role, sharedLinks]);

  return (
    <div
      className="myCallContainer"
      ref={containerRef}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
}
