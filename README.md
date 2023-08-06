# Study Buddy Web Application

Study Buddy is a web application built using Node.js, EJS, and Express, MongoDB, etc. providing a platform for university students to communicate with each other and also engage in a global chat with other users. The application is powered by Socket.IO to enable real-time communication in the chat feature.

## Features

- User Registration: University students can create an account and log in to the Study Buddy platform.
- User Profiles: Each user has a profile where they can see info about themselves and their academic interests.
- Global Chat: Study Buddy offers a global chat room where users can interact with other students worldwide.
- Real-time Communication: Socket.IO allows instant messaging in both private and global chat.
- Online Status: Users can see the online status of other users in the chat application.

## Installation

To run Study Buddy locally on your machine, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/your-username/study-buddy.git
```

2. Navigate to the project directory:

```bash
cd study-buddy
```

3. Install the dependencies:

```bash
npm install
```

4. Checkout of main branch:

```plaintext
git checkout develop
```

5. Start the application:

```bash
npm run dev
```

6. Open your web browser and visit `http://localhost:3000`  to access Study Buddy.

## Dependencies

Study Buddy relies on the following main dependencies:

- Node.js
- Express
- EJS
- Socket.IO
- And many more.

These dependencies are automatically installed when running the `npm install` command.

## File Structure

The project's file structure is organized as follows:

```
study-buddy/
|-- auth/
|  |-- auth.js
|  |-- checkLogin.js
|-- model/
|  |--server.js
|  |--university.js
|  |--user.js
|-- public/
|   |-- css/
|   |-- js/
|   |-- img/
|   |--chat.html
|-- views/
|   |-- partials/
|   |-- login.ejs
|   |-- profile.ejs
|   |-- etc..
|-- routers/
|   |-- app.js
|   |-- homeRouter.js
|   |-- chatRouter.js
|   |-- userRouter.js
|-- index.js
|-- .env
|-- package.json
|-- README.md
```

## Contribution

Contributions to Study Buddy are welcome! If you find any bugs or have suggestions for new features, please submit an issue or a pull request on the GitHub repository.

## Author

Study Buddy is developed and maintained by [Kaif Khan](https://github.com/kaifkh20),
[Farhan Ahmad](),
[Meer Alamgir](),
[Syed Ataullah](),
[Saif Khan]().

---

## Features Needed
- [ ] Frontend Revamp
- [ ] Private Chat feature
- [ ] Students near you feature
- [ ] Voice channel feature
- [ ] Video channel feature
