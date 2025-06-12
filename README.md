# Big Five Personality Test

A modern, responsive implementation of the Big Five (OCEAN) personality test with AI-powered insights.

## Features

- 50-question personality assessment
- Real-time scoring and analysis
- AI-powered personality insights using Google's Gemini API
- Beautiful, responsive UI with Tailwind CSS
- Embeddable version for third-party websites

## Taking the Personality Test

Follow these steps to take the test:

- Make sure you have an active profile on people.ai (Admin).
- Upload the resume before starting the test.
- Use the same email ID mentioned in your resume.
- Answer all the questions and submit the test once you're done.
- The test can only be taken **once**. If you face any issues, please contact the admin.

 

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Environment Variables

Create a `.env` file with:
```
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## License

MIT License
