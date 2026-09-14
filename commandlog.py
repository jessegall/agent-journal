from __future__ import annotations

from pathlib import Path

import state

KEY = "activity"
CAP = 250
SKIP = {"statusline", "serve", "channel", "migrate", "version"}
# writes that Activity already shows from the stores they change
SHOWN = {"todos:add", "todos:done", "work:start", "work:update", "work:end", "questions:add", "messages:done"}

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
}


def describe(noun: str, verb: str, n=None) -> str:
    text = DESCRIBE.get(f"{noun}:{verb}") or DESCRIBE.get(f"{noun}:")
    if not text:
        return f"Running journal {noun} {verb}".strip()
    return text.replace("{n}", str(n)) if n not in (None, "") else text.replace(" {n}", "")


def record(root: Path, track: str, parsed, at: str) -> None:
    noun, verb = parsed.command.noun, parsed.command.verb
    if noun in SKIP or f"{noun}:{verb}" in SHOWN:
        return
    entry = {"at": at, "text": describe(noun, verb, parsed.arg("n"))}
    with state.locked(root):
        items = state.tracked(root, KEY, track, [])
        items = (items if isinstance(items, list) else []) + [entry]
        state.put_tracked(root, KEY, track, items[-CAP:])


def entries(root: Path, track: str) -> list[dict]:
    got = state.tracked(root, KEY, track, [])
    return got if isinstance(got, list) else []
