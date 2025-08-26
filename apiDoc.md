Here is the complete and comprehensive API documentation for the Book Management System, with no omissions.

-----

### General API Information

  * **Base URL**: `https://api.yourdomain.com/v1`
  * **Authentication**: All protected endpoints require a valid JWT **`access_token`** in the `Authorization` header as a **`Bearer`** token.
      * **Header**: `Authorization: Bearer <your_access_token>`
  * **Error Handling**:
      * `400 Bad Request`: The request was malformed or invalid.
      * `401 Unauthorized`: Authentication failed (invalid/missing token).
      * `403 Forbidden`: The authenticated user lacks permission.
      * `404 Not Found`: The requested resource does not exist.
      * `429 Too Many Requests`: Rate limit exceeded.
      * `500 Internal Server Error`: A server-side error occurred.

-----

### 1\. User & Authentication API

#### **1.1. User Registration**

  * **Endpoint**: `POST /auth/register`
  * **Description**: Registers a new user with a default 'customer' role. After successful creation, it logs in the user and returns their profile and JWT tokens.
  * **Request Body**: `application/json`
    ```json
    {
      "username": "example_user",
      "email": "user@example.com",
      "password": "SecurePassword123",
      "avatar": "avater url"
    }
    ```
  * **Success Response (201 Created)**
    ```json
    {
      "message": "User registered successfully.",
      "accessToken": "eyJhbGciOiJIUzI1Ni...",
      "refreshToken": "eyJhbGciOiJIUzI1Ni...",
      "user": {
        "id": "uuid-of-the-new-user",
        "username": "example_user",
        "email": "user@example.com",
        "role": "customer",
        "avatar": "avatarurl"
      }
    }
    ```
  * **Error Response (400 Bad Request)**
    ```json
    {
      "message": "Validation failed.",
      "errors": {
        "email": "Email is already in use."
      }
    }
    ```
  * **Test Case**: Verify that a new user is created and the response includes both tokens and user data.

-----

#### **1.2. User Login**

  * **Endpoint**: `POST /auth/login`
  * **Description**: Authenticates a user and issues `access_token` and `refresh_token`.
  * **Request Body**: `application/json`
    ```json
    {
      "email": "user@example.com",
      "password": "SecurePassword123"
    }
    ```
  * **Success Response (200 OK)**
    ```json
    {
      "message": "Login successful.",
      "accessToken": "eyJhbGciOiJIUzI1Ni...",
      "refreshToken": "eyJhbGciOiJIUzI1Ni...",
      "user": {
        "id": "uuid-of-the-user",
        "username": "example_user",
        "email": "user@example.com",
        "role": "customer"
      }
    }
    ```
  * **Error Response (401 Unauthorized)**
    ```json
    {
      "message": "Invalid email or password."
    }
    ```
  * **Test Case**: Log in with correct credentials and check for the presence of both tokens.

-----

#### **1.3. Get User Profile**

  * **Endpoint**: `GET /users/me`
  * **Description**: Fetches the profile of the currently authenticated user.
  * **Headers**: `Authorization: Bearer <access_token>`
  * **Success Response (200 OK)**
    ```json
    {
      "id": "uuid-of-the-user",
      "username": "example_user",
      "email": "user@example.com",
      "role": "customer",
      "borrowingRecords": [ /* ... */ ],
      "purchaseHistory": [ /* ... */ ]
    }
    ```
  * **Error Response (401 Unauthorized)**
    ```json
    {
      "message": "Authentication failed. Please log in."
    }
    ```
  * **Test Case**: Make a request with and without a valid token to verify access control.

-----

### 2\. Book & Inventory API (Public & Admin)

#### **2.1. Get Available Book List**

  * **Endpoint**: `GET /books`
  * **Description**: Retrieves a paginated list of books available for sale.
  * **Query Parameters**: `page`, `limit`, `genre`, `author`, `search`.
  * **Success Response (200 OK)**
    ```json
    {
      "totalItems": 150,
      "totalPages": 15,
      "currentPage": 1,
      "items": [
        {
          "id": "book-101",
          "title": "The Hitchhiker's Guide to the Galaxy",
          "author": "Douglas Adams",
          "price": 12.99,
          "stock": 50,
          "isEbook": false,
          "coverPhotoUrl": "https://cdn.example.com/books/cover_101.jpg"
        }
      ]
    }
    ```
  * **Test Case**: Test various combinations of query parameters to ensure correct filtering and pagination.

