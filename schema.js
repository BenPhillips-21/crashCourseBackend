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

    type Person {
        id: ID!
        firstName: String!
        lastName: String!
        phoneNumber: String!
        involvement: String!
    }

    type insuranceDetails {
        id: ID!
        owner: ID
        otherDriver: ID
        carRegistrationNumber: String!
        insurerCompany: String!
        insurerContactNumber: String!
        insurancePolicy: String!
        insurancePolicyNumber: String!
    }

    input EditInsuranceInput {
        insuranceID: String!
        carRegistrationNumber: String
        insurerCompany: String
        insurerContactNumber: String
        insurancePolicy: String
        insurancePolicyNumber: String
    }

    input PhotoInput {
        url: String!
    }

    input VehicleInput {
        registrationNumber: String!
        make: String!
        model: String!
    }

    input WitnessInput {
        firstName: String!
        lastName: String!
        phoneNumber: String!
        involvement: String!
    }

    type accident {
        id: ID!
        user: [User!]!
        date: DateTime!
        time: String!
        location: String!
        speed: String!
        weatherConditions: String!
        crashDescription: String!
        photos: [Photo!]
        insurances: [insuranceDetails!]
        witnesses: [Person!]
    }

    type Photo {
        url: String!
    }

    type Vehicle {
        registrationNumber: String!
        make: String!
        model: String!
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
    addPerson(
        firstName: String!
        lastName: String!
        phoneNumber: String!
        involvement: String!
    ): Person
    editPerson(
        personID: ID!
        firstName: String
        lastName: String
        phoneNumber: String
        involvement: String
    ): Person
    deletePerson(
        personID: ID!
    ): Person
    addInsuranceDetails(
        carRegistrationNumber: String!
        insurerCompany: String!
        insurerContactNumber: String!
        insurancePolicy: String!
        insurancePolicyNumber: String!
        otherDriver: ID
    ): insuranceDetails
    editInsuranceDetails(
      input: EditInsuranceInput  
    ): insuranceDetails
    deleteInsuranceDetails(
        insuranceID: String!
    ): insuranceDetails
    addAccident(
        date: DateTime!
        time: String!
        location: String!
        speed: String!
        weatherConditions: String!
        crashDescription: String!
        photos: [PhotoInput!]
        otherVehicles: [VehicleInput!]
        witnesses: [WitnessInput!]
    ): accident
    editAccident(
        accidentID: String!
        date: DateTime
        time: String
        location: String
        speed: String
        weatherConditions: String
        crashDescription: String
        photos: [PhotoInput]
        otherVehicles: [VehicleInput]
        witnesses: [WitnessInput]
    ): accident
    deleteAccident(
        accidentID: String!
    ): accident
    addPhoto(
        accidentID: String!
        photoURL: String!
    ): accident
    deletePhoto(
        accidentID: String!
        photoURL: String!
    ): accident
    addWitness(
        accidentID: String!
        input: WitnessInput
    ): accident
    deleteWitness(
        accidentID: String!
        phoneNumber: String!
    ): accident
    addOtherVehicle(
        accidentID: String!
        input: VehicleInput
    ): accident
    deleteOtherVehicle(
        accidentID: String!
        registrationNumber: String!
    ): accident
    }
`

module.exports = typeDefs