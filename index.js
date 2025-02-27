import express from 'express';
import bodyParser from 'body-parser';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { config } from 'dotenv';

const app = express();
const port = 3000;

config();
const filename = "database.db"
console.log(filename)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: filename
});

/**
 * Modelo de libro.
 * @class
 * @extends {Model}
 */
class Book extends Model { }
Book.init({
    /**
     * El título del libro.
     * @type {string}
     */
    title: DataTypes.STRING,
    /**
     * El autor del libro.
     * @type {string}
     */
    author: DataTypes.STRING,
    /**
     * El ISBN del libro.
     * @type {string}
     */
    isbn: DataTypes.STRING,
    /**
     * La editorial del libro.
     * @type {string}
     */
    publisher: DataTypes.STRING,
    /**
     * El número de páginas del libro.
     * @type {number}
     */
    pages: DataTypes.INTEGER
}, { sequelize, modelName: 'book' });

sequelize.sync();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Obtener todos los libros.
 * @route GET /books
 * @returns {Array<Book>} 200 - Lista de libros
 */
app.get('/books', async (req, res) => {
    const books = await Book.findAll();
    res.json(books);
});

/**
 * Obtener un libro por ID.
 * @route GET /books/:id
 * @param {string} id - ID del libro
 * @returns {Book} 200 - Libro encontrado
 * @returns {Object} 404 - Libro no encontrado
 */
app.get('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

/**
 * Crear un nuevo libro.
 * @route POST /books
 * @param {Book} book - Datos del libro a crear
 * @returns {Book} 201 - Libro creado
 */
app.post('/books', async (req, res) => {
    const book = await Book.create(req.body);
    res.status(201).json(book);
});

/**
 * Actualizar un libro por ID.
 * @route PUT /books/:id
 * @param {string} id - ID del libro
 * @param {Book} book - Datos del libro a actualizar
 * @returns {Book} 200 - Libro actualizado
 * @returns {Object} 404 - Libro no encontrado
 */
app.put('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.update(req.body);
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

/**
 * Eliminar un libro por ID.
 * @route DELETE /books/:id
 * @param {string} id - ID del libro
 * @returns {Object} 200 - Libro eliminado
 * @returns {Object} 404 - Libro no encontrado
 */
app.delete('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.destroy();
        res.json({ message: 'Book deleted' });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
