#---------------------------
# ---- STAGE #1 - setup ----
#---------------------------
FROM node:18 AS setup
WORKDIR /code

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./


# Install development dependencies.
RUN npm ci


#---------------------------
# ---- STAGE #2 - build ----
#---------------------------
FROM setup AS builder
WORKDIR /code

# Copy source code to the container image.
COPY . .

RUN npm run build

#----------------------------
# ---- STAGE #4 - secure ----
#----------------------------
FROM node:18 AS secure
WORKDIR /app

# Copy all required files
COPY --from=builder /code/node_modules ./node_modules/
COPY --from=builder /code/dist .

EXPOSE 8080

ENV NODE_ENV production
ENV HOST 0.0.0.0

# Run the web service on container startup.
CMD ["app.js"]
