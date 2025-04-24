'use strict';

var socket_ioClient = require('socket.io-client');

class SaaSChatWidget {
  socket = null;
  currentChatId = null;
  pendingMessages = [];
  elements = {
    widgetContainer: null,
    chatButton: null,
    chatWindow: null,
    messagesContainer: null,
    input: null,
    sendButton: null
  };
  constructor(config = {}) {
    this.config = {
      apiKey: null,
      organization: null,
      userId: null,
      userName: null,
      userEmail: null,
      apiUrl: 'https://api.saas-chat.com',
      socketUrl: 'https://api.saas-chat.com',
      position: 'right',
      primaryColor: '#6366f1',
      headerText: 'Chat Support',
      placeholder: 'Type a message...',
      welcomeMessage: 'Hello! How can we help you today?',
      autoOpen: false,
      debug: false,
      ...config
    };
    this.init();
  }
  init() {
    this.log('Initializing widget');
    this.createStyles();
    this.createWidgetElements();
    if (this.config.autoOpen) {
      setTimeout(() => {
        this.openChatWindow();
      }, 1000);
    }
  }
  createStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .saas-chat-widget {
        position: fixed;
        bottom: 20px;
        ${this.config.position === 'right' ? 'right: 20px' : 'left: 20px'};
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }

