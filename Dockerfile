# Use python3.8 parent image for application
FROM python:3.8

WORKDIR /usr/src/app

# Install dependencies required to run project
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

CMD ["python3", "./server/server.py"]