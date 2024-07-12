const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")
const { GraphQLError } = require('graphql')

const User = require('./models/user')
const Insurance = require('./models/insurance')
const Accident = require('./models/accident')
const Person = require('./models/person')

const dotenv = require('dotenv');
const { argsToArgsConfig } = require('graphql/type/definition')

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
    },
    findAccident: async(root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError('Not authenticated');
      }
  
      try {
        const accident = await Accident.findById(args.accidentID)
          .populate('insurances')
          .populate('witnesses')
        return accident;
      } catch (err) {
        throw new GraphQLError("Could not fetch accident data");
      }
    },
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
    addPerson: async (root, args, context) => {
      const newPerson = new Person({ 
        firstName: args.firstName,
        lastName: args.lastName,
        phoneNumber: args.phoneNumber,
        involvement: args.involvement
      });
  
      try {
        await newPerson.save();
      } catch (err) {
        throw new GraphQLError("Could not save newPerson");
      }
      return newPerson
    },
    editPerson: async (root, args) => {
      const person = await Person.findById(args.personID)
      if (!person) {
        throw new GraphQLError("Could not find that person in the database")
      }

      args.firstName ? person.firstName = args.firstName : null
      args.lastName ? person.lastName = args.lastName : null
      args.phoneNumber ? person.phoneNumber = args.phoneNumber : null
      args.involvement ? person.involvement = args.involvement : null

      person.save()

      return person
    },
    deletePerson: async (root, args) => {
      const person = await Person.findByIdAndDelete(args.personID);
      if (!person) {
        throw new GraphQLError("Could not find that person in the database");
      }
    
      return person
    },    
    addInsuranceDetails: async (root, args, context) => {
        const currentUser = context.currentUser;
        if (!currentUser) {
          throw new GraphQLError('Not authenticated');
        }

        const mutation = {
          insurerContactNumber: args.insurerContactNumber,
          insurerCompany: args.insurerCompany,
          insurancePolicyNumber: args.insurancePolicyNumber,
          insurancePolicy: args.insurancePolicy,
          carRegistrationNumber: args.carRegistrationNumber
        }
        
        let insurance
        
        if (!args.otherDriver) {
          insurance = new Insurance({ 
            owner: currentUser._id,
            ...mutation
          })
        } else {
          insurance = new Insurance({ 
            otherDriver: args.otherDriver,
            ...mutation
          })
        }        
    
        try {
          await insurance.save();
        } catch (err) {
          throw new GraphQLError("Could not save insurance details!!!!!");
        }
        
        if (!args.otherDriver) {
        currentUser.insuranceDetails.push(insurance._id);
        try {
          await currentUser.save();
        } catch (err) {
          throw new GraphQLError("Could not update user with insurance details");
        }
      }
    
        return insurance;
    },    
    editInsuranceDetails: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('Not authenticated')
      }

      const insurance = await Insurance.findById(args.input.insuranceID)

      if (!insurance) {
        return null
    } else {
        args.input.carRegistrationNumber ? insurance.carRegistrationNumber = args.input.carRegistrationNumber : null
        args.input.insurerCompany ? insurance.insurerCompany = args.input.insurerCompany : null
        args.input.insurerContactNumber ? insurance.insurerContactNumber = args.input.insurerContactNumber : null
        args.input.insurancePolicy ? insurance.insurancePolicy = args.input.insurancePolicy : null
        args.input.insurancePolicyNumber ? insurance.insurancePolicyNumber = args.input.insurancePolicyNumber : null

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
        throw new GraphQLError("Could not update user with accident");
      }

      return accident
    },
    // editAccident: async (root, args, context) => {
    //   const currentUser = context.currentUser;
    //   if (!currentUser) {
    //     throw new GraphQLError('Not authenticated');
    //   }

    //   const foundItem = currentUser.accidents.find(item => item.toString() === args.accidentID)

    //   if (!foundItem) {
    //     throw new GraphQLError('Cannot find this accident')
    //   } 

    //   const accident = await Accident.findById(args.accidentID)

    //   if (!accident) {
    //     return null
    // } else {
    //     args.date ? accident.date = args.date : null
    //     args.time ? accident.time = args.time : null
    //     args.location ? accident.location = args.location : null
    //     args.speed ? accident.speed = args.speed : null
    //     args.weatherConditions ? accident.weatherConditions = args.weatherConditions : null
    //     args.crashDescription ? accident.crashDescription = args.crashDescription : null
    //     accident.save()
    //     return accident
    // }      
    // },
    // deleteAccident: async (root, args, context) => {
    //   const currentUser = context.currentUser;
    //   if (!currentUser) {
    //     throw new GraphQLError('Not authenticated');
    //   }

    //   try {
    //     const isUserAccident = currentUser.accidents.find(item => item.toString() === args.accidentID)

    //     if (!isUserAccident) {
    //       throw new GraphQLError('Cannot find this accident')
    //     } 

    //     const accidentToDelete = await Accident.findByIdAndDelete(args.accidentID)
    //     if (!accidentToDelete) {
    //       throw new GraphQLError("Could not delete that accident")
    //     }

    //     return accidentToDelete
    //   } catch (err) {
    //     throw new GraphQLError(err.message)
    //   }
    // },
    // addPhoto: async (root, args, context) => {
    //   const currentUser = context.currentUser;
    //   if (!currentUser) {
    //     throw new GraphQLError('Not authenticated');
    //   }

    //   try {
    //     const isUserAccident = currentUser.accidents.find(item => item.toString() === args.accidentID)

    //     if (!isUserAccident) {
    //       throw new GraphQLError('Cannot find this accident')
    //     } 

    //     const accident = await Accident.findById(args.accidentID)
    //     if (!accident) {
    //       throw new GraphQLError("Could not find that accident")
    //     }
    //     const photo = {
    //       url: args.photoURL
    //     }

    //     accident.photos.push(photo)

    //     try {
    //       await accident.save();
    //     } catch (err) {
    //       throw new GraphQLError("Could not add photo to accident");
    //     }
  
    //     return accident
    //   } catch (err) {
    //     throw new GraphQLError(err.message)
    //   }
    // },
    // deletePhoto: async (root, args, context) => {
    //   const currentUser = context.currentUser;
    //   if (!currentUser) {
    //     throw new GraphQLError('Not authenticated');
    //   }
    
    //   try {
    //     const foundItem = currentUser.accidents.find(
    //       item => item.toString() === args.accidentID
    //     );
    
    //     if (!foundItem) {
    //       throw new GraphQLError('Cannot find those accident details');
    //     }
    
    //     const accident = await Accident.findById(args.accidentID);
    //     if (!accident) {
    //       throw new GraphQLError("Could not find those accident details");
    //     }
    
    //     accident.photos = accident.photos.filter(
    //       photo => photo.url !== args.photoURL
    //     );
    
    //     await accident.save();
    
    //     return accident;
    //   } catch (err) {
    //     throw new GraphQLError(err.message);
    //   }
    // },
  }
}

module.exports = resolvers