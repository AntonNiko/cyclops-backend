
# Dream Game

This is the repository for the SENG 350 group project for Group 12. Team members are:

1. Anton Nikitenko
2. Sam Kosman
3. Connor Buchko


# VENV

```python
python3 -m venv venv/
```

## Installation

Ensure that Docker is installed when downloading and building the project. Use the guide to [install Docker Engine](https://docs.docker.com/engine/install/ubuntu/)

A short summary of the installation steps for Docker are listed below for an `x86_64/amd64` system:

```bash
$ sudo apt-get update
$ sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
$ sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
 $ sudo apt-get update
 $ sudo apt-get install docker-ce docker-ce-cli containerd.io
```

Verify that the installation of Docker is successful by running the following command:

```bash
$ sudo docker run hello-world
```

To ensure this project runs as expected, ensure Docker 19.03.13 or later is installed by verifying with the following command:

```bash
$ docker --version
```

To build the docker image required to run the application, run the following command:

```bash
$ sudo docker build -t dream_game .
```

The result of building the project is that a docker image by the name of `dream_game` is visible in the list of images when `docker image ls` is executed.

### PIP alternative

If docker cannot be installed on the system, an alternative can be used which involves using `pip3` to install dependencies.
Assumming that `Python3` is already installed, run the following command:

```bash
$ pip install --no-cache-dir -r requirements.txt
```


## Usage

To run the newly built docker image as a container, run the following command (assumming the image name is `dream_game`):

```bash
$ sudo docker run -it -p 8080:8080 dream_game
```

The game should run properly if it is accessed in a browser, by visiting `127.0.0.1:8080` for example.

Alternatively if `pip` was used to install the application's dependencies on the host, the following command should 
successfully launch the application on `127.0.0.1:8080`:

```bash
$ python3 ./server/server.py 
```


## Assets
Dino Assets: https://arks.itch.io/dino-characters
Nature Platform Set: https://rottingpixels.itch.io/nature-platformer-tileset

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)