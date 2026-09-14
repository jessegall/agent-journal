from __future__ import annotations

import re
from functools import lru_cache
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
SKIP = {"statusline", "serve", "channel", "migrate", "version"}
# noun -> the kind of resource a line is about, so Activity can open it
KINDS = {"todos": "todo", "messages": "message", "questions": "question", "reports": "report",
         "suggestions": "suggestion", "docs": "doc", "pins": "pin", "rules": "rule", "comments": "comment",
         "reminders": "reminder", "work": "work"}
# writes that Activity already shows from the stores they change
SHOWN = {"todos:add", "todos:done", "work:start", "work:update", "work:end", "start:", "end:", "questions:add", "messages:done"}
# commands whose number argument is not called n
NUMBER_ARG = {"docs:files": "doc", "docs:part": "doc", "docs:final": "doc", "docs:draft": "doc", "docs:abstract": "doc",
              "docs:title": "doc", "docs:paths": "doc", "docs:archive": "doc", "docs:move": "doc", "docs:attach": "doc",
              "docs:detach": "doc", "rules:strike": "id", "rules:inject": "id", "rules:uninject": "id"}
# the argument whose value Activity shows after the number, like "high" for a priority
DETAIL = {"todos:priority": "value", "reports:keep": "days", "switch:": "name", "environments:switch": "name",
          "environments:": "name", "environments:show": "name", "environments:remove": "name",
          "environments:prepare": "name", "environments:claim": "name", "prepare:": "name", "claim:": "name",
          "grant:": "name", "tools:run": "name", "tools:show": "name", "tools:add": "name", "tools:set": "name",
          "tools:remove": "name"}
# run by git hooks, not by the agent
HOOKS = {"todos:from-commit"}
# lines that introduce something, so Activity shows its title under them; reads and closes do not repeat it
TITLED = {"questions:add", "reports:add", "docs:add", "suggestions:add", "suggest:", "pins:add", "rules:add",
          "reminders:add", "notifications:add", "ideas:add", "comments:add"}

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
    "todos:amend": "Adding to to-do {n}",
    "todos:replace": "Rewriting to-do {n}",
    "todos:ask": "Asking you about to-do {n}",
    "todos:block": "Marking to-do {n} blocked",
    "todos:move": "Moving to-do {n}",
    "messages:list": "Reading your messages",
    "messages:show": "Reading message {n}",
    "messages:process": "Filing message {n}",
    "messages:done": "Marking message {n} processed",
    "messages:reply": "Replying to message {n}",
    "questions:list": "Reading questions",
    "questions:show": "Reading question {n}",
    "questions:add": "Asking you a question",
    "questions:edit": "Editing question {n}",
    "questions:withdraw": "Withdrawing question {n}",
    "work:start": "Starting work",
    "work:update": "Noting progress",
    "work:await": "Waiting on something",
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
    "messages:archive": "Archiving message {n}",
    "messages:move": "Moving message {n}",
    "questions:answer": "Answering question {n}",
    "questions:link": "Linking question {n}",
    "questions:unlink": "Unlinking question {n}",
    "comments:add": "Writing a comment",
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
    "reports:doc": "Turning report {n} into a document",
    "suggestions:edit": "Rewording suggestion {n}",
    "suggestions:withdraw": "Withdrawing suggestion {n}",
    "suggestions:accept": "Accepting suggestion {n}",
    "suggestions:adjust": "Adjusting suggestion {n}",
    "suggestions:decline": "Declining suggestion {n}",
    "ideas:list": "Reading ideas",
    "ideas:add": "Writing an idea",
    "ideas:drop": "Dropping idea {n}",
    "ideas:promote": "Turning idea {n} into a to-do",
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


def describe(noun: str, verb: str) -> str:
    """The line's wording. The number is not part of it: Activity shows it on its own."""
    text = DESCRIBE.get(f"{noun}:{verb}") or DESCRIBE.get(f"{noun}:")
    if not text:
        return f"Running journal {noun} {verb}".strip()
    return text.replace(" {n}", "")


def record(root: Path, track: str, parsed, at: str) -> None:
    noun, verb = parsed.command.noun, parsed.command.verb
    if noun in SKIP or f"{noun}:{verb}" in SHOWN or f"{noun}:{verb}" in HOOKS:
        return
    key = f"{noun}:{verb}"
    n = parsed.arg(NUMBER_ARG.get(key, "n"))
    detail = parsed.arg(DETAIL[key]) if key in DETAIL else None
    detail = " ".join(map(str, detail)) if isinstance(detail, (list, tuple)) else detail
    entry = {"at": at, "text": describe(noun, verb), "kind": KINDS.get(noun),
             "n": int(n) if str(n).isdigit() else None, "titled": key in TITLED,
             "detail": " ".join(str(detail).split())[:40] if detail not in (None, "") else ""}
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


def entries(root: Path, track: str) -> list[dict]:
    got = state.tracked(root, KEY, track, [])
    items = got if isinstance(got, list) else []
    out = []
    for e in items:
        read = kind_of(e.get("text", "")) if isinstance(e, dict) else {}
        if not read:
            out.append(e)
        elif e.get("kind"):
            out.append({**e, "text": read["text"]})
        else:
            out.append({**e, **read})
    return out
