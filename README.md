# Secure Examination Paper Distribution System

Creating a secure examination paper distribution system is essential to maintain the integrity and confidentiality of exams.

## Core Features

### 1. User Authentication and Authorization

- *Secure login system* for different user roles: administrators, examiners, and invigilators.
- *Role-based access control* to ensure data privacy and security.

### 2. Secure Paper Upload and Management

- *Paper upload* by administrators and examiners.
- *Encryption* of papers upon upload to ensure confidentiality.
- *Version control* to manage updates and revisions to papers.

### 3. Access Control and Distribution

- *Granular access control* to ensure only authorized personnel can access specific papers.
- *Scheduled distribution* of papers to ensure they are available only at the specified times.
- *Logging* of all access attempts for audit purposes.

### 4. Exam Paper Viewing and Download

- *Secure interface* for authorized users to view and download examination papers.
- *Watermarking and tracking* to prevent unauthorized sharing.
- *Time-limited access* to downloaded papers to ensure they are only accessible during the examination period.

## Tech Stack

- *Backend*: Node.js, MongoDB
- *Frontend*: React
- *Cloud Services*: Amazon AWS (for storage, hosting, and other services)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [AWS Account](https://aws.amazon.com/)
- [React](https://reactjs.org/)

### Installation

1. Clone the repository:

   bash
   git clone https://github.com/yourusername/secure-exam-paper-system.git
   cd secure-exam-paper-system
   

2. Install server dependencies:

   bash
   cd server
   npm install
   

3. Install client dependencies:

   bash
   cd ../client
   npm install
   

4. Set up environment variables. Create a .env file in the server directory and add your MongoDB URI, AWS credentials, and other necessary configurations:
   plaintext
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   S3_BUCKET_NAME=your_s3_bucket_name
   

### Running the Application

1. Start the server:

   nodemon server.js
   

2. Start the React client:
   bash
   cd ../client
   npm start
   

### Usage

1. *Admin Login*: Use the admin credentials to log in and manage the system.
2. *Upload Papers*: Administrators and examiners can upload examination papers which will be encrypted and stored in AWS S3.
3. *Schedule Distribution*: Set schedules for when papers should be made available to invigilators.
4. *View/Download Papers*: Authorized users can view and download papers, which will be watermarked and time-limited.
<!--

## Deployment

### Backend

1. Deploy the backend server on an AWS EC2 instance or using AWS Elastic Beanstalk.
2. Ensure that your MongoDB instance is accessible (either locally or through a cloud service like MongoDB Atlas).

### Frontend

1. Deploy the React application using AWS S3 and CloudFront for static website hosting.
2. Configure your AWS S3 bucket for website hosting and set up CloudFront for CDN. -->

## Acknowledgements

- Thanks to the teams for their valuable support.
