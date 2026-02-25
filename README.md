## Getting Started

### 1. Database Setup
- Install MySQL and create the database:
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend Setup
- Open `backend/src/main/resources/application.properties`
- Update your MySQL password:
```
spring.datasource.password=your_password_here
```
- Run the Spring Boot app:
```bash
cd backend
mvn spring-boot:run
```
Backend runs on: `http://localhost:8080`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on: `http://localhost:3000`
