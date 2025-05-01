import { gql } from '@apollo/client';

export const GET_ME = gql`
    query me {
        username
        email
        password
        savedBooks {
            bookID
            authors
            description
            title
            image
        }
    }
`;
