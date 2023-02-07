# syntax=docker/dockerfile:1
FROM python:3.7-alpine

WORKDIR /app  
COPY requirements.txt /app
RUN pip install -r requirements.txt --no-cache-dir

# ENV DATABASE_URL=postgres://postgres:postgres@postgres_container:5432/library

ENTRYPOINT ["python"] 
CMD ["manage.py", "runserver"]

EXPOSE 8000

