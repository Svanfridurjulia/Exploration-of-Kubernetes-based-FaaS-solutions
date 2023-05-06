FROM openfaas/of-watchdog:0.8.0 as watchdog

RUN mkdir -p /home/app

COPY --from=watchdog /fwatchdog /usr/bin/fwatchdog
RUN chmod +x /usr/bin/fwatchdog

# Add non root user
RUN addgroup --system app && adduser app --system --ingroup app
RUN chown app /home/app

USER app
ENV PATH=$PATH:/home/app/.local/bin

USER root
WORKDIR /home/app/
RUN chown -R app:app *
USER app

ENV fprocess="python app.py"


CMD ["fwatchdog"]



