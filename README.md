## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Vite React**: Install [Node.js](https://nodejs.org/) (v14.0.0 or higher) and [npm](https://www.npmjs.com/) or use an alternative package manager like [Yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/).
- **Git**: Install [Git](https://git-scm.com/) for version control.

## Getting Started

To set up and run the project locally, follow these steps:

### Install Dependencies

Install the project dependencies using your preferred package manager:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Set Up Environment Variables

```bash
Create a .env file in the root of the project to define your environment-specific variables. Use the .env.example file as a reference.
```

#### Environment Variables

To configure the project, create a `.env` file in the root directory with the following keys:

- **VITE_OPENAI_API_KEY**: OpenAI API Key for accessing AI services.
- **VITE_CLOUDFLARE_ACCOUNT_ID**: Cloudflare account ID for managing Cloudflare services.
- **VITE_R2_ACCESS_KEY_ID**: Access key ID for Cloudflare R2 storage.
- **VITE_R2_SECRET_ACCESS_KEY**: Secret key for R2 access (keep secure).
- **VITE_R2_BUCKET_NAME**: Name of the R2 storage bucket.
- **VITE_R2_ENDPOINT**: Endpoint URL for R2 storage API access.

#### Resource Hints

- **OpenAI API Key**: Obtain from your [OpenAI dashboard](https://platform.openai.com).
- **Cloudflare Credentials**: Get these from the [Cloudflare dashboard](https://dash.cloudflare.com), under R2 storage settings.
- **Security**: Ensure these keys remain secure and are not shared publicly.

  > To avoid **cors** error add these below code into your bucket cors section

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["Your Domain"],
    "ExposeHeaders": ["ETag", "x-amz-request-id"],
    "MaxAgeSeconds": 3000
  }
]
```

### Start the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### Editing Pages

```md
You can start editing the page by modifying src/app.jsx. The page auto-updates as you edit the file.
```

### Build for Production

To build the project for production, use your preferred package manager to create an optimized production build:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Start the Production Server

Once the build is complete, start the production server:

```bash
npm start
# or
yarn start
# or
pnpm start
```

### Read more

[See Instruction](./instructions/README.md)
