# Cost of Living Comparison Scraper

This project is a web scraping application that fetches cost of living data for various cities compared to Sofia, Bulgaria, using Puppeteer. The data is stored in a MongoDB database and includes scheduled scraping, manual force-scraping, and filtering by month-year.

## Features

- **Scrape Data**: Scrapes cost-of-living comparison data from [Numbeo](https://www.numbeo.com/).
- **Database Storage**: Saves scraped data in MongoDB, organized by month and year (e.g., `1.25` for January 2025).
- **Scheduled Scraping**: Automatically scrapes data every month (configurable).
- **Force Scraping**: Allows manual scraping via API with data overwriting for the current month.
- **Filterable API**: Provides an API to fetch all data or filter by specific months.
- **Dockerized**: Easily deployable using Docker for consistent and reliable environment setups.

---

## Table of Contents

1. [Technologies](#technologies)
2. [Getting Started](#getting-started)
3. [API Endpoints](#api-endpoints)
4. [Environment Variables](#environment-variables)
5. [Project Structure](#project-structure)
6. [How to Run](#how-to-run)
7. [License](#license)

---

## Technologies

- **Node.js**
- **Express.js**
- **MongoDB** (using Mongoose)
- **Puppeteer**
- **Docker** & **Docker Compose**
- **node-schedule**

---

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/ivelinmegdanov/cost-of-living-api.git
   cd cost-of-living-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables)).

4. Start the application:
   ```bash
   npm start
   ```

---

## API Endpoints

### 1. **Get Latest or Filtered Data**

- **Endpoint**: `/api/cost-of-living`
- **Method**: `GET`
- **Query Params**:
  - `monthYear` (optional): Fetches data for a specific month-year (e.g., `1.25` for January 2025).
- **Response**:
  - Success: Returns data for the requested month-year or the latest data.
  - Failure: Returns `404` if no data exists.

### 2. **Force Scrape Data**

- **Endpoint**: `/api/scrape`
- **Method**: `POST`
- **Description**: Manually triggers scraping and overwrites the data for the current month-year.
- **Response**:
  - Success: Data scraped and saved.
  - Failure: Returns `500` with the error details.

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://mongo:27017/cost-of-living
SCRAPE_DAY=8 // By default every first of the month
```

Or copy and rename `.env.example` file in the root directory and modify the variables.

---

## Project Structure

```plaintext
.
├── src
│   ├── config
│   │   └── database.js.js       # database config
│   ├── controllers
│   │   └── scrapeController.js  # API logic
│   ├── models
│   │   └── costOfLiving.js      # Mongoose model
│   ├── routes
│   │   └── scrapeRoutes.js      # API routes
│   ├── schedules
│   │   └── scheduleScrape.js    # Scheduled scraping
│   ├── services
│   │   └── scraper.js           # Puppeteer scraping logic
│   ├── utils
│   │   └── constants.js         # Comparison cities and other constants
│   └── app.js                   # Express application
├── tasks
│   └── scheduleScrape.js        # Automatic scrape
├── Dockerfile                   # Docker configuration for the app
├── docker-compose.yml           # Docker Compose file
├── package.json                 # Node.js dependencies
├── README.md                    # Project documentation
└── .env                         # Environment variables (ignored in Git)
```

---

## How to Run

### Local Environment

1. Start MongoDB locally or via Docker:

   ```bash
   docker run -d -p 27017:27017 --name mongo mongo
   ```

2. Start the application:
   ```bash
   npm start
   ```

### Dockerized Environment

1. Build and start using Docker Compose:

   ```bash
   docker-compose up --build
   ```

2. Access the API at:
   - `http://localhost:5000/api/cost-of-living`
   - `http://localhost:5000/api/scrape`

---

## License

This project is licensed under the MIT License. Feel free to use and modify it as you wish.
