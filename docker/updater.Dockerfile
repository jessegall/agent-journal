FROM gcr.io/projectsigstore/cosign:v2.4.1@sha256:b03690aa52bfe94054187142fba24dc54137650682810633901767d8a3e15b31 AS cosign

FROM docker:27.3.1-cli@sha256:328eb399a065780c2cebe9224de003aa14084cf69efae882ac27430f921819b7
COPY --from=cosign /ko-app/cosign /usr/local/bin/cosign
COPY --chmod=755 docker/update.sh /usr/local/bin/update.sh
ENTRYPOINT ["update.sh"]
