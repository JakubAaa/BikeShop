# Bike Shop
> Simple bike shop app created with Node.js


## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Setup](#setup)
* [Usage](#usage)
* [Features](#features)

## General Information
* This is a Node.js bike shop app powered by Express that provides the main functions you'd expect from online shop.
* Project was created as part of exercise after the Node.js course on Udemy.

---

## Technologies Used
Project is created with:
* Node.js version: 18.3.0
* Express version: 4.18.1
* Mongoose version: 6.6.1
* Jest version: 29.0.3

---

## Setup
* Clone this repo to your desktop and run `npm install` to install all the dependencies.
* Create `.env` file in this project root directory. This file should contain the following fields:
```
PORT
MONGO_URL
URL_DOMAIN
PRODUCTS_PER_PAGE
PRODUCTS_PER_PAGE_ADMIN
SENDGRID_API_KEY
SENDER_EMAIL
STRIPE_SECRET_KEY
```

---

## Usage
* Once the dependencies are installed and `.env` is created, you can run  `npm start` to start the application.
* You will then be able to access it at your port from `.env` or at localhost:3000

---

## Features

### As normal user:
* Browsing products
* Product details
* Signup and login
* Password change
* Adding product to the cart
* Creating order
* Payments

### As admin:
* Adding new product
* Editing products
* Deleting products
* Browsing all orders

---
