# Mistral AI Chat Assistant

A modern, responsive AI chatbot built with Next.js and powered by Mistral AI. This application provides a sleek chat interface for interacting with the Mistral AI model, allowing users to have natural conversations with state-of-the-art AI technology.

<img width="1512" alt="Mistral AI Chat Assistant Screenshot" src="https://github.com/user-attachments/assets/581ecad1-47c8-4a9f-9a15-99ed0049c217" />

## Features

- 🤖 Powered by Mistral AI's advanced language models
- 💬 Real-time chat interface with streaming responses
- 📱 Responsive design that works on mobile, tablet, and desktop
- 🌓 Dark and light mode support
- 💾 Conversation history saved in localStorage
- ⚡ Built with Next.js for optimal performance and SEO
- 🎨 Modern UI with smooth animations and transitions

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- A Mistral AI API key

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/my-ai-app.git
   cd my-ai-app
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your Mistral API key:

   ```
   MISTRAL_API_KEY=your_api_key_here
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Environment Variables

| Variable          | Description             |
| ----------------- | ----------------------- |
| `MISTRAL_API_KEY` | Your Mistral AI API key |

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Mistral AI](https://mistral.ai/) - AI model provider
- [AI SDK](https://sdk.vercel.ai/docs) - Vercel's AI SDK for building AI applications

## Project Structure

```
my-ai-app/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts       # API route for chat
│   │   └── globals.css            # Global styles
│   │   └── layout.tsx             # Root layout component
│   └── page.tsx               # Main chat interface
├── public/                    # Static assets
├── .env.local                 # Environment variables (not in repo)
├── next.config.ts             # Next.js configuration
├── package.json               # Project dependencies
└── README.md                  # Project documentation
```

## Customization

### Changing the AI Model

To use a different Mistral model, modify the model name in `app/api/chat/route.ts`:

```typescript
const result = streamText({
  model: mistral("your-preferred-model"),
  messages,
});
```

### Styling

The application uses Tailwind CSS for styling. You can customize the appearance by modifying the classes in `app/page.tsx` and `app/globals.css`.

## Deployment

This application can be easily deployed to Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Add your environment variables
4. Deploy

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Mistral AI](https://mistral.ai/) for providing the AI model
- [Vercel](https://vercel.com/) for hosting and the AI SDK
- [Next.js](https://nextjs.org/) team for the amazing framework
