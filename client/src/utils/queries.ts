import { gql } from '@apollo/client';

export const GET_ME = gql`
    query me {
        _id
        username
        email
        password
        bookCount
        savedBooks {
            bookID
            authors
            description
            title
            image
            link
        }
    }
`;
