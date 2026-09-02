---
title: publish agent-journal: a fresh public repo, README with install, one-line install, update notification with changelog
track: session-scoped runtime
at: 2026-09-02T08:38:58+00:00
session: a926a873-bbe7-43a7-baba-958131aff937.jsonl
line: 1156
started: 2026-09-02T08:39:51+00:00
done: 2026-09-02T09:05:48+00:00
how: closed with the work of the same name
asks: 
answer: 
doc: 
---

The user's words: rename the repository to agent-journal; or better, create a new
repository, remove the online one, drop the current git history and start fresh so no
old commits or previous attempts leak. The README must give a brief and quick intro of
what the tool is, installation instructions, and one command that pulls the files and
runs the install script. Add an update notification: when agents update via a journal
command they get the latest version plus a brief on what changed, what is possible now,
and any instructions that follow (a changelog). Make it public for colleagues. Make sure
no sensitive data is in the repo or the history (record.json, runtime, settings, the
project's own to-dos and docs are this project's, not the package's).

Plan: a versioned package (VERSION + CHANGELOG.md in .journal/), `journal upgrade` pulls
from the public repo (git clone into a temp dir, install --from), the SessionStart block
carries a one-line "update available: vX — <headline>" when the remote version is newer
(checked at most once a day, cached in runtime), and after upgrading the changelog entry
is printed and injected once. Then: a new empty GitHub repo jessegall/agent-journal,
the package exported without this project's data, one initial commit, pushed, public;
delete the old orchestrator remote only after the user confirms.
