FROM debian:12-slim AS security-patch
RUN apt-get update && apt-get upgrade -y libssl3 && rm -rf /var/lib/apt/lists/*

FROM gcr.io/distroless/nodejs24-debian12

COPY --from=security-patch /usr/lib/x86_64-linux-gnu/libssl.so.3 /usr/lib/x86_64-linux-gnu/libssl.so.3
COPY --from=security-patch /usr/lib/x86_64-linux-gnu/libcrypto.so.3 /usr/lib/x86_64-linux-gnu/libcrypto.so.3

WORKDIR /usr/src/app

COPY ./dist ./dist
COPY ./node_modules ./node_modules

ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["./dist/server/entry.mjs"]

EXPOSE $PORT
