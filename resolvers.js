const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")
const { GraphQLError } = require('graphql')
const User = require('./models/user')

const dotenv = require('dotenv');

dotenv.config();

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
function validateEmail(email) {
  return emailRegex.test(email);
}

const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    createUser: async (root, args) => {
      const emailVerify = validateEmail(args.email);
      if (!emailVerify) {
        throw new GraphQLError('Not a valid email');
      }

      if (args.password !== args.confirmedPassword) {
        throw new GraphQLError('Password and confirmed password do not match!');
      }

      try {
        const hashedPassword = await bcrypt.hash(args.password, 10);
        const user = new User({
          email: args.email,
          password: hashedPassword,
          firstName: args.firstName,
          lastName: args.lastName,
          address: args.address,
          phoneNumber: args.phoneNumber,
        });
        await user.save();
        return user;
      } catch (err) {
        throw new GraphQLError('Error creating user: ' + err.message);
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ email: args.email })
      if (!user) {
        throw new GraphQLError('Could not find that user');
      }
      const match = await bcrypt.compare(args.password, user.password);
      if (!match) {
        throw new GraphQLError('Incorrect credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })  
      }
  
      const userForToken = {
        email: user.email,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  }
}

module.exports = resolvers