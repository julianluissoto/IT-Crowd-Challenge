# IT CROWD - CHALLENGE 
## Web Application

## Description
This web application,  is designed to provide users with a platform for various tasks, including user registration, authentication, product and brand management, and im working on more features. It utilizes a full-stack architecture with both frontend and backend components.

## Technologies Used

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Cloudinary

### Backend
- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Prisma
- JWT

## Running the Application Locally

### Frontend
1. Clone the frontend repository.
2. Navigate to the frontend directory.
3. Install dependencies with `npm install` or `yarn install`.
4. Set the required environment variables (if any).
5. Start the development server with `npm start` or `yarn start`.

### Backend
1. Clone the backend repository.
2. Navigate to the backend directory.
3. Install dependencies with `npm install` or `yarn install`.
4. Set the required environment variables (if any).
5. Start the server with `npm start` or `yarn start`.

## .env
DATABASE_URL=postgres://julian:XkrRWonI6nRLjQNwuRezZhG3VriyHlK8@dpg-ck0bca36fquc73a3v65g-a.oregon-postgres.render.com/itcrowd

SECRET= itcrowd

CLOUDINARY_CLOUD_NAME=julian-soto
CLOUDINARY_API_KEY=294192131485266
CLOUDINARY_API_SECRET=PpXtSK7I3XwoI9mbr9xlX8jQqyQ

## API Documentation

The IT CROWD API provides the following endpoints:

- `/user` (POST): Create a new user.
- `/signup` (POST): User signup.
- `/login` (POST): User login.
- `/products` (GET, POST): Get all products, create a new product.
- `/products/:id` (GET, PUT, DELETE): Get, update, or delete a specific product by ID.
- `/brands` (GET, POST): Get all brands, create a new brand.
-



## Authentication
For login there is a user already created if you want to use it 
## Use user: test@test.com
## Password : test1234
- User authentication is implemented using JWT tokens.
- Users can register, log in, and obtain JWT tokens for authenticated access and setted on header as "Authorization"

## Database Schema

The database schema includes tables for users, products, and brands. Relationships between these tables are defined to manage data effectively.

## Deployment

- [Frontend Deployment](https://your-frontend-deployment-url.com)
- [Backend Deployment](https://your-backend-deployment-url.com)

## Security Considerations

- JWT tokens are securely managed for user authentication.
-

## Testing

No testing implemented yet.

## Contributing

Contributions to this project are welcome. Please follow our contribution guidelines.

## Authors

- [Julian Soto](https://www.linkedin.com/in/julian-soto-dev/)

![image](https://github.com/julianluissoto/IT-Crowd-Challenge/assets/84419137/e2e634ce-13c1-4f26-b306-6577cb31b06a)
![image](https://github.com/julianluissoto/IT-Crowd-Challenge/assets/84419137/fbe78e66-79b5-4e48-b855-284d2d83a49c)


## Contact Information

For inquiries or support, you can reach out to [julianlasoto@gmail.com](mailto:julianlasoto@gmail.com).

## Screenshots 




## Acknowledgments

- Thank you to the open-source community for their valuable contributions.
