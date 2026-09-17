# Connections

A connection is a service this project can reach — Sentry, a GitHub organisation, an internal API — kept by name, so a session knows it exists and how to authenticate without anyone pasting a token into a message.

## The secret is never here

A connection keeps the **name of an environment variable**, never the token in it. The journal is read back verbatim into every session and every subagent, so a secret written here is a secret that has leaked. A value with the shape of a token is refused where it is typed.

This page shows the variable's name and whether the server has it set. It never shows what is in it, and neither does anything else in the journal.

## The project keeps the list; an environment may disagree

The list belongs to the project. An environment can change one field of one connection — a different URL for staging, a different variable for a second account — and that is recorded as a change to that field alone, never as a second copy of the connection. So nothing exists only on one environment, and what it changed is always readable beside what it changed it from.

What you see on this page is **this environment's** reading: the project's list with this environment's changes applied, each one marked.

## What you can do

- Read what the project can reach, what each connection is for, and whether its token is set.
- See which fields this environment has changed, and what the project's own values are.

Connections are written from the terminal, where whoever types a variable name can see which shell they are in:

    journal connections add <name> "<what it is for>" --url= --secret=<ENV_VAR>
    journal connections set  <name> purpose|kind|url|secret "<value>"
    journal connections here <name> purpose|kind|url|secret "<value>"
    journal connections remove <name> "<why>"
