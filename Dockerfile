FROM node:20-alpine3.17 as build

# Create app directory
WORKDIR /usr/src/app

RUN node --version && npm --version

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# CMD ["npm", "start"]    # npm start


# ---- Release ----
FROM node:20-alpine3.17 as release
RUN mkdir -p /usr/src/app
# Copy production node_modules
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist/ ./
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/src/views src/views


RUN chown node:node /usr/src/app
USER node
EXPOSE 3000

CMD ["npm", "run", "start"]
