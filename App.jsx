import React, { useEffect, useState } from "react";
import { api } from "./api";

const demoBooks = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", category: "Programming", totalCopies: 5, availableCopies: 5 },
  { id: 2, title: "Effective Java", author: "Joshua Bloch", category: "Java", totalCopies: 4, availableCopies: 4 },
  { id: 3, title: "Spring in Action", author: "Craig Walls", category: "Spring Boot", totalCopies: 3, availableCopies: 3 }
];

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) || null; }
    catch { return null; }
  });

  const [page, setPage] = useState("home");

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setPage("home");
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand" onClick={() => setPage("home")}>
          <div className="logo">A</div>
          <div>
            <strong>Archivalia</strong>
            <span>Digital Library</span>
          </div>
        </div>

        <nav>
          <button className={page === "home" ? "active" : ""} onClick={() => setPage("home")}>Home</button>
          <button className={page === "books" ? "active" : ""} onClick={() => setPage("books")}>Books</button>
          <button className={page === "borrows" ? "active" : ""} onClick={() => setPage("borrows")}>My Borrows</button>
          <button className={page === "fines" ? "active" : ""} onClick={() => setPage("fines")}>Fines</button>
          {user.role === "ADMIN" && (
            <button className={page === "admin" ? "active" : ""} onClick={() => setPage("admin")}>Admin</button>
          )}
        </nav>

        <div className="user-area">
          <div className="avatar">{user.username?.[0]?.toUpperCase()}</div>
          <div>
            <b>{user.username}</b>
            <small>{user.role}</small>
          </div>
          <button className="logout" onClick={logout}>Logout</button>
        </div>
      </header>

      <main>
        {page === "home" && <Home setPage={setPage} />}
        {page === "books" && <Books />}
        {page === "borrows" && <Borrows />}
        {page === "fines" && <Fines />}
        {page === "admin" && user.role === "ADMIN" && <Admin />}
      </main>

      <footer>© 2026 Archivalia Digital Libraries • Enterprise Academic E-Library</footer>
    </div>
  );
}

function Login({ onLogin }) {
  const [username, setUsername] = useState("student");
  const [password, setPassword] = useState("student123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api.login(username, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        username: data.username || username,
        role: data.role || "USER",
        userId: data.userId || data.id || 1001
      }));
      onLogin({
        username: data.username || username,
        role: data.role || "USER",
        userId: data.userId || data.id || 1001
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <div className="logo large">A</div>
          <h1>Archivalia</h1>
          <p>Enterprise Academic E-Library</p>
        </div>
        <div className="book-art">📚</div>
        <p className="quote">Search. Borrow. Learn. Return.</p>
      </div>

      <div className="login-card">
        <h2>Welcome back</h2>
        <p>Sign in to access your digital library.</p>

        <form onSubmit={submit}>
          <label>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />

          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />

          {error && <div className="error">{error}</div>}

          <button className="primary full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="demo">
          <b>Demo accounts</b>
          <span>Student: student / student123</span>
          <span>Admin: admin / admin123</span>
        </div>
      </div>
    </div>
  );
}

function Home({ setPage }) {
  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">ENTERPRISE ACADEMIC E-LIBRARY</span>
          <h1>Your knowledge,<br /><em>always within reach.</em></h1>
          <p>Search academic books, borrow resources, return them easily and track your fines from one secure platform.</p>
          <button className="primary" onClick={() => setPage("books")}>Explore Library →</button>
        </div>
        <div className="hero-books">
          <div className="floating-book book1">CLEAN<br />CODE</div>
          <div className="floating-book book2">EFFECTIVE<br />JAVA</div>
          <div className="floating-book book3">SPRING<br />IN ACTION</div>
        </div>
      </section>

      <section className="stats">
        <div><b>3+</b><span>Sample Resources</span></div>
        <div><b>24/7</b><span>Digital Access</span></div>
        <div><b>JWT</b><span>Secure Sessions</span></div>
        <div><b>REST</b><span>Microservices API</span></div>
      </section>

      <section className="features">
        <div className="section-title">
          <span className="eyebrow">LIBRARY SERVICES</span>
          <h2>Everything you need to manage resources</h2>
        </div>
        <div className="feature-grid">
          <Feature icon="⌕" title="Search Books" text="Find academic resources quickly by title or keyword." onClick={() => setPage("books")} />
          <Feature icon="↗" title="Borrow Resources" text="Borrow available books through the Borrow Service." onClick={() => setPage("borrows")} />
          <Feature icon="✓" title="Return & Fines" text="Return books and automatically calculate late fines." onClick={() => setPage("fines")} />
        </div>
      </section>
    </>
  );
}

function Feature({ icon, title, text, onClick }) {
  return (
    <button className="feature" onClick={onClick}>
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      <span>Open →</span>
    </button>
  );
}

