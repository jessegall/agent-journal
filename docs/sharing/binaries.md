# The share service's gateway programs

The `share` build target of `.docker/app/Dockerfile` adds two programs to the application image, both pinned at
build time and never downloaded at runtime. They are installed at `/opt/sharing/bin/tunler` and
`/opt/sharing/bin/ngrok`, the paths `config/sharing.php` reads.

## Tunler

| What | Value |
| --- | --- |
| Version | `v0.2.2` |
| Commit | `7ddb5d59947f27b06a1801c17af5a62adadd043a` |
| Source archive | `https://codeload.github.com/jessegall/tunler/tar.gz/7ddb5d59947f27b06a1801c17af5a62adadd043a` |
| sha256 of that archive | `644d40a7fd90afdd14bd51f60b3e1862e1edcf5d32d6272fc7d32c44dcb0c0bb` |
| Built with | `golang:1.26.4-bookworm` (the repository's `go.mod` asks for go 1.26.4), `CGO_ENABLED=0 go build ./cmd/tunler` |

How it was checked: the tag `v0.2.2` was read from the GitHub API (`/repos/jessegall/tunler/tags`), which names the
commit above; the archive of that commit was downloaded and its sha256 computed on 2026-11-18. The build refuses an
archive with another sum. Go module downloads during the build are checked by the repository's own `go.sum`.

Not verified: GitHub does not promise that a generated source archive stays byte-for-byte the same; if GitHub ever
regenerates it, the build fails on the checksum rather than building other source, and the sum must be checked again.
The Tunler release binaries were not used.

## ngrok

| Architecture | Archive | sha256 |
| --- | --- | --- |
| amd64 | `https://bin.equinox.io/a/h2cqbjsNLj7/ngrok-v3-3.39.13-linux-amd64.tar.gz` | `233e0647849913e6404150c1e9c5e4f31c1368aefee330958d038d7afecb8f2e` |
| arm64 | `https://bin.equinox.io/a/j83dYTwHiq9/ngrok-v3-3.39.13-linux-arm64.tar.gz` | `fb41ee8f251969f6e399ef03122f791ae537155dfd9ac4c0baf108aca95c17d7` |

Version `3.39.13`, the newest stable release listed on ngrok's official archive page
(`https://dl.equinox.io/ngrok/ngrok-v3/stable/archive`) on 2026-11-18. Both archives were downloaded and their sha256
computed that day; each contains the single file `ngrok`. Other architectures refuse to build.

Not verified: ngrok publishes no checksum beside these archives, so the sums above are what was downloaded on that
day, not a vendor-signed value. The build still refuses any archive that differs from what was checked.

## Not done in this change

- `docker compose build share` and running the image were not run by the worker that wrote this; the build is part of
  the phase-end checks. The binaries' `version` output inside the image is therefore not yet confirmed.
- No user home folder and no personal Tunler or ngrok settings are mounted: the service keeps its configuration and
  credential store on the private `sharing-data` volume at `/app/storage/sharing`.
