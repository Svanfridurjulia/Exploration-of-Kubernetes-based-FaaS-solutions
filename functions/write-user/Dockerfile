FROM python:3.9-slim

WORKDIR /app

RUN apt-get update && apt-get install -y wget

COPY handler.py .

COPY requirements.txt .

RUN wget https://github.com/openfaas/faas/releases/download/0.13.4/fwatchdog -O /usr/bin/fwatchdog \
    && chmod +x /usr/bin/fwatchdog \
    && pip install --no-cache-dir -r requirements.txt

ENV PATH=$PATH:/usr/bin

CMD ["fwatchdog"]
