import os
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, session, render_template, request, make_response, abort
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.sql import text

os.environ["DATABASE_URL"] = "postgres://postgres:postgres@localhost:5432/library"

if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

uri = os.getenv("DATABASE_URL")  # or other relevant config var
if uri and uri.startswith("postgres://"):
    uri = uri.replace("postgres://", "postgresql://", 1)

engine = create_engine(uri)
db = scoped_session(sessionmaker(bind=engine))

def main():
    try:
        print("Create table public.books...")
        db.execute(text("CREATE TABLE IF NOT EXISTS public.books (\
            isbn character varying NOT NULL,\
            title character varying NOT NULL,\
            author character varying NOT NULL,\
            year character varying NOT NULL\
        );"))
        # db.execute("ALTER TABLE public.books OWNER TO xjrrfhutdfyvrs;")
        # db.execute("ALTER TABLE ONLY public.books ADD CONSTRAINT books_pkey PRIMARY KEY (isbn);")
        db.commit()
        print('Table "books" successfully created!')
    except Exception as e:
        print('Table "books" cannot be created!')

    try:
        print("Create table public.users...")
        db.execute(text("CREATE TABLE IF NOT EXISTS public.users (\
            username character varying NOT NULL,\
            password character varying NOT NULL,\
            f_name character varying NOT NULL,\
            l_name character varying NOT NULL\
        );"))
        # db.execute("ALTER TABLE public.users OWNER TO xjrrfhutdfyvrs;")
        # db.execute("ALTER TABLE ONLY public.users ADD CONSTRAINT users_pkey PRIMARY KEY (username);")
        db.commit()
        print('Table "users" successfully created!')
    except Exception as e:
        print('Table "users" cannot be created!')
    try:
        print("Create table public.tokens...")
        db.execute(text("CREATE TABLE IF NOT EXISTS public.tokens (\
            userhash character varying NOT NULL,\
            session character varying NOT NULL,\
            token character varying NOT NULL,\
            expire bigint NOT NULL\
        );"))
        # db.execute("ALTER TABLE public.tokens OWNER TO xjrrfhutdfyvrs;")
        # db.execute("ALTER TABLE ONLY public.tokens ADD CONSTRAINT tokens_pkey PRIMARY KEY (userhash, session, token);")
        db.commit()
        print('Table "tokens" successfully created!')
    except Exception as e:
        print('Table "tokens" cannot be created!')

    try:
        print("Create table public.reviews...")
        db.execute(text("CREATE TABLE IF NOT EXISTS public.reviews (\
            isbn character varying NOT NULL,\
            username character varying NOT NULL,\
            rating integer NOT NULL,\
            review character varying\
        );"))
        # db.execute("ALTER TABLE public.reviews OWNER TO xjrrfhutdfyvrs;")
        # db.execute("ALTER TABLE ONLY public.reviews ADD CONSTRAINT reviews_pkey PRIMARY KEY (isbn, username);")
        # db.execute("ALTER TABLE ONLY public.reviews ADD CONSTRAINT reviews_isbn_fkey FOREIGN KEY (isbn) REFERENCES public.books(isbn);")
        # db.execute("ALTER TABLE ONLY public.reviews ADD CONSTRAINT reviews_username_fkey FOREIGN KEY (username) REFERENCES public.users(username);")
        db.commit()
        print('Table "reviews" successfully created!')
    except Exception as e:
        print('Table "reviews" cannot be created!')


if __name__ == "__main__":
    main()
