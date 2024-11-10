FROM node:18-alpine

WORKDIR /app

# Add these environment variables
ENV NEXTAUTH_URL=http://localhost:3000
ENV NEXTAUTH_SECRET="tzBSB0OkkWLiyxieNVosAm3ed2J4FcUz5lo3w0KVUbE="

# Copy package files first
COPY package*.json ./
RUN npm install

# Copy auth configuration files specifically
COPY auth.config.ts ./
COPY auth.ts ./
COPY middleware.ts ./

# Copy the rest of the application
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]