# The journal on a server, simple

One container: the journal with its agents, and Caddy in front of it asking for a username and password. Caddy
serves https with its own certificate when you give it a domain.

## Install

On the server, with Docker and the compose plugin:

```sh
git clone -b hosted-v4 https://github.com/jessegall/agent-journal && cd agent-journal/docker/simple
cp .env.example .env && chmod 600 .env    # fill in the login, the domain, the repository and Claude's login
docker compose up -d --build
docker compose logs -f
```

Open `https://<your domain>` (or `http://<server>` without a domain) and log in with `JOURNAL_USER` and
`JOURNAL_PASSWORD`.

## Claude Code's login

Run `claude setup-token` on your own machine. It opens the browser once and prints a token that uses your
subscription for about a year. Put it in `.env` as `CLAUDE_CODE_OAUTH_TOKEN`. An `ANTHROPIC_API_KEY` works as
well, paid per use.

## Day to day

- Change the password: edit `.env`, then `docker compose up -d`.
- Update the journal: `git pull && docker compose up -d --build`.
- Everything the journal keeps (the project, its record, Claude's settings, Caddy's certificates) is in the
  `journal-data` volume; `docker compose down` keeps it, `docker compose down -v` removes it.

## What the login protects, and what it does not

Caddy's login keeps everyone without the password out. Behind it, the agents run as the user `journal` and can
read the variables of `.env` they need: the GitHub token and Claude's login. Give the GitHub token access to this
one repository only.
