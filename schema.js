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

    union Owner = Person | User

    type insuranceDetails {
        id: ID!
        owner: Owner
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
        findAccident(
            accidentID: ID!
        ): accident
        getAllInsurances: [insuranceDetails]
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
        ownerType: String!
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
    deleteAllInsurances: String
    addAccident(
        date: DateTime!
        time: String!
        location: String!
        speed: String!
        weatherConditions: String!
        crashDescription: String!
        photos: [PhotoInput!]
        insurances: [ID!]
        witnesses: [ID!]
    ): accident
    editAccident(
        accidentID: ID!
        date: DateTime
        time: String
        location: String
        speed: String
        weatherConditions: String
        crashDescription: String
    ): accident
    deleteAccident(
        accidentID: ID!
    ): accident
    addPhoto(
        accidentID: ID!
        photoURL: String!
    ): accident
    deletePhoto(
        accidentID: ID!
        photoURL: String!
    ): accident
}
`

module.exports = typeDefs