FROM node:16.19.0

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --legacy-peer-deps
RUN npm install react-scripts -g --silent

# add app
# COPY . ./

# start app
CMD ["yarn", "dev"]

EXPOSE 5173

