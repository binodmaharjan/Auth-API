# Nodejs Authentication APIs

### Installation & Configuration
- Install Docker Desktop and start it.
- Clone this repo in your local machine https://github.com/binodmaharjan/Auth-API.git
- Open the Terminal and navigate to the project folder.
- Below will be  your postgres connection details
```bash
ADMINER_DEFAULT_SERVER=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=1111
```

### Building the project
- We can start bulding our projects by running 'docker compose build'
- Once build is done, run `docker compose up' to start the servies. You can run `docker compose up -d` for detach mode
- To stop the services you can press `Ctrl + C` - (Control + C)


# Accessing the Docker Container
- Authentication APIs run on [http://localhost:8000](http://localhost:8000)
- Database Access [http://localhost:8080](http://localhost:8080) - use the above detail to login.


