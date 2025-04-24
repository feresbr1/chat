<template>
  <div>
    <h1>SaaS Chat Widget Vue Example</h1>
    <p>This example shows how to use the SaaS Chat widget in a Vue application.</p>
    
    <button @click="openChat">Open Chat</button>
    <button @click="closeChat">Close Chat</button>
  </div>
</template>

<script>
import SaaSChatWidget from 'saas-chat-widget';

export default {
  name: 'ChatWidgetExample',
  data() {
    return {
      chatWidget: null
    };
  },
  mounted() {
    // Initialize the widget when the component mounts
    this.chatWidget = new SaaSChatWidget({
      apiKey: 'YOUR_API_KEY',
      organization: 'your-organization',
      apiUrl: 'http://localhost:5030',
      socketUrl: 'http://localhost:5030',
      primaryColor: '#4f46e5',
      headerText: 'Vue Example',
      welcomeMessage: '👋 Hello! This is a Vue example of the SaaS Chat widget.',
      debug: true,
    });
  },
  beforeUnmount() {
    // Clean up when the component unmounts
    if (this.chatWidget) {
      this.chatWidget.destroy();
      this.chatWidget = null;
    }
  },
  methods: {
    openChat() {
      if (this.chatWidget) {
        this.chatWidget.open();
      }
    },
    closeChat() {
      if (this.chatWidget) {
        this.chatWidget.close();
      }
    }
  }
};
</script>

<style scoped>
h1 {
  color: #4f46e5;
}

button {
  background-color: #4f46e5;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  margin-right: 10px;
  cursor: pointer;
}

button:hover {
  background-color: #4338ca;
}
</style>