function Books() {
  const [keyword, setKeyword] = useState("");
  const [books, setBooks] = useState(demoBooks);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function search() {
    setLoading(true);
    setMessage("");
    try {
      const data = await api.searchBooks(keyword);
      setBooks(Array.isArray(data) ? data : data?.content || []);
    } catch (err) {
      setMessage("Backend not reachable. Showing demo books. " + err.message);
      const k = keyword.toLowerCase();
      setBooks(demoBooks.filter(b => !k || b.title.toLowerCase().includes(k) || b.author.toLowerCase().includes(k)));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { search(); }, []);

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">CATALOG</span>
          <h1>Explore the library</h1>
          <p>Search the academic collection and borrow available resources.</p>
        </div>
      </div>

      <div className="search-box">
        <input value={keyword} onChange={e => setKeyword(e.target.value)} onKeyDown={e => e.key === "Enter" && search()} placeholder="Search by title or keyword..." />
        <button className="primary" onClick={search}>{loading ? "Searching..." : "Search"}</button>
      </div>

      {message && <div className="notice">{message}</div>}

      <div className="book-grid">
        {books.length === 0 ? <div className="empty">No books found.</div> :
          books.map(book => <BookCard key={book.id} book={book} />)}
      </div>
    </section>
  );
}

function BookCard({ book }) {
  const [days, setDays] = useState(7);
  const [message, setMessage] = useState("");

  async function borrow() {
    setMessage("");
    try {
      await api.borrowBook(book.id, days);
      setMessage("Book borrowed successfully.");
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <article className="book-card">
      <div className="book-cover"><span>BOOK</span><strong>{book.title}</strong></div>
      <div className="book-info">
        <span className="tag">{book.category || "Academic"}</span>
        <h3>{book.title}</h3>
        <p>by {book.author}</p>
        <div className="availability">
          <span>Available copies</span>
          <b>{book.availableCopies ?? book.totalCopies ?? 0}</b>
        </div>
        <div className="borrow-row">
          <select value={days} onChange={e => setDays(e.target.value)}>
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="21">21 days</option>
          </select>
          <button className="primary" onClick={borrow}>Borrow</button>
        </div>
        {message && <small className="result">{message}</small>}
      </div>
    </article>
  );
}

function Borrows() {
  const [borrows, setBorrows] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await api.getBorrows();
      setBorrows(Array.isArray(data) ? data : data?.content || []);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function returnBook(id) {
    try {
      const data = await api.returnBook(id);
      setMessage(typeof data === "string" ? data : "Book returned successfully.");
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <section className="page">
      <div className="page-heading">
        <div><span className="eyebrow">BORROW SERVICE</span><h1>My borrowed books</h1><p>Track your borrowed resources and return them here.</p></div>
      </div>
      {message && <div className="notice">{message}</div>}
      {loading ? <div className="loading">Loading borrow records...</div> :
        borrows.length === 0 ? <div className="empty">No borrow records found.</div> :
        <div className="table-wrap"><table><thead><tr><th>ID</th><th>Book ID</th><th>Borrow Date</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>{borrows.map(b => <tr key={b.id}><td>#{b.id}</td><td>{b.bookId}</td><td>{b.borrowDate || "-"}</td><td>{b.dueDate || "-"}</td><td><span className="status">{b.status || "BORROWED"}</span></td><td>{String(b.status).toUpperCase() !== "RETURNED" && <button className="small-btn" onClick={() => returnBook(b.id)}>Return</button>}</td></tr>)}</tbody>
        </table></div>
      }
    </section>
  );
}

function Fines() {
  const [fines, setFines] = useState([]);
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    api.getFines(user.userId || 1001)
      .then(data => setFines(Array.isArray(data) ? data : data?.content || []))
      .catch(err => setMessage(err.message));
  }, []);

  return (
    <section className="page">
      <div className="page-heading"><div><span className="eyebrow">FINE SERVICE</span><h1>My fines</h1><p>Late-return fines calculated by the Fine Service.</p></div></div>
      {message && <div className="notice">{message}</div>}
      {fines.length === 0 ? <div className="empty">No fines found.</div> :
        <div className="fine-grid">{fines.map((f, i) => <div className="fine-card" key={f.id || i}><span>Fine #{f.id || i + 1}</span><strong>₹{f.amount ?? f.fine ?? 0}</strong><small>{f.daysLate ?? 0} late days</small></div>)}</div>}
    </section>
  );
}

function Admin() {
  const [form, setForm] = useState({ title: "", author: "", category: "Academic", totalCopies: 1 });
  const [message, setMessage] = useState("");

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setMessage("");
    try {
      await api.addBook({ ...form, totalCopies: Number(form.totalCopies) });
      setMessage("Book added successfully.");
      setForm({ title: "", author: "", category: "Academic", totalCopies: 1 });
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <section className="page narrow">
      <div className="page-heading"><div><span className="eyebrow">ADMINISTRATION</span><h1>Add a new book</h1><p>Only users with the ADMIN role can add resources.</p></div></div>
      <form className="admin-form" onSubmit={submit}>
        <label>Book title<input name="title" value={form.title} onChange={change} required /></label>
        <label>Author<input name="author" value={form.author} onChange={change} required /></label>
        <label>Category<input name="category" value={form.category} onChange={change} required /></label>
        <label>Total copies<input type="number" min="1" name="totalCopies" value={form.totalCopies} onChange={change} required /></label>
        <button className="primary" type="submit">Add Book</button>
        {message && <div className="notice">{message}</div>}
      </form>
    </section>
  );
}

export default App;