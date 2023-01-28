# syntax=docker/dockerfile:1
FROM python:3.7-alpine

ENV DATABASE_URL=postgres://postgres:postgres@postgres_container:5432/library

COPY requirements.txt requirements.txt
COPY db db

RUN pip install -r requirements.txt
RUN python /db/createtable.py

EXPOSE 5000

