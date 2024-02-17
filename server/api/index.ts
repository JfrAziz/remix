import { Hono } from 'hono'
import books from './books'
import authors from './authors'

const app = new Hono()

app.route('/authors', authors)
app.route('/books', books)

export default app