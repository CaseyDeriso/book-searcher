import gql from "graphql-tag";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($bookId: String!, $authors: [String!], $description: String, $title: String!, $image: String!) {
    saveBook(bookId: $bookId, authors: $authors, description: $description, title: $title, image: $image) {
      _id
      username
      bookCount
      savedBooks {
          bookId
          title
        
      }
    }

  }
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      User {
        _id
        username
        bookCount
        savedBooks
      }
    }
  }
`;
