import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
                email
                password
            }
        }
    }`;

export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
                email
                savedBooks {
                    bookId
                    title
                    authors
                    description
                    image
                }
            }
        }
    }`;

export const SAVE_BOOK = gql`
    mutation saveBook($input: saveBookInput!) {
        saveBook(input: $input) {
                _id
                username
                email
                password
                bookCount
                savedBooks {
                    bookId
                    authors
                    description
                    title
                    image
                }
        }
    }`;

export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: ID!) {
        removeBook(bookId: $bookId) {
                _id
                username
                savedBooks {
                    bookId
                    title
                    authors
                    description
                    image
                }
        }
    }`;
