# Rover: Search Sitter's Ranking Scores 🚀

[![Node.js](https://img.shields.io/badge/Node.js->=24.18.0-green?logo=node.js)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm->=11.16.0-blue?logo=npm)](https://www.npmjs.com/)
[![License](https://img.shields.io/badge/license-ISC-brightgreen)](LICENSE)
[![Code Quality](https://img.shields.io/badge/Code%20Quality-Maintained-success)]()
[![Test Coverage](https://img.shields.io/badge/Coverage-100%25-blue)]()

A sitter ranking and scoring system that calculates and ranks petsitters based on profile metrics and user ratings.

## Overview

App processes CSV data containing sitter information and user ratings, then calculates a composite search score for each sitter based on their name characteristics and review history. The results are sorted and exported to a new CSV file.


## Quick Start

### Prerequisites

- [nvm](https://github.com/nvm-sh/nvm)

### Installation

```bash
nvm use
npm install
```

### Running the Application

```bash
npm start
```

This will:
1. Read sitter data from `data/input/reviews.csv`
2. Calculate scores for each sitter
3. Sort by search score (descending) with name as tie-breaker
4. Export results to `data/output/sitters_ranking.csv`

## Scoring Algorithm

### Profile Score
Calculated based on unique letters in the sitter's name:
```
Profile Score = 5 × (unique_letters / 26)
```
- Maximum score: 5 (all 26 letters present)
- Minimum score: 0 (no letters)

### Rating Score
Calculated as the average of all user ratings:
```
Rating Score = average(ratings)
```
- Represents user satisfaction
- Ranges from 0 to 5+

### Search Score
Intelligent weighted combination based on experience (stay count):
```
If stays = 0:
  Search Score = Profile Score

If stays >= 10:
  Search Score = Rating Score

If 0 < stays < 10:
  Search Score = (Profile Score × weight_profile) + (Rating Score × weight_rating)
  where weights are proportional to stay count
```

This ensures:
- New sitters rely on profile metrics
- Experienced sitters rely on user feedback
- Mid-level sitters balance both factors

### Sorting
Results are sorted by:
1. **Primary**: Search Score (descending)
2. **Tie-breaker**: Sitter name (ascending, alphabetical)

All scores are formatted to exactly 2 decimal places.

## Project Structure

```
rover/
├── data/
│   ├── input/reviews.csv                             # (delimited by default ";")
├── src/
│   ├── application/
│   │   └── use-cases/
│   │       └── calculateSittersRaking.use-case.js    # Main business logic
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── sitter.entity.js                      # Sitter domain model
│   │   │   └── sitterScore.entity.js                 # Score domain model
│   │   ├── policies/
│   │   │   └── sitterScore.policy.js                 # Score calculation rules
│   │   ├── repository/
│   │   │   └── sitter.repository.js                  # Repository interface
│   │   └── constants/
│   │       └── index.js                              # Domain constants
│   ├── infrastructure/
│   │   ├── csv/
│   │   │   ├── csvFile.adapter.js                    # CSV file I/O
│   │   │   └── csvSitter.repository.js               # CSV-Sitter based repository implementation
│   │   └── constants/
│   │       └── index.js                              # Infrastructure constants
│   ├── utils/
│   │   ├── logger.util.js                            # Logging utilities
│   │   └── number.util.js                            # Number formatting utilities
│   └── cli.js                                         # Application entry point
├── package.json
├── README.md

```

## Architecture

### Clean Architecture Layers

1. **Domain Layer** (`domain/`)
   - Core business logic and rules
   - Independent of frameworks and external libraries
   - Contains entities & policies

2. **Application Layer** (`application/`)
   - Contains Application Use cases
   - Mix usage between domain and infrastructure
   - High-level workflow management

3. **Infrastructure Layer** (`infrastructure/`)
   - External concerns (file I/O, CSV parsing)
   - Adapter implementations for persistence


### Key Patterns

- **Repository Pattern**: Abstracts data access layer
- **Policy Pattern**: Encapsulates logic for scoring algorithms
- **Use Case Pattern**: Orchestrates business workflows
- **Adapter Pattern**: Converts between different data formats

## CSV Input Format

Expected input file: `data/input/reviews.csv`

Required columns (semicolon-delimited) for Europe target:
```
sitter;sitter_email;rating;...
John Doe;john@example.com;5;...
Jane Smith;jane@example.com;4;...
```

The application reads sitter name, email, and rating from each row. Multiple rows per sitter are aggregated.

## CSV Output Format

Generated output file: `data/output/sitters_ranking.csv`

Columns:
- `email`: Sitter email address
- `name`: Sitter name
- `profile_score`: Profile score (0-5, 2 decimals)
- `ratings_score`: Average rating score (2 decimals)
- `search_score`: Final search score (2 decimals)

Results are sorted by search_score (descending), with sitter name as tie-breaker.

## Development


### Running Tests

```bash
npm test
```

### Test Coverage

```bash
npm run coverage
```

### Linting

Check for code style issues:
```bash
npm run lint
```

Fix linting issues automatically:
```bash
npm run lint:fix
```


## Logging
The application includes a simple logging helper, console logs are not permitted and loggign helper is welcome to be improved on whatever is required to fetch from code

```
   # log('UserController','create', {})

   # log('UserController','create', 'Hello World')

   # logError('UserController','create', error)
```

## Configuration

### Constants

Domain constants (`src/domain/constants/index.js`):
- `CONSTANT_PROFILE_SCORE`: Maximum profile score (5)
- `ALPHABET_LETTERS`: Total alphabet letters (26)
- `LIMIT_OF_STAYS_FOR_WEIGHT_AVG`: Threshold for search score calculation (10)

Infrastructure constants (`src/infrastructure/constants/index.js`):
- `INPUT_CSV`: Input file path
- `OUTPUT_CSV`: Output file path
- `DEFAULT_CSV_DELIMITER`: ";"


## Contributing

When contributing to Rover:

1. Follow the existing code structure and patterns
2. Add tests for new features
3. Ensure all tests pass: `npm test`
4. Fix linting issues: `npm run lint:fix`
5. Provide clear commit messages

## Discussion Question
#### How would you adjust the calculation and storage of search scores in a production application?

> **Answer**
>
> I'd use two layers with a database as core source and Redis as a cache layer for fast reads.
>
> The search score would be calculated and stored in the database & cache whenever a dependency that affects the score changes (for example: ratings or profile name), an event would trigger a score recalculation and update the stored value async.
>
> On the other hand, Redis caches the latest score results for read performance to search queries. The cache would be invalidated or refreshed whenever the underlying score changes.
>
> If Score Formula gets complex, I would also consider batch recalculations and background jobs to handle score updates efficiently without impacting user interaction in the app.

---

#### Describe a technical implementation for the frontend you would use to display a list of sitters and their scores. How would the frontend manage state as users interact with a page?

> **Answer**
>
> I'd implement the frontend using a combination of server-side data fetching and client-side state management.
>
> The sitter list would be loaded using pagination or scrolling pagination to avoid loading large datasets at once. The frontend would request only the required data from the API, including optional parameters such as page, filters, sorting, and search criteria.
>
> For state management, I would separate server state from UI state. A solution like React Query could manage server data, caching, refetching, and synchronization, while Redux or local state could handle UI-specific information such as selected filters, sorting preferences, and user interactions.
>
> So, the user interaction would be like:
>
> 1. Update UI state.
> 2. Trigger server request (if required, else ~> 4.).
> 3. Update server state/cache.
> 4. Re-render the UI with the latest data.

---

#### What infrastructure choices might you make to build and host this project at scale? Suppose your web application must return fast search results with a peak of 10 searches per second.

> **Answer**
>
> I'd choose an infrastructure composed of Redis, Elasticsearch, and a primary database.
>
> - Redis would be used as a cache layer for fast access to frequently requested search results.
> - Elasticsearch would handle complex search operations such as filtering, ranking, and querying across large datasets.
> - The database would remain as core source for persistent sitter data.
>
> The application can start on a single server, but it can also scale more if we manage to use containers and Kubernetes, with pods and replicas to distribute traffic, ensure delivery and maintain performance as usage increases.

---

#### Describe how you would approach API design for a backend service to provide sitter and rank data to a client/web frontend.

> **Answer**
>
> I'd design the API with clear source of responsibility.
>
> **GET /sitters/{id}**
>
> - Provides sitter information.
> - We can include optional parameters for more information eg. "current_ranking" if required or if business uses it frequently.
>
> **GET /sitters/{id}/ranking** *(optional if required)*
>
> - Provides sitter rank history data.
>
> **GET /search/sitters/rankings**
>
> - Provides all sitters ranking.
> - Supports query parameters for filtering, searching, sorting, pagination, and ranking criteria.
>
> Request headers could include client metadata such as platform and app version, allowing backend middlewares to handle compatibility, feature flags, and client-specific behaviour when required.

## License

ISC
