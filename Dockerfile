FROM ghcr.io/porla/build-env:202210272121 AS build-env
WORKDIR /src
COPY . .
ARG GITVERSION_SEMVER="0.0.0"
ENV VCPKG_FORCE_SYSTEM_BINARIES="1"
RUN cd build && GIVERSION_SEMVER=$GITVERSION_SEMVER ninja porla && strip porla

# -- runtime layer
FROM alpine:3.16.2 AS runtime
WORKDIR /
COPY --from=build-env /src/build/porla /usr/bin/porla
ENTRYPOINT [ "/usr/bin/porla" ]