-----

#### **2.2. Get Book Details**

  * **Endpoint**: `GET /books/:id`
  * **Description**: Retrieves detailed information for a specific book.
  * **URL Parameter**: `id` of the book.
  * **Success Response (200 OK)**
    ```json
    {
      "id": "book-101",
      "title": "The Hitchhiker's Guide to the Galaxy",
      "author": "Douglas Adams",
      "description": "A comedic science fiction series...",
      "price": 12.99,
      "stock": 50,
      "isEbook": false,
      "coverPhotoUrl": "https://cdn.example.com/books/cover_101.jpg",
      "genre": "Science Fiction",
      "publicationDate": "1979-10-12"
    }
    ```
  * **Error Response (404 Not Found)**
    ```json
    {
      "message": "Book with ID book-999 not found."
    }
    ```
  * **Test Case**: Test with a valid ID and an invalid ID.

-----

#### **2.3. Add a New Book (Admin Only)**

  * **Endpoint**: `POST /admin/books`
  * **Description**: Adds a new book to the inventory.
  * **Headers**: `Authorization: Bearer <access_token>`
  * **Request Body**: `multipart/form-data` or `application/json`
    ```json
    {
      "title": "New Book Title",
      "author": "New Author",
      "description": "...",
      "price": 25.50,
      "stock": 100,
      "isEbook": false,
      "coverPhoto": "file_upload"
    }
    ```
  * **Success Response (201 Created)**
    ```json
    {
      "message": "Book added successfully.",
      "bookId": "new-book-id-123"
    }
    ```
  * **Test Case**: Add a new book as an admin and verify a `403 Forbidden` error when a regular user attempts it.

-----

#### **2.4. Bulk Upload Books (Admin Only)**

  * **Endpoint**: `POST /admin/books/bulk-upload`
  * **Description**: Uploads books from a CSV or Excel file.
  * **Headers**: `Authorization: Bearer <access_token>`
  * **Request Body**: `multipart/form-data`
    ```
    file: [excel file with columns: title, author, price, stock, isEbook, coverPhotoUrl]
    ```
  * **Success Response (200 OK)**
    ```json
    {
      "message": "Bulk upload complete.",
      "totalRecords": 250,
      "successfulRecords": 245,
      "failedRecords": 5,
      "errors": [
        {
          "row": 10,
          "title": "Invalid Book",
          "reason": "Price must be a number."
        }
      ]
    }
    ```
  * **Test Case**: Upload a file with mixed valid and invalid data to ensure the response correctly reports errors.

-----

### 3\. Gonopathagar (Library) API

#### **3.1. Get Library Books by Location**

  * **Endpoint**: `GET /library/books`
  * **Description**: Lists books available for borrowing at a specific library branch.
  * **Query Parameters**: `locationId`, `page`, `limit`, `search`.
  * **Success Response (200 OK)**
    ```json
    {
      "totalItems": 75,
      "items": [
        {
          "bookId": "book-205",
          "title": "The Alchemist",
          "author": "Paulo Coelho",
          "availableCopies": 3
        }
      ]
    }
    ```
  * **Test Case**: Verify filtering by `locationId` works correctly.

-----

#### **3.2. Borrow a Book (Client Only)**

  * **Endpoint**: `POST /library/borrow`
  * **Description**: Records a book borrowing request.
  * **Headers**: `Authorization: Bearer <access_token>`
  * **Request Body**: `application/json`
    ```json
    {
      "bookId": "book-205",
      "locationId": "location-50"
    }
    ```
  * **Success Response (201 Created)**
    ```json
    {
      "message": "Book borrowed successfully.",
      "borrowingId": "borrow-record-id-123",
      "returnDate": "2025-09-10"
    }
    ```
  * **Error Response (400 Bad Request)**
    ```json
    {
      "message": "Book is not available at this location."
    }
    ```
  * **Test Case**: Borrow an available book and confirm `availableCopies` is decremented.

-----

### 4\. E-Book API

