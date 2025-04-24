# SaaS Chat Widget

A customizable chat widget for integrating SaaS Chat into your website or application.

## Installation

### NPM

```bash
npm install saas-chat-widget
```

### Yarn

```bash
yarn add saas-chat-widget
```

## Usage

### Basic Usage

```html
<script type="module">
  import SaaSChatWidget from 'saas-chat-widget';
  
  const chatWidget = new SaaSChatWidget({
    apiKey: 'YOUR_API_KEY',
    organization: 'your-organization',
  });
</script>
```

### CDN Usage

```html
<script src="https://unpkg.com/saas-chat-widget/dist/index.umd.js"></script>
<script>
  const chatWidget = new SaaSChatWidget({
    apiKey: 'YOUR_API_KEY',
    organization: 'your-organization',
  });
</script>
```

### Script Tag with Data Attributes

```html
<script 
  src="https://unpkg.com/saas-chat-widget/dist/index.umd.js" 
  data-api-key="YOUR_API_KEY" 
  data-organization="your-organization"
  data-primary-color="#6366f1"
  data-header-text="Chat Support"
></script>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| apiKey | string | null | Your API key (required) |
| organization | string | null | Your organization ID or slug (required) |
| userId | string | auto-generated | Custom user ID for the visitor |
| userName | string | "Website Visitor" | Name of the visitor |
| userEmail | string | null | Email of the visitor |
| apiUrl | string | "https://api.saas-chat.com" | API URL |
| socketUrl | string | "https://api.saas-chat.com" | Socket URL |
| position | "right" or "left" | "right" | Position of the widget |
| primaryColor | string | "#6366f1" | Primary color for the widget |
| headerText | string | "Chat Support" | Text displayed in the widget header |
| placeholder | string | "Type a message..." | Placeholder text for the input field |
| welcomeMessage | string | "Hello! How can we help you today?" | Initial message shown to users |
| autoOpen | boolean | false | Automatically open the chat widget on page load |
| debug | boolean | false | Enable debug mode for troubleshooting |

## Methods

### open()

Opens the chat widget.

```javascript
chatWidget.open();
```

### close()

Closes the chat widget.

```javascript
chatWidget.close();
```

### destroy()

Removes the chat widget from the DOM and disconnects the socket.

```javascript
chatWidget.destroy();
```

## License

MIT
