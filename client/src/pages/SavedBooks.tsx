import { useState } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { GET_ME } from '../utils/queries.js';
import { REMOVE_BOOK } from '../utils/mutations.js';
import { useMutation, useQuery } from '@apollo/client';
// import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth.js';
import { removeBookId } from '../utils/localStorage';
import type { User } from '../models/User.js';

const SavedBooks = () => {
  const [removeBook] = useMutation(REMOVE_BOOK, {
    update(cache, { data: { removeBook } }) {
      cache.writeQuery({
        query: GET_ME,
        data: { me: removeBook },
      });
    },
    });

  const [userData, setUserData] = useState<User>({
    username: '',
    email: '',
    password: '',
    savedBooks: [],
  });

  const { loading } = useQuery(GET_ME, {
    onCompleted: (data) => {
      setUserData(data.me);
      console.log('User data: ', data.me);
    }
  });

  if (loading) {
    return <h2>Loading...</h2>;
  }

  const userDataLength = Object.keys(userData).length;

  // useEffect(() => {
    // const getUserData = async () => {
    //   try {
    //     const token = Auth.loggedIn() ? Auth.getToken() : null;

    //     if (!token) {
    //       return false;
    //     }


        // const response = await getMe(token);

        // if (!response.ok) {
        //   throw new Error('something went wrong!');
        // }

    //     const user = await response.json();
    //     setUserData(user);
    //   } catch (err) {
    //     console.error(err);
    //   }
    // };

  //   getUserData();
  // }, [userDataLength]);


  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId },
      });
        } catch (err) {
          console.error(err);
        }
        removeBookId(bookId);
        // upon success, remove book's id from userData SavedBooks array
        const updatedUser = userData.savedBooks.filter((book) => book.bookId !== bookId);
        setUserData({ ...userData, savedBooks: updatedUser });
      };

      if (!userDataLength) {
        return <h2>LOADING...</h2>;
      }
      // const response = await deleteBook(bookId, token);
      
      // if (!response.ok) {
        //   throw new Error('something went wrong!');
        // }
        
        // const updatedUser = await response.json();
        // setUserData(updatedUser);
        // upon success, remove book's id from localStorage
        
        // if data isn't here yet, say so
  console.log('Trying to render SavedBooks');
  console.log('User data: ', userData);
  console.log(userData.savedBooks);
  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md='4'>
                <Card key={book.bookId} border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
