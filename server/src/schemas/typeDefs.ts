const typeDefs = `

    type Query {
        me: User
    }

    type User {
        _id: ID
        username: String
        email: String
        bookCount: Number
        savedBooks: [Book]
    }

    type Book {
        bookID: ID
        authors: [String]
        description: String
        title: String
        image: String
        link: String    
    }

    type Auth {
        token: ID!
        user: User
    }

    input saveBookInput {
        books: [Books]
        description: String
        title: String
        bookID: ID
        image: String
        link: String
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(input: saveBookInput!): User
        removeBook(bookID: ID!): User
    }

`;

export default typeDefs;