#### **4.1. Get E-Book List**

  * **Endpoint**: `GET /ebooks`
  * **Description**: Retrieves a paginated list of all e-books.
  * **Query Parameters**: `page`, `limit`, `isLocked`.
  * **Success Response (200 OK)**
    ```json
    {
      "totalItems": 45,
      "items": [
        {
          "id": "ebook-301",
          "title": "Dune",
          "author": "Frank Herbert",
          "isLocked": true,
          "price": 15.99
        },
        {
          "id": "ebook-302",
          "title": "The Art of War",
          "author": "Sun Tzu",
          "isLocked": false,
          "price": 0.00,
          "downloadUrl": "https://cdn.example.com/ebooks/art-of-war.pdf"
        }
      ]
    }
    ```
  * **Test Case**: Verify the `downloadUrl` is only present for unlocked books.

-----

#### **4.2. Purchase an E-Book**

  * **Endpoint**: `POST /ebooks/purchase`
  * **Description**: Initiates the purchase of a locked e-book.
  * **Headers**: `Authorization: Bearer <access_token>`
  * **Request Body**: `application/json`
    ```json
    {
      "ebookId": "ebook-301"
    }
    ```
  * **Success Response (200 OK)**
    ```json
    {
      "message": "Purchase successful. E-book unlocked.",
      "downloadUrl": "https://cdn.example.com/ebooks/dune.pdf"
    }
    ```
  * **Error Response (400 Bad Request)**
    ```json
    {
      "message": "E-book is already unlocked or not available for purchase."
    }
    ```
  * **Test Case**: Purchase a locked e-book and confirm the response provides the download link.

-----

### 5\. Sales & Reporting API

#### **5.1. Process Sale (POS)**

  * **Endpoint**: `POST /sales/process`
  * **Description**: Processes a sale transaction, either online or via POS.
  * **Headers**: `Authorization: Bearer <access_token>` (for admin/librarian)
  * **Request Body**: `application/json`
    ```json
    {
      "items": [
        { "bookId": "book-101", "quantity": 1 },
        { "bookId": "book-105", "quantity": 2 }
      ],
      "paymentMethod": "card",
      "customerInfo": {
        "email": "customer@example.com"
      }
    }
    ```
  * **Success Response (201 Created)**
    ```json
    {
      "message": "Sale processed successfully.",
      "saleId": "sale-12345",
      "invoiceUrl": "https://cdn.example.com/invoices/inv-12345.pdf"
    }
    ```
  * **Test Case**: Process a sale and verify that stock is correctly updated for each item.

-----

#### **5.2. Get Sales Reports (Admin Only)**

  * **Endpoint**: `GET /admin/reports/sales`
  * **Description**: Generates sales reports with various filters.
  * **Headers**: `Authorization: Bearer <access_token>`
  * **Query Parameters**: `period` (`daily`, `weekly`, `monthly`, `custom`), `startDate`, `endDate`.
  * **Success Response (200 OK)**
    ```json
    {
      "report": {
        "totalRevenue": 5500.75,
        "totalBooksSold": 850,
        "mostPopularBook": {
          "title": "The Lord of the Rings",
          "unitsSold": 150
        },
        "salesTrends": [
          { "date": "2025-08-20", "revenue": 250.50 },
          { "date": "2025-08-21", "revenue": 320.10 }
        ]
      }
    }
    ```
  * **Test Case**: Request a report for a specific date range and verify a `403` error when a regular user attempts to access it.

-----

### 6\. News Feed / Blog API

#### **6.1. Get Blog Posts**

  * **Endpoint**: `GET /blog/posts`
  * **Description**: Retrieves a paginated list of blog posts and articles.
  * **Query Parameters**: `page`, `limit`.
  * **Success Response (200 OK)**
    ```json
    {
      "totalItems": 120,
      "items": [
        {
          "id": "post-1",
          "title": "Our New Digital Library Initiative",
          "author": "Jane Smith",
          "date": "2025-08-25",
          "excerpt": "We are excited to announce..."
        }
      ]
    }
    ```
  * **Test Case**: Verify pagination works and the API returns the correct number of posts.

-----

#### **6.2. Get Single Blog Post**

  * **Endpoint**: `GET /blog/posts/:id`
  * **Description**: Retrieves a single, full blog post.
  * **Success Response (200 OK)**
    ```json
    {
      "id": "post-1",
      "title": "Our New Digital Library Initiative",
      "author": "Jane Smith",
      "date": "2025-08-25",
      "content": "<h1>Our New Digital Library...</h1><p>Full article content...</p>",
      "imageUrl": "https://cdn.example.com/blog/image1.jpg"
    }
    ```
  * **Test Case**: Test with a valid ID and an invalid ID.