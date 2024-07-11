const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")
const { GraphQLError } = require('graphql')

const User = require('./models/user')
const Insurance = require('./models/insurance')
const Accident = require('./models/accident')

const dotenv = require('dotenv');

dotenv.config();

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
function validateEmail(email) {
  return emailRegex.test(email);
}

const resolvers = {
  Query: {
    me: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError('Not authenticated');
      }
      const userID = currentUser._id.toString()
      try {
        const populatedUser = await User.findById(userID)
          .populate('insuranceDetails')
          .populate('accidents')
        return populatedUser;
      } catch (err) {
        throw new GraphQLError("Could not fetch user data");
      }
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
    addInsuranceDetails: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError('Not authenticated');
      }

      const insurance = new Insurance({ ...args });
      insurance.owner = currentUser._id;

      try {
        await insurance.save();
      } catch (err) {
        throw new GraphQLError("Could not save insurance details");
      }

      currentUser.insuranceDetails.push(insurance._id);
      try {
        await currentUser.save();
      } catch (err) {
        throw new GraphQLError("Could not update user with insurance details");
      }

      return insurance;
    },
    editInsuranceDetails: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('Not authenticated')
      }

      const foundItem = currentUser.insuranceDetails.find(item => item.toString() === args.insuranceID)

      if (!foundItem) {
        throw new GraphQLError('Cannot find these insurance details')
      } 

      const insurance = await Insurance.findById(args.insuranceID)


      if (!insurance) {
        return null
    } else {
        args.carRegistrationNumber ? insurance.carRegistrationNumber = args.carRegistrationNumber : null
        args.insurerCompany ? insurance.insurerCompany = args.insurerCompany : null
        args.insurerContactNumber ? insurance.insurerContactNumber = args.insurerContactNumber : null
        args.insurancePolicy ? insurance.insurancePolicy = args.insurancePolicy : null
        args.insurancePolicyNumber ? insurance.insurancePolicyNumber = args.insurancePolicyNumber : null
        insurance.save()
        return insurance
    }
    },
    deleteInsuranceDetails: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError('Not authenticated');
      }

      try {
        const foundItem = currentUser.insuranceDetails.find(item => item.toString() === args.insuranceID)

        if (!foundItem) {
          throw new GraphQLError('Cannot find those accident details')
        } 

        const insuranceToDelete = await Insurance.findByIdAndDelete(args.insuranceID)
        if (!insuranceToDelete) {
          throw new GraphQLError("Could not find those insurance details")
        }

        return insuranceToDelete
      } catch (err) {
        throw new GraphQLError(err.message)
      }
    },
    addAccident: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError('Not authenticated');
      }

      const accident = new Accident({ ...args })
      accident.user = currentUser._id

      try {
        await accident.save()
      } catch (err) {
        throw new GraphQLError(err)
      }

      currentUser.accidents.push(accident._id)
      try {
        await currentUser.save();
      } catch (err) {
        throw new GraphQLError("Could not update user with insurance details");
      }

      return accident
    },
    editAccident: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError('Not authenticated');
      }

      const foundItem = currentUser.accidents.find(item => item.toString() === args.accidentID)

      if (!foundItem) {
        throw new GraphQLError('Cannot find this accident')
      } 

      const accident = await Accident.findById(args.accidentID)

      if (!accident) {
        return null
    } else {
        args.date ? accident.date = args.date : null
        args.time ? accident.time = args.time : null
        args.location ? accident.location = args.location : null
        args.speed ? accident.speed = args.speed : null
        args.weatherConditions ? accident.weatherConditions = args.weatherConditions : null
        args.crashDescription ? accident.crashDescription = args.crashDescription : null
        accident.save()
        return accident
    }      
    },
    deleteAccident: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError('Not authenticated');
      }

      try {
        const isUserAccident = currentUser.accidents.find(item => item.toString() === args.accidentID)

        if (!isUserAccident) {
          throw new GraphQLError('Cannot find this accident')
        } 

        const accidentToDelete = await Accident.findByIdAndDelete(args.accidentID)
        if (!accidentToDelete) {
          throw new GraphQLError("Could not delete that accident")
        }

        return accidentToDelete
      } catch (err) {
        throw new GraphQLError(err.message)
      }
    },
    addPhoto: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError('Not authenticated');
      }

      try {
        const isUserAccident = currentUser.accidents.find(item => item.toString() === args.accidentID)

        if (!isUserAccident) {
          throw new GraphQLError('Cannot find this accident')
        } 

        const accident = await Accident.findById(args.accidentID)
        if (!accident) {
          throw new GraphQLError("Could not find that accident")
        }
        const photo = {
          url: args.photoURL
        }

        accident.photos.push(photo)

        try {
          await accident.save();
        } catch (err) {
          throw new GraphQLError("Could not add photo to accident");
        }
  
        return accident
      } catch (err) {
        throw new GraphQLError(err.message)
      }
    },
    deletePhoto: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError('Not authenticated');
      }
    
      try {
        const foundItem = currentUser.accidents.find(
          item => item.toString() === args.accidentID
        );
    
        if (!foundItem) {
          throw new GraphQLError('Cannot find those accident details');
        }
    
        const accident = await Accident.findById(args.accidentID);
        if (!accident) {
          throw new GraphQLError("Could not find those accident details");
        }
    
        accident.photos = accident.photos.filter(
          photo => photo.url !== args.photoURL
        );
    
        await accident.save();
    
        return accident;
      } catch (err) {
        throw new GraphQLError(err.message);
      }
    },
    addWitness: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError('Not authenticated');
      }

      try {
        const isUserAccident = currentUser.accidents.find(item => item.toString() === args.accidentID)

        if (!isUserAccident) {
          throw new GraphQLError('Cannot find this accident')
        } 

        const accident = await Accident.findById(args.accidentID)
        if (!accident) {
          throw new GraphQLError("Could not find that accident")
        }
        const witness = {
          firstName: args.input.firstName,
          lastName: args.input.lastName,
          phoneNumber: args.input.phoneNumber,
          involvement: args.input.involvement
        }

        accident.witnesses.push(witness)

        try {
          await accident.save();
        } catch (err) {
          throw new GraphQLError("Could not add photo to accident");
        }
  
        return accident
      } catch (err) {
        throw new GraphQLError(err.message)
      }
    },
    deleteWitness: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError('Not authenticated');
      }

      try {
        const foundItem = currentUser.accidents.find(
          item => item.toString() === args.accidentID
        );
    
        if (!foundItem) {
          throw new GraphQLError('Cannot find those accident details');
        }
    
        const accident = await Accident.findById(args.accidentID);
        if (!accident) {
          throw new GraphQLError("Could not find those accident details");
        }
    
        accident.witnesses = accident.photos.filter(
          photo => photo.phoneNumber !== args.phoneNumber
        );
    
        await accident.save();
    
        return accident;
      } catch (err) {
        throw new GraphQLError(err.message);
      }
    } 
  }
}

module.exports = resolvers