# 🚀 Deployment Guide

## Deploying to Vercel

### Prerequisites
- Vercel account
- MongoDB Atlas account (for cloud database)
- GitHub repository

### Step 1: Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist all IP addresses (0.0.0.0/0) for Vercel
5. Get your connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/micro-learning`)

### Step 2: Deploy Backend to Vercel

1. **Push your code to GitHub**
   ```bash
   git push origin <your-branch>
   ```

2. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Backend Environment Variables**
   Add these in Vercel dashboard → Settings → Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/micro-learning
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   FRONTEND_URL=https://your-frontend.vercel.app
   NODE_ENV=production
   ```

4. **Configure Build Settings**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Output Directory: `.`
   - Install Command: `npm install`

5. **Deploy**
   - Click "Deploy"
   - Note your backend URL (e.g., `https://your-backend.vercel.app`)

### Step 3: Deploy Frontend to Vercel

1. **Create a new Vercel project** for the frontend
   - Import the same GitHub repository
   - This will be a separate deployment

2. **Configure Frontend Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend.vercel.app/api
   REACT_APP_SOCKET_URL=https://your-backend.vercel.app
   ```

3. **Configure Build Settings**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Your frontend will be live at `https://your-frontend.vercel.app`

### Step 4: Update Backend FRONTEND_URL

Go back to your backend Vercel project and update the `FRONTEND_URL` environment variable with your actual frontend URL.

### Step 5: Enable CORS

The backend already has CORS configured, but make sure the `FRONTEND_URL` environment variable matches your frontend deployment.

---

## Alternative: Deploy as Monorepo (Single Vercel Project)

You can also deploy both frontend and backend in a single Vercel project:

1. **Push to GitHub**

2. **Import to Vercel**

3. **Add Environment Variables**
   ```
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secret_key
   NODE_ENV=production
   ```

4. **Use the included vercel.json**
   The project already has a `vercel.json` configured for monorepo deployment

5. **Deploy**

---

## Environment Variables Summary

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend.vercel.app/api
REACT_APP_SOCKET_URL=https://your-backend.vercel.app
```

---

## Post-Deployment

1. **Test the application**
   - Visit your frontend URL
   - Try signing up and logging in
   - Check if the feed loads

2. **Monitor logs**
   - Check Vercel function logs for any errors
   - Monitor MongoDB Atlas for connections

3. **Initial RSS Fetch**
   - The cron job might not work on Vercel's free tier
   - You may need to use Vercel Cron Jobs (Pro plan) or an external service like GitHub Actions

---

## Limitations on Vercel Free Tier

- **Serverless Functions**: 10-second timeout (RSS fetch might timeout)
- **Cron Jobs**: Not available on free tier
- **WebSockets**: Limited support (Socket.io may not work fully)

### Workarounds:

1. **For Cron Jobs**: Use GitHub Actions to trigger RSS fetch via API endpoint
2. **For WebSockets**: Use polling as fallback or upgrade to Vercel Pro
3. **For Long-Running Tasks**: Split RSS fetching into smaller chunks

---

## Vercel CLI Deployment

Alternatively, use Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## Troubleshooting

**MongoDB Connection Fails:**
- Whitelist 0.0.0.0/0 in MongoDB Atlas Network Access
- Check connection string format
- Ensure database user has read/write permissions

**CORS Errors:**
- Update FRONTEND_URL in backend environment variables
- Check if URLs match exactly (no trailing slashes)

**Build Fails:**
- Check Node version compatibility
- Ensure all dependencies are in package.json
- Check build logs in Vercel dashboard

**Socket.io Not Working:**
- Vercel serverless functions have limitations with WebSockets
- Consider using Vercel Pro or deploying backend to Railway/Render

---

**Ready to Deploy! 🚀**
