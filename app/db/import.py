import os
import csv
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.sql import text

os.environ["DATABASE_URL"] = "postgres://postgres:postgres@db:5432/library"

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

uri = os.getenv("DATABASE_URL")  # or other relevant config var
if uri and uri.startswith("postgres://"):
    uri = uri.replace("postgres://", "postgresql://", 1)

# Set up database
engine = create_engine(uri)
db = scoped_session(sessionmaker(bind=engine))


def main():
    file_dir = os.path.dirname(os.path.realpath('__file__'))
    file_name = os.path.join(file_dir, './books.csv')

    f = open(file_name)
    rows = csv.reader(f)
    db.execute(text("TRUNCATE books_book CASCADE"))
    index = 0
    for isbn, title, author, year in rows:
        # don't add the header row
        if index > 0:
            try:
                db.execute(text("INSERT INTO books_book (id, title, author, year) VALUES (:isbn, :title, :author, :year)"),
                    {"isbn": index, "title": title, "author": author, "year": year})
                index += 1
            except Exception as e:
                print(e)
        else :
            index += 1
    db.commit()
    print(str(index - 1), "rows have been added to the books table!")

if __name__ == "__main__":
    main()
