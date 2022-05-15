# Backend test task

# Task
1. таблица user - поля: (email, firstName, lastName, image(string), pdf(binary))
2. crud операции над user
3. загрузка картинки на сервер
4. создать post запрос на который генерируется pdf юзера который находится по email(передать в теле)
5. далее функция находит пользователя в базе по email
6. генерит pdf файл вида firstName + lastName + image
7. сохраняет pdf файл в поле pdf базы данных- возвращает пользователю результат в виде JSON (true/false).
8. Залить на гит (edited)

Условия
1. node fraemwork + orm + relation db (edited)
2. авторизация

# API
1. Create user (registration)
```
POST http://localhost:8080/registration
form-data example:
  email: boo@foo.com
  password: 1234
  firstName: Vova
  lastName: Bulkin
  image: *image*
  role: user or admin
```
User can work only with his record. Admin has access to all records
2. Login
```
POST http://localhost:8080/login
{
    "email": "boo@foo.com",
    "password": "1234"
}
```
Returns access token with email and role in it's payload
3. Read
```
GET http://localhost:8080/read?email=boo@foo.com
+ authorization header
```
returns firstName, lastName and image url
```
GET http://localhost:8080/pdf?email=boo@foo.com
+ authorization header
```
returns download response with pdf
4. Update
```
POST http://localhost:8080/update?email=boo@foo.com
+ authorization header
form-data example:
  newEmail: boo@user.com
  firstName: Vova
  lastName: Bulkin
  image: *image*
```
Returns new access token if email was changed
5. Delete
```
POST http://localhost:8080/delete?email=boo@foo.com
+ authorization header
```
6. Load image
```
POST http://localhost:8080/image
+ authorization header
form-data example:
  email: boo@foo.com
  image: *image*
```
7. Make PDF
```
POST http://localhost:8080/pdf
+ authorization header
{
    "email": "boo@foo.com"
}
```
# Technologies
Node.js, Express.js, Sequelize, bcrypt, express-validator, jsonwebtoken, Multer, Pdfkit
