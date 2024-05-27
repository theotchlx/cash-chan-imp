Podman : daemonless Docker

# Deployment Readme

## Building the image

```
podman build -t cash-chan -f Containerfile .
```

## Creating the container and binding ports

```
podman create -p 3333:3333 cash-chan
```

---

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

Congratulations ! You can now connect to `http://localhost:3333/` and enjoy!

### Logs
```
podman logs <container_name>
```
please docker exec -it cash-chan-imp-postgres-1 bash


## Cleanup :
docker stop cash-chan-imp-postgres-1 cash-chan-imp-cash-chan-1
docker rm cash-chan-imp-postgres-1 cash-chan-imp-cash-chan-1
docker volume prune

## Redo :

docker build -t cash-chan -f Containerfile .
docker-compose up -d

## Diagnose db :
docker exec -it cash-chan-imp-postgres-1 bash
psql -U anything -d anything
\dt
docker logs cash-chan-imp-cash-chan-1