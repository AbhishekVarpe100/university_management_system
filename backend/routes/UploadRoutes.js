const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require('../models/User');
const Staff=require('../models/Staff');
const jwt=require('jsonwebtoken');
const path=require('path')