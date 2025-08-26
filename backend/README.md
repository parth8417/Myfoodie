# MyFoodie Backend

This is the backend service for the MyFoodie application.

## Deployment on Render

### Setup Instructions

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Use the following settings:
   - **Name**: myfoodie-backend (or your preferred name)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Branch**: main (or your deployment branch)

### Environment Variables

Make sure to set these environment variables in the Render dashboard:

- `PORT`: Port for the server (Render will provide a `PORT` automatically)
- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation

### Static File Hosting

This application serves uploaded images from the `/uploads` directory. Render provides persistent disk storage for Web Services that can be used for this purpose.

## Local Development

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file based on `.env.example`
4. Run `npm run dev` to start development server with nodemon
