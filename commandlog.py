from __future__ import annotations

import re
from functools import lru_cache
from datetime import datetime, timezone
from pathlib import Path

import state
from templates import render

KEY = "activity"
SHOW, KEEP = "activity_show", "activity_keep"
DEFAULTS = {SHOW: 50, KEEP: 250}

MESSAGES = {
    "set_usage": "{key} wants a whole number of at least 1",
    "set_show": "{env}: Activity shows the last {n} line(s)",
    "set_keep": "{env}: the activity log keeps the last {n} line(s)",
    "dispatched": "Dispatched a subagent",
    "mcp_used": "Used {server}",
    "ran_long": "Ran {what}",
    "mcp_calls": "{n} calls",
    "committed": "Committed",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


def setting(root: Path, track: str, key: str) -> int:
    got = state.get(root, key, {})
    value = got.get(track) if isinstance(got, dict) else None
    return DEFAULTS[key] if value is None else int(value)


def set_setting(root: Path, track: str, key: str, value) -> tuple[bool, str]:
    if value is None or int(value) < 1:
        return False, say("set_usage", key=key)
    with state.locked(root):
        got = state.get(root, key, {})
        got = got if isinstance(got, dict) else {}
        got[track] = int(value)
        state.put(root, key, got)
    return True, say("set_show" if key == SHOW else "set_keep", env=track, n=int(value))
SKIP = {"statusline", "serve", "claude", "codex", "migrate", "version"}
# noun -> the kind of resource a line is about, so Activity can open it
KINDS = {"todos": "todo", "messages": "message", "questions": "question", "reports": "report", "plans": "plan",
         "suggestions": "suggestion", "docs": "doc", "pins": "pin", "rules": "rule", "comments": "comment",
         "reminders": "reminder", "work": "work"}
# writes that Activity already shows from the stores they change
SHOWN = {"todos:add", "todos:done", "work:start", "work:update", "work:end", "start:", "end:", "questions:add", "messages:done"}
# commands whose number argument is not called n
NUMBER_ARG = {"docs:files": "doc", "docs:part": "doc", "docs:final": "doc", "docs:draft": "doc", "docs:abstract": "doc",
              "docs:title": "doc", "docs:paths": "doc", "docs:archive": "doc", "docs:move": "doc", "docs:attach": "doc",
              "docs:detach": "doc", "rules:strike": "id", "rules:inject": "id", "rules:uninject": "id"}
# the argument whose value Activity shows after the number, like "high" for a priority
DETAIL = {"todos:priority": "value", "reports:keep": "days", "todos:keep": "days", "switch:": "name", "environments:switch": "name", "work:await": "what", "work:park": "why",
          "environments:": "name", "environments:show": "name", "environments:remove": "name",
          "environments:prepare": "name", "environments:claim": "name", "prepare:": "name", "claim:": "name",
          "grant:": "name", "tools:run": "name", "tools:show": "name", "tools:add": "name", "tools:set": "name",
          "tools:remove": "name", "connections:show": "name", "connections:add": "name",
          "connections:set": "name", "connections:here": "name", "connections:remove": "name",
          "style:show": "subject", "style:add": "subject", "style:set": "subject",
          "style:remove": "subject"}
# run by git hooks, not by the agent
HOOKS = {"todos:from-commit"}
# lines that introduce something, so Activity shows its title under them; reads and closes do not repeat it
TITLED = {"questions:add", "reports:add", "plans:add", "docs:add", "suggestions:add", "suggest:", "pins:add", "rules:add",
          "reminders:add", "notifications:add", "notices:add", "comments:add"}

# noun:verb -> the line shown in Activity; "noun:" is a command with no verb; {n} is its number argument
DESCRIBE = {
    "status:": "Checking where things stand",
    "carry:": "Reading the whole journal",
    "open:": "Checking open work",
    "next:": "Picking the next to-do",
    "search:": "Searching the transcript",
    "conversation:": "Reading back the conversation",
    "user:": "Reading your earlier messages",
    "cleanup:": "Looking for stale rules and pins",
    "todos:list": "Reading the to-do list",
    "todos:show": "Reading to-do {n}",
    "todos:add": "Writing a to-do",
    "todos:start": "Starting to-do {n}",
    "todos:done": "Closing to-do {n}",
    "todos:drop": "Dropping to-do {n}",
    "todos:amend": "Adding a section to the brief of to-do {n}",
    "todos:replace": "Rewriting the brief of to-do {n}",
    "todos:ask": "Asking you about to-do {n}",
    "todos:block": "Marking to-do {n} blocked",
    "todos:move": "Moving to-do {n}",
    "messages:list": "Reading messages",
    "messages:waiting": "Checking for new messages",
    "messages:show": "Reading message {n}",
    "messages:process": "Filing message {n}",
    "messages:declare": "Saying what message {n} is",
    "messages:done": "Marking message {n} processed",
    "messages:reply": "Replying to message {n}",
    "questions:list": "Reading questions",
    "questions:show": "Reading question {n}",
    "questions:add": "Asking you a question",
    "questions:edit": "Editing question {n}",
    "questions:withdraw": "Withdrawing question {n}",
    "work:start": "Starting work",
    "work:update": "Noting progress",
    "work:await": "Waiting on",
    "work:park": "Parking work",
    "work:end": "Ending work",
    "pins:list": "Reading pins",
    "pins:show": "Reading pin {n}",
    "pins:add": "Pinning a fact",
    "pins:strike": "Striking pin {n}",
    "rules:list": "Reading rules",
    "rules:show": "Reading rule {n}",
    "rules:add": "Writing a rule",
    "docs:list": "Reading the documents list",
    "docs:show": "Reading document {n}",
    "docs:add": "Writing a document",
    "docs:search": "Searching the documents",
    "reports:list": "Reading reports",
    "reports:show": "Reading report {n}",
    "reports:add": "Writing a report",
    "suggestions:list": "Reading suggestions",
    "suggestions:show": "Reading suggestion {n}",
    "suggestions:add": "Suggesting a change",
    "comments:list": "Reading comments",
    "comments:show": "Reading comment {n}",
    "comments:done": "Closing comment {n}",
    "reminders:list": "Reading reminders",
    "reminders:add": "Writing a reminder",
    "notifications:add": "Sending you a notification",
    "notices:add": "Pinning a line to the chat",
    "codex:": "Starting Codex under the journal",
    "browser:": "Asking the page you are on",
    "browser:ask": "Asking the page you are on",
    "browser:list": "Reading what the page was asked",
    "browser:show": "Reading browser ask {n}",
    "react:": "Reacting to a message",
    "notice:": "Pinning a line to the chat",
    "upgrade:": "Upgrading the journal",
    "update:": "Updating the journal",
    "verify:": "Checking the journal install",
    "enable:": "Turning the journal on",
    "disable:": "Turning the journal off",
    "settings:": "Reading the settings",
    "nothing:": "Deciding nothing needs pinning",
    "notify:": "Sending you a notification",
    "suggest:": "Suggesting a change",
    "strike:": "Striking pin {n}",
    "promote:": "Promoting pin {n} to a rule",
    "assign:": "Assigning to-do {n}",
    "switch:": "Switching environment",
    "prepare:": "Preparing an environment",
    "claim:": "Taking over an environment",
    "grant:": "Lending an environment to subagents",
    "grants:": "Checking lent environments",
    "lent:": "Checking lent environments",
    "loop:": "Checking the loop",
    "loop:set": "Setting the loop",
    "loop:unset": "Stopping the loop",
    "worktree:": "Checking the worktree",
    "worktree:link": "Linking this worktree",
    "auto-mode:show": "Checking auto mode",
    "auto-mode:enable": "Turning auto mode on",
    "auto-mode:disable": "Turning auto mode off",
    "todos:reopen": "Reopening to-do {n}",
    "todos:answer": "Answering to-do {n}",
    "todos:unblock": "Unblocking to-do {n}",
    "todos:after": "Ordering to-do {n} after others",
    "todos:report": "Reporting to-do {n} finished",
    "todos:priority": "Setting to-do priority {n}",
    "todos:auto": "Changing auto mode",
    "todos:prune": "Clearing out old to-dos",
    "messages:add": "Writing a message",
    "messages:edit": "Rewording message {n}",
    "messages:file": "Filing an attachment from message {n}",
    "messages:detach": "Removing a file from message {n}",
    "messages:attach": "Adding files to message {n}",
    "messages:archive": "Archiving message {n}",
    "messages:move": "Moving message {n}",
    "questions:answer": "Answering question {n}",
    "questions:link": "Linking question {n}",
    "questions:unlink": "Unlinking question {n}",
    "comments:add": "Writing a comment",
    "notices:list": "Reading what is pinned to the chat",
    "reactions:list": "Reading the reactions",
    "notices:close": "Taking notice {n} down",
    "notifications:list": "Reading notifications",
    "notifications:read": "Marking notification {n} read",
    "pins:": "Reading pin {n}",
    "pins:promote": "Promoting pin {n} to a rule",
    "pins:move": "Moving pin {n}",
    "pins:amend": "Adding to pin {n}",
    "pins:replace": "Rewriting pin {n}",
    "rules:": "Reading rule {n}",
    "rules:strike": "Striking rule {n}",
    "rules:inject": "Adding rule {n} to CLAUDE.md",
    "rules:uninject": "Removing rule {n} from CLAUDE.md",
    "rules:move": "Moving a rule",
    "rules:amend": "Adding to rule {n}",
    "rules:replace": "Rewriting rule {n}",
    "reminders:done": "Retiring reminder {n}",
    "reminders:move": "Moving reminder {n}",
    "reports:archive": "Archiving report {n}",
    "reports:keep": "Setting how long reports stay listed",
    "todos:keep": "Setting how long done to-dos stay listed",
    "reports:doc": "Turning report {n} into a document",
    "plans:list": "Reading plans",
    "plans:show": "Reading plan {n}",
    "plans:add": "Drafting a plan",
    "plans:from-doc": "Drafting a plan from a document",
    "plans:phase": "Adding a phase to plan {n}",
    "plans:rephrase": "Correcting a phase of plan {n}",
    "plans:todos": "Putting to-dos in a phase of plan {n}",
    "plans:activate": "Activating plan {n}",
    "plans:acknowledge": "Acknowledging plan {n}",
    "plans:edit": "Edited a plan",
    "plans:park": "Parking plan {n}",
    "plans:ready": "Finished writing plan {n}",
    "plans:continue": "Continuing plan {n} past a checkpoint",
    "plans:auto": "Switching plan {n} auto mode",
    "plans:abandon": "Abandoning plan {n}",
    "plans:link": "Linking plan {n}",
    "suggestions:edit": "Rewording suggestion {n}",
    "suggestions:withdraw": "Withdrawing suggestion {n}",
    "suggestions:accept": "Accepting suggestion {n}",
    "suggestions:adjust": "Adjusting suggestion {n}",
    "suggestions:decline": "Declining suggestion {n}",
    "docs:": "Reading a document",
    "docs:files": "Reading document {n}'s files",
    "docs:part": "Adding a part to document {n}",
    "docs:replace": "Rewriting a document part",
    "docs:strike": "Striking a document part",
    "docs:final": "Marking document {n} final",
    "docs:draft": "Marking document {n} a draft",
    "docs:abstract": "Rewriting document {n}'s abstract",
    "docs:title": "Renaming document {n}",
    "docs:paths": "Reading document {n}'s paths",
    "docs:archive": "Archiving document {n}",
    "docs:move": "Moving document {n}",
    "docs:supersede": "Replacing a document with a newer one",
    "docs:attach": "Attaching a file to document {n}",
    "docs:detach": "Removing a file from document {n}",
    "docs:index": "Rebuilding the documents index",
    "environments:": "Reading an environment",
    "environments:list": "Reading the environments",
    "environments:show": "Reading an environment",
    "environments:remove": "Removing an environment",
    "environments:switch": "Switching environment",
    "environments:claim": "Taking over an environment",
    "environments:prepare": "Preparing an environment",
    "tools:list": "Reading the tools",
    "tools:show": "Reading a tool",
    "tools:add": "Adding a tool",
    "tools:set": "Changing a tool",
    "tools:remove": "Retiring a tool",
    "tools:index": "Rebuilding the tools index",
    "connections:list": "Reading the connections",
    "connections:show": "Reading a connection",
    "connections:add": "Keeping a connection",
    "connections:set": "Changing a connection",
    "connections:here": "Changing a connection on this environment",
    "connections:remove": "Dropping a connection",
    "style:list": "Reading the coding style",
    "style:show": "Reading a coding style rule",
    "style:add": "Adding a coding style rule",
    "style:set": "Changing a coding style rule",
    "style:remove": "Retiring a coding style rule",
    "style:sync": "Generating the coding style skills",
    "tools:run": "Running a tool",
    "todos:search": "Searching the to-dos",
    "messages:search": "Searching your messages",
    "questions:search": "Searching questions",
    "reports:search": "Searching reports",
    "suggestions:search": "Searching suggestions",
    "reminders:search": "Searching reminders",
    "pins:search": "Searching pins",
    "rules:search": "Searching rules",
    "work:search": "Searching work",
    "comments:search": "Searching comments",
}


# wording that changed: lines already logged read the new wording
RENAMED = {"Reading your messages": "Reading messages", "Reading waiting messages": "Checking for new messages"}


def describe(noun: str, verb: str) -> str:
    """The line's wording. The number is not part of it: Activity shows it on its own."""
    text = DESCRIBE.get(f"{noun}:{verb}") or DESCRIBE.get(f"{noun}:")
    if not text:
        return f"Running journal {noun} {verb}".strip()
    return text.replace(" {n}", "")


# viewer actions that only read
READS = {"index", "show", "files", "paths", "search", "waiting", "pending"}
# viewer writes that Activity already shows from the stores they change
# viewer bookkeeping, not something the user did: opening a question marks it seen and writes no Activity line
WEB_QUIET = {"questions:seen", "reports:seen"}
WEB_SHOWN = {"todos:store", "todos:done", "messages:store", "questions:answer", "comments:store", "work:store",
             "work:note", "work:end"}
WEB_KINDS = {**KINDS, "messages": "message", "notifications": None}
# the field a viewer write carries that Activity shows after the number
WEB_DETAIL = {"todos:update": "priority", "todos:priority": "value", "reports:keep": "days", "work:wait": "what"}
# a write whose body changes only this field reads as this line instead
WEB_FIELD = {"todos:update": ("priority", "Changed to-do priority")}

# resource:action -> the line shown in Activity for a write made in the viewer; {n} is the id in the path
WEB = {
    "journal:settings": "Changed the journal's settings",
    "messages:declare": "Said what message {n} is",
    "plans:update": "Edited plan {n}",
    "style:store": "Added a coding style rule",
    "style:update": "Changed coding style rule {n}",
    "style:destroy": "Retired coding style rule {n}",
    "style:sync": "Generated the coding style skills",
    "todos:update": "Edited to-do {n}",
    "todos:destroy": "Removed to-do {n}",
    "todos:reopen": "Reopened to-do {n}",
    "todos:start": "Started to-do {n}",
    "todos:move": "Moved to-do {n}",
    "todos:ask": "Asked about to-do {n}",
    "todos:answer": "Answered to-do {n}",
    "todos:block": "Marked to-do {n} blocked",
    "todos:unblock": "Unblocked to-do {n}",
    "todos:after": "Ordered to-do {n} after others",
    "todos:report": "Reported to-do {n} finished",
    "todos:priority": "Changed to-do priority {n}",
    "todos:amend": "Added a section to the brief of to-do {n}",
    "todos:replace": "Rewrote the brief of to-do {n}",
    "todos:prune": "Cleared out old to-dos",
    "todos:commit": "Closed to-dos from a commit",
    "docs:store": "Wrote a document",
    "docs:update": "Edited document {n}",
    "docs:destroy": "Removed document {n}",
    "docs:part": "Added a part to document {n}",
    "docs:final": "Marked document {n} final",
    "docs:draft": "Marked document {n} a draft",
    "docs:move": "Moved document {n}",
    "docs:supersede": "Replaced document {n}",
    "docs:attach": "Attached a file to document {n}",
    "docs:detach": "Removed a file from document {n}",
    "docs:adopt": "Added an existing document",
    "docs:archive": "Archived document {n}",
    "environment:settings": "Changed the settings",
    "journal:auto": "Changed auto mode",
    "environment:make": "Made an environment",
    "environment:remove": "Removed an environment",
    "environment:assign": "Assigned an agent to this environment",
    "browser:store": "Asked the page: {op}",
    "browser:result": "The page answered browser ask {n}",
    "browser:driver": "Driving switched",
    "messages:update": "Edited message {n}",
    "messages:process": "Filed message {n}",
    "messages:file": "Filed an attachment from message {n}",
    "messages:detach": "Removed a file from message {n}",
    "messages:attach": "Added files to message {n}",
    "messages:done": "Marked message {n} processed",
    "messages:move": "Moved message {n}",
    "messages:destroy": "Removed message {n}",
    "messages:reply": "Replied to message {n}",
    "notices:store": "Pinned a line to the chat",
    "reactions:store": "Reacted to a turn",
    "notices:close": "Closed notice {n}",
    "notifications:store": "Sent a notification",
    "notifications:read": "Marked notification {n} read",
    "notifications:readall": "Marked all notifications read",
    "pins:store": "Pinned a fact",
    "pins:update": "Edited pin {n}",
    "pins:destroy": "Struck pin {n}",
    "pins:amend": "Added to pin {n}",
    "pins:move": "Moved pin {n}",
    "pins:promote": "Promoted pin {n} to a rule",
    "rules:store": "Wrote a rule",
    "rules:update": "Edited rule {n}",
    "rules:destroy": "Struck rule {n}",
    "rules:amend": "Added to rule {n}",
    "rules:inject": "Added rule {n} to CLAUDE.md",
    "rules:uninject": "Removed rule {n} from CLAUDE.md",
    "questions:store": "Asked a question",
    "questions:update": "Edited question {n}",
    "questions:destroy": "Withdrew question {n}",
    "questions:link": "Linked question {n}",
    "questions:unlink": "Unlinked question {n}",
    "reminders:store": "Wrote a reminder",
    "reminders:update": "Edited reminder {n}",
    "reminders:destroy": "Retired reminder {n}",
    "reminders:move": "Moved reminder {n}",
    "reports:store": "Wrote a report",
    "reports:destroy": "Archived report {n}",
    "reports:keep": "Set how long reports stay listed",
    "todos:keep": "Set how long done to-dos stay listed",
    "reports:todoc": "Turned report {n} into a document",
    "plans:store": "Drafted a plan",
    "plans:fromdoc": "Drafted a plan from a document",
    "plans:phase": "Added a phase to plan {n}",
    "plans:rephrase": "Corrected a phase of plan {n}",
    "plans:todos": "Changed the to-dos of plan {n}",
    "plans:activate": "Approved plan {n}",
    "plans:acknowledge": "Acknowledged plan {n}",
    "plans:park": "Parked plan {n}",
    "plans:ready": "Plan {n} is ready to approve",
    "plans:proceed": "Continued plan {n} past a checkpoint",
    "plans:auto": "Switched plan {n} auto mode",
    "plans:destroy": "Abandoned plan {n}",
    "plans:link": "Linked plan {n}",
    "suggestions:store": "Suggested a change",
    "suggestions:update": "Edited suggestion {n}",
    "suggestions:accept": "Accepted suggestion {n}",
    "suggestions:adjust": "Adjusted suggestion {n}",
    "suggestions:decline": "Declined suggestion {n}",
    "suggestions:destroy": "Withdrew suggestion {n}",
    "tools:store": "Added a tool",
    "tools:update": "Changed a tool",
    "tools:destroy": "Retired a tool",
    "tools:adopt": "Added an existing tool",
    "work:update": "Edited work {n}",
    "work:destroy": "Removed work {n}",
    "work:wait": "Waiting on",
    "work:park": "Parked work {n}",
    "comments:done": "Closed comment {n}",
}


def _detail(value) -> str:
    value = " ".join(map(str, value)) if isinstance(value, (list, tuple)) else value
    return " ".join(str(value).split())[:40] if value not in (None, "") else ""


def _settings_said(key: str, body: dict) -> str:
    """What a settings change from the viewer changed, in words: "Turned auto mode on", "Activity shows the last 80 lines"."""
    def on(value) -> bool:
        return str(value).lower() in ("true", "1", "yes", "on", "enable")
    said = []
    if key == "journal:auto" and body.get("state") not in (None, ""):
        said.append("Turned auto mode on" if on(body["state"]) else "Turned auto mode off")
    if key == "journal:settings" and "auto" in body:
        said.append("Turned auto mode on for the journal" if on(body["auto"]) else "Turned auto mode off for the journal")
    if key == "environment:settings":
        if "reports_archive_days" in body:
            days = str(body["reports_archive_days"])
            said.append("Reports stay listed until archived by hand" if days in ("0", "") else f"Reports stay listed for {days} day(s)")
        if "todos_archive_days" in body:
            days = str(body["todos_archive_days"])
            said.append("Done to-dos stay listed until archived by hand" if days in ("0", "") else f"Done to-dos stay listed for {days} day(s)")
        if SHOW in body:
            said.append(f"Activity shows the last {body[SHOW]} line(s)")
        if KEEP in body:
            said.append(f"The activity log keeps the last {body[KEEP]} line(s)")
    return " · ".join(said)


def record_web(root: Path, track: str, resource: str, action: str, ident: str | None, body: dict, at: str) -> None:
    """A write made in the viewer, as a line by the user."""
    key = f"{resource}:{action}"
    if action in READS or key in WEB_SHOWN or key not in WEB:
        return
    text = WEB[key].replace(" {n}", "")
    field = WEB_FIELD.get(key)
    if field and set(body or {}) == {field[0]}:
        text = field[1]
    n = str(ident or "").split(".")[0]
    detail = _detail((body or {}).get(WEB_DETAIL.get(key, "")))
    # a settings change names what changed, not only that something did
    if said := _settings_said(key, body or {}):
        text, detail = said, ""
    _append(root, track, {"at": at, "text": text, "kind": WEB_KINDS.get(resource), "n": int(n) if n.isdigit() else None,
                          "titled": False, "detail": detail, "by": "You"})


def record(root: Path, track: str, parsed, at: str) -> None:
    noun, verb = parsed.command.noun, parsed.command.verb
    if noun in SKIP or f"{noun}:{verb}" in SHOWN or f"{noun}:{verb}" in HOOKS:
        return
    key = f"{noun}:{verb}"
    n = parsed.arg(NUMBER_ARG.get(key, "n"))
    entry = {"at": at, "text": describe(noun, verb), "kind": KINDS.get(noun),
             "n": int(n) if str(n).isdigit() else None, "titled": key in TITLED,
             "detail": _detail(parsed.arg(DETAIL[key])) if key in DETAIL else ""}
    _append(root, track, entry)


QUEUE = "tool_queue"
QUEUE_AT = "tool_queue_at"
QUEUE_ENV = "tool_queue_env"
#: SOONER RATHER THAN TIDIER. Ten tool uses is a long time to watch a column say nothing, and the
#: line it eventually writes is no more useful for having waited: three is enough to be a batch.
QUEUE_SIZE = 3
#: and a quiet stretch flushes what is queued, so a pause never leaves one or two uses unsaid
QUIET_SECONDS = 20
# tool name -> the bucket a summed line counts it in
BUCKETS = {"Bash": "ran", "Edit": "edited", "Write": "edited", "MultiEdit": "edited", "NotebookEdit": "edited",
           "Read": "read", "Grep": "searched", "Glob": "searched"}
# bucket -> (one, many) wording, in the order the line names them
WORDING = {"ran": ("ran 1 command", "ran {n} commands"), "edited": ("edited 1 file", "edited {n} files"),
           "read": ("read 1 file", "read {n} files"), "searched": ("searched 1 time", "searched {n} times"),
           "other": ("used 1 tool", "used {n} tools")}


def tools_text(counts: dict) -> str:
    """"Ran 4 commands, edited 3 files, read 2 files": the queued tool uses as one line."""
    parts = [(one if counts[b] == 1 else many.replace("{n}", str(counts[b])))
             for b, (one, many) in WORDING.items() if counts.get(b)]
    text = ", ".join(parts)
    return text[:1].upper() + text[1:]


def queue_tool(root: Path, track: str, stem: str, tool: str, at: str) -> None:
    """Count one tool use the agent made outside the journal; ten of them become one Activity line."""
    counts = state.get(root, QUEUE, None, stem=stem) or {}
    bucket = BUCKETS.get(tool, "other")
    counts[bucket] = counts.get(bucket, 0) + 1
    state.put_many(root, {QUEUE: counts, QUEUE_AT: at, QUEUE_ENV: track}, stem=stem)
    if sum(counts.values()) >= QUEUE_SIZE:
        flush_tools(root, track, stem, at)


def flush_tools(root: Path, track: str, stem: str, at: str) -> None:
    """Write whatever tool uses are queued as one Activity line, and empty the queue."""
    counts = state.get(root, QUEUE, None, stem=stem) or {}
    if not sum(counts.values()):
        return
    state.put(root, QUEUE, {}, stem=stem)
    _append(root, track, {"at": at, "text": tools_text(counts), "kind": None, "n": None, "titled": False,
                          "detail": "", "by": "Agent"})


def flush_stale(root: Path, env: str, now: datetime | None = None) -> None:
    """Write the queued tool uses of every session on this environment that has used no tool for a minute."""
    now = now or datetime.now(timezone.utc)
    for stem, marks in state.runtime_files(root):
        if marks.get(QUEUE_ENV) != env or not sum((marks.get(QUEUE) or {}).values()):
            continue
        try:
            last = datetime.fromisoformat(str(marks.get(QUEUE_AT)).replace("Z", "+00:00"))
        except ValueError:
            continue
        last = last if last.tzinfo else last.replace(tzinfo=timezone.utc)
        if (now - last).total_seconds() >= QUIET_SECONDS:
            flush_tools(root, env, stem, marks[QUEUE_AT])


#: an MCP tool arrives as `mcp__<server>__<tool>`: the server is what the reader recognises
MCP_PREFIX = "mcp__"


def mcp_parts(name: str) -> tuple[str, str]:
    """(server, tool) for an MCP tool call, or ("", "") for anything else."""
    if not str(name or "").startswith(MCP_PREFIX):
        return "", ""
    server, _, tool = str(name)[len(MCP_PREFIX):].partition("__")
    return server, tool or server


def mcp_label(server: str) -> str:
    """`playwright` reads as Playwright; `claude_ai_Gmail` as Claude ai Gmail."""
    words = str(server or "").replace("-", " ").replace("_", " ").split()
    return " ".join([w[:1].upper() + w[1:] for w in words[:1]] + words[1:]) or server


def record_mcp(root: Path, track: str, stem: str, name: str, at: str) -> None:
    """An MCP tool call: its own Activity line, naming the server, holding every call made through it.

    NOT BUNCHED INTO "used 3 tools". A call through an MCP server is a different kind of act from a
    shell command — the user asked to see which server was used and what was done with it — so it gets
    a line of its own, and the calls that follow it are appended to that same line rather than piling
    up new ones. A line in between ends the run: the next call starts a new line, in its real place.
    """
    server, tool = mcp_parts(name)
    if not server:
        return
    flush_tools(root, track, stem, at)
    with state.locked(root):
        items = state.tracked(root, KEY, track, [])
        items = items if isinstance(items, list) else []
        last = items[-1] if items else None
        if isinstance(last, dict) and last.get("kind") == "mcp" and last.get("server") == server:
            calls = list(last.get("calls") or []) + [tool]
            items[-1] = {**last, "calls": calls, "at": at, "detail": say("mcp_calls", n=len(calls)) if len(calls) > 1 else ""}
        else:
            items = items + [{"at": at, "text": say("mcp_used", server=mcp_label(server)), "kind": "mcp", "n": None,
                              "titled": False, "detail": "", "server": server, "calls": [tool], "by": "Agent"}]
        state.put_tracked(root, KEY, track, items[-setting(root, track, KEEP):])


#: a command that has run this long is worth a line of its own rather than a tally mark
LONG_SECONDS = 30


def record_long(root: Path, track: str, stem: str, what: str, took: float, at: str) -> None:
    """A shell command that took a long time: its own Activity line, with what it was and how long.

    A TALLY MARK SAYS NOTHING ABOUT WAITING. "Ran 3 commands" is the same line whether they took a
    second or four minutes, and the four minutes is the part the user is looking at the screen for.
    """
    flush_tools(root, track, stem, at)
    _append(root, track, {"at": at, "text": say("ran_long", what=" ".join(str(what).split())[:80]),
                          "kind": "ran", "n": None, "detail": _span(took), "by": "Agent"})


def _span(seconds: float) -> str:
    seconds = int(seconds)
    return f"{seconds}s" if seconds < 60 else f"{seconds // 60}m {seconds % 60}s"


def record_commit(root: Path, track: str, stem: str, sha: str, subject: str, at: str) -> None:
    """The agent committed: its own line, with the short sha and the subject, after the tool uses before it."""
    flush_tools(root, track, stem, at)
    _append(root, track, {"at": at, "text": say("committed"), "kind": "commit", "n": None, "detail": sha[:7], "sha": sha,
                          "title": " ".join((subject or "").split()), "by": "Agent"})


def record_dispatch(root: Path, track: str, stem: str, description: str, at: str) -> None:
    """The agent handed work to a subagent: its own line, after whatever tool uses came before it."""
    flush_tools(root, track, stem, at)
    _append(root, track, {"at": at, "text": say("dispatched"), "n": None, "detail": " ".join((description or "").split()),
                          "by": "Agent"})


def _append(root: Path, track: str, entry: dict) -> None:
    with state.locked(root):
        items = state.tracked(root, KEY, track, [])
        items = (items if isinstance(items, list) else []) + [entry]
        state.put_tracked(root, KEY, track, items[-setting(root, track, KEEP):])


@lru_cache(maxsize=1)
def _patterns() -> tuple:
    out = []
    for key, text in DESCRIBE.items():
        kind = KINDS.get(key.split(":")[0])
        if kind:
            out.append((re.compile("^" + re.escape(text).replace(re.escape("{n}"), r"(\d+)") + "$"), kind,
                        text.replace(" {n}", "")))
    return tuple(out)


def kind_of(text: str) -> dict:
    """The resource a line names and its wording, read from its text: for lines logged before they recorded them."""
    for pattern, kind, wording in _patterns():
        got = pattern.match(text or "")
        if got:
            return {"kind": kind, "n": int(got.group(1)) if got.groups() else None, "text": wording}
    return {}


PRIORITY_LINES = {"Setting to-do priority", "Changed to-do priority"}


def _named_priority(e: dict) -> dict:
    """A priority line whose number is a named level shows the name."""
    detail = str(e.get("detail") or "")
    if e.get("text") not in PRIORITY_LINES or not detail.lstrip("-").isdigit():
        return e
    import todo
    names = {num: name for name, num in todo.PRIORITY_LEVELS.items()}
    return {**e, "detail": names.get(int(detail), detail)}


def entries(root: Path, track: str) -> list[dict]:
    return [_named_priority(e) if isinstance(e, dict) else e for e in _entries(root, track)]


def _entries(root: Path, track: str) -> list[dict]:
    got = state.tracked(root, KEY, track, [])
    items = got if isinstance(got, list) else []
    out = []
    for e in items:
        if isinstance(e, dict) and e.get("text") in RENAMED:
            e = {**e, "text": RENAMED[e["text"]]}
        read = kind_of(e.get("text", "")) if isinstance(e, dict) else {}
        if not read:
            out.append(e)
        elif e.get("kind"):
            out.append({**e, "text": read["text"]})
        else:
            out.append({**e, **read})
    return out
