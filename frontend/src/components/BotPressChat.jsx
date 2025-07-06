import { useState, useRef } from 'react';
import {
  Webchat,
  WebchatProvider,
  Fab,
  getClient,
  Configuration,
} from '@botpress/webchat';
import {useEffect} from 'react';

const clientId = "e8ce95c2-045b-4bc3-9f49-23e4861ecfc4";

const configuration: Configuration = {
  color: '#000',
  showPoweredBy: false,
  botName: 'TutorAI',
};

const BotPressChat = () => {
  const client = getClient({ clientId });
  const [isWebchatOpen, setIsWebchatOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // Ref to store the Botpress Webchat API once ready
  const webchatApi = useRef(null);

  const toggleWebchat = () => {
    setIsWebchatOpen((prev) => {
      const newState = !prev;

      

      return newState;
    });
  };

  useEffect(() => {
  const interval = setInterval(() => {
    if (window.botpressWebChat) {
      clearInterval(interval);

      const customPayload = {
        type: 'custom_event',
        channel: 'web',
        payload: {
          course_topic: "Digital Marketing Fundamentals",
        },
      };

      window.botpressWebChat.sendEvent(customPayload)
        .then(() => {})
        .catch((err) => console.error("Failed to send event:", err));
    }
  }, 500);

  return () => clearInterval(interval);
}, [isWebchatOpen]);


  return (
    <div
      className="chatbody"
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 800,
      }}
    >
      <WebchatProvider
        client={client}
        configuration={configuration}
        
      >
        {/* Chatbot label - only show when chat is closed */}
        {!isWebchatOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: 85, // Position above the FAB
              right: 20,
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: '500',
              pointerEvents: 'none',
              zIndex: 11,
              whiteSpace: 'nowrap',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            chatbot
          </div>
        )}
        
        <Fab
          onClick={toggleWebchat}
          
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            pointerEvents: 'auto',
            zIndex: 10,
          }}
        />
        {isWebchatOpen && (
          <div
            className="chat-window"
            style={{
              position: 'absolute',
              bottom: 70,
              right: 20,
              width: 320,
              height: 400,
              pointerEvents: 'auto',
              zIndex: 9,
              backgroundColor: 'white',
              boxShadow: '0 0 10px rgba(0,0,0,0.2)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <Webchat />
          </div>
        )}
      </WebchatProvider>
    </div>
  );
};

export default BotPressChat;