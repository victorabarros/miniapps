FROM node:14.17

RUN mkdir /monthly-budget-manager
COPY . /monthly-budget-manager
WORKDIR /monthly-budget-manager
EXPOSE 3003
ENTRYPOINT ["yarn", "dev"]
