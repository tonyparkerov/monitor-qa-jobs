# DOU QA Jobs Monitor

A TypeScript application that monitors DOU.ua for new QA job vacancies, filters them based on configured criteria, and sends notifications to a Telegram chat. The application uses MongoDB for state persistence.

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/tonyparkerov/monitor-qa-jobs/check-qa-jobs.yml?style=flat-square)

## 🚀 Features

- Automatically scrapes QA job vacancies from DOU.ua focusing on remote positions
- Filters jobs based on configurable exclusion terms (keywords and companies)
- Tracks the last seen job in MongoDB to avoid sending duplicate notifications
- Sends formatted job notifications to a designated Telegram chat
- Runs automatically via GitHub Actions on a weekday schedule (Monday-Friday)
- TypeScript-based codebase with proper typing and modular architecture

## 🔄 How It Works

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│             │    │             │    │             │    │             │
│  Fetch Jobs │───►│ Filter Jobs │───►│    Format   │───►│ Send to     │
│  from DOU.ua│    │ by criteria │    │   Message   │    │ Telegram    │
│             │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
        │                 │
        │                 │
        ▼                 ▼
┌─────────────┐    ┌─────────────┐
│             │    │             │
│  MongoDB    │    │ Excluded    │
│  Database   │    │ Terms       │
│             │    │             │
└─────────────┘    └─────────────┘
```

## 📋 Prerequisites

- Node.js (latest version recommended)
- A Telegram bot token (create one via [@BotFather](https://t.me/botfather))
- A Telegram chat ID where notifications will be sent
- MongoDB database (local or cloud-based)

## 🔧 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/monitor-qa-jobs.git
   cd monitor-qa-jobs
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your credentials:
   ```
   BOT_TOKEN=your_telegram_bot_token
   CHAT_ID=your_telegram_chat_id
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_DB_NAME=your_db_name
   ```

## ⚙️ Configuration

The application can be configured by modifying the following files:

### Job Filtering

Edit `src/config/config.ts` to customize the job filtering criteria:

```typescript
filters: {
  excludedTerms: [
    "Python",
    "Java",
    "C#",
    "офіс",
    "office",
    "Lead",
    // Add or remove terms as needed
  ],
  excludedCompanies: []
},
```

### DOU.ua URL Configuration

You can modify the DOU.ua URL in `src/config/config.ts` to target different job categories or criteria:

```typescript
dou: {
  url: "https://jobs.dou.ua/vacancies/?remote&category=QA",
},
```

## 🏃‍♂️ Usage

### Running Locally

To build and run the application:

```bash
npm start
```

This will compile the TypeScript code and run the application.

### GitHub Actions Workflow

The application is configured to run automatically via GitHub Actions:

- **Schedule**: Runs every weekday (Monday to Friday) at 16:00 UTC (19:00 Ukrainian time during summer)
- **Manual Trigger**: Can be manually triggered via the GitHub Actions UI
- **Environment**: Uses GitHub Secrets for sensitive configuration

## 🚀 Deployment

### Setting up GitHub Secrets

For the GitHub Actions workflow to function properly, you need to set up the following secrets in your repository:

1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `BOT_TOKEN`: Your Telegram bot token
   - `CHAT_ID`: Your Telegram chat ID
   - `MONGODB_URI`: Your MongoDB connection string
   - `MONGODB_DB_NAME`: Your MongoDB database name

### Testing the Workflow

You can manually trigger the workflow to test if everything is set up correctly:

1. Go to your GitHub repository → Actions
2. Select the "Check QA Jobs" workflow
3. Click "Run workflow" and confirm

## 🏗️ Project Structure

```
monitor-qa-jobs/
├── .github/workflows/    # GitHub Actions workflow configurations
├── src/
│   ├── config/           # Application configuration
│   ├── filters/          # Job filtering logic
│   ├── models/           # Job data model
│   ├── services/         # Core services (DOU.ua parser, Telegram, MongoDB)
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions and message formatting
│   └── app.ts            # Main application entry point
├── .env                  # Environment variables (not committed)
├── package.json          # Project dependencies
└── tsconfig.json         # TypeScript configuration
```

## 📦 Dependencies

- [cheerio](https://github.com/cheeriojs/cheerio): For parsing and extracting job data from HTML
- [telegraf](https://github.com/telegraf/telegraf): For sending notifications to Telegram
- [mongodb](https://github.com/mongodb/node-mongodb-native): For storing job state information
- [dotenv](https://github.com/motdotla/dotenv): For loading environment variables
- TypeScript for type-safe code

## 📊 Example Output

Messages sent to Telegram have the following format:

```
📊 DOU QA vacancies

[QA Engineer (Remote)] @Company Name
🗓️ Posted: 27 March
📍 Locations: Remote
💰 Salary: $1500-2000

[Manual QA Engineer] @Another Company
🗓️ Posted: 26 March
📍 Locations: Kyiv, Lviv, Remote
```

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

For questions or suggestions, please open an issue in this repository.

## 🙏 Acknowledgements

- [DOU.ua](https://dou.ua) for providing the job listings
- All contributors to the dependencies used in this project
