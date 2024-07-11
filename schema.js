const { DateTimeResolver } = require('graphql-scalars');

const typeDefs = `
    scalar DateTime

    type User {
        email: String!
        firstName: String!
        lastName: String!
        password: String!
        address: String!
        phoneNumber: String!
        insuranceDetails: [insuranceDetails]
        accidents: [accident]
        id: ID!
    }

    type insuranceDetails {
        carRegistrationNumber: String!
        insurerCompany: String!
        insurerContactNumber: String!
        insurancePolicy: String!
        insurancePolicyNumber: String!
    }

    type accident {
        date: DateTime!
        time: String!
        location: String!
        speed: String!
        weatherConditions: String!
        crashDescription: String!
        photos: [Photo!]
        otherVehicles: [Vehicle!]
        witnesses: [Witness!]
    }

    type Photo {
        url: String!
    }

    type Vehicle {
        registrationNumber: String!
        make: String!
        model: String!
    }

    type Witness {
        firstName: String!
        lastName: String!
        phoneNumber: String!
        involvement: String!
    }

    type Token {
        value: String!
    }

    type Query {
        me: User
    }

    type Mutation {
    createUser(
        email: String!
        password: String!
        confirmedPassword: String!
        firstName: String!
        lastName: String!
        address: String!
        phoneNumber: String!
    ): User
    login(
        email: String!
        password: String!
    ): Token
    addInsuranceDetails(
        carRegistrationNumber: String!
        insurerCompany: String!
        insurerContactNumber: String!
        insurancePolicy: String!
        insurancePolicyNumber: String!
    ): insuranceDetails
    }
`

module.exports = typeDefs