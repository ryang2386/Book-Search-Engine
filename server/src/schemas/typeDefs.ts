const typeDefs = `

    type Query {
        me: User
    }

    type User {
        _id: ID
        username: String!
        email: String!
        password: String!
        bookCount: Int
        savedBooks: [Book]!
    }

    type Book {
        bookId: ID
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
        bookId: ID
        description: String
        title: String
        image: String
        authors: [String]
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(input: saveBookInput!): User
        removeBook(bookId: ID!): User
    }

`;

export default typeDefs;