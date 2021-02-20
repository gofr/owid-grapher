# Using this for no other reason than that the Docker tutorial uses this one.
FROM node:12-alpine

# The node docker image is based on Alpine v3.11, and 2.24.3-r0 is the current
# git package version. Install that or better.
# https://pkgs.alpinelinux.org/packages?name=git&branch=v3.11
RUN apk add "git>2.24.3" && apk upgrade
