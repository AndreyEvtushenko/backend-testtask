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
Create user (registration)
```
POST http://localhost:8080/registration
form-data example:
email: boo@foo.com
password: 1234
firstName: Vova
lastName: Bulkin
image: *imgage*
role: user or admin
```

# Technologies
