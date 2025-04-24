import React, { useEffect, useState } from 'react';
import SaaSChatWidget from 'saas-chat-widget';

const ChatWidgetExample = () => {
  const [chatWidget, setChatWidget] = useState(null);

  useEffect(() => {
    // Initialize the widget when the component mounts
    const widget = new SaaSChatWidget({
      apiKey: 'YOUR_API_KEY',
      organization: 'your-organization',
      apiUrl: 'http://localhost:5030',
      socketUrl: 'http://localhost:5030',
      primaryColor: '#4f46e5',
      headerText: 'React Example',
      welcomeMessage: '👋 Hello! This is a React example of the SaaS Chat widget.',
      debug: true,
    });

    // Store the widget instance in state
    setChatWidget(widget);

    // Clean up when the component unmounts
    return () => {
      if (widget) {
        widget.destroy();
      }
    };
  }, []);

  const handleOpenChat = () => {
    if (chatWidget) {
      chatWidget.open();
    }
  };

  const handleCloseChat = () => {
    if (chatWidget) {
      chatWidget.close();
    }
  };

  return (
    <div>
      <h1>SaaS Chat Widget React Example</h1>
      <p>This example shows how to use the SaaS Chat widget in a React application.</p>
      
      <button onClick={handleOpenChat}>Open Chat</button>
      <button onClick={handleCloseChat}>Close Chat</button>
    </div>
  );
};

export default ChatWidgetExample;