      .saas-chat-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: ${this.config.primaryColor};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.2s ease;
      }

      .saas-chat-button:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }

      .saas-chat-button svg {
        width: 28px;
        height: 28px;
      }

      .saas-chat-window {
        position: fixed;
        bottom: 90px;
        ${this.config.position === 'right' ? 'right: 20px' : 'left: 20px'};
        width: 360px;
        height: 500px;
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        pointer-events: none;
      }

      .saas-chat-window.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: all;
      }

      .saas-chat-header {
        background-color: ${this.config.primaryColor};
        color: white;
        padding: 15px 20px;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .saas-chat-close {
        cursor: pointer;
        opacity: 0.8;
        transition: opacity 0.2s;
      }

      .saas-chat-close:hover {
        opacity: 1;
      }

      .saas-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 15px;
        background-color: #f5f7fb;
      }

      .saas-chat-message {
        margin-bottom: 10px;
        max-width: 80%;
        padding: 10px 15px;
        border-radius: 18px;
        position: relative;
        word-wrap: break-word;
      }

      .saas-chat-message.user {
        background-color: ${this.config.primaryColor};
        color: white;
        margin-left: auto;
        border-bottom-right-radius: 4px;
      }

      .saas-chat-message.agent {
        background-color: #e5e7eb;
        color: #1f2937;
        margin-right: auto;
        border-bottom-left-radius: 4px;
      }

      .saas-chat-input-container {
        padding: 10px 15px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        align-items: center;
      }

      .saas-chat-input {
        flex: 1;
        border: 1px solid #d1d5db;
        border-radius: 20px;
        padding: 8px 15px;
        outline: none;
        font-size: 14px;
        resize: none;
        max-height: 100px;
        overflow-y: auto;
      }

      .saas-chat-input:focus {
        border-color: ${this.config.primaryColor};
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
      }

      .saas-chat-send {
        margin-left: 10px;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: ${this.config.primaryColor};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: none;
        outline: none;
      }

      .saas-chat-send:disabled {
        background-color: #d1d5db;
        cursor: not-allowed;
      }

      .saas-chat-send svg {
        width: 18px;
        height: 18px;
      }

      @media (max-width: 480px) {
        .saas-chat-window {
          width: calc(100% - 40px);
          height: calc(100% - 120px);
          bottom: 80px;
        }
      }
    `;
    document.head.appendChild(style);
  }
  createWidgetElements() {
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'saas-chat-widget';
    const chatButton = document.createElement('div');
    chatButton.className = 'saas-chat-button';
    chatButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    chatButton.addEventListener('click', this.toggleChatWindow.bind(this));
    const chatWindow = document.createElement('div');
    chatWindow.className = 'saas-chat-window';
    chatWindow.id = 'saas-chat-window';
    const chatHeader = document.createElement('div');
    chatHeader.className = 'saas-chat-header';
    chatHeader.innerHTML = `
      <div>${this.config.headerText}</div>
      <div class="saas-chat-close">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
    `;
    chatHeader.querySelector('.saas-chat-close')?.addEventListener('click', this.closeChatWindow.bind(this));
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'saas-chat-messages';
    messagesContainer.id = 'saas-chat-messages';
    const inputContainer = document.createElement('div');
    inputContainer.className = 'saas-chat-input-container';
    const input = document.createElement('textarea');
    input.className = 'saas-chat-input';
    input.placeholder = this.config.placeholder;
    input.rows = 1;
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
      setTimeout(() => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 100) + 'px';
      }, 0);
    });
    const sendButton = document.createElement('button');
    sendButton.className = 'saas-chat-send';
    sendButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
    sendButton.addEventListener('click', this.sendMessage.bind(this));
    inputContainer.appendChild(input);
    inputContainer.appendChild(sendButton);
    chatWindow.appendChild(chatHeader);
    chatWindow.appendChild(messagesContainer);
    chatWindow.appendChild(inputContainer);
    widgetContainer.appendChild(chatWindow);
    widgetContainer.appendChild(chatButton);
    document.body.appendChild(widgetContainer);
    this.elements = {
      widgetContainer,
      chatButton,
      chatWindow,
      messagesContainer,
      input,
      sendButton
    };
    if (this.config.welcomeMessage) {
      this.addMessage(this.config.welcomeMessage, 'agent');
    }
  }
  toggleChatWindow() {
    if (this.elements.chatWindow?.classList.contains('open')) {
      this.closeChatWindow();
    } else {
      this.openChatWindow();
    }
  }
  openChatWindow() {
    this.elements.chatWindow?.classList.add('open');
    this.elements.input?.focus();
    this.initializeSocket();
  }
  closeChatWindow() {
    this.elements.chatWindow?.classList.remove('open');
  }
  addMessage(content, type) {
    if (!this.elements.messagesContainer) return;
    const messageElement = document.createElement('div');
    messageElement.className = `saas-chat-message ${type}`;
    messageElement.textContent = content;
    this.elements.messagesContainer.appendChild(messageElement);
    this.elements.messagesContainer.scrollTop = this.elements.messagesContainer.scrollHeight;
  }
  sendMessage() {
    if (!this.elements.input) return;
    const message = this.elements.input.value.trim();
    if (!message) return;
    this.addMessage(message, 'user');
    this.elements.input.value = '';
    this.elements.input.style.height = 'auto';
    if (this.socket && this.socket.connected) {
      this.socket.emit('send-message', {
        chatId: this.currentChatId,
        content: message
      });
      this.log('Message sent:', message);
    } else {
      this.log('Socket not connected, storing message for later');
      this.pendingMessages.push(message);
      this.initializeSocket();
    }
  }
  initializeSocket() {
    if (this.socket && this.socket.connected) {
      this.log('Socket already connected');
      return;
    }
    this.log('Connecting to socket server:', this.config.socketUrl);
    if (!this.config.userId) {
      this.config.userId = localStorage.getItem('saas-chat-user-id');
      if (!this.config.userId) {
        this.config.userId = 'widget_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('saas-chat-user-id', this.config.userId);
      }
    }
    this.socket = socket_ioClient.io(this.config.socketUrl, {
      auth: {
        token: this.config.apiKey,
        userId: this.config.userId,
        userName: this.config.userName || 'Website Visitor',
        userEmail: this.config.userEmail,
        organization: this.config.organization
      },
      transports: ['websocket']
    });
    this.socket.on('connect', () => {
      this.log('Socket connected');
      this.getOrCreateChat();
    });
    this.socket.on('disconnect', () => {
      this.log('Socket disconnected');
    });
    this.socket.on('error', error => {
      this.log('Socket error:', error);
    });
    this.socket.on('new-message', data => {
      this.log('New message received:', data);
      if (data.message.sender._id !== this.config.userId) {
        this.addMessage(data.message.content, 'agent');
      }
    });
  }
  getOrCreateChat() {
    this.log('Getting or creating chat');
    this.currentChatId = localStorage.getItem('saas-chat-chat-id');
    if (this.currentChatId) {
      this.log('Found existing chat:', this.currentChatId);
      if (this.socket) {
        this.socket.emit('join-chat', this.currentChatId);
      }
      this.sendPendingMessages();
    } else {
      this.log('Creating new chat');
      fetch(`${this.config.apiUrl}/api/widget/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          userId: this.config.userId,
          userName: this.config.userName || 'Website Visitor',
          userEmail: this.config.userEmail,
          organization: this.config.organization
        })
      }).then(response => response.json()).then(data => {
        this.log('Chat created:', data);
        if (data.success && data.data && data.data._id) {
          this.currentChatId = data.data._id;
          localStorage.setItem('saas-chat-chat-id', this.currentChatId);
          if (this.socket) {
            this.socket.emit('join-chat', this.currentChatId);
          }
          this.sendPendingMessages();
        } else {
          this.log('Failed to create chat:', data);
        }
      }).catch(error => {
        this.log('Error creating chat:', error);
      });
    }
  }
  sendPendingMessages() {
    if (this.pendingMessages.length > 0 && this.currentChatId && this.socket) {
      this.log('Sending pending messages:', this.pendingMessages);
      this.pendingMessages.forEach(message => {
        this.socket?.emit('send-message', {
          chatId: this.currentChatId,
          content: message
        });
      });
      this.pendingMessages = [];
    }
  }
  log(...args) {
    if (this.config.debug) {
      console.log('SaaS Chat Widget:', ...args);
    }
  }
  open() {
    this.openChatWindow();
  }
  close() {
    this.closeChatWindow();
  }
  destroy() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    if (this.elements.widgetContainer) {
      document.body.removeChild(this.elements.widgetContainer);
    }
    this.elements = {
      widgetContainer: null,
      chatButton: null,
      chatWindow: null,
      messagesContainer: null,
      input: null,
      sendButton: null
    };
  }
}
if (typeof window !== 'undefined') {
  const scriptElement = document.currentScript;
  if (scriptElement) {
    const config = {};
    Array.from(scriptElement.attributes).forEach(attr => {
      if (attr.name.startsWith('data-')) {
        const key = attr.name.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        if (attr.value === 'true') {
          config[key] = true;
        } else if (attr.value === 'false') {
          config[key] = false;
        } else {
          config[key] = attr.value;
        }
      }
    });
    window.saasChat = new SaaSChatWidget(config);
  }
}

module.exports = SaaSChatWidget;
//# sourceMappingURL=index.js.map
