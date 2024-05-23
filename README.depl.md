
# Deployment Readme

## Building the image

```
podman build -f Containerfile src
```

## Creating the container and binding ports

```
podman create -p 3000:3000 <image_name>
```

## Starting the container

```
podman run <container_name>
```

<br />

Congratulations ! You can now connect to `http://localhost:3000/` and enjoy!