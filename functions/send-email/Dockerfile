FROM golang:1.17-alpine

WORKDIR /go/src/handler
COPY . .

RUN go mod tidy && \
    go build -ldflags="-s -w" -o handler \
    chmod +x handler


CMD ["./handler"]
