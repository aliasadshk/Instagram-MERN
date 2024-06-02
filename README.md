# Insta Clone - Social Media Application for Sharing Moments with Friends

![Instagram Clone](https://github.com/rishirawat04/Insta-Clone-Social-media-application-for-sharing-moments-with-friends/blob/main/client/public/InstaProfile.png)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

This is a fully functional Instagram clone built with the MERN stack. It allows users to share posts, like or dislike posts, comment on posts, follow other users, and view posts from the users they follow. The application uses JWT for authentication and Tailwind CSS for styling. It is designed to be fully responsive, ensuring a seamless experience across different devices.

## Features

- **User Authentication**: Sign up and log in using JWT.
- **Post Creation**: Share images and captions.
- **Likes and Dislikes**: Like or dislike posts.
- **Commenting**: Add and view comments on posts.
- **Following System**: Follow and unfollow users.
- **Feed**: View posts from users you follow.
- **Responsive Design**: Fully responsive layout using Tailwind CSS.

## Technologies Used

- **Frontend**:
  - React.js
  - Tailwind CSS

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB
  - JWT for authentication

## Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/rishirawat04/Insta-Clone-social-media-application-for-sharing-moments-with-friends-.git
    ```

2. **Navigate to the project directory**:
    ```sh
    cd Insta-Clone-social-media-application-for-sharing-moments-with-friends-
    ```

3. **Install frontend dependencies**:
    ```sh
    cd client
    npm install
    ```

4. **Install backend dependencies**:
    ```sh
    cd ../server
    npm install
    ```

5. **Set up environment variables**:
    Create a `.env` file in the `server` directory and add the following variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

6. **Start the development server**:
    - In the `client` directory, run:
      ```sh
      npm start
      ```
    - In the `server` directory, run:
      ```sh
      npm run dev
      ```

## Usage

1. **Sign Up**: Create a new account by signing up.
2. **Log In**: Log in to your account.
3. **Create Post**: Share your posts by uploading images and adding captions.
4. **Interact**: Like, dislike, and comment on posts.
5. **Follow Users**: Follow other users to see their posts in your feed.
6. **View Feed**: View posts from users you follow.

## Screenshots

### Post Section
![Post Section](https://github.com/rishirawat04/Insta-Clone-Social-media-application-for-sharing-moments-with-friends/blob/main/client/public/instaPost.png)

### Profile Section
![Profile Section](https://github.com/rishirawat04/Insta-Clone-Social-media-application-for-sharing-moments-with-friends/blob/main/client/public/InstaProfile.png)

### Comments and Likes Section
![Comments and Likes Section](https://github.com/rishirawat04/Insta-Clone-Social-media-application-for-sharing-moments-with-friends/blob/main/client/public/InstaComment.png)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any features or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

Rishi Rawat - [LinkedIn](https://www.linkedin.com/in/rishi-rawat-a6632a251/)
