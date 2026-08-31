CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title)
VALUES (
    'Jero',
    'https://example.com/blog1',
    'Learning PostgreSQL'
);

INSERT INTO blogs (author, url, title)
VALUES (
    'User',
    'https://example.com/blog2',
    'Learning Relational DB'
);