# The shared journal

A journal can be shared with a team. Everyone keeps their own journal on their own machine, and a team server
keeps them in step: a task one person files appears in everyone's journal, a message posted in one chat reaches
every copy of it, and each person's writes carry their own name.

## Hosting the team server

The team server is one Docker container. On a machine with Docker, run:

    curl -fsSL https://github.com/jessegall/agent-journal/releases/latest/download/install.sh | sh

It asks for the project's name, the admin's name and email, a password (twice) and the address the team reaches
the server at. A domain gets an HTTPS certificate of its own; a bare IP address gets the server's own
certificate, whose fingerprint the join line carries. Everything the server keeps lives in one Docker volume.
At the end it prints the line the admin joins with.

Opening the server's address in a browser shows the team's journal: sign in with your team account and you work in it as yourself, every write named as yours. No agent runs there; agents run on each person's own journal, and the hosted journal always runs the team's version.

Back up a running server with `docker exec agent-journal-<project> python -m sync_server backup --data /data/team`.

## Joining

Join from a clone of the project's repository: a journal belongs to one repository, and a checkout of another
is refused. Run the line the setup or an invitation printed, in a terminal of your own, since it asks your
password:

    journal team join <address> --code <code>

The first journal to join becomes the team's: its rows and files are uploaded, and an environment named team is
made, the Team chat. Every journal after it downloads the team's copy; what it held before is kept in a backup
file beside it. A journal must run the team's version to join; if it does not, the refusal prints the line that
installs it.

The admin invites a person with `journal team invite <email>`, which prints their join line. `journal team
status` says how the sync stands, `journal team devices` lists the team's devices, and `journal team revoke <n>`
shuts a device out.

## Your environments and your colleagues'

Every environment has an owner. Yours carry your prefix, so names never clash, and run your agents in a git
worktree of their own. You can open a colleague's environment and watch their chat live, but you cannot start an
agent there or change anything in it: what you write there is a comment, and their agent is told it is a
colleague's words, not its user's, so a request in it waits for its user's agreement.

Beside every chat there is a side thread where people talk to each other and no agent reads.

## The Team chat

The Team chat is everyone's. Anyone types in it, and each message is named. One person claims it with `journal
team claim`, and their machine runs its agent, which hears everyone and answers for all. Its file changes are
committed to the branch journal/team-chat and pushed, and every other machine's copy of the Team chat's worktree
follows that branch while it has no changes of its own.

`journal team release` lets it go: the agent stops, its files are committed and pushed first, and anyone may
claim it. If the holder goes offline for a minute and a half, anyone may claim it over them; whatever they had not
pushed stays on their machine. The new agent starts from the chat's latest messages.

## What is shared and what is not

Tasks, plans, messages, documents, reports, rules, facts, reminders, questions, checks, sequences, templates,
triggers, the team's settings and the people are shared. A command's output, the hook log, secrets, plugins,
phones and the agents themselves stay on your machine; a command's card in a chat is shared, but its output is
not. A worker's row is shared, but the worker runs on the machine that started it. A file attached to a message or
a dump opens on every machine.

When two people change the same field of the same row, the later change wins and the other person sees a card
saying whose edit was kept.

## Upgrading

The team runs one version of the journal, which the admin moves:

    journal team upgrade 4.21.0

Every member's status bar then asks for that version, and `journal update apply` installs it (and no newer one).
Until a journal runs the team's version it does not sync; its changes wait on the machine and are sent once it
does. The first journal to upgrade migrates the team's rows for everyone, and the server keeps a backup of the
copy it replaced. The admin can let journals on other versions sync with `journal team versions any`, and require
the match again with `journal team versions exact`.

The team server's image is upgraded on its own, by running the install line again on the server.
