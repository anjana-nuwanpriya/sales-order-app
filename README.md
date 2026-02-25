## Getting Started

### 1. Database Setup

Make sure MySQL is running, then create the database:

```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend Setup

If your MySQL root user has a password, open `backend/src/main/resources/application.properties` and update this line:

```
spring.datasource.password=your_password_here
```

Leave it blank if your root user has no password:

```
spring.datasource.password=
```

Then run the backend:

```bash
cd backend
mvn spring-boot:run
```

Wait until you see: `Started SalesOrderApplication in X seconds`

Backend runs on: `http://localhost:8080`

### 3. Frontend Setup

Open a new terminal tab, then:

```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`
