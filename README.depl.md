
# Deployment Readme

## Building the image

```
podman build -t cash-chan -f Containerfile .
```

## Creating the container and binding ports

```
podman create -p 3000:3000 <image_name>
```

## Starting the container

```
podman run <container_name>
```

### Or...
## Deploying using docker-compose

```
docker-compose up -d
```

<br />

Congratulations ! You can now connect to `http://localhost:3000/` and enjoy!

### Logs
```
podman logs <container_name>
```