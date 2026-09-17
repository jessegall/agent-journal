#!/usr/bin/env python3
"""One doorbell. The payload says which event fired, so the harness config never changes.

    "command": "\"$CLAUDE_PROJECT_DIR\"/.journal/hook.py"

THE CONTRACT, and it is the whole reason this file is small:
  exit 0            silent; stdout is shown to the user
  exit 2 + stderr   the turn is HELD and stderr is fed back to the agent

The hold is what makes a rule a mechanism instead of a wish. It sits at the STOP and
nowhere else: a tool count is an arbitrary boundary that can fire mid-thought, while a
stop is the moment the stretch is about to be lost — which is the moment worth holding.

AND IT CAN ONLY HOLD ONCE PER STRETCH. A hook that re-holds on the message it provoked is
a loop the agent cannot leave, so the line it last held at is written down and it never
holds at or behind that mark again. A nudge that cannot be escaped stops being a nudge.

THE TRANSCRIPT COMES FROM THE PAYLOAD. Every event carries `session_id` and
`transcript_path`; the first version guessed the newest file by mtime instead, and with two
terminals open on one project it held session A for session B's messages. Every mark this
file writes is a fact about the transcript it was handed, and is filed under its name.
"""
from __future__ import annotations

import contextlib
import json
import os
import re
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
import worktree  # noqa: E402

# A LINKED WORKTREE USES THE MAIN CHECKOUT'S JOURNAL. `resolve` links a clean copy, or
# redirects here when the copy has changes; the note is handed to the session below.
_HERE = Path(__file__).parent  # unresolved: a symlink stays a symlink here
ROOT, WORKTREE_NOTE = worktree.resolve(_HERE if _HERE.is_symlink() else ROOT)

import asks  # noqa: E402
import settings as settings_mod  # noqa: E402
import state  # noqa: E402
import tags  # noqa: E402
import context  # noqa: E402
import docs  # noqa: E402
import fmt  # noqa: E402

fmt.cli(ROOT)   # the spelling every printed command prints, computed from where we are
import agents  # noqa: E402
import grants  # noqa: E402
import nudges  # noqa: E402
import builtin  # noqa: E402
import pins  # noqa: E402
import reminders  # noqa: E402
import work  # noqa: E402
import todo  # noqa: E402
import tools  # noqa: E402
import tracks  # noqa: E402
import transcript  # noqa: E402
import migrate  # noqa: E402
import update  # noqa: E402
import inbox  # noqa: E402
from templates import render as fill  # noqa: E402

MESSAGES = {
    "inbox_fact": "the user left {n} message(s) for you, the oldest being message {first}",
    # POINTS AT `waiting`, NOT `messages`. `messages waiting` hands them back OLDEST FIRST and marks
    # every one of them read; the plain list does neither — so an agent that followed this nudge read
    # one message, acted on it, and left the user looking at ticks that said exactly that.
    "inbox_do": "read them all and handle them oldest first: `.journal/journal.py messages waiting` shows every one "
                "in full and marks them read; split each into parts with `messages process`, a question for any part "
                "you do not understand, then `messages done`",
    "viewer_first_note": "THE USER WORKS FROM THE VIEWER on this environment: keep each terminal message to its one tagged line, and put the "
                         "answer where they read it: a reply on their message (journal messages reply), a report for research, a question for a decision.",
    "inbox_mention": "the user left {n} new message(s) for you — `journal messages waiting` reads them all, oldest "
                     "first, when you reach a pause; nothing is blocked",
    "comments_mention": "the user left {n} new comment(s) for you — `journal comments` reads them when you reach a "
                        "pause; nothing is blocked",
    "deferral_do": "park it as a to-do before going on, or run this call again if nothing is deferred",
    "deferral_why": "You wrote:\n  …{said}…\n\nThe user asked for something and this says it will happen later. Work "
                    "held only in words lives in this window, and one distraction or one compaction loses it. Park it "
                    'now:\n  .journal/journal.py todos add "<title>" --brief\nand say in your next message that it is '
                    "parked as to-do n. If nothing is deferred — you were describing the order of the current work — "
                    "run the call again; this is said once per reply.",
    "deferral_fact": "work deferred in words, not parked",
    "agent_unreadable": "this line runs the journal in a way the hook cannot read, and a subagent's journal command has to be "
                        "readable to be allowed. Write it plainly: .journal/journal.py --env=\"<name>\" --as=\"<your name>\" <verb> …",
    "agent_closes_row": "a subagent does not close a to-do. Say it is finished with "
                        "`.journal/journal.py --env=\"<name>\" --as=\"<your name>\" todos report <n> \"<how it was done>\"`; "
                        "the session that dispatched you closes it.",
    "deferral_stop_do": "park it as a to-do, or say in one line that nothing was put off; this is not asked again for this reply",
    "deferral_stop_why": "You wrote:\n  …{said}…\n\nThe user asked for something and this says it will happen later. Work "
                         "held only in words lives in this window, and one distraction or one compaction loses it. Park it "
                         'now:\n  .journal/journal.py todos add "<title>" --brief\nand say in your next message that it is '
                         "parked as to-do n. If nothing was put off, you were describing the order of the current work: say "
                         "so in one line and carry on.",
    "deferral_deny": "{do}\n\n{why}",
    "prompt_fact": "{n} piece(s) of work open",
    "prompt_do": 'a NEW request is a to-do unless the user said to do it NOW: `.journal/journal.py todos add "<title>" '
                 "--brief`, say you parked it, and carry on with what is open. Do NOT `work end` to make room — ending "
                 "work is not finishing a row, and the row you are on stays yours. Same work? carry on. Told to do it "
                 "now? `update` the open work and `start` the new one.",
    "rules_decided": "Decided, and still in force:",
    "rules_again": "Again, because the block you read at the start is far behind you:",
    "context_fact": "context {pct}% full",
    "context_decide": 'decide before any other tool runs: `pin "<claim>"` or `nothing "<why>"` — the `journal-memory` skill says which',
    "context_consider": "consider what must outlive it",
    "update_run": "{note} Run it now if nothing is mid-flight: `.journal/journal.py update`.",
    "waiting_fact": "{n} to-do(s) waiting on `{env}`",
    "waiting_do": "delayed work, not an instruction to start any of it; `journal todo` lists them",
    "row": "  - {row}",
    "taken_fact": "environment `{env}` is taken by another session",
    "taken_do": 'session {sid} has it ({age}); ask the user which environment this session works on, then '
                '`.journal/journal.py switch "<name>"`',
    "loop_fact": "auto is on, no loop running",
    "loop_do": "start one before the list can drain: the `loop` skill with `{m}m journal next`, or "
               "`.journal/journal.py loop set` if one is running that the journal cannot see",
    "undecided_fact": "context {pct}% full, still undecided",
    "undecided_do": 'the warning is unanswered: `.journal/journal.py pin "<claim>"` or `.journal/journal.py nothing '
                    '"<why>"` before anything else',
    "untagged_fact": "{n} untagged message(s)",
    "untagged_do": "last at line {line}; open the next with {tags: }[{teach}]",
    "untagged_teach": "; the tag is the first thing in the message, nothing before it",
    "tag": "\\[!{tag}\\]",
    "waited_fact": "work waited out",
    "waited_dead": "{who} has exited; `{subject}` was waiting on {what}",
    "waited_mins": "`{subject}` has waited {mins} minute(s) on {what}[ ({who})]",
    "waited_do": "is it still coming? `work update` what you know, `work await` again, or `work end` it",
    "waited_note": "Open: {subject}\nAwaited: {what}[ ({who})]{how}A wait expires so that work cannot be abandoned "
                   'quietly. Decide:\n  .journal/journal.py work update "<what you know now>"   it moved, or it did '
                   'not\n  .journal/journal.py work await "<the same thing>" --for=<minutes>   still coming\n'
                   '  .journal/journal.py work end "<the same words>"   it is over, or it is not coming',
    "waited_exited": " — that process has EXITED.\n\n",
    "waited_for": ", for {mins} minute(s).\n\n",
    "auto_open_fact": "auto is on, work still open",
    "auto_inherited_fact": "auto is on, but the open work was opened by another session",
    "auto_inherited_do": "it is not yours to end: leave it to that session; the list starts once it is closed",
    "auto_inherited_gone_do": "that session is gone, so nothing will end it: if it is finished close it with "
                              "`journal work end --force \"<note>\"`, or ask the user; the list waits until it is closed",
    "note_auto_unbound": "AUTO IS ON for this journal, and it applies to every environment — but this session is on "
                         "none yet, so pick one first and then work the list without asking",
    "auto_open_do": "`work end` each if it is done, `work await` it if it is in flight on something you cannot hurry, "
                    "or park what is left as a to-do and end it{tail}",
    "auto_open_listed": "; then the list starts",
    "auto_open_never": "; open work is never left standing",
    "auto_open_note": "Open:\n{names:\n}\n\nAuto is on for `{env}`, and the next to-do starts only when nothing is "
                      'open. If this work is finished, close it:\n  .journal/journal.py work end "<the same words>"\n'
                      "If part of it is waiting on the user — a ruling, a review — that part is a to-do, not open work: "
                      "park it with the questions in its brief, then end the work:\n"
                      '  .journal/journal.py todos add "<what is left, and on what it waits>" --brief\n'
                      "If it is IN FLIGHT on something you cannot hurry — a subagent, a build, a review — say so and the "
                      'nudging stops until it lands:\n  .journal/journal.py work await "<what you wait on>" '
                      "--pid=<n>|--agent=<id>\nIf you are mid-work and stopped to ask the user something, say so; the "
                      "next turn asks again.",
    "open_fact": "work still open",
    "open_do": '{subjects:; }: `work end` it, `work update` where it got to, or `work await "<what you wait on>" '
               "--pid=<n>|--agent=<id>` if it is in flight on something you cannot hurry",
    "rules_n": "{n} rule(s)",
    "pins_n": "{n} pin(s)",
    "recall_fact": "{counted: and } are in force here, and the block that handed them to you is far behind",
    "recall_owed": "`.journal/journal.py cleanup read` reads every one AND asks the three questions — the reading pass "
                   "is owed here, and reading them is the moment to judge them",
    "recall_read": "`journal rules` and `journal pins` read them back in one command each — cheaper than being wrong "
                   "about one",
    "cleanup_fact": "{n} thing(s) in the record have evidence against them ({kinds:, })",
    "cleanup_do": "`.journal/journal.py cleanup` lists each beside the command that retires it; `cleanup read` is the "
                  "half no check can do, and was {never}",
    "cleanup_clean_fact": "nothing in the record has evidence against it, but the reading pass was {never}",
    "cleanup_clean_do": "`.journal/journal.py cleanup read` — every rule and pin judged against the code — when the "
                        "work you just did touched what they claim",
    "decided_one": "the user decided suggestion {n}",
    "decided_many": "the user decided {n} suggestions",
    "decided_do": "act on each decision; a declined one is a ruling and is not filed again; "
                  "`.journal/journal.py suggestions show <n>` reads one in full",
    "decided_accepted": "suggestion {n}: {title} → accepted, {todo} filed",
    "decided_adjusted": "suggestion {n}: {title} → accepted with the user's change, {todo} filed",
    "decided_declined": "suggestion {n}: {title} → declined[: {why}]",
    "user_only": "`journal suggestions {verb}` is the user's decision to make, from the viewer or their own terminal. "
                 "File the proposal and keep working; the next stop tells you what they decided.",
    "commented_one": "the user commented on {label}",
    "commented_many": "the user left {n} comments",
    "commented_do": "act on what each asks — amend, drop or answer what it is about — then "
                    '`.journal/journal.py comments done <n> "<what was done>"`',
    "commented_row": "comment {n} on {label}: {text}",
    "answered_one": "the user answered question {n}",
    "answered_many": "the user answered {n} questions",
    "answered_do": "act on each answer; `.journal/journal.py questions show <n>` reads one in full",
    "answered_row": "question {n}: {text} → {answer}[{changed}]",
    "answer_changed": " (a new answer)",
    "aside_fact": "auto is on for `{env}`, and every waiting to-do is set aside",
    "aside_do": "nothing is blocked on the user — these wait on conditions you judge: {rows:; } `journal todos start "
                "<n>` when one comes true",
    "aside_row": "{n} ({why})",
    "reason_asking": "waiting on your answer",
    "reason_aside": "set aside on a condition",
    "reason_after": "waiting on a to-do that must land first",
    "reason_held": "held by an agent still working",
    "reason_reported": "reported finished by an agent, yours to close with `journal todos done <n>`",
    "reason": "{n} {what}",
    "stuck_fact": "auto is on for `{env}`, but nothing on the list can be picked up",
    "stuck_do": "[{why:, }; ]`journal todo` shows what each waits on[. {asked}]",
    "stuck_asked": "A QUESTION WAITING ON THE USER IS NOT A STOP — a plan being shaped, a doc, anything already open: "
                   "asking is not waiting, and auto exists so you carry on while they are away",
    "user_answered_fact": "the user answered to-do {n}",
    "user_answered_do": "({title}) — that is their word to do it: `.journal/journal.py todos start {n}`",
    "answered_block": "To-do {n}: {title}\n  asked:    {asks}\n  answered: {answer}",
    "user_answered_note": "{blocks:\n}\n\nStart it, do it, end it. The answer stays on the to-do; `journal todos {n}` "
                          "shows both.",
    "auto_answered_fact": "auto is on, the user answered to-do {n}",
    "auto_answered_do": "({title}) — you are unstuck: `.journal/journal.py todos start {n}`",
    "auto_answered_note": "{blocks:\n}\n\nStart with to-do {n}: the answer is above, the brief is `journal todos {n}`. "
                          "Then the rest of the list:\n{rest:\n}",
    "list_row": "  {n}  {title}[  (waits on the user: {asks})]",
    "auto_next_fact": "auto is on, {n} to-do(s) waiting",
    "auto_next_do": "nothing is open — pick up the next: `.journal/journal.py todos start {n}`",
    "auto_next_note": "Waiting on `{env}`:\n{rows:\n}\n\nRead the brief (`journal todos {n}`), start it, solve it, "
                      "`work end` it; the next idle stop brings the next one. Every choice the brief leaves open is "
                      "yours. {loop}\nStuck on something only the user can supply: `work update` what was tried, `work "
                      'end`, `journal todos ask {n} "<what is stuck>"`.',
    "loop_owed": "AUTO IS ON for `{env}` and this session has no loop, so the list would stop at your next idle stop. "
                 "Start one before writing anything else:\n  the `loop` skill with `{m}m journal next`\n"
                 "  .journal/journal.py loop set     if one is already running that the journal cannot see\n"
                 "  .journal/journal.py auto-mode disable   if the list should not drain on its own\n"
                 "Reads are never gated; only changes.",
    "choice_line": "journal: this session has no environment yet — {names:, }. It will take one from your first "
                   "message, or ask.",
    "backticked": "`{name}`",
    "viewer_back": "the viewer had stopped and is up again at {url} — it is where the user reads this.",
    "viewer_up": "journal: the web viewer is running at {url}",
    "viewer_down": "journal: browse and edit the journal in your browser: run `.journal/journal.py serve` "
                   "(or ask Claude to start it), then open http://127.0.0.1:8420",
    "none_exist": "none exist yet",
    "choose": "THIS SESSION HAS NO ENVIRONMENT{where}. Every pin, to-do and piece of work belongs to one, so nothing "
              "can be written until this session is on one. It is not given you: you choose it, because you are the "
              "one who has read what the user asked.\nThe environments that exist:\n{have:\n}\n"
              "DECIDE FROM WHAT THE USER JUST ASKED. If it names or plainly implies one of these, take it — `journal "
              'switch "<name>"` — and say in one line which you took, so a wrong guess costs the user one word to '
              "correct. If the work is real and belongs on none of them, `journal prepare \"<name>\"` makes one. If "
              "the message names nothing to work on — a greeting, a question about the record, anything you can "
              "answer without writing — ASK which environment, listing the ones above, before you answer it. Do not "
              "guess in the dark and do not fall back to the first on the list: an environment nobody chose is how "
              "work lands where nobody looks.",
    "choose_row": "  {name}",
    "choose_none": "  (none yet)",
    "taken_block": "ENVIRONMENT `{env}` IS TAKEN: session {sid} is on it ({age}), and one session works an environment "
                   "at a time. Before anything else, tell the user and ask which environment this session works on — a "
                   "free one from `journal environments`, or a new name — then\n"
                   '  .journal/journal.py switch "<name>"\nUntil then edits are refused and every stop asks again. '
                   "Reads are fine.",
    "pin_refused": "That pin would be refused, so the command is not run.\n{why}",
    "context_deny": "CONTEXT IS {pct}% FULL and nothing has been decided about what must outlive it. This call is "
                    'denied until one of these has run:\n  .journal/journal.py pins add "<the claim, in one line>"\n'
                    '  .journal/journal.py nothing "<why nothing here needs pinning>"\nNothing is the right answer more '
                    "often than not — say so and carry on. `journal search`, `journal conversation --back=1` and "
                    "`journal pins` still run, to decide with.",
    "always_skills": "LOAD THESE SKILLS NOW — the user asked for them at every start: {names}.",
    "model_denied": "A subagent dispatch must name its model — rule B1, the journal's own: add `model`, haiku for "
                    "mechanical work with a known answer, sonnet for care without invention, opus only where the task "
                    "turns on judgement. A fork, which cannot take a model, and an agent whose own definition sets one "
                    "go through. The `journal-agents` skill says more.",
    "ask_denied": "AUTO IS ON, so the question tool is refused: it would halt the session until the user returns, "
                  "which auto exists to prevent. Ask through the journal instead — it never halts — and carry on with "
                  'what does not depend on the answer:\n  .journal/journal.py questions add "<the question>" '
                  '--about="todo <n>"\n  .journal/journal.py work update "<what you chose, and why>"   if you can '
                  "decide it yourself\nThe user answers with `journal questions answer <n>` and the next stop tells you. The `journal-questions` skill says how to ask well.",
    "unbound_deny": "{block}\n\nThis call is denied until one has been chosen. Reads are never gated; only changes.",
    "gate": "Nothing is open, so this edit would not be filed against any work. Say what you are doing first — one "
            'line, and then this stops asking:\n  .journal/journal.py work start "<the work, in your own words>"\n'
            "Close it with `end` when it is done. Reads are never gated; only changes.",
    "deny": "\\[{project}\\] {reason}",
    "markdown_hint": "journal: {path} is a markdown file written outside the journal. Not a problem — but if it is a "
                     "design, a report or a finding, the docs catalogue is where it is handed to every session and "
                     'found by search:\n  .journal/journal.py docs add "<title>" --abstract="<one line>" --brief < the '
                     'file\n  .journal/journal.py docs part <n> "<title>" --brief < the file      as a part of doc n\n'
                     "A plan (what will be done, in what order) is not a doc: `journal plans add`. A README or a changelog is fine as it is.",
    "commit_how": "commit {sha}: {subject}",
    "commit_mixed": "the commit closed {shut}, and could not close {kept}",
    "commit_closed": "the commit's trailer closed what it named",
    "commit_nothing": "the commit's trailer ({trailer} todos done <n>) closed nothing",
    "commit_ok": "  {line}",
    "commit_bad": "  ! {line}",
    "commit_said": "journal: {fact}\n{lines:\n}",
    "trailer_hint": "journal: that commit closed no to-do, and to-do {n} ({title}) is started — the commit that "
                    "finishes it can close it from its own message, on a line of its own:\n    {trailer} todos done "
                    '{n}\n  the close then cites the commit; `journal todos done {n} "<how>"` by hand is fine too',
    "attach_hint": "journal: {path} has been read {count} times this session, and it is not a source file of this "
                   "project. If it is reference material — a rendered design, an export, something the user sent — "
                   "attach it to the doc it belongs to, so it is catalogued, found by name and handed to the next "
                   'session instead of re-read:\n  .journal/journal.py docs attach <doc> "{path}" "<what it is>"\n'
                   "(`journal docs add` first if no doc fits; a markdown file may be a doc or a part instead.) A scratch "
                   "file is fine as it is.",
    "search_hint": "journal: what you searched for is attached to a doc — read it there before searching the repo:\n"
                   "{rows:\n}\n  `journal docs files <doc>` lists what a doc holds; `journal docs paths <doc>` gives absolute paths",
    "search_hint_row": "  doc {n} ({title}): {path}",
    "script_wrote": "{path} is a script you wrote{where}",
    "script_scratch": " in a scratch folder, which the next session cannot reach",
    "script_ran": "{path} is a scratch script you ran",
    "inline_twice": "the same inline script has now run twice",
    "tool_hint": "journal: {what}. If this job will come back, it is a tool: put the script under .journal/tools/<name>/ "
                 "(or leave it and point --entry at it) and catalogue it, so every session is handed it instead of "
                 'writing it again:\n  .journal/journal.py tools add <name> "<title>" --summary="<what it does>" '
                 '--usage="<how to call it>" --entry=<file>\nA one-off is fine as it is.',
    "stall": "journal: {calls} tool calls on to-do {n} ({title}) with no progress filed. If there is a measurable "
             'result, file it — `journal work update "<what moved>"` — and carry on. If there is not, stop pouring '
             'time in: `update` what was tried, `end` the work, `journal todos ask {n} "<what is stuck>"`, and move on.',
    "size_fact": "that {tool} call returned {size} characters, the largest this session",
    "size_do": "it is in the context for good; if you were after one thing in it, the next read can be narrower — grep "
               "for the line, sed a range, head the file. Nothing to undo.",
    "that_tool": "that tool",
    "details": "\n  details: `.journal/journal.py next`",
    "with_reminder": "{brief}\n\n{reminder}",
    "no_context": "journal: {event} cannot carry additionalContext — the harness rejects it. {n} lines were NOT "
                  "delivered.",
    "over_budget": "\n\nTHIS BLOCK IS {size} CHARACTERS and the harness saves anything over {cap} to a file, handing "
                   "you a path instead of the text — so if what you are reading looks cut off, it was. `journal carry` "
                   "prints it in full, and `journal cleanup read` is how the record gets smaller.",
    "in_force_bound": "THE JOURNAL IS IN FORCE HERE — this session is bound to environment `{env}` (`journal "
                      "environments` for the others; `journal switch` moves this session only, `--project` also the "
                      "start environment).",
    "in_force_unbound": "THE JOURNAL IS IN FORCE HERE — but this session is on NO ENVIRONMENT yet. What is listed below "
                        "is the start environment's (`{env}`), shown so you can read; it is not yours until you take "
                        'it. Choose one from the user\'s first message — `journal switch "<name>"`, `journal '
                        "environments` for the list — and say which you took. If that message asks for nothing, ask "
                        "them which. Writes are refused meanwhile.",
    "doorway": "{head}\nOpen every message with exactly one tag: {tags: } — what each is for: the `journal` skill.\n"
               'Work is not a tag, it costs a command: `journal work start "<the work>"`, `journal work update "<what '
               'moved>"`, `journal work end "<the same words>"` — and `journal work await "<what you wait on>" '
               "--pid=<n>|--agent=<id>` when it is in flight on something you cannot hurry, which stops the nudging "
               "until it lands.\nA NEW REQUEST IS A TO-DO UNLESS THE USER SAID TO DO IT NOW. Park it — `journal todos "
               '"<title>"` — say you parked it, and carry on with what is open. Do not end your work to make room: '
               "ending work is not finishing a row.\n\nIF YOU ARE UNSURE WHAT WAS DECIDED, LOOK — do not answer from "
               "what survived: `journal search <term>`, `journal conversation --back=1`, `journal user`.\n\n"
               "LOAD THE `journal` SKILL before your first pin, rule, declaration or search in this session, and again "
               "whenever a hook holds or denies you. Its focused skills — `journal-todos`, `journal-questions`, "
               "`journal-messages`, `journal-memory`, `journal-docs`, `journal-agents`, `journal-plans`, `journal-reports` — load when their "
               "part comes up; "
               "load one yourself if it has not.",
    "docs_cite": "{catalogue}\n  A pin, rule or to-do that rests on a doc cites it: --doc=N, or --doc=N.P for one part.",
    "compact_tail": "THE SUMMARY YOU ARE HOLDING DROPPED WHAT WAS DECIDED. Before you touch anything:\n"
                    "  .journal/journal.py conversation --back=1    the stretch that summary REPLACED\n"
                    "  .journal/journal.py user        the user's own words, in full\n"
                    "  .journal/journal.py open        work you declared and never closed\n"
                    "The transcript lost nothing. Read it rather than half-remembering it.",
    # WHAT SURVIVES A COMPACTION IS A SUMMARY OF A SKILL, NOT THE SKILL. The same instruction an
    # upgrade already gives, for the same reason: what you remember of it is stale.
    "compact_skills": "RELOAD YOUR JOURNAL SKILLS NOW — invoke the `journal` skill again, and every `journal-*` skill "
                      "you had loaded, even if you believe they are still loaded. What crossed the compaction is a "
                      "summary of them, and a summary of a rule is not the rule.",
    "nothing_open": 'NOTHING IS OPEN — declare what you pick up: `journal work start "<the work>"`.',
    "still_open": "STILL OPEN, from this or an earlier session:\n{rows:\n}\n`journal open` shows where each got to.",
    "note_auto": "AUTO IS ON — work the list without asking: `todos start <n>`, solve it, `work end`, repeat. "
                 "`journal auto-mode disable` stops it",
    "note_answered": "{n} the user has ANSWERED — theirs saying to do it, read those first",
    "note_asks": "{n} of them wait on the user",
    "note_delayed": "delayed work, not an instruction to start any of it",
    "count_reminders": "said again at every stop; not repeated here",
    "count_tools": "scripts this project keeps; run them, do not rewrite them",
    "count_connections": "services this project can reach, and which variable holds each token",
    "count_row": "{n}  {cmd}",
    "count_carry": "      journal carry",
    "count_carry_what": "all of it, in full, in one read",
    "count_suggestions": "waiting on the user's decision; `journal suggest \"<the change>\" --brief` proposes one",
    "suggest_hint_fact": "your reply proposes a change nobody asked for — «{said}»",
    "suggest_hint_do": 'if the user should decide it: `.journal/journal.py suggest "<the change>" --brief`; otherwise ignore this',
    "counts": "WHAT ELSE STANDS HERE — the number is the command's, not a summary:\n{rows}",
    "keep_loop": "KEEP A LOOP RUNNING while auto is on, if none is: the `loop` skill with `{m}m journal next`, so that "
                 "an idle session comes back every {m} minutes and carries on until nothing is left it can do; stop "
                 "the loop when the list is empty or everything left waits on the user.",
    "another_session": "another session",
    "claimed_fact": "environment `{env}` was claimed by another session",
    "claimed_do": "by session {by}: {why}",
    "claimed_note": "This session is bound to nothing now, and nothing of that environment was deleted.\n"
                    '  .journal/journal.py claim "{env}" "<why>"   take it back\n'
                    '  .journal/journal.py switch "<name>"   pick another; `journal environments` lists them',
    "unregistered_deny": "`journal {verb}` is refused: this session is registered on no environment — {block}",
    "unregistered_hold": "journal: environment `{env}` is taken by session {sid} ({age}), and one session works an "
                         "environment — ask the user which environment this session works on, then "
                         '`.journal/journal.py switch "<name>"`',
    "problem": "journal: {problem}",
    "no_session": "journal: {event} payload names no session or transcript — nothing filed",
    "as_denied": '`--as="{said}"` is not you: this call is agent `{aid}`. Use your own name — you were told it on your '
                 "first tool call — or leave the flag off and write nothing.",
    "handler_failed": "journal: {event} handler failed ({kind}: {error}) — nothing filed",
}


def say(message: str, /, **values) -> str:
    return fill(MESSAGES[message], **values)


class Ctx:
    """Which transcript this event is about, and where its marks go.

    `stem` names the runtime file. For the session's own events it is the transcript's
    stem. A SUBAGENT's tool call carries the PARENT's transcript and session — measured —
    and only `agent_id` tells them apart; it is keyed `agent-<id>`, the name of its own
    transcript on disk, so that nothing it does can land in the parent's file. In practice
    the handlers ignore subagents altogether (each checks `payload.get("agent_id")` where
    it matters), so no such file is written.
    """

    __slots__ = ("stem", "path")   # not a dataclass: `inspect` is 6ms on every hook event

    def __init__(self, stem: str, path: "Path | None"):
        self.stem = stem
        self.path = path


def _ctx(payload: dict) -> Ctx | None:
    tp = payload.get("transcript_path") or ""
    sid = payload.get("session_id") or ""
    aid = payload.get("agent_id") or ""
    if aid:
        stem = f"agent-{aid}"
    elif tp:
        stem = Path(tp).stem
    elif sid:
        stem = sid
    else:
        return None
    if aid:
        # A SUBAGENT'S TRANSCRIPT IS ITS OWN, one level under its parent's; the payload
        # names the parent's. Before its first line exists there is none, and the handlers
        # that need one wait for it.
        own = payload.get("agent_transcript_path") or ""
        path = Path(own) if own and Path(own).is_file() else transcript.find(ROOT.parent, stem)
        return Ctx(stem, path)
    path = Path(tp) if tp else transcript.find(ROOT.parent, sid) if sid else None
    return Ctx(stem, path)


# `filing_units` USED TO BE DEFINED HERE and now lives in `transcript.py`, because the
# digest needed the same answer. Two copies of "what counts as a message" is two rules, and
# they had already drifted: the hook stopped holding scaffolding while the digest went on
# printing it.


def untagged(lines, units: set[int]) -> list:
    """Messages that said nothing about what they carried.

    A `[!reply]` is NOT untagged — it obeyed the rule and declared itself routine. Only a
    message wearing no tag at all filed nothing, and only a FILING UNIT can be one.
    """
    return [
        l
        for l in lines
        if l.n in units
        and l.kind == "text"
        and (l.text or "").strip()
        and not tags.found(l.text)
        # A QUESTION PUT TO THE USER IS NOT A MESSAGE THAT NEEDS A TAG. It is spoken text
        # so the digest shows what the user answered, and the moment it was, the hold
        # judged it: "line 3014: asked: When a state key that a slot's factory read…".
        and not any(t in transcript.ASKS for t in l.tools)
    ]


def _caches(stem: str) -> tuple[Path, Path]:
    """Where a session's parsed transcript and its context reading are kept between hook processes."""
    d = ROOT / state.RUNTIME_DIR
    return d / f"{stem}.lines.cache", d / f"{stem}.context.cache"


def _drop_caches(stem: str, *, lines_only: bool = False) -> None:
    for f in _caches(stem)[:1] if lines_only else _caches(stem):
        with contextlib.suppress(OSError):
            f.unlink()


def _floor(ctx: Ctx, lines=None) -> int:
    """The line under which nothing is held against anyone, written on FIRST SIGHT.

    A transcript the hook was not present for has a history, all of it untagged because
    there was no vocabulary to tag it with. That history exists for a fresh install into a
    running session, for a resumed or forked session whose transcript was copied at line N,
    and for a SessionStart hook that failed once in a session that then ran for hours. The
    first version drew this line only at install, into a transcript guessed by mtime; the
    second only at SessionStart, which does not fire when a hook is picked up mid-session.

    So WHICHEVER HANDLER FIRST SEES A TRANSCRIPT with no floor writes one, at the line count
    of that moment. In a fresh session that is SessionStart at line one or two and nothing
    is suppressed; in a session joined late it is the line it was joined at.
    """
    got = state.get(ROOT, "floor", None, stem=ctx.stem)
    if got is not None:
        return got
    if lines is None:
        lines = transcript.read(ctx.path, _caches(ctx.stem)[0])[0] if ctx.path else []
    floor = lines[-1].n if lines else 0
    state.put(ROOT, "floor", floor, stem=ctx.stem)
    return floor


#: The shapes a deferral takes in an agent's own words. "I'll rename it once the Editor
#: agent finishes", "for now, back to the failures", "I'll come back to that". Measured:
#: the user asked whether to rename a component, the agent said it would do it next, and
#: nothing was written down — one distraction away from being forgotten.
#:
#: NOT THE ORDER OF THE WORK. "Let me read the file, then fix the bug", "I'll check the hook
#: next" and "For now, reading the file" are an agent narrating its next step, and each of
#: them was refused: the audit ran them through this pattern and they all matched. "Let me",
#: and "then", "next", "when" and "for now" on their own, name a step in the current work,
#: not a promise about later, so they no longer count.
_DEFERRAL = re.compile(
    r"\b(?:I(?:'|’)ll|I will|I(?:'|’)m going to|we(?:'|’)ll)\b[^.!?\n]{0,90}?"
    r"\b(?:once|after|later|afterwards|as soon as)\b"
    r"|\b(?:later on|come back to (?:that|this|it)|circle back|after this|"
    r"once that(?:'|’)s done|when that(?:'|’)s done)\b",
    re.I,
)


def deferred(text: str) -> str | None:
    """The sentence in which this message puts work off, if it does."""
    m = _DEFERRAL.search(tags.strip(text or ""))
    if not m:
        return None
    body = " ".join(tags.strip(text).split())
    i = max(0, body.lower().find(m.group(0).lower().split()[0], max(0, m.start() - 5)))
    return body[max(0, i - 40):i + 140]


def _deferral(conf: dict, ctx: Ctx, at_stop: bool = False) -> tuple[str, str] | None:
    """(the one-line instruction, the reasoning) if the agent's latest reply puts work
    off and nothing was parked since the user asked; None otherwise. Said once per reply.

    THE USER ASKED, THE AGENT SAID "LATER", NOTHING WAS WRITTEN. Measured: "Let's rename
    Nothing to Empty? or None?" — "I'll rename it once the Editor agent finishes; for now,
    back to the failures." — and the rename lived nowhere but that sentence, one
    distraction from gone. The skill said to park it and was not enough, so it is a gate.

    Three things must all hold, so that an agent describing the order of its own work is
    not stopped: the last prompt asked for work (`asks.asks_for_work`, recorded at
    UserPromptSubmit); no to-do has been added since that prompt; and the latest reply
    contains a deferral. Then it fires once for that reply, and a retry passes, so a false
    match costs one call and never traps.
    """
    if "deferral" in conf["silenced"] or ctx.path is None:
        return None
    asked = state.get(ROOT, "prompt", None, stem=ctx.stem)
    if not asked or not asked.get("asked"):
        return None
    here = tracks.current(ROOT, ctx.stem)
    if len(todo.open_items(ROOT, here)) > asked.get("todos", 0):
        return None
    got = transcript.last_reply(ctx.path)
    if not got:
        return None
    text, uid = got
    if uid == state.get(ROOT, "deferral_at", "", stem=ctx.stem):
        return None
    said = deferred(text)
    if not said:
        return None
    state.put(ROOT, "deferral_at", uid, stem=ctx.stem)
    # A STOP HAS NO CALL TO RUN AGAIN: its hold asks for the to-do or one line, not a retry
    if at_stop:
        return say("deferral_stop_do"), say("deferral_stop_why", said=said)
    return say("deferral_do"), say("deferral_why", said=said)


def _filed(here: str) -> int:
    """How many to-dos, suggestions and questions exist here: a rise since the prompt means one was filed."""
    import questions
    import suggestions
    return (len(todo._all(ROOT, here)) + len(suggestions._all(ROOT, here)) + len(questions._all(ROOT, here)))


_PROPOSES = re.compile(r"\b(?:we could|we might want to|it (?:might|would) be (?:better|cleaner|simpler) to|"
                       r"i(?:'d| would) (?:suggest|recommend)|consider (?:switching|moving|replacing|dropping|using)|"
                       r"a (?:better|cleaner) (?:way|approach) would be|worth (?:switching|reconsidering))\b[^.!?\n]*", re.I)


def on_user_prompt(conf: dict, payload: dict, ctx: Ctx) -> int:
    """The moment the user asks. Record whether they asked for work; remind if work is open.

    The reminder rides only on a prompt that asks for work while something is open —
    exactly the case where the answer might be "later" — so it is not wallpaper on every
    message. With nothing open the request is the work and needs no reminder.
    """
    notes = state.get(ROOT, PROMPT_NOTES, [], stem=ctx.stem) or []
    if notes:
        state.put(ROOT, PROMPT_NOTES, [], stem=ctx.stem)
    lead = "\n\n".join(notes)
    with_notes = lambda text: "\n\n".join(x for x in (lead, text) if x)  # noqa: E731
    prompt = str(payload.get("prompt") or "")
    asked = asks.asks_for_work(prompt)
    here = tracks.current(ROOT, ctx.stem)
    state.put(ROOT, "prompt", {"asked": asked, "todos": len(todo.open_items(ROOT, here)),
                               "opinion": asks.asks_opinion(prompt), "filed": _filed(here)},
              stem=ctx.stem)
    # THE CHOICE COMES FIRST, and it rides the prompt because the prompt is what decides
    # it. It is repeated on every prompt until an environment is taken: a session that
    # answered three questions unbound has had three chances to notice, and the fourth
    # message may be the one that writes.
    if _unbound(conf, ctx):
        return _context("UserPromptSubmit", with_notes(_choose_block(" YET")))
    standing = work.open_work(ROOT)
    if not asked or not standing or "prompt_reminder" in conf["silenced"]:
        return _context("UserPromptSubmit", lead) if lead else 0
    # `_say` SUPPLIES THE DASH. A fact that carries its own gets two of them before the
    # reader reaches the instruction.
    return _context("UserPromptSubmit", with_notes(_say(
        say("prompt_fact", n=len(standing)), say("prompt_do"),
        rows=[w["subject"] for w in standing])[1]))


def _rung(conf: dict, ctx: Ctx, got, stretch=()) -> tuple[str, str, str] | None:
    """(label, instruction, reasoning) if a new rung of the ladder was just passed.

    ONE RUNG, ONCE. The highest rung already passed is written down, so a session that
    sits at 71% for an hour is told once and not at every stop — a warning that repeats
    while nothing has changed is one the reader learns to clear without looking.

    CALLED FROM THE STOP AND FROM EVERY TOOL CALL. A rung that fires only at a stop is
    missed by exactly the session that needs it: one long stretch of tool calls can cross
    95% and compact before the agent ever stops. Measured — the user had to ask "did you
    get the 95% warning?" and the answer was no. So the tool-call hook checks a cheap tail
    reading too; the rung is recorded the same way, and the decision gate that follows it
    is the same gate.
    """
    ladder = sorted(conf["context_warn_ladder"])
    if not ladder or "context" in conf["silenced"]:
        return None
    done = state.get(ROOT, "warned_at", 0.0, stem=ctx.stem)
    passed = [r for r in ladder if got[0] >= r > done]
    if not passed:
        return None
    rung = passed[-1]
    state.put(ROOT, "warned_at", rung, stem=ctx.stem)
    standing = pins.live(ROOT)
    # How many were written since the last rung — a fact, and the one that would expose
    # padding to the reader who is doing it.
    seen = state.get(ROOT, "pins_at_warn", 0, stem=ctx.stem)
    state.put(ROOT, "pins_at_warn", len(standing), stem=ctx.stem)
    gated = bool(conf["gate_after_context_rung"]) and "pin_due" not in conf["silenced"]
    if gated:
        # RECORDED HERE, ENFORCED AT THE NEXT TOOL CALL. A Stop can only hold; PreToolUse
        # is the one event that can refuse an act.
        state.put(ROOT, "pin_due", {"rung": rung, "used": got[1], "window": got[2]}, stem=ctx.stem)
    pct = 100 * got[1] / got[2]
    text = context.warning(
        got[1], got[2], len(standing), context.shape(stretch), rung,
        latest=standing[-1]["fact"] if standing else "",
        since=max(0, len(standing) - seen), gated=gated,
    )
    # THE RULES RIDE EVERY RUNG. A rule read at the session's start is far behind by the
    # time the window is half full, and it is a few lines.
    ruled = pins.carry(ROOT, "compact", key=pins.RULES)
    if ruled:
        text += "\n\n" + ruled.replace(say("rules_decided"), say("rules_again"))
    return _say(say("context_fact", pct=round(pct)),
                say("context_decide") if gated else say("context_consider"), note=text)


#: THE STOP QUEUE, in the order the subjects are raised. One subject per stop, each
#: subject at most once per turn. A subject stays pending until its condition is actually
#: resolved — the decision made, the deferral parked, the message tagged, the work noted
#: or ended, the to-do picked up — so an unresolved one comes back next turn; and because
#: each is raised once per turn, the queue always drains and nothing can loop.
#: Measured before this: three conditions, one reply that did none of them, all three
#: gone; and later a resolved context warning followed by silence where "auto is on, pick
#: up the next" was owed. The user's rule: the hook runs them one by one.
#: The subjects of the queue live below, each registered with `nudges.subject(name, priority)`;
#: `nudges.ordered(conf)` is the order they run in, and it is the ONLY answer: the order
#: comes from the decorators plus `stop_priority`, so a tuple listing the names here could
#: only ever drift out of agreement with it. One lived here saying it "is kept as the
#: default order", read by nothing, and already missing two subjects.

#: A SUBJECT THAT NEVER YIELDS IS A QUEUE THAT NEVER DRAINS, and this is where that was
#: tried and rejected. Making the loop hold fire at every stop — on the reasoning that it is
#: the condition under which every later hold can reach anybody — meant it raised itself
#: three stops running while the untagged message and the open work behind it were never
#: reached, and the chain could not end at all. test_queue caught it in one run. The forcing
#: belongs where it cannot be stepped over and cannot deadlock either: the WRITE GATE, in
#: `_loop_owed`. The hold stays once per chain, like every other subject.


def _still_raised(conf: dict, ctx: Ctx, lines, active: bool) -> dict:
    """{subject: the line it was raised at} for the subjects this chain must stay quiet about.

    ONE HOLD PER CHAIN WAS THE WRONG BUDGET, and it failed in the direction that costs most:
    an agent held once, that answered the hold and then worked for nine minutes, met a stop
    where every subject it needed was already marked raised and stopped in SILENCE. The
    longer the stretch, the more certain the silence. Seen on a live run — four phases
    finished, work open, 52 to-dos waiting, and nothing said.

    So the memory expires on PROGRESS rather than on the chain. A subject held a moment ago
    stays quiet; one held twenty-five lines of work ago is not being nagged about, it is
    being told at the next stop after real work. Raising it at every stop was tried in
    1.29.0 for the loop subject and starved the queue behind it — the threshold is exactly
    what separates the two.

    An older record holds a bare LIST here; it is read as "raised just now", which is what
    it meant, and written back in the new shape at the next hold.
    """
    if not active:
        return {}
    got = state.get(ROOT, "raised_this_turn", {}, stem=ctx.stem) or {}
    now = lines[-1].n if lines else 0
    if isinstance(got, list):
        got = {s: now for s in got}
    if not isinstance(got, dict):
        return {}
    after = conf.get("hold_again_after_lines", 0)
    if not after:
        return got
    return {s: at for s, at in got.items() if now - int(at or 0) < after}


def _keep_viewer(conf: dict, ctx: Ctx) -> None:
    """The viewer comes back if it stopped while somebody is still working here.

    AT A STOP, NOT ON EVERY TOOL CALL. Asking whether it is up opens a socket with a timeout,
    and this hook is a fresh process on every single call — paying that on each one is the
    mistake. A stop is an idle moment and the moment the user is most likely to look at it.

    IT RESPECTS A DELIBERATE SILENCE. Somebody who stopped the viewer on purpose must not have
    it resurrected on a loop, so `silenced: ["viewer"]` switches this off like any other nudge.
    And a session on no environment is not working anywhere yet, so it starts nothing.
    """
    # NOT IN A TEST, AND NOT OFFLINE. A suite fires hundreds of stops against throwaway journals; each
    # one started a viewer for a temp directory and then WAITED up to fifteen seconds for it to answer.
    # The user watched a row of "proj" viewers appear on ports of their own, and two suites timed out.
    if os.environ.get("AGENT_JOURNAL_IN_TESTS") or os.environ.get("AGENT_JOURNAL_OFFLINE"):
        return
    if "viewer" in conf["silenced"] or not tracks.bound(ROOT, ctx.stem):
        return
    import serve
    if serve.running(ROOT):
        return
    import commands.system as system
    with contextlib.suppress(Exception):   # a viewer that will not start must never fail a stop
        _, url, _ = system.start_viewer()
        if url:
            _for_next_prompt(ctx, say("viewer_back", url=url))


def on_stop(conf: dict, payload: dict, ctx: Ctx) -> int:
    # REMINDERS COME FIRST AND SPEND NOTHING. The queue below raises ONE subject per stop
    # on purpose, and a reminder must not be able to lose that race: the whole point of it
    # is that it is said EVERY time, so it is folded into whatever the stop was going to
    # say — the hold's line, the context-only note, or nothing at all — rather than
    # competing for the slot. It also survives `hold_stop_on_untagged: false`, which turns
    # the queue off and was never a statement about what the user asked to be told again.
    _REMIND[:] = []
    # ONCE PER STOP CHAIN, NOT ONCE PER STOP EVENT. "Every stop" was measured against a
    # live session and the measurement said something the design had not: a Stop that
    # returns anything is re-entered with `stop_hook_active`, so a reminder that spoke
    # unconditionally answered its own re-entry and woke the session again with nobody
    # asking for anything. The queue's subjects already draw this line — the flag is what
    # tells a fresh stop from the tail of one being worked — and a reminder has to draw it
    # too. It still costs the queue nothing and still cannot be starved by it; it is said
    # at the head of every chain, which is what "at every stop" meant to the person who
    # asked for it.
    if "reminders" not in conf["silenced"] and not payload.get("stop_hook_active"):
        said = reminders.block(ROOT)
        if said:
            _REMIND[:] = [said]
            state.put(ROOT, "since_remind", 0, stem=ctx.stem)   # just said; the count restarts
    # THE SETTING NAMES ONE SUBJECT AND USED TO SILENCE ALL OF THEM. This guard returned
    # before the queue ran, so `hold_stop_on_untagged: false` — set by somebody who wanted
    # the tag nudge to stop — also switched off open work, the context ladder, the loop, the
    # deferral, cleanup and auto, without saying so. `silenced: ["untagged"]` is the
    # spelling that turns one subject off, and it already works; the setting belongs where
    # the untagged subject reads it, and nowhere else.
    if ctx.path is None:
        return _remind_only()
    _keep_viewer(conf, ctx)
    _HOLD_CTX[:] = [ctx.stem]
    active = bool(payload.get("stop_hook_active"))
    lines, boundaries = transcript.read(ctx.path, _caches(ctx.stem)[0])
    raised = _still_raised(conf, ctx, lines, active)
    stretch = transcript.since(lines, boundaries, 0)
    _floor(ctx, lines)
    here = tracks.current(ROOT, ctx.stem)

    for subject, pending in nudges.ordered(conf):
        if subject in raised or subject in conf["silenced"]:
            continue
        hold = pending(conf, ctx, lines, stretch, here, active)
        if hold is None:
            continue
        raised[subject] = lines[-1].n if lines else 0
        state.put(ROOT, "raised_this_turn", raised, stem=ctx.stem)
        if hold[0] == "context-only":
            # SAID, NOT HELD: the user sees it now, the agent gets it with the next prompt,
            # and the turn is not re-opened for something nobody owes an action on
            _for_next_prompt(ctx, hold[1])
            return _tell_user(_remembering(hold[1]))
        return _hold(*hold, subject=subject)
    if not active:
        state.put(ROOT, "raised_this_turn", {}, stem=ctx.stem)

    # NOTHING HELD. Two things are only said, to the user, never held: a newer journal upstream,
    # and to-dos waiting while auto is off. `additionalContext` here would re-open the turn
    # (see `_hold`), so they go out as `systemMessage`; the upgrade also reaches the agent
    # with the user's next prompt.
    if "update_check" not in conf["silenced"]:
        note, latest = update.available(ROOT)
        if note:
            if latest and latest != state.get(ROOT, "update_said", "", stem=ctx.stem):
                state.put(ROOT, "update_said", latest, stem=ctx.stem)
                if state.get(ROOT, UPDATE_TOLD, "", stem=ctx.stem) != latest:
                    state.put(ROOT, UPDATE_TOLD, latest, stem=ctx.stem)
                    _for_next_prompt(ctx, say("update_run", note=note))
                return _tell_user(_remembering(say("update_run", note=note)))
    if not work.open_work(ROOT) and not todo.auto(ROOT):
        ids = sorted(t["n"] for t in todo.open_items(ROOT, here))
        if ids and ids != state.get(ROOT, "todos_said", [], stem=ctx.stem):
            state.put(ROOT, "todos_said", ids, stem=ctx.stem)
            return _tell_user(_remembering(_say(
                say("waiting_fact", n=len(ids), env=here), say("waiting_do"))[1]))
    return _remind_only()


#: runtime key: what a stop had to say to the agent without re-opening the turn, handed over with the next prompt
PROMPT_NOTES = "notes_for_prompt"


def _for_next_prompt(ctx: Ctx, text: str) -> None:
    notes = state.get(ROOT, PROMPT_NOTES, [], stem=ctx.stem) or []
    if text and text not in notes:
        state.put(ROOT, PROMPT_NOTES, (notes + [text])[-5:], stem=ctx.stem)


def _tell_user(text: str) -> int:
    """Shown to the user at a stop; the agent's turn is not re-opened."""
    print(json.dumps({"systemMessage": text}))
    return 0


#: ────────────────────────────── the one place a message is shaped ──────────────────────────
#:
#: EVERY STOP MESSAGE GOES THROUGH `_say`, and only stop messages: a PreToolUse denial and
#: the start block are their own shapes for their own reasons, and saying "every message"
#: here was an overclaim that was false the moment it was written. Before it, each subject
#: wrote its own
#: string: its own `journal: ` prefix, its own em dash, its own idea of where the command
#: goes — nine implementations of one sentence shape, which had already drifted into five
#: subjects stating their fact twice, one shouting in capitals with no prefix at all, and
#: three ending with a coda about the hook's own throttling that the others did not have.
#: Every one of those was fixed once by hand and would have drifted again by the next noun.
#:
#: THE FACT IS WRITTEN ONCE AND USED TWICE. `_hold` renders `journal: <label> — <body>`, and
#: the label used to be a second string somebody wrote to match the body. Here it IS the
#: body's own opening, passed once — so the two cannot disagree, and the de-duplication that
#: used to be a fragile prefix match is now a property of how the message was built.
#:
#: WHAT GOES WHERE: `fact` is the one line — what happened, no prefix, no dash. `do` is what
#: to do about it, one or more fragments joined into that line. `note` is the long half, and
#: it never rides in the line: `_hold` files it and the line says `journal next`.


def _say(fact: str, *do: str, rows=(), note: str = "") -> tuple:
    """One stop message: the fact on its own line, what to do about it under it.

    IT USED TO BE ONE LINE AND IT READ AS A WALL. Fact, em dash, instruction, semicolon,
    second instruction, all run together and wrapped by the terminal wherever it happened
    to end — so the reader had to parse a sentence to find the command. The user's word for
    it: a shit ton of text. What is on the screen now is a heading and an indented
    instruction, which is the same information and can be skimmed in one glance:

        1 untagged message(s)
          last at line 928; open the next with [!discovery] [!correction] [!blocked]
          [!info] [!reply]

    AND IT DOES NOT SAY `journal:` FIRST. The harness already labels this "Stop hook
    feedback:" before a word of ours is printed, so the prefix was the second label on the
    same line — the user has asked for it gone twice, and it survived both times because it
    is written here and complained about over there.

    THE FACT IS STILL WRITTEN ONCE. It is the first line here and the short label the user
    sees, so the two cannot disagree — that was the point of this function and it survives
    the reshaping intact.
    """
    # SEVERAL THINGS ARE A LIST, NOT A SENTENCE. `rows` is how a subject says "these N
    # things", and they are printed one per line under the fact. Nine open work subjects
    # joined with "; " and dropped mid-paragraph is what the user sent a screenshot of:
    # every one of them is a separate thing to act on, and a reader cannot count what is
    # not on its own line. The FACT stays one line, because it is also the hold's label.
    body = " ".join(d.strip() for d in do if d and d.strip())
    parts = [fact]
    if rows:
        parts.append("\n".join(say("row", row=fmt.gist(r)) for r in rows))
    if body:
        parts.append(fmt.wrap(body, indent=2))
    # AIR BETWEEN THE LIST AND WHAT TO DO ABOUT IT. The user's standing instruction about
    # every screen this package prints: on a new line, with some white space between.
    return (fact, ("\n\n" if rows and body else "\n").join(parts), note)


def _said(fact: str, *do: str) -> tuple:
    """The same message, SAID rather than held — the queue's `context-only` answer.

    The same shaper deliberately: a subject that only reports still puts the fact before what
    to do about it, and still must not be a place where the house style is re-invented
    because the delivery happens to differ.
    """
    return ("context-only", _say(fact, *do)[1])


#: THE SUBJECTS OF THE STOP QUEUE. Each returns None when nothing is pending, a
#: `(label, one-line brief[, details])` tuple for a hold, or `("context-only", text)` for a
#: line said rather than held. The number is the priority: lower runs first, and
#: `stop_priority` in settings.json overrides it per project.


@nudges.subject("claimed", 4)
def _p_claimed(conf: dict, ctx: Ctx, lines, stretch, here: str, active: bool):
    """THE SESSION THAT LOST AN ENVIRONMENT LEARNS IT FROM THE JOURNAL, not by contradiction.

    A claim unbinds this session, and nothing about being unbound looks like an event: the
    next write is simply refused, or worse, lands somewhere else. So the claim leaves a note
    on this session's runtime and it is read out here, once, ahead of everything — before
    even the environment subject, because "you are on no environment" is the CONSEQUENCE and
    this is the cause.

    Said once and cleared: it is news, and news repeated at every stop is a hold nobody
    reads.
    """
    return _claimed_note(ctx)


@nudges.subject("environment", 5)
def _p_track(conf: dict, ctx: Ctx, lines, stretch, here: str, active: bool):
    due = _track_due(conf, ctx)
    if not due:
        return None
    # THE LABEL IS THE FACT; THE BODY IS WHAT TO DO ABOUT IT. `_hold` prints them as one
    # line, so a body that opens by restating its own label says the fact twice in the
    # user's terminal — which four other subjects were also doing.
    return _say(say("taken_fact", env=due["track"]), say("taken_do", sid=due["by"][:8], age=due["age"]))


@nudges.subject("inbox", 7)
def _p_inbox(conf: dict, ctx: Ctx, lines, stretch, here: str, active: bool):
    waiting = inbox.unprocessed(ROOT, here)
    if not waiting:
        return None
    return _say(say("inbox_fact", n=len(waiting), first=waiting[0][0]), say("inbox_do"))


@nudges.subject("loop", 10)
def _p_loop(conf: dict, ctx: Ctx, lines, stretch, here: str, active: bool):
    # THE LOOP COMES FIRST. With auto on, everything the queue asks after this depends on
    # a session that wakes up by itself; without a loop an idle stop is the end of the list.
    m = conf.get("auto_loop_minutes", 0)
    if not m or not todo.auto(ROOT):
        return None
    # THE SAME CONDITION AS THE WRITE GATE: a loop is owed only when the list has something
    # ready for it to pick up. Open work alone is being worked; a loop would wake to nothing.
    if not todo.ready(ROOT, here):
        return None
    if _loop_running(ctx, lines):
        return None
    return _say(say("loop_fact"), say("loop_do", m=m))


@nudges.subject("context", 20)
def _p_context(conf: dict, ctx: Ctx, lines, stretch, here: str, active: bool):

    # ONE RUNG, ONCE; then, while the decision is owed, said again once per turn. The
    # PreToolUse gate enforces it between stops; this is the stop's share.
    got = context.pressure(ctx.path, conf["context_window"], state.get(ROOT, "window", 0) or 0, _caches(ctx.stem)[1])
    rung = _rung(conf, ctx, got, stretch) if got and got[3] else None
    if rung:
        return rung
    due = state.get(ROOT, "pin_due", None, stem=ctx.stem)
    if due:
        pct = 100 * due["used"] / due["window"] if due.get("window") else 0
        return _say(say("undecided_fact", pct=round(pct)), say("undecided_do"))
    return None


@nudges.subject("deferral", 30)
def _p_deferral(conf: dict, ctx: Ctx, lines, stretch, here: str, active: bool):
    due = _deferral(conf, ctx, at_stop=True)
    # BOTH HALVES. `_deferral` builds the evidence — the agent's own deferring sentence,
    # quoted back — and for a while this line returned only the instruction and dropped it.
    # The evidence is what lets a reader tell a real deferral from a false positive, and a
    # message assembled and thrown away is the wired-and-silent shape `verify` reports.
    return _say(say("deferral_fact"), due[0], note=due[1]) if due else None


@nudges.subject("untagged", 40)
def _p_untagged(conf: dict, ctx: Ctx, lines, stretch, here: str, active: bool):
    if not conf["hold_stop_on_untagged"]:
        return None
    missing = untagged(stretch, transcript.filing_units(lines))
    if not missing:
        return None
    floor = _floor(ctx, lines)
    held_at = max(state.get(ROOT, "held_at", 0, stem=ctx.stem), floor)
    newest = missing[-1].n
    if newest <= held_at:
        return None
    fresh = [m for m in missing if m.n > held_at]
    state.put(ROOT, "held_at", newest, stem=ctx.stem)
    taught = state.get(ROOT, "taught_vocabulary", False, stem=ctx.stem)
    if not taught:
        state.put(ROOT, "taught_vocabulary", True, stem=ctx.stem)
    return _say(say("untagged_fact", n=len(fresh)),
                say("untagged_do", line=fresh[-1].n, tags=[say("tag", tag=t) for t in tags.TAGS],
                    teach=None if taught else say("untagged_teach")))


def _session_live(name: str, stale_hours: float = 24.0) -> bool:
    """Is the session that opened this work still running? Its hook has run recently and it has not ended."""
    stem = name[:-len(".jsonl")] if name.endswith(".jsonl") else name
    if not stem or state.get(ROOT, "ended", None, stem=stem):
        return False
    seen = state.get(ROOT, "seen_at", 0, stem=stem) or 0
    return bool(seen) and time.time() - float(seen) < stale_hours * 3600


def _owners(ctx: Ctx) -> set:
    """The transcript name whose work this session is answerable for.

    IT WAS A SET FOR ONE REASON, and that reason is gone: a delegated subagent's writes
    carried its parent's transcript name, so the parent's name had to be matched too. A
    subagent no longer reaches the hook at all, so there is one owner and it is this one.
    The set survives because every caller asks `in` of it.
    """
    return {ctx.path.name if ctx.path else None}


@nudges.subject("work", 50)
def _p_work(conf: dict, ctx: Ctx, lines, stretch, here: str, active: bool):
    standing = work.open_work(ROOT)
    if not standing:
        return None
    # WAITING IS NOT IDLING. Work marked `work await` is in flight on something this agent
    # cannot hurry — a subagent, a build, a review — and holding it at every stop teaches
    # the reader to clear holds without reading them. The wait always expires, and the
    # expired ones are held FIRST and by name, because the question then is a real one.
    now = time.time()
    mine = [w for w in standing if w.get("session") in _owners(ctx)]
    late = [w for w in mine if work.expired(w, now) or work.gone(w)]
    if late:
        w = late[0]
        got = w["awaiting"]
        mins = int((now - (float(got["until"]) - float(got["minutes"]) * 60)) / 60)
        dead = work.gone(w) is not None
        who = work.named(got)
        work.woke(ROOT, w["subject"])   # said once; saying it again needs a new `await`
        return _say(
            say("waited_fact"),
            say("waited_dead", who=who, subject=w["subject"], what=got["what"]) if dead
            else say("waited_mins", subject=w["subject"], mins=mins, what=got["what"], who=who),
            say("waited_do"),
            note=say("waited_note", subject=w["subject"], what=got["what"], who=who,
                     how=say("waited_exited") if dead else say("waited_for", mins=mins)))
    standing = [w for w in standing if not work.awaiting(w, now) or work.gone(w)]
    # PARKED IS NOT IDLE EITHER, and unlike a wait it has no clock to bring it back: work
    # parked on a question stays open, says why, and is picked up by the first update on it.
    standing = [w for w in standing if not work.parked(w)]
    if not standing:
        return None
    if todo.auto(ROOT):
        # AUTO IS ON AND WORK IS OPEN AT A STOP: every turn, once. End it, or park what
        # is left as a to-do and end it; open work is never left standing.
        # BUT ONLY THIS SESSION'S. Told to `work end` work another session opened, an agent
        # closed work it knew nothing about, or the list never moved.
        owners = _owners(ctx)
        mine = [w for w in standing if w.get("session") in owners]
        if mine:
            listed = bool(todo.open_items(ROOT, here))
            return _say(
                    say("auto_open_fact"),
                    say("auto_open_do", tail=say("auto_open_listed") if listed else say("auto_open_never")),
                    rows=[w["subject"] for w in mine],
                    note=say("auto_open_note", names=[say("row", row=w["subject"]) for w in mine], env=here))
        # A GONE SESSION'S WORK IS HELD AT EVERY STOP: nothing else will end it, and the list waits on it.
        # A LIVE SESSION'S WORK IS SAID ONCE: it is being worked, and repeating it wakes this agent for nothing.
        gone = [w["subject"] for w in standing if not _session_live(str(w.get("session") or ""))]
        if gone:
            return _say(say("auto_inherited_fact"), say("auto_inherited_gone_do"), rows=gone)
        theirs = sorted(w["subject"] for w in standing)
        if theirs == state.get(ROOT, "inherited_said", [], stem=ctx.stem):
            return None
        state.put(ROOT, "inherited_said", theirs, stem=ctx.stem)
        return _say(say("auto_inherited_fact"), say("auto_inherited_do"), rows=theirs)
    # ONLY WORK THIS TRANSCRIPT OPENED, ONCE PER PIECE. Work opened elsewhere was told
    # at the start; work legitimately spans stops, and a hold that repeats until it
    # closes is a trap.
    owners = _owners(ctx)
    raw = state.get(ROOT, "held_work", {}, stem=ctx.stem)
    held = raw if isinstance(raw, dict) else {k: -1 for k in (raw or [])}
    fresh = [w for w in standing if w.get("session") in owners and w["subject"] not in held]
    if not fresh:
        return None
    for w in fresh:
        held[w["subject"]] = len(w.get("notes", []))
    state.put(ROOT, "held_work", held, stem=ctx.stem)
    # AWAIT IS OFFERED WHERE IT IS NEEDED, NOT ONLY WHERE IT IS DOCUMENTED. This hold fires
    # at the one moment an agent is stopped with work in flight — a build running, a
    # subagent out — and it used to offer only `end` and `update`, so an agent that had
    # never read the skill learned `await` from the user or not at all. Measured: exactly
    # that, twice in one session. A vocabulary taught only in a file nobody is required to
    # open is a vocabulary that does not exist.
    return _say(say("open_fact"), say("open_do", subjects=[w["subject"] for w in fresh]))


@nudges.subject("recall", 65)
def _p_recall(conf: dict, ctx: Ctx, lines, stretch, here: str, active: bool):
    """Say that the rules and pins exist, a few times a session. Never say what they are.

    THEY ARE HANDED OVER ONCE AND THEN LEFT TO ROT IN THE WINDOW. A session gets its rules
    and pins in full at its start, and after that nothing mentions them again until a
    compaction re-delivers them. A subagent is treated better than this — it gets the rules
    from the start is far behind and attention fades, and the main agent, which runs
    longest and holds the most, was told nothing.

    A POINTER, AND ONLY A POINTER. Re-injecting the claims would spend the context to fight
    a symptom of the context being full, and the user's instruction was explicit: remind the
    agent to look, do not print them all. So this is two numbers and two commands. What
    makes it land is that reading them is one command and being wrong about one is not.
    """
    if "recall" in conf["silenced"] or not conf["recall_ladder"]:
        return None
    ruled, pinned = len(pins.live(ROOT, pins.RULES)), len(pins.live(ROOT))
    if not (ruled or pinned):
        return None
    window = conf["context_window"] or (state.get(ROOT, "window", 0) or 0)
    if not window or ctx.path is None:
        return None
    used = context.reading_tail(ctx.path)
    if used is None:
        return None
    done = state.get(ROOT, "recalled", [], stem=ctx.stem)
    passed = [m for m in sorted(conf["recall_ladder"]) if used / window >= m and m not in done]
    if not passed:
        return None
    state.put(ROOT, "recalled", list(done) + passed, stem=ctx.stem)
    counted = ([say("rules_n", n=ruled)] if ruled else []) + ([say("pins_n", n=pinned)] if pinned else [])
    # READING THEM IS THE MOMENT TO JUDGE THEM, and the two are one command apart. A field
    # report: "Both times I obeyed it, spotted one wrong pin, fixed that one, and moved on.
    # It never occurred to me to run the full cleanup, because nothing in the nudge said
    # cleanup — and re-reading pins is exactly the moment you'd catch a dead one." So when
    # a pass is owed this points at the pass, and when it is not it stays two commands.
    import cleanup as cleanup_mod
    try:
        due = cleanup_mod.owed(ROOT, here)
    except Exception:
        due = False
    if due:
        return _said(say("recall_fact", counted=counted), say("recall_owed"))
    return _said(say("recall_fact", counted=counted), say("recall_read"))


@nudges.subject("cleanup", 70)
def _p_cleanup(conf: dict, ctx: Ctx, lines, stretch, here: str, active: bool):
    """The record has entries with evidence against them — said once, never held.

    TAUGHT AT THE MOMENT IT ANSWERS, which is the standing rule: a command reachable only
    through the skill or its own help is a command the agent meets the moment and does not
    know exists. `cleanup` was being done by the USER instead, pasted in by hand session
    after session — remove the obsolete rules, clear the docs nobody uses, strike the
    stale pins — which is the definition of a thing the tool never learned.

    SAID, NOT HELD, and last in the queue. Nothing here blocks anyone: a stale pin is a
    slow cost, and a hold that fires when nothing has to move is what teaches a reader to
    clear a hold without reading it. It also repeats only when the set of candidates
    CHANGES, so a reader who judged them and left them costs one line, once.
    """
    if work.open_work(ROOT):
        return None
    import cleanup as cleanup_mod
    try:
        found = cleanup_mod.candidates(ROOT, here, stale_hours=conf["session_stale_hours"])
    except Exception:
        return None
    never = cleanup_mod.last_read(ROOT, here)
    if not found and not cleanup_mod.owed(ROOT, here):
        return None
    key = sorted(f"{f['kind']}{f['n']}{f['text'][:20]}" for f in found) + [never]
    if key == state.get(ROOT, "cleanup_said", [], stem=ctx.stem):
        return None
    state.put(ROOT, "cleanup_said", key, stem=ctx.stem)
    if found:
        return _said(say("cleanup_fact", n=len(found), kinds=sorted({f["kind"] for f in found})),
                     say("cleanup_do", never=never))
    # NOTHING MECHANICAL TO SAY, AND STILL SOMETHING OWED. The rot that matters most leaves
    # no trace a command can find, so an empty findings list is not a clean record — it is a
    # record nobody has read. This is the only thing the hook can say about it: how long.
    return _said(say("cleanup_clean_fact", never=never), say("cleanup_clean_do"))


@nudges.subject("comments", 8)
def _p_comments(conf: dict, ctx: Ctx, lines, stretch, here: str, active: bool):
    import comments
    fresh = comments.untold(ROOT, here)
    if not fresh:
        return None
    head = (say("commented_one", label=comments.label(fresh[0][1]["about"])) if len(fresh) == 1
            else say("commented_many", n=len(fresh)))
    said = _say(head, say("commented_do"),
                rows=[say("commented_row", n=n, label=comments.label(c["about"]), text=c["text"]) for n, c in fresh])
    # TOLD ONCE THE MESSAGE EXISTS. Marked first, a failure building it lost the comments for good.
    comments.mark_told(ROOT, here, [n for n, _ in fresh], todo.now())
    return said


@nudges.subject("questions", 45)
def _p_questions(conf: dict, ctx: Ctx, lines, stretch, here: str, active: bool):
    import questions
    fresh = questions.untold(ROOT, here)
    if not work.open_work(ROOT):
        # WITH NOTHING OPEN, THE AUTO NOTICE TELLS AN ANSWERED TO-DO'S QUESTIONS BESIDE IT, but only
        # when it will: auto off, or auto on with an answered to-do next in line. An answered to-do
        # that is not ready (it waits on another) was skipped here and never named there.
        ready = todo.ready(ROOT, here)
        if not todo.auto(ROOT) or (ready and todo.answered_one(ready[0])):
            left = {f"todo:{t['n']}" for t in todo.answered(ROOT, here)}
            fresh = [(n, q) for n, q in fresh if not left & set(q.get("links") or [])]
    if not fresh:
        return None
    head = (say("answered_one", n=fresh[0][0]) if len(fresh) == 1
            else say("answered_many", n=len(fresh)))
    said = _say(head, say("answered_do"),
                rows=[say("answered_row", n=n, text=q["text"], answer=q["answer"],
                          changed=say("answer_changed") if q.get("earlier_answers") else None) for n, q in fresh])
    questions.mark_told(ROOT, here, [n for n, _ in fresh], todo.now())
    return said


def _told_with(here: str, rows: list[dict]) -> None:
    import questions
    refs = {f"todo:{t['n']}" for t in rows}
    ns = [n for n, q in questions.untold(ROOT, here) if refs & set(q.get("links") or [])]
    if ns:
        questions.mark_told(ROOT, here, ns, todo.now())


@nudges.subject("suggestions", 46)
def _p_suggestions(conf: dict, ctx: Ctx, lines, stretch, here: str, active: bool):
    import questions
    import suggestions
    fresh = suggestions.untold(ROOT, here)
    if not fresh:
        return None
    rows = []
    for n, s in fresh:
        st = suggestions.status(s)
        if st == "declined":
            rows.append(say("decided_declined", n=n, title=s["title"], why=s.get("declined") or None))
        else:
            rows.append(say(f"decided_{st}", n=n, title=s["title"], todo=questions.label(s["became"])))
    head = say("decided_one", n=fresh[0][0]) if len(fresh) == 1 else say("decided_many", n=len(fresh))
    said = _say(head, say("decided_do"), rows=rows)
    suggestions.mark_told(ROOT, here, [n for n, _ in fresh], todo.now())
    return said


@nudges.subject("suggest_hint", 47)
def _p_suggest_hint(conf: dict, ctx: Ctx, lines, stretch, here: str, active: bool):
    """A reply that proposes a change and filed nothing: say once that a suggestion exists for that. Never held."""
    if ctx.path is None:
        return None
    asked = state.get(ROOT, "prompt", None, stem=ctx.stem)
    if not asked or asked.get("opinion") or _filed(here) > asked.get("filed", 0):
        return None
    if (state.get(ROOT, "suggest_hints", 0, stem=ctx.stem) or 0) >= 3:
        return None
    got = transcript.last_reply(ctx.path)
    if not got:
        return None
    text, uid = got
    if uid in (state.get(ROOT, "suggest_hint_at", "", stem=ctx.stem), state.get(ROOT, "deferral_at", "", stem=ctx.stem)):
        return None
    plain = re.sub(r"```.*?```|`[^`]*`", " ", text, flags=re.S)
    plain = "\n".join(l for l in plain.splitlines() if not l.lstrip().startswith(">"))
    m = _PROPOSES.search(plain)
    if not m:
        return None
    state.put(ROOT, "suggest_hint_at", uid, stem=ctx.stem)
    state.put(ROOT, "suggest_hints", (state.get(ROOT, "suggest_hints", 0, stem=ctx.stem) or 0) + 1, stem=ctx.stem)
    return _said(say("suggest_hint_fact", said=fmt.gist(m.group(0), 90)), say("suggest_hint_do"))


@nudges.subject("auto", 60)
def _p_auto(conf: dict, ctx: Ctx, lines, stretch, here: str, active: bool):
    if work.open_work(ROOT):
        return None
    waiting = todo.open_items(ROOT, here)
    ids = sorted(t["n"] for t in waiting)
    if not ids:
        return None
    auto = todo.auto(ROOT)
    ready = todo.ready(ROOT, here)
    unstuck = todo.answered(ROOT, here)
    if auto and not ready:
        # NOTHING TO PICK UP, AND THE TWO REASONS ARE DIFFERENT. Waiting on the user means
        # somebody must answer; set aside means a condition is not true yet and the agent
        # itself decides when it is. Said once per state, and it must NAME which, or a list
        # that has quietly stopped offering anything looks like a list that is finished.
        held_back = todo.blocked(ROOT, here)
        owed = [t for t in todo.open_items(ROOT, here) if todo.waiting_on(ROOT, here, t)]
        if ids != state.get(ROOT, "todos_said", [], stem=ctx.stem):
            state.put(ROOT, "todos_said", ids, stem=ctx.stem)
            import plans
            stalled = plans.stall(ROOT, here)
            if stalled:
                return _said(stalled)
            if held_back and not todo.asking(ROOT, here):
                return _said(say("aside_fact", env=here),
                             say("aside_do", rows=[say("aside_row", n=t["n"], why=t["blocked"]) for t in held_back[:3]]))
            # EVERY REASON, OR THE COUNT IS A LIE BY OMISSION. This named two of the four
            # ways a row can be unstartable and left out the one the reader can actually
            # act on — measured here: a list with a to-do waiting on the user and one set
            # aside reported "1 set aside on a condition" and never mentioned the question,
            # while `journal next`, asked the same thing one command later, reported the
            # question and never mentioned the set-aside row. Two messages, two different
            # halves of the truth, neither of them wrong on its own.
            reasons = (
                (todo.asking(ROOT, here), say("reason_asking")),
                (held_back, say("reason_aside")),
                (owed, say("reason_after")),
                ([t for t in todo.open_items(ROOT, here) if t.get("reported")], say("reason_reported")),
                ([t for t in todo.open_items(ROOT, here) if t.get("assigned") and not t.get("reported")], say("reason_held")),
            )
            why = [say("reason", n=len(rows), what=what) for rows, what in reasons if rows]
            return _said(say("stuck_fact", env=here),
                         say("stuck_do", why=why, asked=say("stuck_asked") if todo.asking(ROOT, here) else None))
        return None
    if not auto:
        if not unstuck:
            return None
        key = [str(t["n"]) for t in unstuck]
        if key == state.get(ROOT, "answered_said", [], stem=ctx.stem):
            return None
        state.put(ROOT, "answered_said", key, stem=ctx.stem)
        _told_with(here, unstuck)
        t = unstuck[0]
        blocks = [say("answered_block", n=u["n"], title=u["title"], asks=u["asks"], answer=u["answer"])
                  for u in unstuck]
        return _say(say("user_answered_fact", n=t["n"]), say("user_answered_do", title=t["title"], n=t["n"]),
                    note=say("user_answered_note", blocks=blocks, n=t["n"]))
    nxt = ready[0]
    if todo.answered_one(nxt):
        _told_with(here, unstuck)
        blocks = [say("answered_block", n=u["n"], title=u["title"], asks=u["asks"], answer=u["answer"])
                  for u in unstuck]
        rest = [say("list_row", n=str(t["n"]).rjust(3), title=t["title"], asks=None)
                for t in waiting if not todo.answered_one(t)]
        return _say(say("auto_answered_fact", n=nxt["n"]), say("auto_answered_do", title=nxt["title"], n=nxt["n"]),
                    note=say("auto_answered_note", blocks=blocks, n=nxt["n"], rest=rest))
    rows = [say("list_row", n=str(t["n"]).rjust(3), title=t["title"], asks=t.get("asks")) for t in waiting]
    return _say(say("auto_next_fact", n=len(ids)), say("auto_next_do", n=nxt["n"]),
                note=say("auto_next_note", env=here, rows=rows, n=nxt["n"], loop=_loop_line(conf)))



#: What a running loop looks like in a transcript: the harness's scheduling tools, the
#: `loop` skill, or the user typing `/loop`.
_LOOP_TOOLS = frozenset({"CronCreate", "ScheduleWakeup", "Skill:loop"})


def _loop_running(ctx: Ctx, lines) -> bool:
    """Has this session a loop? Once seen it is remembered; `journal loop set` says so by hand."""
    if state.get(ROOT, "loop_set", False, stem=ctx.stem):
        return True
    for l in lines:
        # `/loop` COUNTS ONLY WHEN THE USER TYPED IT. A tool result or an injected block that
        # mentions it (a grep of a changelog, this very docstring) is not a loop running.
        if any(t in _LOOP_TOOLS for t in l.tools) or (l.kind == "human" and "/loop" in (l.text or "")):
            state.put(ROOT, "loop_set", True, stem=ctx.stem)
            return True
    return False


def _loop_owed(conf: dict, ctx: Ctx, here: str) -> str:
    """The refusal owed when auto is on and nothing will wake this session, or "".

    The same four exemptions the stop subject has, and for the same reasons: the setting
    turned off, auto off, a subagent (its parent owns the loop), a delegated session. And
    nothing is owed while the list has nothing ready — a loop that wakes to an empty list
    is noise, so the demand starts when there is something for it to pick up.
    """
    m = conf.get("auto_loop_minutes", 0)
    if not m or "loop" in conf["silenced"] or not todo.auto(ROOT):
        return ""
    if not todo.ready(ROOT, here):
        return ""
    # THE TRANSCRIPT IS READ ONLY HERE, on the last step before a refusal. `_loop_running`
    # also counts a loop it can SEE — the `/loop` the user typed, the tool that drives it —
    # and a session that started one and has not stopped since would otherwise be refused
    # for a loop it already has. That read costs real time on a large transcript, so it is
    # reached only when every cheaper condition already says a denial is owed.
    if _loop_running(ctx, transcript.read(ctx.path, _caches(ctx.stem)[0])[0] if ctx.path else []):
        return ""
    return say("loop_owed", env=here, m=m)


def _unbound(conf: dict, ctx: Ctx) -> bool:
    """Has this session still not chosen an environment?

    A SESSION IS UNBOUND UNTIL SOMEBODY CHOOSES. Not a subagent — a delegated one is put on
    its environment by the session that dispatched it, and an undelegated one is outside all
    of this — and not a session that has switched, delegated, or run under
    `bind_on_start`. Unbound, `tracks.current` answers "" — there is no default environment —
    so the CLI refuses a read as well as a write until one is picked; this is what both are
    held on.
    """
    if conf["bind_on_start"]:
        return False
    return not tracks.bound(ROOT, ctx.stem)


def _choice_line() -> str:
    """The one line the USER sees when a session starts with no environment."""
    names = tracks.choices(ROOT)
    return say("choice_line", names=[say("backticked", name=n) for n in names] or [say("none_exist")])


def _viewer_line(conf: dict) -> str:
    """The line the USER sees at a start: where the web viewer is, or how to start one."""
    if "viewer_line" in conf["silenced"]:
        return ""
    import serve
    url = serve.running(ROOT)
    return say("viewer_up", url=url) if url else say("viewer_down")


def _choose_block(where: str) -> str:
    """What the AGENT is told while the session is unbound. Said at the start and at each prompt."""
    names = tracks.choices(ROOT)
    have = [say("choose_row", name=n) for n in names] or [say("choose_none")]
    return say("choose", where=where, have=have)


def _track_due(conf: dict, ctx: Ctx) -> dict | None:
    """Is this session on an environment another live session holds? Written to runtime while it is.

    ONE SESSION WORKS AN ENVIRONMENT. Two agents on one environment share its open work and its to-do
    list, and two auto sessions would pick the same chore. So a session that starts on a
    taken environment — the project's start environment, usually, because the user opened a second
    terminal — is told at its start, held at its stops and refused edits until it has
    switched. A session that was here first is never moved.
    """
    if not conf["one_session_per_environment"] or "environment" in conf["silenced"] or "track" in conf["silenced"]:
        return None
    if _unbound(conf, ctx):
        return None   # nothing is held until an environment is chosen
    here = tracks.current(ROOT, ctx.stem)
    others = tracks.occupants(ROOT, here, ctx.stem, conf["session_stale_hours"])
    if not others:
        if state.get(ROOT, "track_due", None, stem=ctx.stem):
            state.put(ROOT, "track_due", None, stem=ctx.stem)
        return None
    sid, age = others[0]
    due = {"track": here, "by": sid, "age": tracks.age_text(age)}
    state.put(ROOT, "track_due", due, stem=ctx.stem)
    return due


def _taken_block(due: dict) -> str:
    return say("taken_block", env=due["track"], sid=due["by"][:8], age=due["age"])


#: Tools whose ENTIRE PURPOSE is to change a file. No judgement needed for these.
WRITE_TOOLS = frozenset({"Edit", "Write", "NotebookEdit", "MultiEdit", "Update"})

#: Commands whose job is to change something. Matched as the COMMAND, never as text.
WRITE_CMDS = frozenset({
    "rm", "rmdir", "mv", "cp", "mkdir", "touch", "chmod", "chown", "truncate", "dd",
    "tee", "install", "patch", "ln", "unlink", "rsync",
})

#: `git` is only a write in some of its moods.
WRITE_GIT = frozenset({"commit", "apply", "checkout", "reset", "restore", "rm", "mv", "add",
                       "clean", "merge", "rebase", "cherry-pick", "revert", "am", "pull", "switch"})
#: git subcommands that write unless they only list or show
WRITE_GIT_UNLESS_READ = frozenset({"stash", "worktree"})
#: git options that come before the subcommand and take a value
_GIT_VALUED = frozenset({"-C", "-c", "--git-dir", "--work-tree", "--namespace"})
#: where a redirect writes nothing the project owns: scratch and temporary files
_SCRATCH_DIRS = ("/tmp/", "/private/tmp/", "/var/folders/", "/private/var/folders/")
#: perl's in-place flag, alone or bundled: -i, -i.bak, -pi, -pie
_PERL_INPLACE = re.compile(r"^-[A-Za-z]*i")

#: Where one command ends and the next begins. A write anywhere in a chain is a write.
_SPLIT = re.compile(r"[;&|]+|\n")
#: Quoted text is DATA, not a command, and it must be removed before anything is matched.
_QUOTED = re.compile(r"'[^']*'|\"[^\"]*\"")
#: A HEREDOC BODY IS DATA TOO, and it is the biggest body of text a command ever carries.
#: In auto mode nearly every analysis runs as `python3 - <<'PY' … PY`, and a script that
#: says `if shown >= 6` was being read as a shell redirection and denied as a write. The
#: opening `<<WORD` is kept, so `cat > file <<EOF` is still a write on the strength of its
#: own `>` — what is dropped is only what the interpreter, not the shell, will read.
_HEREDOC = re.compile(r"<<-?\s*'?\"?([A-Za-z_][A-Za-z0-9_]*)'?\"?.*?(?:\1|$)", re.S)


#: Pieces that change nothing and may lead a line: moving into a directory, setting a
#: variable. `cd proj && journal work start "w" && git checkout -b x` declares before it writes.
_NEUTRAL = frozenset({"cd", "pushd", "popd", "export", "set", "true", ":"})
_REDIR = re.compile(r"^\d*>{1,2}(.*)$")


def _piece_is_write(words: list[str]) -> bool:
    """Does this one command of a chain change something on disk?"""
    if not words:
        return False
    for i, w in enumerate(words):
        m = _REDIR.match(w)
        if not m:
            continue
        target = m.group(1) or (words[i + 1] if i + 1 < len(words) else "")
        # `2>&1` and `>&2` move a file descriptor (`>&` was marked `>@` by `_pieces`);
        # `>/dev/null` throws output away. Both appear in ordinary reading — `2>&1` was
        # the third false positive this gate produced in a day, and every one stopped a
        # read.
        if target.startswith("@") or target.startswith("/dev/null"):
            continue
        # A READ SAVED TO A SCRATCH FILE CHANGES NOTHING THE PROJECT OWNS. `grep … > /tmp/out`
        # was refused as a write, under a message that says reads are never gated.
        if target.startswith(_SCRATCH_DIRS):
            continue
        return True
    verb = words[0]
    if _is_journal_verb(verb):
        # running a tool changes files; it needs declared work like any other write
        return len(words) > 2 and words[1] == "tools" and words[2] == "run"
    if verb in _NEUTRAL:
        return False
    if verb in WRITE_CMDS:
        return True
    # A COMMAND RUN BY ANOTHER COMMAND IS STILL THAT COMMAND. `ls | xargs rm` and
    # `find . -exec rm {} \;` were reads by their first word, and an agent refused for `rm`
    # learned they went through.
    if verb == "xargs":
        i = 1
        while i < len(words) and (words[i].startswith("-") or words[i].isdigit()):
            i += 1
        return _piece_is_write(words[i:])
    if verb == "find":
        if "-delete" in words:
            return True
        for flag in ("-exec", "-execdir", "-ok"):
            if flag in words:
                return _piece_is_write([w for w in words[words.index(flag) + 1:] if w not in ("{}", "\\", ";", "+")])
        return False
    if verb == "sed" and any(w.startswith("-i") or w == "--in-place" for w in words[1:]):
        return True
    if verb == "perl" and any(_PERL_INPLACE.match(w) for w in words[1:]):
        return True
    if verb == "git":
        # `git -C sub commit`: the subcommand is the first word that is not an option or its value
        i = 1
        while i < len(words) and words[i].startswith("-"):
            i += 2 if words[i] in _GIT_VALUED else 1
        sub = words[i] if i < len(words) else ""
        if sub in WRITE_GIT:
            return True
        if sub in WRITE_GIT_UNLESS_READ:
            return not (i + 1 < len(words) and words[i + 1] in ("list", "show"))
    return False


def _is_write(payload: dict) -> bool:
    """Is this tool call about to change something on disk?

    MATCHED AS A COMMAND, NEVER AS TEXT. The first version tested substrings — `"patch "`
    in the command line — and denied this, which is a pure read:

        cat resources/js/view/triggers.ts; echo "=== useDispatch ==="; cat …

    `useDis` + `patch ` matched inside a heading being echoed. The agent was reading, and
    it was made to declare work before it had learned enough to say what the work was.
    That is the worst possible failure for a gate: it fires on discovery, which is exactly
    when nobody can yet name the thing they are about to do, so it teaches that the gate is
    an obstacle to get around rather than a prompt to answer. Word boundaries are not a
    detail here; they are the difference between a prompt and a nuisance.

    So: quoted text is stripped first — it is data, not a command — the line is split on
    the separators that end a command, and each piece is judged by its FIRST WORD. The
    journal's own commands are never a write, but only THAT piece is exempt: the first
    version waved through any line that mentioned journal.py anywhere, so
    `journal todos add "x" && rm -rf build` was not a write.
    """
    name = payload.get("tool_name") or ""
    if name in WRITE_TOOLS:
        return True
    if name != "Bash":
        return False
    cmd = str((payload.get("tool_input") or {}).get("command", ""))
    return any(_piece_is_write(w) for w in _pieces(cmd))


def _is_journal_verb(word: str) -> bool:
    return word == "journal" or word.endswith("journal.py")


def _pieces(cmd: str) -> list[list[str]]:
    """Each command of a chain as its words, quotes and heredoc bodies removed.

    NEWLINES ARE SEPARATORS, SO THEY ARE NOT COLLAPSED FIRST. The first version joined
    the whole command on spaces before splitting, and `cd proj\njournal work start "w"`
    became one piece whose verb was `cd` — the `start` on the second line was never seen,
    and a line that declared before it wrote was denied. Heredoc bodies are removed on
    the raw text, where the newlines still say where a body begins and ends.

    `>&` IS A FILE-DESCRIPTOR DUP, NOT A SEPARATOR. Splitting on `&` cut `2>&1` into a
    redirect with no target, which read as a write, and stopped a read.
    """
    bare = _QUOTED.sub(" ", _HEREDOC_BODY.sub(r"\1", cmd)).replace(">&", ">@")
    out = []
    # A VARIABLE SET EARLIER IN THE LINE IS RESOLVED. `J=.journal/journal.py; $J remember`
    # is a common shape, and read literally its verb is `$J`, which is nobody's command:
    # the rung gate denied the very pin it was asking for. Only the simple form is
    # followed — NAME=value, then $NAME or ${NAME} leading a later piece.
    names: dict[str, str] = {}
    for piece in _SPLIT.split(bare):
        words = piece.split()
        while words and ("=" in words[0] or words[0] in ("sudo", "env", "time", "nohup")):
            w = words.pop(0)
            if "=" in w and w[0] not in "$-" and w.split("=", 1)[0].isidentifier():
                names[w.split("=", 1)[0]] = w.split("=", 1)[1]
        if words:
            head = words[0]
            if head.startswith("$"):
                head = names.get(head.strip("${}"), head)
            words[0] = head.rsplit("/", 1)[-1]
            # `python3 .journal/journal.py nothing "…"` IS the journal. Measured: a session
            # whose `journal` command was broken prefixed every call with python3, and the
            # context gate denied the very command that satisfies it, twice, while the
            # bare form passed. The interpreter is a wrapper, like sudo.
            if words[0] in ("python", "python3") and len(words) > 1 and words[1].endswith("journal.py"):
                words.pop(0)
                words[0] = words[0].rsplit("/", 1)[-1]
            out.append(words)
    return out


#: What a journal read is piped through. `journal --back=1 | head -40` is still reading.
_FILTERS = frozenset({"head", "tail", "grep", "cut", "wc", "sort", "uniq", "tr", "cat",
                      "less", "more", "fold", "column", "awk"})

def _declared_first(payload: dict) -> bool:
    """Does every write in this line come after a `journal work start` in the same line?

    `journal work start "w" && git commit` declares and then writes, in that order, which is
    exactly what the gate asks for. `cd proj && journal work start "w" && git checkout -b x`
    too: `cd` changes nothing. `git add && journal work start "w"` does not qualify — the
    write would run undeclared. The same shape the rung gate accepts: the deciding
    command leads, and neutral pieces before it do not count.
    """
    declared = False
    for words in _pieces(str((payload.get("tool_input") or {}).get("command", ""))):
        rest = _journal_args(words)
        if rest is not None and rest and (
                rest[0] == "start" or (rest[0] in ("todo", "todos", "work") and len(rest) > 1 and rest[1] == "start")):
            declared = True
        elif _piece_is_write(words) and not declared:
            return False
    return declared


def _journal_args(words: list[str]) -> list[str] | None:
    """The words after `journal`, its leading flags (`--env=x`, `--as=y`) skipped; None when this is not the journal."""
    if not words or not _is_journal_verb(words[0]):
        return None
    return [w for w in words[1:] if not w.startswith("-")]


#: The journal verbs that answer a context rung. A chain that OPENS with one of these has
#: decided before anything after it runs, so the rung gate lets the whole line through.
DECIDES = frozenset({"pin", "rule", "nothing"})
#: the two-word spellings that decide the same way: `pins add`, `rules add`
DECIDES_ADD = frozenset({"pins", "rules"})


def _is_journal(payload: dict) -> bool:
    """May this call pass the rung gate? Journal-only lines, or a line that decides first.

    `journal search x` and `journal conversation --back=1` are how the decision gets made, so a line of
    nothing but journal commands passes. `journal pins add "…" && git commit` passes too:
    the decision runs first and lifts the gate before the commit. `ls && journal nothing
    "…"` does not — the `ls` would run undecided.
    """
    if (payload.get("tool_name") or "") != "Bash":
        return False
    pieces = [w for w in _pieces(str((payload.get("tool_input") or {}).get("command", "")))
              if w[0] not in _NEUTRAL]
    if not pieces:
        return False
    if (any(_is_journal_verb(w[0]) for w in pieces)
            and all(_is_journal_verb(w[0]) or w[0] in _FILTERS for w in pieces)):
        return True
    rest = _journal_args(pieces[0])
    return bool(rest) and (rest[0] in DECIDES or (rest[0] in DECIDES_ADD and len(rest) > 1 and rest[1] == "add"))


def _journal_only(payload: dict) -> bool:
    """Is this line nothing but the journal's own commands, and filters over their output?

    NOT `_is_journal`. That one also passes a line that OPENS with a decision, because it
    answers the context rung, and it is right for that gate alone. Used for the others, it let
    `journal nothing "x"; rm -rf build` past the environment, loop and wait gates, the `rm`
    riding on a decision nobody owed.
    """
    if (payload.get("tool_name") or "") != "Bash":
        return False
    pieces = [w for w in _pieces(str((payload.get("tool_input") or {}).get("command", "")))
              if w[0] not in _NEUTRAL]
    return bool(pieces) and any(_is_journal_verb(w[0]) for w in pieces) and \
        all(_is_journal_verb(w[0]) or w[0] in _FILTERS for w in pieces)


#: Where a `pin` stops on a command line: the next shell separator or redirection.
_SEPARATORS = frozenset({"&&", "||", ";", "|", "&"})
_REDIRECT = re.compile(r"^\d*[<>]")

#: A HEREDOC BODY, ON THE RAW COMMAND. The opener's line is kept and everything from the
#: next line to the terminator is dropped. Distinct from `_HEREDOC` above, which runs on a
#: whitespace-collapsed line; this one needs the newlines to know where the body starts.
#: Caught live: a patch script piped through `python3 - <<'PY'` mentioned
#: `journal.py pins add "<the claim>"` in a string, and the pin gate denied the patch.
_HEREDOC_BODY = re.compile(r"(<<-?\s*['\"]?(\w+)['\"]?[^\n]*)\n.*?(?:\n\2(?=\n|$)|\Z)", re.S)


def _pin_overflow(payload: dict, limit: int) -> str | None:
    """The refusal a `journal pin` on this command line would earn, before it runs.

    THE COMMAND'S OWN EXIT 1 WAS NOT ENOUGH. It is a line of stderr after the fact, and a
    reader in the middle of a thought reads past it and carries on believing the pin
    stands. A denied tool call is not readable past: the command never ran, and the reason
    is the whole of what comes back. So the fact is read off the command line here — the
    same tokens `journal.py` would join — and judged by the same function the CLI uses.

    If the line cannot be parsed it is left to the CLI: a gate that guesses at a quoting
    it did not understand would deny reads, and that is the failure this file keeps
    measuring. The miss costs one refused command; the guess costs trust in the gate.
    """
    if (payload.get("tool_name") or "") != "Bash":
        return None
    cmd = str((payload.get("tool_input") or {}).get("command", ""))
    if "journal" not in cmd or not ("pin" in cmd or "rule" in cmd):
        return None
    import shlex
    # ONE LINE AT A TIME. A newline ends a command as surely as `&&`, and shlex treats it
    # as whitespace: a rule of 330 characters followed by four more commands on their own
    # lines was measured as 536 and refused, with the next four commands quoted back as
    # the part to cut.
    for line in _HEREDOC_BODY.sub(r"\1", cmd).splitlines():
        if "journal" not in line or not ("pin" in line or "rule" in line):  # `pins`/`rules` contain both
            continue
        try:
            toks = shlex.split(line)
        except ValueError:
            continue
        for i, t in enumerate(toks):
            # THE CANONICAL SPELLINGS REACH THIS GATE TOO. It matched only the bare singular
            # verbs, so `journal pins add "…"` and `journal rules add "…"` — the plurals
            # ruling R1 made canonical, and the ones the skill teaches first — tokenise as
            # [journal, pins, add, …] and never matched. The gate was dark on the spelling
            # everybody uses, and the CLI's own refusal was the only thing left catching it,
            # after the command had already run.
            if t in ("pins", "rules") and i > 0 and "journal" in toks[i - 1] \
                    and i + 1 < len(toks) and toks[i + 1] == "add":
                start = i + 2
            elif t in ("pin", "rule") and i > 0 and "journal" in toks[i - 1]:
                start = i + 1
            else:
                continue
            fact = []
            for t2 in toks[start:]:
                # A redirection ends the fact as surely as a pipe: `2>&1 | tail -1` was
                # being counted as five characters of claim.
                if t2 in _SEPARATORS or _REDIRECT.match(t2):
                    break
                if t2.startswith("--"):
                    continue
                fact.append(t2)
            got = pins.refused(" ".join(fact), limit)
            if got:
                return got
    return None


_SHELL_BREAKS = frozenset({"&&", "||", "|", ";"})


#: A redirection is the shell's, never an argument: `2>&1`, `2>/dev/null`, `>out`, `&>log`, and a bare `>` before its file.
_REDIRECT = re.compile(r"^(\d*>>?|\d*<|&>>?)(&?\d+|\S+)?$")


def _command_words(toks: list[str], start: int) -> list[str]:
    """The words of one journal command from its verb: up to the next separator, even one glued to a word
    (`-150;`), and without the shell's redirections. `journal todos --all 2>&1` once read as `todos add "2>&1"`,
    a write, and a subagent's plain read was refused for it."""
    out: list[str] = []
    k = start
    while k < len(toks):
        tok = toks[k]
        if tok in _SHELL_BREAKS:
            break
        glued = next((b for b in (";", "&&", "||", "|") if tok.endswith(b) and tok != b), None)
        word = tok[: -len(glued)] if glued else tok
        if _REDIRECT.match(word):
            # a bare `>` or `2>` takes the next word as its file
            if re.fullmatch(r"\d*>>?|\d*<|&>>?", word) and not glued:
                k += 1
        elif word:
            out.append(word)
        if glued:
            break
        k += 1
    return out


def _journal_lines(line: str) -> list[str]:
    """The line as the shell runs it: heredoc bodies dropped, `NAME=value` variables put back, and each
    `bash -c` / `sh -c` script as a line of its own.

    A SUBAGENT'S PIN HID BEHIND A VARIABLE. `J=.journal/journal.py; $J pins add "x"` and
    `bash -c ".journal/journal.py pins add x"` were not seen as journal writes at all, so an
    agent that was lent nothing filed a pin under its dispatcher's name. And a heredoc body is
    data: a patch script that merely mentions `suggestions accept` was refused as a decision.
    """
    line = _HEREDOC_BODY.sub(r"\1", line)
    names = {k: v.strip("'\"") for k, v in re.findall(r"(?:^|[\s;&|])([A-Za-z_][A-Za-z0-9_]*)=([^\s;&|]+)", line)}

    def put(text: str) -> str:
        return re.sub(r"\$\{?([A-Za-z_][A-Za-z0-9_]*)\}?", lambda m: names.get(m.group(1), m.group(0)), text)

    return [put(line)] + [put(m.group(2)) for m in re.finditer(r"\b(?:ba|z)?sh\s+-c\s+(['\"])(.*?)\1", line, re.S)]


def _journal_cmds(payload: dict) -> list[tuple[str, object, list[str]]] | None:
    """(verb, command, its words) for each journal command a Bash line runs; None when a journal line cannot be read."""
    if (payload.get("tool_name") or "") != "Bash":
        return []
    # NOT AT THE TOP, AND THIS IS THE CASE THE RULE NAMES. `commands` pulls in every command
    # module and its controllers, and this hook is a fresh interpreter on EVERY tool call. The
    # two places that read the registry are both behind this Bash check, so a Read, an Edit or a
    # Grep paid for it and used none of it. Measured end to end on a Read: 72.6ms before, 58.9ms
    # after — 14ms back on every non-Bash call, which is most of them.
    import commands
    import shlex
    found = []
    for text in _journal_lines(str((payload.get("tool_input") or {}).get("command", ""))):
        if "journal" not in text:
            continue
        try:
            toks = shlex.split(text)
        except ValueError:
            return None
        for i, t in enumerate(toks[:-1]):
            if "journal" not in t:
                continue
            # THE VERB IS THE FIRST WORD THAT IS NOT A FLAG, so `journal --env=other pins add "x"` is a write.
            j = i + 1
            while j < len(toks) and toks[j].startswith("-"):
                j += 1
            verb = toks[j] if j < len(toks) else ""
            if commands.REGISTRY.knows(verb):
                cmd = commands.REGISTRY.command_of(_command_words(toks, j))
                if cmd is not None:
                    found.append((verb, cmd, toks[j:]))
    return found


#: the commands that close a to-do row, which only the session that owns the row may run
_CLOSES_ROW = frozenset({"todos:done", "todos:drop", "todos:reopen"})


def _closes_row(cmd, words: list[str]) -> bool:
    signature = str(getattr(cmd, "signature", "") or "")
    name = signature.split()[0] if signature else ""
    return name in _CLOSES_ROW or (name in ("work:end", "end") and any(w in ("--todo", "--todos") for w in words))


def _journal_write(payload: dict) -> str | None:
    """The journal write verb on this command line, if it is one, anywhere in a chain."""
    for verb, cmd, words in _journal_cmds(payload) or ():
        if cmd.writes and not (cmd.reads_bare and len(words) == 1):
            return verb
    return None


def _user_only(payload: dict) -> str | None:
    """The verb of a journal command on this line that only the user may run, or None."""
    if (payload.get("tool_name") or "") != "Bash":
        return None
    line = _HEREDOC_BODY.sub(r"\1", str((payload.get("tool_input") or {}).get("command", "")))
    if "journal" not in line:
        return None
    import commands   # see `_journal_cmds`: only a Bash line ever needs the registry
    import shlex
    try:
        toks = shlex.split(line)
    except ValueError:
        return None
    for i, t in enumerate(toks[:-1]):
        if "journal" not in t:
            continue
        j = i + 1
        while j < len(toks) and toks[j].startswith("-"):
            j += 1
        if j >= len(toks) or not commands.REGISTRY.knows(toks[j]):
            continue
        end = next((k for k in range(j, len(toks)) if toks[k] in _SHELL_BREAKS), len(toks))
        cmd = commands.REGISTRY.command_of(toks[j:end])
        if cmd is not None and getattr(cmd, "user_only", False):
            return cmd.signature.split()[0].partition(":")[2] or toks[j]
    return None


def on_pre_tool(conf: dict, payload: dict, ctx: Ctx) -> int:
    """Refuse a write while no work is open. The one rule that stands IN THE PATH of an act.

    Everything else here is a nudge after the fact: the stop hook says a message went
    unfiled once it is already unfiled, and the agent can read past it. Measured on a live
    session doing eight hours of real work — 843 lines, every message dutifully tagged, and
    `journal work start` run EXACTLY ZERO TIMES. The free thing got used and the costly one did
    not, which is what always happens when one rule is a side effect and the other is a
    discipline.

    So this is the second rule, and it is deliberate that there are now two. A gate is
    expensive — it stops work — and it earns that only where a nudge has been shown not to
    land. That evidence now exists.

    IT NAMES THE WAY OUT IN THE MESSAGE, and the way out is one command. A gate that says
    "denied" without saying how to proceed is an obstacle; one that hands you the next line
    is a prompt. And it never blocks `journal.py` itself, because declaring the work is the
    escape and a gate that locks its own door is a trap.
    """
    # The first event a transcript's hook sees is nearly always a tool call, so this is
    # where a session joined late gets its floor. One small read, once.
    _floor(ctx)
    _note_dispatch(payload, ctx)
    over = _pin_overflow(payload, conf["pin_max_chars"])
    if over:
        return _deny(say("pin_refused", why=over))
    # A RUNG WAS ANNOUNCED AND NOTHING WAS DECIDED. The hold at the stop was measured and
    # did not land — the user had to ask for the pin — so until `pin` or `nothing`
    # has run, no other tool does. Reads too, this once: the decision needs thought, not
    # more files, and the transcript stays readable through the journal's own commands,
    # which are never gated because they are the way out.
    if not _is_journal(payload):
        put_off = _deferral(conf, ctx)
        if put_off:
            return _deny(say("deferral_deny", do=put_off[0], why=put_off[1]))
    due = state.get(ROOT, "pin_due", None, stem=ctx.stem)
    if due and not _is_journal(payload):
        pct = 100 * due["used"] / due["window"] if due.get("window") else 0
        return _deny(say("context_deny", pct=round(pct)))
    # A DISPATCH NAMES ITS MODEL (rule B1). Unset hands out this session's own model, the most expensive in the room.
    # A fork cannot take one, and a custom agent whose definition sets one has already decided.
    if payload.get("tool_name") == "Agent":
        given = payload.get("tool_input") or {}
        kind = str(given.get("subagent_type") or "")
        if not str(given.get("model") or "").strip() and kind != "fork" and not agents.defined_model(ROOT.parent, kind):
            return _deny(say("model_denied"))
    # WITH AUTO ON, A QUESTION TO THE USER IS THE ONE MOVE THAT STOPS THE LIST. The user
    # switched auto on to be away; AskUserQuestion halts the session until they are back,
    # which is exactly what auto was turned on to prevent. The skill says to decide and
    # file the choice, or `todos ask` so the list moves on to the next row — so those are
    # the two ways out, and this is a denial rather than a hold because a hold arrives
    # after the question is already on screen.
    if payload.get("tool_name") == "AskUserQuestion" and todo.auto(ROOT):
        return _deny(say("ask_denied"))
    # A DECISION ON A SUGGESTION IS THE USER'S: the agent that proposed a change cannot also approve it.
    mine = _user_only(payload)
    if mine:
        return _deny(say("user_only", verb=mine))
    # A WAIT ENDS WHEN THE WORK STARTS AGAIN, without being told. The user's ruling. `await`
    # buys silence, and that silence is right while the agent is blocked and wrong the
    # instant it is not — and the agent that has picked the work back up is the last thing
    # that will remember to say so. A WRITE is the signal and a read is not: reading IS what
    # waiting looks like (polling a log, checking a build), so a read leaves the wait
    # standing, and this is the same line the gate below already draws.
    if _is_write(payload) and not _journal_only(payload):
        woke = work.resumed(ROOT, _owners(ctx))
        if woke:
            state.put(ROOT, "held_work", {}, stem=ctx.stem)   # it may be held for again
    if _is_write(payload) and not _journal_only(payload) and _unbound(conf, ctx):
        return _deny(say("unbound_deny", block=_choose_block("")))
    if _is_write(payload) and not _journal_only(payload):
        taken = _track_due(conf, ctx)
        if taken:
            return _deny(_taken_block(taken))
    # AUTO WITHOUT A LOOP IS A PROMISE NOTHING KEEPS. Auto says the list drains while the
    # user is away; a session with no loop stops at its first idle stop and the list sits
    # there until somebody comes back — which is the one thing auto was turned on to avoid.
    # This was a HOLD at the stop, and it leaked twice over: a subject fires at most once
    # per stop-chain, so an agent that worked through it was not asked again for an hour,
    # and a hold is advice arriving at the moment the agent is trying to finish. Measured by
    # the user: "the agent forgets to turn the loop on quite often after turning on auto".
    # A denial cannot be stepped over. Reads are never gated, and neither is the journal's
    # own CLI — `journal loop set` is the way out and must always run.
    if _is_write(payload) and not _journal_only(payload):
        owed = _loop_owed(conf, ctx, tracks.current(ROOT, ctx.stem))
        if owed:
            return _deny(owed)
    try:
        _snapshot_files(payload, ctx)
    except Exception as e:  # counting files must never stop a tool call
        print(f"journal files: {e}", file=sys.stderr)
    if not conf["gate_writes_on_start"] or "gate" in conf["silenced"]:
        return 0
    if not _is_write(payload) or work.open_work(ROOT) or _declared_first(payload):
        return 0
    return _deny(say("gate"))


def _deny(reason: str) -> int:
    """Refuse the tool call, with the way out in the message. The one hold before an act.

    IT SAYS WHICH JOURNAL IS SPEAKING. There can be more than one on a machine and more than
    one in a session's reach: a subagent dispatched from here runs under THIS project's
    hook, whatever directory it was sent to work in — so an agent working in another
    project, against another journal, is refused by this one, judged against this one's
    record. Measured: a dogfood agent spent most of its run trying flag after flag against a
    journal that was never the one refusing it, and no message it received named either.
    One word makes the mismatch legible in the line that reports it.
    """
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": fmt.block(say("deny", project=ROOT.parent.name, reason=reason)),
    }}))
    return 0


#: A REDIRECT, NOT ANY `>`. This matched the `>` inside a PLACEHOLDER — `environments/
#: <lent>/todo/NNN-*.md`, written in a docstring — and told the reader they had written a
#: loose markdown file. A shell redirect is preceded by whitespace or starts the command;
#: a `>` closing an angle-bracket placeholder is preceded by a word character. One
#: character of context separates a hint that is right from one that teaches the reader to
#: skim every hint after it.
_MD_WRITE = re.compile(r"(?:^|\s)(?:>>?|tee(?:\s+-a)?)\s*['\"]?([^\s'\"|;&]+\.md)\b")


def _raw_markdown(conf: dict, payload: dict, ctx: Ctx) -> str | None:
    """A markdown file written by hand, not through the journal: a hint, once per file.

    A HINT, NEVER A HOLD. The user's ruling. Writing docs by hand is fine and sometimes
    right — a README, a changelog — but a design or a report written as a loose file is
    one the catalogue does not know, no session is handed, and search does not find. So
    the first write to a given .md file says so, once, and names the command. The
    journal's own writes are exempt, and so is anything already catalogued: editing a
    doc's own file by hand is how a human maintains it.
    """
    if "markdown_hint" in conf["silenced"]:
        return None
    name = payload.get("tool_name") or ""
    inp = payload.get("tool_input") or {}
    path = ""
    if name in ("Write", "Edit", "MultiEdit", "NotebookEdit"):
        path = str(inp.get("file_path") or "")
    elif name == "Bash":
        cmd = str(inp.get("command") or "")
        # the journal's own commands are exempt — judged by the verb, not by the substring,
        # because `.journal/docs/x.md` contains the word too
        if any(_is_journal_verb(w[0]) for w in _pieces(cmd)):
            return None
        m = _MD_WRITE.search(cmd)
        path = m.group(1) if m else ""
        # AND THE FILE HAS TO BE THERE. A regex cannot tell a redirect the shell RAN from
        # the same characters sitting inside a quoted string or a heredoc — `echo "x >
        # notes.md"` writes nothing and reads identically. This runs after the tool did,
        # so it can stop guessing and look: no file, no write, no hint.
        if path and not (Path(path) if Path(path).is_absolute()
                         else ROOT.parent / path).is_file():
            return None
    if not path.endswith(".md"):
        return None
    try:
        rel = str(Path(path).resolve().relative_to(ROOT.parent.resolve()))
    except ValueError:
        rel = path
    if rel.startswith(".claude/") or rel.lower().startswith("readme") or (
            rel.startswith(".journal/") and not rel.startswith(".journal/docs/")):
        return None
    try:
        for d in docs._load(ROOT):
            if d["path"].resolve() == Path(path).resolve() or any(
                    x["path"].resolve() == Path(path).resolve() for x in d["parts"]):
                return None
    except Exception:
        pass
    said = state.get(ROOT, "md_hinted", [], stem=ctx.stem) or []
    if rel in said:
        return None
    state.put(ROOT, "md_hinted", (said + [rel])[-50:], stem=ctx.stem)
    return say("markdown_hint", path=rel)


#: SOURCE OR REFERENCE. A file the project is built from is source: it has a source
#: extension, or git environments it. A file the agent keeps coming back to for what it SAYS —
#: a rendered design, an export, a PDF the user sent, a log — is reference material, and
#: the doc it belongs to is where it should be attached. Neither list has to be complete:
#: an unknown untracked file inside the project is left alone, and only a file outside
#: the project is judged by not being source.
_SOURCE_EXT = frozenset({
    ".py", ".pyi", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".vue", ".svelte", ".php", ".blade", ".rb",
    ".go", ".rs", ".java", ".kt", ".kts", ".swift", ".c", ".h", ".cc", ".cpp", ".hpp", ".cs", ".m", ".mm",
    ".scala", ".clj", ".ex", ".exs", ".erl", ".hs", ".lua", ".pl", ".pm", ".r", ".jl", ".dart", ".sh", ".bash",
    ".zsh", ".fish", ".ps1", ".sql", ".graphql", ".gql", ".proto", ".css", ".scss", ".sass", ".less", ".styl",
    ".json", ".jsonc", ".yaml", ".yml", ".toml", ".ini", ".cfg", ".conf", ".env", ".lock", ".xml", ".xsl",
    ".twig", ".jinja", ".j2", ".hbs", ".ejs", ".erb", ".haml", ".pug", ".njk", ".liquid", ".mustache",
    ".make", ".mk", ".cmake", ".gradle", ".sbt", ".pom", ".ipynb", ".tf", ".hcl", ".dockerfile",
})
_REFERENCE_EXT = frozenset({
    ".html", ".htm", ".pdf", ".csv", ".tsv", ".xlsx", ".xls", ".docx", ".doc", ".pptx", ".ppt", ".odt", ".ods",
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp", ".tiff", ".txt", ".log", ".rtf", ".eml", ".msg",
    ".md", ".markdown", ".rst", ".adoc", ".har", ".ndjson",
})
_READ_CMDS = frozenset({"cat", "head", "tail", "less", "more", "bat", "open", "pdftotext", "strings", "xxd", "hexdump"})


def _read_path(payload: dict) -> str:
    """The one file this tool call read, or ''. `Read`, or a bash line whose verb only reads."""
    name = payload.get("tool_name") or ""
    inp = payload.get("tool_input") or {}
    if name == "Read":
        return str(inp.get("file_path") or "")
    if name != "Bash":
        return ""
    pieces = [w for w in _pieces(str(inp.get("command", ""))) if w and w[0] not in _NEUTRAL]
    if len(pieces) != 1 or pieces[0][0] not in _READ_CMDS:
        return ""
    args = [a for a in pieces[0][1:] if not a.startswith("-")]
    return args[0] if len(args) == 1 else ""


FILE_TOOLS = {"Edit", "Write", "MultiEdit", "NotebookEdit"}


def _project_path(path: str) -> str:
    """The path relative to the project, or "" when it lies outside it or inside the journal."""
    try:
        rel = Path(path).resolve().relative_to(ROOT.parent.resolve())
    except (ValueError, OSError):
        return ""
    return "" if not rel.parts or rel.parts[0] == ROOT.name else rel.as_posix()


def _tool_file_changes(payload: dict) -> list[dict]:
    """An Edit or Write names its file and hands back the patch: its + and - lines are the counts."""
    resp = payload.get("tool_response")
    if payload.get("tool_name") not in FILE_TOOLS or not isinstance(resp, dict):
        return []
    rel = _project_path(str(resp.get("filePath") or (payload.get("tool_input") or {}).get("file_path") or ""))
    if not rel:
        return []
    added = removed = 0
    for hunk in resp.get("structuredPatch") or []:
        for line in hunk.get("lines") or []:
            added += line.startswith("+")
            removed += line.startswith("-")
    created = resp.get("type") == "create"
    if created and not added:
        added = len(str(resp.get("content") or "").splitlines())
    return [{"path": rel, "created": created, "added": added, "removed": removed}]


def _git_out(project: Path, *args: str) -> str | None:
    import subprocess
    try:
        p = subprocess.run(["git", *args], cwd=str(project), capture_output=True, text=True, timeout=5)
    except (OSError, subprocess.SubprocessError):
        return None
    return p.stdout if p.returncode == 0 else None


def _git_snapshot(project: Path, base: str = "HEAD") -> dict | None:
    """HEAD, lines changed against `base` per tracked file, and the untracked files: what a shell command is measured by."""
    head = _git_out(project, "rev-parse", "HEAD")
    numstat = _git_out(project, "diff", "--numstat", base)
    untracked = _git_out(project, "ls-files", "--others", "--exclude-standard")
    if head is None or numstat is None or untracked is None:
        return None
    stats = {}
    for line in numstat.splitlines():
        parts = line.split("\t", 2)
        if len(parts) == 3 and parts[0].isdigit() and parts[1].isdigit():
            stats[parts[2]] = [int(parts[0]), int(parts[1])]
    return {"head": head.strip(), "numstat": stats, "untracked": untracked.splitlines()}


def _bash_file_changes(before: dict | None, after: dict | None, project: Path) -> list[dict]:
    # after a commit, `after` must be measured against the old HEAD (see _record_files), or the edits it committed vanish
    if not before or not after:
        return []
    out = []
    for path, (a, r) in after["numstat"].items():
        a0, r0 = before["numstat"].get(path, [0, 0])
        if (a, r) != (a0, r0) and _project_path(str(project / path)):
            out.append({"path": path, "created": False, "added": max(0, a - a0), "removed": max(0, r - r0)})
    known = set(before["untracked"])
    for path in after["untracked"]:
        if path not in known and _project_path(str(project / path)):
            try:
                lines = len((project / path).read_bytes()[:1_000_000].splitlines())
            except OSError:
                lines = 0
            out.append({"path": path, "created": True, "added": lines, "removed": 0})
    return out


#: A script can write files without the gate calling it a write: counted after, never refused before.
_SCRIPTS = frozenset({"python", "python3", "node", "perl", "ruby", "php", "sh", "bash", "zsh", "make", "npm", "npx", "yarn", "pnpm"})


def _may_change_files(payload: dict) -> bool:
    cmd = str((payload.get("tool_input") or {}).get("command", ""))
    return _is_write(payload) or any(w[0] in _SCRIPTS and not (len(w) > 1 and w[1].endswith("journal.py"))
                                     for w in _pieces(cmd) if w)


def _owns_open_work(ctx: Ctx) -> bool:
    standing = work.open_work(ROOT)
    return any(w.get("session") in _owners(ctx) for w in standing) or len(standing) == 1


def _snapshot_files(payload: dict, ctx: Ctx) -> None:
    """Before a shell command that writes, remember what git sees, so the files it changed can be counted after."""
    if payload.get("tool_name") != "Bash":
        return
    if _may_change_files(payload) and _owns_open_work(ctx):
        # the work this call belongs to, named BEFORE it runs: the call may end it before the hook looks
        state.put_many(ROOT, {"files_before": _git_snapshot(ROOT.parent),
                              "work_before": work.owned_subject(ROOT, _owners(ctx))}, stem=ctx.stem)
    elif state.get(ROOT, "files_before", None, stem=ctx.stem):
        state.put(ROOT, "files_before", None, stem=ctx.stem)


def _record_commits(before: dict | None, after: dict | None, ctx: Ctx, on: str = "") -> None:
    """A shell command that moved HEAD made commits; each goes on the open work with its subject."""
    from datetime import datetime, timezone
    import commandlog
    if not before or not after or before["head"] == after["head"]:
        return
    got = _git_out(ROOT.parent, "log", "--format=%H%x09%s", f"{before['head']}..{after['head']}")
    commits = [{"sha": sha, "subject": subject} for sha, _, subject in
               (line.partition("\t") for line in (got or "").splitlines()) if sha]
    at = datetime.now(timezone.utc).isoformat(timespec="seconds")
    work.record_commits(ROOT, _owners(ctx), list(reversed(commits)), at, on=on)
    # EACH COMMIT IS AN ACTIVITY LINE OF ITS OWN: work landing is the news the user watches for
    for c in reversed(commits):
        commandlog.record_commit(ROOT, tracks.current(ROOT, ctx.stem), ctx.stem, c["sha"], c["subject"], at)


def _record_files(payload: dict, ctx: Ctx) -> None:
    """The files this tool call changed go on the open work, with lines added and removed."""
    from datetime import datetime, timezone
    changes = _tool_file_changes(payload)
    was = ""   # only a shell call can end the work it was doing mid-call; an Edit or a Write cannot
    if payload.get("tool_name") == "Bash":
        before = state.get(ROOT, "files_before", None, stem=ctx.stem)
        if not before:
            return
        was = state.get(ROOT, "work_before", "", stem=ctx.stem) or ""
        state.put_many(ROOT, {"files_before": None, "work_before": ""}, stem=ctx.stem)
        after = _git_snapshot(ROOT.parent)
        _record_commits(before, after, ctx, was)
        if after and after["head"] != before["head"]:
            after = _git_snapshot(ROOT.parent, before["head"])
        changes = _bash_file_changes(before, after, ROOT.parent)
    if changes:
        work.record_files(ROOT, _owners(ctx), changes, datetime.now(timezone.utc).isoformat(timespec="seconds"), on=was)


def _queue_tool(payload: dict, ctx: Ctx) -> None:
    """Count a tool use for Activity's summed line. A shell line that runs the journal is not counted:
    the journal command itself writes out the queue."""
    from datetime import datetime, timezone
    import commandlog
    name = payload.get("tool_name") or ""
    if not name or name == "Agent" or (name == "Bash" and any(_is_journal_verb(w[0]) for w in
                                           _pieces(str((payload.get("tool_input") or {}).get("command", ""))) if w)):
        return
    at = datetime.now(timezone.utc).isoformat(timespec="seconds")
    # a call through an MCP server is its own line, naming the server: never bunched into "used 3 tools"
    if name.startswith(commandlog.MCP_PREFIX):
        commandlog.record_mcp(ROOT, tracks.current(ROOT, ctx.stem), ctx.stem, name, at)
        return
    commandlog.queue_tool(ROOT, tracks.current(ROOT, ctx.stem), ctx.stem, name, at)


def _note_dispatch(payload: dict, ctx: Ctx) -> None:
    """The session hands work to a subagent: Activity says so, with the dispatcher's description."""
    from datetime import datetime, timezone
    import commandlog
    if payload.get("tool_name") != "Agent" or payload.get("agent_id"):
        return
    description = str((payload.get("tool_input") or {}).get("description") or "")
    commandlog.record_dispatch(ROOT, tracks.current(ROOT, ctx.stem), ctx.stem, description,
                               datetime.now(timezone.utc).isoformat(timespec="seconds"))


def _git_tracked(project: Path, path: Path) -> bool:
    import subprocess
    try:
        p = subprocess.run(["git", "ls-files", "--error-unmatch", "--", str(path)], cwd=str(project),
                           capture_output=True, text=True, timeout=5)
        return p.returncode == 0
    except (OSError, subprocess.SubprocessError):
        return False


#: `git commit`, in any of its moods — `git -C x commit`, `git commit -F -`, `git commit -m`.
_GIT_COMMIT = re.compile(r"\bgit\b(?:\s+-{1,2}[^\s]+(?:\s+[^\s-]\S*)?)*\s+commit\b")


def _closed_by_commit(conf: dict, payload: dict, ctx: Ctx) -> str | None:
    """A commit that names a to-do in its trailer closes it, once the commit exists.

    THE MESSAGE IS READ OFF HEAD, NOT OFF THE COMMAND. The command is what was asked for;
    HEAD is what happened. Reading HEAD closes nothing when the commit was rejected by a
    gate or aborted, costs no parsing of `-m` against `-F -` against a heredoc, and hands
    back the sha and subject that become the `how` — a citation instead of a summary.

    ONCE PER SHA. An `--amend`, a rebase, or a second commit in the same line runs this
    again over a message it has already acted on; the sha it last closed against is kept,
    and `todo.close_from_commit` treats an already-closed to-do as a no-op besides.
    """
    if (payload.get("tool_name") or "") != "Bash" or "commit_trailer" in conf["silenced"]:
        return None
    cmd = ((payload.get("tool_input") or {}).get("command") or "")
    if not _GIT_COMMIT.search(cmd):
        return None
    head = todo.commit_at(Path(payload.get("cwd") or ROOT.parent))
    if head is None:
        return None
    sha, subject, message = head
    if not todo.refs_in(message):
        return None
    if state.get(ROOT, "commit_closed", "", stem=ctx.stem) == sha:
        return None
    state.put(ROOT, "commit_closed", sha, stem=ctx.stem)
    said = todo.close_from_commit(ROOT, message, say("commit_how", subject=subject, sha=sha[:9]), todo.now(),
                                  tracks.current(ROOT, ctx.stem))
    if not said:
        return None
    # BOTH HALVES, ALWAYS. "Closed what it named" was printed whenever ANY ref closed, so a
    # commit carrying two trailers where the second was refused — an unknown number, an
    # ambiguous one, one already done — reported success and the reader never learned a
    # close had been lost. A user reported exactly that symptom. Whatever the cause in
    # their case, a hook that overstates what it did is one an agent learns to skim, which
    # is this package's own rule turned against itself.
    shut = [line for ok, line in said if ok]
    kept = [line for ok, line in said if not ok]
    if shut and kept:
        fact = say("commit_mixed", shut=len(shut), kept=len(kept))
    elif shut:
        fact = say("commit_closed")
    else:
        fact = say("commit_nothing", trailer=todo.TRAILER)
    lines = [say("commit_ok", line=l) for l in shut] + [say("commit_bad", line=l) for l in kept]
    return say("commit_said", fact=fact, lines=lines)


def _trailer_hint(conf: dict, payload: dict, ctx: Ctx) -> str | None:
    """A commit landed while a to-do is started, and its message closed nothing. Said once.

    THE THIRD PLACE THE TRAILER IS TAUGHT, and the only one that fires at the moment it is
    needed: the skill is read at a start, `todos start` prints it before there is anything
    to commit, and this is the commit itself. Once per session — the point is that the
    spelling exists, and an agent that has been told and chose otherwise is not wrong.
    """
    if (payload.get("tool_name") or "") != "Bash" or "commit_trailer" in conf["silenced"]:
        return None
    if not _GIT_COMMIT.search(((payload.get("tool_input") or {}).get("command") or "")):
        return None
    if state.get(ROOT, "trailer_taught", False, stem=ctx.stem):
        return None
    head = todo.commit_at(Path(payload.get("cwd") or ROOT.parent))
    if head is None or todo.refs_in(head[2]):
        return None
    here = tracks.current(ROOT, ctx.stem)
    started = [t for t in todo.open_items(ROOT, here) if t.get("started")]
    if not started:
        return None
    state.put(ROOT, "trailer_taught", True, stem=ctx.stem)
    t = started[0]
    # `journal: ` LIKE EVERY OTHER LINE. This one opened with unprefixed shouting, which
    # made it the only message in the package a reader could not place at a glance.
    return say("trailer_hint", n=t["n"], title=t["title"], trailer=todo.TRAILER)


_SEARCH_CMDS = frozenset({"find", "grep", "rg", "ls", "fd", "locate", "ag"})
_SEARCH_SKIP = frozenset({"index", "readme", "main", "files", "test", "tests", "docs"})


def _searched(payload: dict) -> str:
    name = payload.get("tool_name") or ""
    inp = payload.get("tool_input") or {}
    if name in ("Glob", "Grep"):
        return " ".join(str(inp.get(k) or "") for k in ("pattern", "glob", "path"))
    if name != "Bash":
        return ""
    cmd = str(inp.get("command", ""))
    return cmd if any(piece and piece[0] in _SEARCH_CMDS for piece in _pieces(cmd)) else ""


def _cleanup_report(conf: dict, ctx: Ctx) -> str | None:
    """At most once every `cleanup_every_minutes` per session: run the cleanup checks and say what is new."""
    every = conf.get("cleanup_every_minutes") or 0
    if not every or "cleanup_report" in conf["silenced"] or ctx is None:
        return None
    now = time.time()
    if now - float(state.get(ROOT, "cleanup_checked", 0, stem=ctx.stem) or 0) < every * 60:
        return None
    state.put(ROOT, "cleanup_checked", now, stem=ctx.stem)
    try:
        import prune
        prune.sweep(ROOT, tracks.current(ROOT, ctx.stem))
    except Exception:
        pass
    import cleanup as cleanup_mod
    said = state.get(ROOT, "cleanup_reported", [], stem=ctx.stem) or []
    try:
        text, key = cleanup_mod.report_due(ROOT, tracks.current(ROOT, ctx.stem), said, conf["session_stale_hours"])
    except Exception:
        return None
    if not text:
        return None
    state.put(ROOT, "cleanup_reported", key, stem=ctx.stem)
    return text


def _search_hint(conf: dict, payload: dict, ctx: Ctx) -> str | None:
    """A search whose term names an attached file: point at the doc that holds it, once per file."""
    if "search_hint" in conf["silenced"]:
        return None
    text = _searched(payload).lower()
    if not text:
        return None
    said = state.get(ROOT, "search_hinted", [], stem=ctx.stem) or []
    rows, keys = [], []
    for d in docs._load(ROOT):
        if d.get("superseded_by"):
            continue
        for p in docs.file_paths(d):
            stem = p.stem.lower()
            key = str(p)
            if len(stem) < 4 or stem in _SEARCH_SKIP or stem not in text or key in said or key in keys:
                continue
            rows.append(say("search_hint_row", n=d["n"], title=fmt.gist(d["title"]), path=str(p)))
            keys.append(key)
    if not rows:
        return None
    state.put(ROOT, "search_hinted", (said + keys)[-200:], stem=ctx.stem)
    return say("search_hint", rows=rows[:8])


def _attach_hint(conf: dict, payload: dict, ctx: Ctx) -> str | None:
    """A non-source file read again and again: a hint to attach it to a doc, once per file.

    THE ALGORITHM. (1) The call read exactly one file. (2) The file is not the journal's,
    not already under docs/, and not source: a source extension, or tracked by git in this
    project, makes it source and ends the matter. Inside the project, only a reference
    extension (rendered, exported, sent) counts; outside it — Downloads, another checkout,
    a scratch folder — anything that is not source counts. (3) It has been read
    `attach_hint_reads` times this session. Then the hint, once per file, never a hold: a
    scratch file read twice is not a problem, and the agent is told to ignore it if so.
    """
    if "attach_hint" in conf["silenced"] or not conf["attach_hint_reads"]:
        return None
    raw = _read_path(payload)
    if not raw:
        return None
    p = Path(raw).expanduser()
    if not p.is_absolute():
        p = ROOT.parent / p
    if not p.is_file():
        return None
    rp = p.resolve()
    project = ROOT.parent.resolve()
    inside = project in rp.parents
    if inside:
        rel = rp.relative_to(project).as_posix()
        if rel.startswith((".journal/", ".claude/", ".git/")):
            return None
    try:
        if docs.folder(ROOT).resolve() in rp.parents:
            return None
    except Exception:
        pass
    ext = rp.suffix.lower()
    if ext in _SOURCE_EXT or rp.name.endswith(".blade.php") or ext == "":
        return None
    if inside and (ext not in _REFERENCE_EXT or _git_tracked(project, rp)):
        return None
    counts = state.get(ROOT, "read_counts", {}, stem=ctx.stem) or {}
    if not isinstance(counts, dict):
        counts = {}
    key = str(rp)
    counts[key] = int(counts.get(key, 0)) + 1
    if len(counts) > 200:
        counts = dict(list(counts.items())[-200:])
    state.put(ROOT, "read_counts", counts, stem=ctx.stem)
    if counts[key] < conf["attach_hint_reads"]:
        return None
    said = state.get(ROOT, "attach_hinted", [], stem=ctx.stem) or []
    if key in said:
        return None
    state.put(ROOT, "attach_hinted", (said + [key])[-100:], stem=ctx.stem)
    shown = rp.relative_to(project).as_posix() if inside else str(rp)
    return say("attach_hint", path=shown, count=counts[key])


_SCRIPT_EXT = (".py", ".sh", ".php", ".js", ".ts", ".rb", ".pl")
_SCRATCH = ("/scratchpad/", "/tmp/", "/var/folders/")
_TOOLISH_DIRS = ("tools/", "scripts/", "bin/", "script/")
_HEREDOC_BODY_RE = re.compile(r"<<-?\s*['\"]?(\w+)['\"]?[^\n]*\n(.*?)\n\1(?=\n|$)", re.S)


def _tool_shaped(conf: dict, payload: dict, ctx: Ctx) -> str | None:
    """Something that looks like a tool before anyone called it one: a hint, once.

    THREE SHAPES, all measured in live sessions. A script written into the scratchpad or
    a scripts folder — a helper the agent will lose with the session. The same long
    inline script run twice — `python3 - <<'PY' …` with the same body, which is a tool
    being retyped. A scratch script run by name — `php /tmp/x.php`, the helper in use.
    Each earns one hint naming `journal tools add`; a hint, never a hold, because plenty
    of scripts are rightly one-offs and the agent is the one who knows.
    """
    if "tool_hint" in conf["silenced"]:
        return None
    name = payload.get("tool_name") or ""
    inp = payload.get("tool_input") or {}
    said = state.get(ROOT, "tool_hinted", [], stem=ctx.stem) or []
    what = key = ""
    if name in ("Write", "Edit", "MultiEdit"):
        path = str(inp.get("file_path") or "")
        if path.endswith(_SCRIPT_EXT) and "/.journal/tools/" not in path:
            try:
                rel = str(Path(path).resolve().relative_to(ROOT.parent.resolve()))
                inside = True
            except ValueError:
                rel, inside = path, False
            scratch = not inside and any(x in path for x in _SCRATCH)
            toolish = inside and any(rel.startswith(d) or f"/{d}" in rel for d in _TOOLISH_DIRS)
            if scratch or toolish:
                what, key = say("script_wrote", path=rel, where=say("script_scratch") if scratch else ""), rel
    elif name == "Bash":
        cmd = str(inp.get("command") or "")
        if any(_is_journal_verb(w[0]) for w in _pieces(cmd)):
            return None
        m = re.search(r"\b(?:python3?|php|sh|bash|node|ruby)\s+(\S*(?:" + "|".join(x.strip("/") for x in _SCRATCH) + r")\S+)", cmd)
        if m:
            what, key = say("script_ran", path=m.group(1)), "run:" + m.group(1)
        else:
            for _, body in _HEREDOC_BODY_RE.findall(cmd):
                if len(body) < 300:
                    continue
                import hashlib
                h = hashlib.sha1(" ".join(body.split()).encode()).hexdigest()[:12]
                seen = state.get(ROOT, "inline_scripts", [], stem=ctx.stem) or []
                if h in seen:
                    what, key = say("inline_twice"), "inline:" + h
                else:
                    state.put(ROOT, "inline_scripts", (seen + [h])[-100:], stem=ctx.stem)
                break
    if not what or key in said:
        return None
    state.put(ROOT, "tool_hinted", (said + [key])[-50:], stem=ctx.stem)
    return say("tool_hint", what=what)


def _stall(conf: dict, ctx: Ctx) -> str | None:
    """Many tool calls on one started to-do with no progress filed: say so, once.

    THE MEASUREMENT BEHIND "SPENDING TOO MUCH TIME WITHOUT RESULT". With auto on the
    agent must decide for itself, and the one thing it cannot judge from inside is how
    long it has been going round. So the hook counts tool calls since the to-do was
    started and, past the setting, says so once — unless an `update` has been filed on the
    work since the last count, which is the agent saying it moved. A nudge, not a hold: the
    agent may well be one call from done. Fires at most once per to-do per multiple of
    the setting, so a long to-do with real progress notes is left alone.

    THE ROW THAT STALLS IS WHICHEVER ONE HAS WORK OPEN, NOT WHICHEVER WAS `started` LAST.
    A to-do's `started` stamp is never cleared by a plain `work end` (only `--todo`/`done`
    clears the row), so a row that was started, ended without `--todo`, and then touched
    again — `todos after`, `todos block` — still carries `started` and can sort after the
    row genuinely open. Measured live: the nudge named to-do 2269, ended and chained
    onto another to-do earlier, while the session's actual open work — per `journal
    open` — was to-do 1417. Matching the open work's subject against the started to-dos,
    instead of taking the last started to-do and hoping it is the open one, is what the
    line below did two steps later anyway, to count progress notes — just too late to
    fix which row got named.
    """
    limit = conf["stall_calls"]
    if not limit or "stall" in conf["silenced"]:
        return None
    here = tracks.current(ROOT, ctx.stem)
    standing = work.open_work(ROOT)
    if not standing:
        return None
    started = {row["title"].lower(): row for row in todo.open_items(ROOT, here) if row.get("started")}
    t = w = None
    for candidate in standing:
        match = started.get(candidate["subject"].lower())
        if match:
            t, w = match, candidate
            break
    if t is None:
        return None
    mark = state.get(ROOT, "stall", {}, stem=ctx.stem) or {}
    if mark.get("n") != t["n"]:
        mark = {"n": t["n"], "calls": 0, "updates": 0, "said": 0}
    mark["calls"] = mark.get("calls", 0) + 1
    updates = len(w.get("notes", []))
    if updates > mark.get("updates", 0):
        mark.update({"updates": updates, "calls": 1, "said": 0})  # progress was filed: this call starts a new count
    state.put(ROOT, "stall", mark, stem=ctx.stem)
    if mark["calls"] < limit or mark.get("said"):
        return None
    mark["said"] = 1
    state.put(ROOT, "stall", mark, stem=ctx.stem)
    return say("stall", calls=mark["calls"], n=t["n"], title=t["title"])


def _response_size(payload: dict) -> int:
    """How much this tool actually handed back, in characters."""
    r = payload.get("tool_response")
    if isinstance(r, str):
        return len(r)
    if isinstance(r, dict):
        for key in ("stdout", "content", "output", "text"):
            v = r.get(key)
            if isinstance(v, str):
                return len(v)
            if isinstance(v, list):
                return sum(len(x.get("text", "")) for x in v if isinstance(x, dict))
    return len(json.dumps(r)) if r is not None else 0


#: runtime key, per session: the newest version the AGENT was told about (the channel sets it too)
UPDATE_TOLD = "update_told"


def _update_news(conf: dict, ctx: Ctx) -> str:
    """A newer journal upstream, told to a working agent once per version: a stop tells only the user."""
    if "update_check" in conf["silenced"]:
        return ""
    note, latest = update.available(ROOT)
    if not note or state.get(ROOT, UPDATE_TOLD, "", stem=ctx.stem) == latest:
        return ""
    state.put(ROOT, UPDATE_TOLD, latest, stem=ctx.stem)
    return say("update_run", note=note)


def _inbox_news(conf: dict, ctx: Ctx) -> str:
    if "inbox" in conf["silenced"]:
        return ""
    here = tracks.current(ROOT, ctx.stem)
    waiting = [n for n, _ in inbox.unprocessed(ROOT, here)]
    told = state.get(ROOT, "inbox_told", {}, stem=ctx.stem) or {}
    said = told.get(here) or []
    fresh = [n for n in waiting if n not in said]
    if not fresh:
        return ""
    told[here] = sorted(set(said) | set(fresh))
    state.put(ROOT, "inbox_told", told, stem=ctx.stem)
    return say("inbox_mention", n=len(fresh))


def _comments_news(conf: dict, ctx: Ctx) -> str:
    """New comments, mentioned once each after a tool call: at a stop the messages reminder outranks them."""
    if "comments" in conf["silenced"]:
        return ""
    import comments
    here = tracks.current(ROOT, ctx.stem)
    waiting = [n for n, _ in comments.untold(ROOT, here)]
    told = state.get(ROOT, "comments_told", {}, stem=ctx.stem) or {}
    said = told.get(here) or []
    fresh = [n for n in waiting if n not in said]
    if not fresh:
        return ""
    told[here] = sorted(set(said) | set(fresh))
    state.put(ROOT, "comments_told", told, stem=ctx.stem)
    return say("comments_mention", n=len(fresh))


def _reminder_due(conf: dict, ctx: Ctx) -> str:
    """Every `reminder_every` tool calls, the standing reminders again — or "".

    THE COUNTER IS PER SESSION AND IT IS RESET BY THE STOP, so the interval measures the
    distance from the last time the agent actually saw them rather than from an arbitrary
    origin. With nothing standing it is held at zero: a reminder added mid-session then
    gets its full interval instead of firing on whatever the count happened to be.
    """
    every = conf["reminder_every"]
    if not every or "reminders" in conf["silenced"]:
        return ""
    said = reminders.block(ROOT)
    if not said:
        state.put(ROOT, "since_remind", 0, stem=ctx.stem)
        return ""
    n = state.get(ROOT, "since_remind", 0, stem=ctx.stem) + 1
    if n < every:
        state.put(ROOT, "since_remind", n, stem=ctx.stem)
        return ""
    state.put(ROOT, "since_remind", 0, stem=ctx.stem)
    return said


def on_post_tool(conf: dict, payload: dict, ctx: Ctx) -> int:
    """Say what a tool call cost, at the moment it cost it — and almost never say it.

    THE SIZE IS A FACT AND THE COMMAND IS A GUESS. The first shape of this was going to
    check whether a bash line contained a `grep` or a `head`, and refuse it if not. That
    reads the intent instead of the result: a piped `grep` can still return forty thousand
    characters, and a bare `cat` of a short file costs nothing. What is worth saying is
    what actually came back, which is measured and cannot be argued with.

    IT SPEAKS ONLY ON A NEW RECORD. Not every large result — the LARGEST SO FAR in this
    context, above a floor. That is the rate limit, and it is self-decaying: the second
    40k read after a 60k one says nothing, and a session settles into silence on its own
    without a counter or an interval. Every rule in here that fired on a condition rather
    than a record ended up teaching the reader to skim it — eleven wrong nudges to catch
    three — and a per-tool complaint is the worst possible place for that, because it lands
    mid-thought where the agent is least able to weigh it.

    SUBAGENTS ARE OUT OF THIS. When this mark was project-wide, three critics reading the
    package raised it from 28,780 to 83,700 and the parent session was silenced by output
    it never saw. A subagent no longer reaches the hook at all — see `main`.
    """
    _floor(ctx)
    try:
        _record_files(payload, ctx)
        _queue_tool(payload, ctx)
    except Exception as e:  # counting files and tool uses must never stop a tool call
        print(f"journal files: {e}", file=sys.stderr)
    # AN ACTION BEATS A HINT: this one CHANGED the record, so it is said before any nudge
    # that only advises, and it is said to the user too — an automatic close they cannot
    # see is the one thing this protocol must never be.
    closed = _closed_by_commit(conf, payload, ctx)
    if closed:
        return _context("PostToolUse", closed, system=closed.replace("\n  ", " · "))
    # THE OTHER HALF OF A REMINDER. The stop says it every time, and between two stops
    # there can be an hour of tool calls — which is exactly the stretch the user wrote the
    # reminder about. Agent-only here, deliberately: the stop is where the person gets
    # their confirmation, and the same line in their terminal every fifteen calls is the
    # wall of repetition this package refuses everywhere else.
    due = _reminder_due(conf, ctx)
    if due:
        return _context("PostToolUse", due)
    news = _inbox_news(conf, ctx)
    if news:
        return _context("PostToolUse", news)
    news = _comments_news(conf, ctx)
    if news:
        return _context("PostToolUse", news)
    news = _update_news(conf, ctx)
    if news:
        return _context("PostToolUse", news)
    # THE CONTEXT LADDER, MID-WORK. Only with the window set: a tail reading has no peak
    # to infer one from, and the ladder never climbs a guess.
    window = conf["context_window"] or (state.get(ROOT, "window", 0) or 0)
    if window and ctx.path is not None and "context" not in conf["silenced"]:
        used = context.reading_tail(ctx.path)
        if used is not None:
            got = (used / window, used, window, True)
            rung = _rung(conf, ctx, got)
            if rung:
                # THE PERCENTAGE WAS SAID TWICE — "journal: context 72% full — consider what
                # must outlive it", then two lines later "CONTEXT IS 72% FULL — 720,000 of
                # 1,000,000". The block says it better, so what survives from the line is
                # only its instruction: the half after the dash, which is what to DO and is
                # load-bearing when the gate is armed.
                # THE INSTRUCTION IS THE INDENTED HALF now that a message is a heading and
                # a body — it was read off an em dash, which `_say` no longer writes.
                _, _, told = rung[1].partition("\n")
                return _context("PostToolUse", rung[2] + ("\n\n" + told if told else ""))
    hint = _trailer_hint(conf, payload, ctx)
    if hint:
        return _context("PostToolUse", hint)
    hint = _raw_markdown(conf, payload, ctx)
    if hint:
        return _context("PostToolUse", hint)
    hint = _tool_shaped(conf, payload, ctx)
    if hint:
        return _context("PostToolUse", hint)
    hint = _search_hint(conf, payload, ctx) or _attach_hint(conf, payload, ctx) or _cleanup_report(conf, ctx)
    if hint:
        return _context("PostToolUse", hint)
    stalled = _stall(conf, ctx)
    if stalled:
        return _context("PostToolUse", stalled)
    if "tool_cost" in conf["silenced"]:
        return 0
    floor = conf["tool_cost_floor"]
    if not floor:
        return 0
    size = _response_size(payload)
    if size < floor or size <= state.get(ROOT, "biggest_result", 0, stem=ctx.stem):
        return 0
    state.put(ROOT, "biggest_result", size, stem=ctx.stem)
    name = payload.get("tool_name") or say("that_tool")
    return _context("PostToolUse", _say(say("size_fact", tool=name, size=format(size, ",")), say("size_do"))[1])


# `on_message_display` LIVED HERE and wrote `last_untagged`, which nothing ever read. The
# event is real in the harness but was never wired for this package, and a handler whose
# only output is a key nobody reads is a write that reports success and lands nowhere.


_HOLD_CTX: list = []   # the transcript stem of the hold in flight, set by on_stop

#: THE STOP'S REMINDER IN FLIGHT: [what the agent reads, the one line the user sees].
#: Set by `on_stop` before the queue runs and read by everything that answers that stop,
#: so a reminder rides along with a hold instead of competing with it for the single slot.
_REMIND: list = []


def _remembering(text: str = "") -> str:
    """Fold this stop's reminder into whatever else the stop was going to say.

    ONE COPY. `additionalContext` is rendered to the user as well as to the agent, so a
    `systemMessage` twin of the same words was the same sentence printed twice in one stop.
    """
    if not _REMIND:
        return text
    return _REMIND[0] + ("\n\n" + text if text else "")


def _remind_only() -> int:
    """The stop had nothing else to say — so the reminder is said to the USER and no more.

    A REMINDER IS NOT A REASON TO CARRY ON WORKING. `additionalContext` at a stop re-opens
    the turn (see `_hold`), so a standing reminder emitted there with nothing else pending
    woke this very session three times with nothing to do — the user watching it happen.
    The agent is reminded where reminding is free: mid-turn every `reminder_every` calls,
    and in the block it is handed at every start. What is owed at the stop is the person's
    confirmation that their instruction is still in force, and `systemMessage` is the field
    for exactly that: shown to them, no turn re-opened.
    """
    if not _REMIND:
        return 0
    print(json.dumps({"systemMessage": _REMIND[0]}))
    return 0



#: TWO WAYS TO HOLD A STOP, AND THEY ARE NOT THE SAME ONE. From the reference
#: (code.claude.com/docs/en/hooks, "Stop decision control"), quoted:
#:
#:   "Use `additionalContext` when the hook is working as designed and giving Claude
#:    guidance, such as 'run the test suite before finishing'. It keeps the conversation
#:    going through the same loop protections as `decision: \"block\"` ... but the transcript
#:    labels it `Stop hook feedback` and no hook error notification is shown"
#:
#: SO `additionalContext` AT A STOP IS A HOLD. Not a quiet aside — it re-opens the turn,
#: exactly as a block does. That sentence explains something this session watched happen:
#: a reminder was emitted as `additionalContext` with nothing else pending, and the session
#: woke three times over with nobody asking for anything. It was not a stray loop; it was
#: the documented behaviour of the field, used as though it were free.
#:
#: WHICH MEANS THE CHOICE IS ABOUT THE LABEL, NOT THE EFFECT. Both hold. `decision: "block"`
#: is announced to the user as an error; `additionalContext` is not. Nothing this package
#: says at a stop is an error — every subject is guidance — so guidance goes in the field
#: that is not called a failure, and `decision: "block"` is kept for the one case where the
#: turn genuinely must not end quietly: a write that would land in the wrong place.
#:
#: AND A HOLD IS NOT FREE. The harness overrides a Stop hook after eight consecutive blocks
#: without progress (`CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` raises it), which is the ceiling this
#: queue's one-subject-per-stop discipline was already keeping well under.
_ERROR_LABELLED = frozenset({"claimed", "environment"})


def _open_ids() -> list:
    """The open to-do numbers on this environment — what a held listing was true of."""
    here = tracks.current(ROOT, _HOLD_CTX[0] if _HOLD_CTX else None)
    return sorted(t["n"] for t in todo.open_items(ROOT, here))


def _asked_lent(payload: dict) -> bool:
    """Did this tool call run `journal lent`? The one command whose answer is the hook's.

    The CLI cannot see `agent_id`, so it cannot answer "who am I" — it prints what a SESSION
    should hear and this supplies the rest on the tool's result. `PostToolUse` because
    `DELIVERS_CONTEXT` does not list `PreToolUse`: the harness rejects context there,
    measured, whatever the reference says.
    """
    if (payload.get("tool_name") or "") != "Bash":
        return False
    cmd = str((payload.get("tool_input") or {}).get("command", ""))
    if "journal" not in cmd:
        return False
    try:
        import shlex
        toks = shlex.split(cmd)
    except ValueError:
        return False
    return any("journal" in t and j + 1 <= len(toks) - 1 and toks[j + 1] == "lent"
               for j, t in enumerate(toks[:-1]))


def _parent_of(payload: dict) -> str:
    """The DISPATCHING session's stem. A subagent's events carry it, not its own."""
    tp = payload.get("transcript_path") or ""
    return Path(tp).stem if tp else (payload.get("session_id") or "")


def _hold(label: str, brief: str, text: str = "", subject: str = "") -> int:
    """Hold the stop: a small label for the user, the instruction and reasoning for the agent.

    The user asked for less: the one-line instruction was still the agent's business
    rendered in their terminal at every hold, under a heading that calls it an error. So
    the reason — the only half the harness prints — is now a label saying that the journal
    reminded Claude and of what, in a few words. The instruction line leads the context
    block, so the agent still reads it first.

    The first version did this with `exit 2` + stderr, which works — and which the harness
    renders to the user as `Stop hook error`. `decision: "block"` was the same hold said
    properly: exit 0, the turn continues so the agent can act. The harness still labels
    the block's reason an error on the user's screen, and prints ALL of it — twenty lines
    of reasoning about pins, every stop, in the user's terminal, for a nudge addressed to
    the agent.

    So the hold has two halves. `reason` is ONE LINE, and it is the whole instruction: what
    happened and the one thing to do, so an agent that received nothing else could still
    act. `additionalContext` carries the reasoning, which the harness delivers to the agent
    and folds away on the user's side. The user sees one line and can open it; the agent
    reads the rest.
    """
    # THE HARNESS PRINTS BOTH HALVES TO THE USER. Measured: "Stop hook feedback:" followed
    # by the whole reasoning, in the terminal, for an untagged message. So a hold carries
    # its one-line instruction and nothing else; the reasoning is in the skill's hold
    # table, read on demand. The context rung is the exception: its text IS the decision
    # material — what stands, what fills the window, the rules — and it fires four times
    # a session at most.
    # THE DETAILS GO BEHIND A COMMAND. The harness prints both halves of a Stop hold to
    # the user — measured, against its own docs — so anything longer than a line is kept
    # in the transcript's runtime file and the line says `journal next`. The agent runs
    # that; the user sees one line.
    # ONE LINE, IN ONE FIELD. The harness prints `reason` as "Stop hook error" and
    # `additionalContext` as "Stop hook feedback": two lines per hold when both are sent.
    # So the hold is the reason alone — label, then the instruction — and nothing else.
    # A SNAPSHOT OF SOMETHING STILL CHANGING IS A LIE WITH A TIMESTAMP. Most held details
    # are facts about the MOMENT — the line an untagged message was at, the reading that
    # tripped a context rung — and those are exactly as true when read later. A LISTING of
    # what is waiting is not: it goes on being handed back after the rows in it have been
    # closed, and `journal next` is the command auto mode tells an agent to run, so the one
    # stale read lands on the reader least able to notice.
    #
    # Seen twice in one session: `work end` closed a row, printed "to-do N is done with it",
    # and the very next `journal next` offered N as the thing to start. Reading it cleared
    # the snapshot, so the second call was right — which is how it stayed hidden.
    #
    # So a subject whose detail is a listing stores nothing, and `next` recomputes. The
    # subject knows which it is; nothing here has to guess.
    if text and _HOLD_CTX:
        state.put(ROOT, "next_text", text, stem=_HOLD_CTX[0])
        # AND WHAT THE RECORD LOOKED LIKE WHEN IT WAS WRITTEN. A held detail is a snapshot,
        # and most of them are facts about the MOMENT — the line an untagged message was at,
        # the reading that tripped a context rung — as true later as they were then. A
        # LISTING of what is waiting is not: it goes on being handed back after the rows in
        # it are closed, and `journal next` is the command auto mode tells an agent to run,
        # so the stale read lands on the reader least able to notice it.
        #
        # Seen twice in one session: `work end` closed a row, printed "to-do N is done with
        # it", and the very next `journal next` offered N as the thing to start. Reading it
        # cleared the snapshot, so the second call was right — which is how it stayed hidden.
        #
        # So the open rows are recorded beside the text, and `next` shows the snapshot only
        # while they still describe the list. Nothing has to know WHICH subjects list rows:
        # a hold whose detail never mentioned the list is simply never contradicted by it.
        state.put(ROOT, "next_rows", _open_ids(), stem=_HOLD_CTX[0])
        # ITS OWN LINE. Appended with an em dash it ran onto the end of a wrapped
        # instruction, which is the one place a reader stops looking.
        brief += say("details")
    # `_say` ALREADY BUILT THE LINE. This used to strip a `journal: ` prefix and then try to
    # spot the label repeated at the start of the body — a textual reconciliation of two
    # strings somebody wrote separately. They are one string now, so there is nothing to
    # reconcile and nothing to get wrong.
    #
    # THE FIELD IS CHOSEN BY WHAT THE SUBJECT IS, not by what it wants to achieve — both
    # fields hold. Only the two subjects about writing to the wrong environment keep the
    # error shape, because for those the alarm IS the message.
    if subject not in _ERROR_LABELLED:
        return _context("Stop", say("with_reminder", brief=brief, reminder=_REMIND[0]) if _REMIND else brief)
    out: dict = {"decision": "block", "reason": brief.replace("\n", " ")}
    # A REMINDER IS NOT AN ERROR, SO IT NEVER GOES IN `reason`. The harness prints that
    # field under the words "Stop hook error", and for one release this line prepended the
    # reminder to it — so a user who had asked to be reminded of something was told their
    # own instruction had failed. `additionalContext` is printed too, under "Stop hook
    # feedback", so the reminder is seen without being called a failure.
    #
    # AND ONCE. It used to be mirrored into `reason` AND `additionalContext`, which the
    # harness renders as two labelled blocks — the same sentence, twice, in one stop.
    # One fact, one field, whichever field is right for what it is.
    if _REMIND:
        out["hookSpecificOutput"] = {"hookEventName": "Stop",
                                     "additionalContext": fmt.block(_REMIND[0])}
    print(json.dumps(out))
    return 0


#: Events whose `hookSpecificOutput.additionalContext` the harness ACCEPTS. Measured, not
#: assumed: PreCompact is not among them, and emitting it there is rejected by schema
#: validation — the hook runs, exits 0, writes its state, and its payload is thrown away.
#: That is a third state past wired-and-fired: ACCEPTED. This list is the one place it
#: lives, so a handler cannot quietly address an event that will not listen.
DELIVERS_CONTEXT = frozenset({
    "UserPromptSubmit", "PostToolUse", "PostToolBatch", "Stop", "SessionStart",
})


def _context(event: str, text: str, system: str | None = None) -> int:
    """Hand the harness something to put in front of the agent, and the user.

    `system` is the half the user sees. `additionalContext` reaches the agent and nothing
    else: the user cannot read it, so a hook that needs the PERSON to know something —
    that this session has no environment yet — has to say it in the one field the harness
    shows them. It is a universal field, so it survives an event that cannot carry
    context, and it is printed even then.

    Refuses an event that cannot carry it. A rejected payload looks identical to a
    delivered one from in here — same exit 0, same written state — so the refusal is
    LOUD: it goes to stderr and to the user, because a delivery that fails invisibly is
    the one shape this system exists to prevent.
    """
    out: dict = {}
    if system:
        out["systemMessage"] = system
    if event not in DELIVERS_CONTEXT:
        print(say("no_context", event=event, n=len(text.splitlines())), file=sys.stderr)
        if out:
            print(json.dumps(out))
        return 0
    out["hookSpecificOutput"] = {"hookEventName": event, "additionalContext": fmt.block(text)}
    print(json.dumps(out))
    return 0


def on_pre_compact(conf: dict, payload: dict, ctx: Ctx) -> int:
    """Says nothing: the harness accepts no context on PreCompact. `main` has already recorded it as
    the session's last event, which is how the viewer shows the agent compacting until the
    SessionStart(source="compact") on the far side of it."""
    return 0


#: THE HARNESS'S OWN CEILING, and it is documented — not measured, not folklore:
#:
#:   "Hook output strings, including `additionalContext`, `systemMessage`, and plain
#:    stdout, are capped at 10,000 characters. Output that exceeds this limit is saved to a
#:    file and replaced with a preview and file path."
#:                                    — code.claude.com/docs/en/hooks, "JSON output"
#:
#: WHAT HAPPENS PAST IT IS THE WORST FAILURE THIS PACKAGE HAS HAD. A real consumer's start
#: block reached 120,360 characters — 125 rules, 194 pins, 82 docs, 163 to-dos — and the
#: harness replaced the whole thing with a path to a file nobody was told to open. The hook
#: fired, reported success, and delivered a 2KB preview of its own header. `verify` said all
#: green, because it checks that the hook FIRED, not that its output ARRIVED.
#:
#: THE BUDGET SITS WELL UNDER IT. The ceiling is a fact about today's harness, not a
#: contract, and the block is assembled from stores that grow — so the caps below are sized
#: for the worst case with room to spare, and `carried` measures itself afterwards.
INLINE_CAP = 10_000
INLINE_BUDGET = 7_000

#: HOW MANY ENTRIES OF EACH STORE ARE INJECTED, at full generosity. Nothing is dropped from
#: the record — every cut says so and names the command that reads the rest (`fmt.cut`).
#: Rules bind every environment, so they keep the biggest allowance.
#:
#: THESE ARE A STARTING POINT, NOT THE GUARANTEE. A count is the wrong unit for a character
#: ceiling: forty short rules and forty long ones are the same number and four times the
#: text. `carried` therefore builds, MEASURES, and tightens until it fits — so the promise
#: is kept by arithmetic rather than by whoever last guessed how long a rule is.
CARRY_CAPS = {"rules": 40, "pins": 30, "docs": 20, "tools": 20, "todos": 25}

#: THE TWO DEPTHS, AND ONE BUILDER FOR BOTH.
#:
#: THE BLOCK WAS TRYING TO BE A BRIEFING AND IT IS A DOORWAY. Measured in a real project:
#: 14,996 characters against the harness's documented 10,000 ceiling, so the whole thing was
#: replaced with a FILE PATH — after every compaction that project's agent was handed a path
#: instead of the record, which is the one delivery this package exists to make. 7,014 of
#: those characters were two answered to-dos printing the user's answer in full, and no cap
#: could reach them: `CARRY_CAPS` bounds the NUMBER of entries and nothing bounded the text
#: inside one, so the halving loop hit its floor and gave up.
#:
#: THE USER'S RULING: say where the session is, say what the commands are, say how many of
#: each thing there is — and let the agent read what it needs. Reminders go out entirely
#: (they fire at every stop, so injecting them here pays twice), the answered to-dos and the
#: questions waiting on the user go out, rules and docs keep their last few. Pins stay, at
#: three, for the one reason that does not apply to anything else: a pin is by definition the
#: fact the reader does not know it is missing, so an agent that feels no gap never runs
#: `journal pins`.
#:
#: NOT A SECOND FUNCTION. A separately written short version is the thing that drifts from
#: the long one — this package has paid for that twice in a day — so the depth is an argument
#: and the sections, their order and their wording are one piece of code.
BRIEF, FULL = "brief", "full"
DOORWAY_CAPS = {"rules": 3, "pins": 3, "docs": 3, "tools": 0, "todos": 0}


def carried(source: str = "compact", stem: str | None = None, unbound: bool = False,
            depth: str = BRIEF) -> str:
    """The start block, built to fit. See `_carried` for what goes in it.

    IT TIGHTENS UNTIL IT FITS. The caps are halved and rebuilt until the block is inside the
    budget or there is nothing left to give — measured, not assumed, because the thing that
    broke was somebody's assumption about how big a record gets. A store never falls below
    three entries: past that the block stops being a hand-over and becomes a footnote, and
    the reader is better served by the honest over-budget notice at the end.
    """
    # THE DOORWAY IS THE HALF THAT GOES INTO CONTEXT, so it is the half that must fit. It
    # used to return here without measuring, on the reasoning that it is short because the
    # long half is a command away — which is a bound on the NUMBER of entries and not on
    # their length, and "a count is the wrong unit for a character ceiling" is the sentence
    # written above `CARRY_CAPS` about the exact bug this reintroduced. Three pins at the
    # 400-character cap, three rules, three doc abstracts of no fixed length: nothing was
    # watching. It was 4,708 characters against a 10,000 ceiling by luck of content.
    #
    # ITS FLOOR IS ONE, NOT THREE. The full block stops at three because below that it stops
    # being a hand-over; a doorway is not a hand-over at any size — it is a pointer, and one
    # of each with the count beside it still points.
    caps, floor = (dict(DOORWAY_CAPS), 1) if depth == BRIEF else (dict(CARRY_CAPS), 3)
    for _ in range(6):
        block = _carried(source, stem, unbound, caps, depth)
        if len(block) <= INLINE_BUDGET or all(v <= floor for v in caps.values()):
            break
        caps = {k: max(floor, v // 2) if v else v for k, v in caps.items()}
    if len(block) > INLINE_BUDGET:
        block += say("over_budget", size=format(len(block), ","), cap=format(INLINE_CAP, ","))
    return block


def _carried(source: str, stem: str | None, unbound: bool, caps: dict,
             depth: str = FULL) -> str:
    """Exactly what a session is handed at its start, built without writing anything.

    THE INJECTED BLOCK IS THE ONE THING NOBODY COULD LOOK AT. It is assembled inside a
    hook, delivered to a context the user cannot read, and until now the only way to see it
    was to pipe a fake payload into the hook — which also wrote state, so looking changed
    the thing being looked at. A mechanism whose output is invisible until it fires is the
    shape this whole package exists to argue against, and this one had it.

    So the assembling lives here, pure, and the handler is what writes. `journal carry`
    reads it and nothing moves.

    THE STORE IS DELIVERED AT EVERY START. The journal is shared by every session, and a
    session that starts fresh, or after `/clear`, or as a fork, has lost as much as one that
    compacted. Only the closing paragraph about "the summary you are holding" is kept for a
    compaction, because on any other source there is no summary and a message claiming one
    is a nudge about an event that did not happen.
    """
    here = tracks.current(ROOT, stem)
    short = depth == BRIEF
    parts = [
        # THE RULES ARE SAID AT THE START, NOT ONLY ENFORCED AT THE STOP. Until this, the
        # vocabulary reached the agent exactly one way: by being held for breaking it. A
        # system whose rules are learnable only through their own violation trains the
        # reader that a rule is something that appears after a mistake — and this one is
        # supposed to be the opposite of that.
        #
        # WHICH ENVIRONMENT OF WORK THIS IS comes first: a fresh agent inherits an environment it did
        # not choose and cannot see, and every pin and open item below belongs to that one.
        say("doorway", head=say("in_force_unbound" if unbound else "in_force_bound", env=here),
            tags=[say("tag", tag=t.name) for t in tags.TAGS.values()])
    ]
    parts.append(_standing(short))
    # THE PACKAGE'S OWN RULES FIRST OF ALL, before anything this project decided: they bind
    # every project, so a reader meets what is true everywhere before what is true here.
    shipped = builtin.carry(brief=short)
    if shipped:
        parts.append(shipped)
    # SKILLS THE USER WANTS AT EVERY START, set on a skill's page in the viewer
    import skills
    stored = skills.always(ROOT)
    # ONLY SKILLS THAT EXIST. A skill deleted or renamed after it was marked stayed in the list,
    # and every start and compaction told the agent to load something it could not.
    present = {s["name"] for s in skills.available(ROOT.parent)} if stored else set()
    wanted = [n for n in stored if n in present]
    if wanted:
        parts.append(say("always_skills", names=", ".join(f"`{n}`" for n in wanted)))
    # REMINDERS ARE NOT INJECTED AT A START. They fire at every stop and every
    # `reminder_every` tool calls, so putting them here pays for the same text twice — and
    # they were the second-largest thing in a block that had stopped being delivered at all.
    # The count below names them; the stop says them.
    if depth == FULL:
        repeated = reminders.block(ROOT)
        if repeated:
            parts.append(repeated)
    # RULES BEFORE PINS. A rule binds every environment, so a reader meets the constraints
    # before the facts of the one environment they happen to be on.
    ruled = pins.carry(ROOT, source, key=pins.RULES, cap=caps["rules"], brief=short) if caps["rules"] else ""
    if ruled:
        parts.append(ruled)
    # THE DOCS CATALOGUE, not the docs. One line each, so an agent knows what has been
    # settled before it re-investigates it; the doc itself is read on demand.
    catalogued = docs.carry(ROOT, cap=caps["docs"], track=here, brief=short) if caps["docs"] else ""
    if catalogued:
        parts.append(say("docs_cite", catalogue=catalogued))
    # A CAP OF ZERO MEANS THE SECTION IS NOT IN THIS DEPTH AT ALL. Passed through, it
    # printed the heading and a bare "… and 23 more of 23" under it — a section announcing
    # that it had shown the reader nothing.
    kept = tools.carry(ROOT, cap=caps["tools"]) if caps["tools"] else ""
    if kept:
        parts.append(kept)
    pinned = pins.carry(ROOT, source, cap=caps["pins"], brief=short) if caps["pins"] else ""
    if pinned:
        parts.append(pinned)
    waiting = todo.carry(ROOT, here, cap=caps["todos"]) if caps["todos"] else ""
    if waiting:
        parts.append(waiting)
    # THE COUNTS ARE THE MECHANISM OF THE DOORWAY. A number beside a command is a fact an
    # agent acts on; a section silently left out is one it never learns about. Each row
    # names the command that reads that store in full, so it reads only what it needs.
    if depth == BRIEF:
        parts.append(_counts(here, unbound))
    if source == "compact":
        parts.append(say("compact_skills"))
        parts.append(say("compact_tail"))
    return "\n\n".join(parts)


def _standing(short: bool) -> str:
    """The work this session declared and never closed — the first record fact it meets.

    IT IS SECOND IN THE BLOCK, ABOVE THE RULES, because a summary is worst at exactly this.
    It is passable at narrative and hopeless at standing orders, and open work is the one
    standing order that decides what the next thirty seconds are spent on. Buried seventh,
    under three rules and three doc abstracts, it was read as trivia.

    THE TITLE, NOT THE UPDATES. The doorway carries pointers; `journal open` carries where
    each got to. A section that grows with how much was written about the work is the same
    defect as an uncapped pin, one noun over.

    AND SILENCE IS NOT AN ANSWER. An omitted section reads as "not mentioned", which leaves
    a reader unable to tell no open work from a doorway that did not say. So the brief block
    says nothing is open when nothing is, in the fewest words that settle it.
    """
    standing = work.open_work(ROOT)
    if not standing:
        return say("nothing_open") if short else ""
    return say("still_open", rows=[say("row", row=fmt.gist(w["subject"]) if short else w["subject"]) for w in standing])


def _todo_note(here: str, unbound: bool = False) -> str:
    """What the to-do count needs said beside it — and it is never the to-dos themselves.

    THE ANSWERED ONES ARE WHY THIS ROW MATTERS. A to-do the user has answered is them saying
    to do it, and it is the one thing in the record that is actionable now and invisible from
    a count: 117 waiting and 2 answered look identical unless the second number is said. The
    ANSWERS are what broke the block — two of them were 7,014 characters — so what crosses
    here is that they exist and the command that reads them.

    AND AUTO IS AN INSTRUCTION, NOT A LISTING. A session in auto that is not told so simply
    stops, which is the one omission a doorway cannot afford: everything else it leaves out
    is readable on demand, and this one is not readable at all — it is a standing order.
    """
    # TWO FACTS THAT BOTH APPLY. Auto is a standing order and an answered to-do is the user
    # saying to do that one — an early return on the first dropped the second, and an
    # answered row under auto is the most actionable thing in the record.
    answered_n = len(todo.answered(ROOT, here))
    asks_n = len(todo.asking(ROOT, here))
    said = []
    if todo.auto(ROOT):
        # NOT AN ORDER TO A SESSION ON NO ENVIRONMENT. The same block tells it to ask the user
        # which environment, and "work the list without asking" beside that started work on an
        # environment it never chose.
        said.append(say("note_auto_unbound") if unbound else say("note_auto"))
    if answered_n:
        said.append(say("note_answered", n=answered_n))
    elif asks_n:
        said.append(say("note_asks", n=asks_n))
    return "; ".join(said) or say("note_delayed")


def _counts(here: str, unbound: bool = False) -> str:
    """How much of each store stands, and the one command that reads it.

    ONLY WHAT IS NOT ALREADY ABOVE. Rules, pins and docs show their most recent few inline,
    each with its own count and its own "reads the rest" line, so repeating them here would
    print the same number twice and teach the reader that this block is filler. What is left
    is exactly what the doorway drops: the reminders, the to-dos, the open work, the tools.

    ROWS WITH NOTHING BEHIND THEM ARE NOT PRINTED. A zero teaches the reader these lines are
    noise, and the next line they skip is the one that mattered. `journal carry` is last
    because "I would rather read it all at once" is a real preference, and cheaper offered
    than discovered.
    """
    import reminders as rem
    rows = [
        (len(rem.live(ROOT)), "journal reminders", say("count_reminders")),
        (len(todo.open_items(ROOT, here)), "journal todos", _todo_note(here, unbound)),
        (len(tools._all(ROOT)), "journal tools", say("count_tools")),
        (len(__import__("connections").all_of(ROOT, here)), "journal connections", say("count_connections")),
        (len(__import__("suggestions").open_items(ROOT, here)), "journal suggestions", say("count_suggestions")),
    ]
    have = [(say("count_row", n=str(n).rjust(4), cmd=cmd), what) for n, cmd, what in rows if n]
    # THE HEADING BELONGS TO THE ROWS. With none of them standing it announced an empty
    # list and then offered `journal carry` under it — a heading over nothing, which is the
    # exact shape that teaches a reader to skip headings.
    if not have:
        return ""
    return say("counts", rows=fmt.commands(have + [(say("count_carry"), say("count_carry_what"))]))


def _loop_line(conf: dict) -> str:
    """The ask that keeps an idle auto session alive: a loop that prompts `journal next`."""
    m = conf.get("auto_loop_minutes", 0)
    if not m:
        return ""
    return say("keep_loop", m=m)


def _prune(keep: str = "") -> None:
    """Drop the runtime file of any transcript this machine no longer has.

    BY EVIDENCE, NEVER BY A COUNTER. A file is kept as long as its transcript is, however
    old, because `verify` counts these as proof the hook ran and nothing here deletes what
    it cannot account for. Subagent transcripts live one level down and are found there.
    Only `*.json` is touched: a writer's tmp is somebody else's file mid-flight.
    """
    project = ROOT.parent
    found: dict[str, bool] = {}

    def present(stem: str) -> bool:
        if stem not in found:
            found[stem] = transcript.find(project, stem) is not None
        return found[stem]

    for stem, _ in state.runtime_files(ROOT):
        # NEVER THE SESSION THAT IS STARTING. A transcript is not always on disk when
        # SessionStart fires — the harness writes it once there is something to write — so
        # `find` says gone for the very session whose mark was written one line earlier,
        # and the prune deleted the only evidence the hook had ever run. `verify` then read
        # the journal as dead in a session it was demonstrably running in. `keep` was
        # already threaded here for `tracks.prune`; the file loop simply ignored it.
        if stem == keep:
            continue
        if not present(stem):
            try:
                state.runtime_file(ROOT, stem).unlink()
            except OSError:
                pass
            _drop_caches(stem)
    tracks.prune(ROOT, lambda stem: stem == keep or present(stem))


def _remember_pid(stem: str) -> None:
    """Claude Code's process id for this session, so the channel server it starts can find its session."""
    import os
    pid = str(os.getppid())
    got = state.get(ROOT, "session_pids", {})
    got = got if isinstance(got, dict) else {}
    if got.get(pid) == stem:
        return
    got[pid] = stem
    state.put(ROOT, "session_pids", dict(list(got.items())[-50:]))


def on_session_start(conf: dict, payload: dict, ctx: Ctx) -> int:
    """Hand the session the store, and mark that this hook is alive in this transcript.

    EVIDENCE THAT THIS RAN, written by the only thing that can write it. Until now the
    only proof a hook had fired was a HOLD, so a journal doing its job quietly — teaching
    the vocabulary at every session start and never needing to hold anybody — was
    indistinguishable from one that had never been invoked. `verify` would have called it
    dead. A hook that works has to leave a mark, or the check that looks for marks is
    measuring how often the agent misbehaves rather than whether the mechanism is alive.
    """
    source = payload.get("source") or "startup"
    _floor(ctx)
    state.put(ROOT, "session_started", source, stem=ctx.stem)
    # A LOOP DOES NOT SURVIVE ITS PROCESS. A resumed or restarted session starts with none,
    # whatever the runtime file remembers; only a compaction keeps the process, and the loop.
    if source in ("resume", "startup"):
        state.put(ROOT, "loop_set", False, stem=ctx.stem)
    # A COMPACTION EMPTIES THE WINDOW, so the ladder starts again from its first rung. Left
    # standing, `pin_due` refused the first call of a nearly empty window, and `warned_at`
    # stuck at the old rung silenced every warning after it.
    if source == "compact":
        state.put(ROOT, "warned_at", 0.0, stem=ctx.stem)
        state.put(ROOT, "pin_due", None, stem=ctx.stem)
    # a --continue or --resume starts a session that once ended; it is running again
    if state.get(ROOT, "ended", None, stem=ctx.stem):
        state.put(ROOT, "ended", None, stem=ctx.stem)
    # NOT BOUND AT THE START. A session used to be put on the project's start environment
    # here, which meant every fresh session was working an environment it had never been
    # asked about; `bind_on_start` restores that. Unbound, the choice is made on the first
    # prompt, by the agent, out loud. A switch from inside the session rebinds it alone.
    if conf["bind_on_start"] and not tracks.bound(ROOT, ctx.stem):
        tracks.bind(ROOT, ctx.stem, tracks.start(ROOT))
    state.use_track(tracks.current(ROOT, ctx.stem))
    if source == "compact" and ctx.path is not None and not conf["context_window"]:
        peak = context.peak_before_compaction(ctx.path)
        if peak and not state.get(ROOT, "window", 0):
            state.put(ROOT, "window", context.window_from_peak(peak))
    began = transcript.read(ctx.path, _caches(ctx.stem)[0])[0] if ctx.path is not None and ctx.path.is_file() else []
    tracks.carried(ROOT, tracks.current(ROOT, ctx.stem), ctx.stem, (began[-1].n + 1) if began else 1)
    _prune(ctx.stem)
    loose = _unbound(conf, ctx)
    block = carried(source, ctx.stem, unbound=loose)
    if tracks.viewer_first(ROOT, tracks.current(ROOT, ctx.stem)):
        block = say("viewer_first_note") + "\n\n" + block
    taken = _track_due(conf, ctx)
    if taken:
        block = _taken_block(taken) + "\n\n" + block
    if WORKTREE_NOTE:
        block = WORKTREE_NOTE + "\n\n" + block
    # WHAT CHANGED SINCE THIS TRANSCRIPT LAST SAW THE JOURNAL, once. An upgrade writes the
    # version pair to the record; each transcript is handed the changelog the first time
    # it starts on the new version, and never again.
    up = state.get(ROOT, "upgraded", None)
    seen = state.get(ROOT, "seen_version", "", stem=ctx.stem)
    now = update.current(ROOT)
    if up and up.get("to") == now and seen != now:
        log = (ROOT / "CHANGELOG.md").read_text() if (ROOT / "CHANGELOG.md").is_file() else ""
        text = update.render_since(log, str(up.get("from", "0")), now)
        if text:
            block = text + "\n\n" + block
        # a viewer from before the self-restart keeps serving the old code until the agent restarts it
        import serve
        notice = serve.restart_notice(ROOT)
        if notice:
            block = notice + "\n\n" + block
    state.put(ROOT, "seen_version", now, stem=ctx.stem)
    if "update_check" not in conf["silenced"]:
        note = update.notice(ROOT)
        if note:
            block += "\n\n" + note
    told = [x for x in (_choice_line() if loose else "", _viewer_line(conf)) if x]
    return _context("SessionStart", block, system="\n".join(told) or None)


#: EVERY EVENT, IN ONE TABLE. The harness has to name this script once per event it should
#: hear about — that part is its rule, not ours — but the script is a single door, and what
#: happens behind it is decided in exactly one place.
#:
#: Every handler takes the same triple — settings, payload, and which transcript this is —
#: and uses what it needs, so the table is the whole routing story. The lowercase spellings
#: are the same events as the harness has also spelled them; an unknown event is silence,
#: because a doorbell that argues with a caller it does not recognise is worse than one
#: that does not ring.
_CONF: list = []


def conf_of(payload: dict) -> dict:
    return _CONF[0] if _CONF else settings_mod.load(ROOT)[0]


def _register(payload: dict, ctx: Ctx) -> str | None:
    """The environment this session is registered on — registering it now if it may be.

    A SESSION WITH NO BINDING YET — its start, or its first event after an update —
    registers on the project's start environment, UNLESS a running session holds it: then
    it is registered nowhere until it switches, told so at its start, refused edits and
    held at its stops meanwhile. That is how two agents never share an environment: the
    second one is simply not let in.
    """
    if tracks.bound(ROOT, ctx.stem):
        return tracks.current(ROOT, ctx.stem)
    # a continued or resumed session goes back on the environment it ended on, if that still exists and is free
    # A SESSION RETURNS TO THE ENVIRONMENT IT WAS IN. Only its own: a `--continue` or
    # `--resume` carries the same session id, and a brand-new one has never been anywhere,
    # so it starts on nothing rather than on somebody else's choice.
    ended_on = state.get(ROOT, "ended_on", "", stem=ctx.stem) if payload.get("source") == "resume" else ""
    if ended_on in tracks.choices(ROOT) and not tracks.occupants(ROOT, ended_on, ctx.stem):
        tracks.bind(ROOT, ctx.stem, ended_on)
        return tracks.current(ROOT, ctx.stem)
    if _track_due(conf_of(payload), ctx):
        return None
    # Bound only if the project still binds at the start. Otherwise this session is
    # registered NOWHERE and `current` says so: no binding is written behind its back, and
    # no environment is read as if it had been chosen.
    if conf_of(payload)["bind_on_start"]:
        tracks.bind(ROOT, ctx.stem, tracks.start(ROOT))
    return tracks.current(ROOT, ctx.stem)


def _claimed_note(ctx: Ctx | None, clear: bool = True) -> tuple[str, str] | None:
    """(label, text) if this session's environment was claimed away, else None. Said once.

    AN EVICTED SESSION IS NOT A SESSION THAT STARTED ON A TAKEN ENVIRONMENT, and until this
    it was told it was: being unbound, it fell into the registered-nowhere path, whose whole
    explanation is "the environment you START on is held by somebody else". True of the
    start environment, and no answer at all to what actually happened — the session HAD an
    environment, and another session took it. Wrong causes are worse than none: the reader
    switches somewhere else and never learns its work moved.
    """
    if ctx is None or not ctx.stem:
        return None
    got = state.get(ROOT, "claimed_away", {}, stem=ctx.stem)
    if not isinstance(got, dict) or not got.get("track"):
        return None
    if clear:
        state.put(ROOT, "claimed_away", {}, stem=ctx.stem)
    by = (got.get("by") or "")[:8] or say("another_session")
    return _say(say("claimed_fact", env=got["track"]), say("claimed_do", by=by, why=got.get("why", "")),
                note=say("claimed_note", env=got["track"]))


def _unregistered(conf: dict, payload: dict, handler, ctx: Ctx | None = None) -> int:
    """An actor registered nowhere: refused the journal's writes, handed the rules, else nothing.

    A SESSION registered nowhere is one whose start environment another running session
    holds. It is told at its start by whom, refused edits, held at its stops, and let
    through to the one thing that registers it: `journal switch` (or `prepare`) onto a
    free environment. Reads are fine.
    """
    if ctx is not None:
        due = state.get(ROOT, "track_due", None, stem=ctx.stem) or {}
        if handler is on_session_start:
            state.put(ROOT, "session_started", payload.get("source") or "startup", stem=ctx.stem)
            _floor(ctx)
            note = _claimed_note(ctx)
            block = ((note[1] if note else _taken_block(due))
                     + "\n\n" + carried(payload.get("source") or "startup", ctx.stem))
            return _context("SessionStart", (WORKTREE_NOTE + "\n\n" + block) if WORKTREE_NOTE else block)
        if handler is on_pre_tool:
            verb = _journal_write(payload)
            if verb and verb not in ("switch", "prepare"):
                return _deny(say("unregistered_deny", verb=verb, block=_taken_block(due)))
            if _is_write(payload) and not _journal_only(payload):
                return _deny(_taken_block(due))
            return 0
        if handler is on_stop:
            _HOLD_CTX[:] = [ctx.stem]
            note = _claimed_note(ctx)
            if note:
                return _hold(*note)
            env = due.get("track", "?")
            return _hold(say("taken_fact", env=env),
                         say("unregistered_hold", env=env, sid=str(due.get("by", ""))[:8], age=due.get("age", "")))
        return 0
    return 0


#: `WorktreeCreate` HAD A HANDLER HERE AND MUST NOT HAVE ONE. The event does not announce a
#: worktree Claude Code made — it is asked to MAKE it and echo the path, and the harness uses
#: what comes back. Wiring it hijacked worktree creation and broke every worktree-backed
#: dispatch in any project with the journal installed. `install.RETIRED_EVENTS` takes it back
#: out of settings.json on the next upgrade.
#:
#: A WORKTREE IS STILL HANDED THE JOURNAL, by the thing that always did it: `worktree.resolve`
#: runs at the import of this file, so the first tool call anybody makes inside a worktree
#: links it. That is also the only mechanism that works for a subagent, since nothing fires a
#: SessionStart for one.


def on_session_end(conf: dict, payload: dict, ctx: Ctx) -> int:
    """The session is over: its environment is free, and so is anything it lent.

    A GRANT DIES WITH THE SESSION, and for one release that was a sentence rather than a
    fact: `granted` is a runtime key, the runtime file outlives the session, and nothing
    cleared it — so a `claude --resume` woke up still lending an environment to subagents
    nobody was watching. That is a door left open by a session that has stopped looking,
    which is the exact failure the grant exists to prevent.
    """
    # remembered so a --continue or --resume of this session starts back on it
    state.put(ROOT, "ended_on", tracks.bound(ROOT, ctx.stem) or "", stem=ctx.stem)
    tracks.unbind(ROOT, ctx.stem)
    state.put(ROOT, "granted", [], stem=ctx.stem)
    state.put(ROOT, "ended", payload.get("reason") or "exit", stem=ctx.stem)
    # the parsed transcript is megabytes; a resumed session parses it again once
    _drop_caches(ctx.stem, lines_only=True)
    state.put(ROOT, "loop_set", False, stem=ctx.stem)
    return 0


def on_subagent_stop(conf: dict, payload: dict, ctx: Ctx) -> int:
    """A subagent stopped; the subagent branch in main marks it finished. Nothing else about it is the journal's."""
    return 0


HANDLERS = {
    "SubagentStop": on_subagent_stop,
    "SessionEnd": on_session_end,
    "session-end": on_session_end,
    "Stop": on_stop,
    "stop": on_stop,
    "UserPromptSubmit": on_user_prompt,
    "user-prompt-submit": on_user_prompt,
    "SessionStart": on_session_start,
    "session-start": on_session_start,
    "PreToolUse": on_pre_tool,
    "pre-tool-use": on_pre_tool,
    "PostToolUse": on_post_tool,
    "post-tool-use": on_post_tool,
    "PreCompact": on_pre_compact,
    "pre-compact": on_pre_compact,
}


def main(raw: str | None = None) -> int:
    """One hook event. `raw` is the payload; without it, stdin — which is how the harness
    calls it, and how a test can answer many events in one interpreter instead of one."""
    try:
        payload = json.loads(raw) if raw is not None else json.load(sys.stdin)
    except Exception:
        return 0  # a doorbell that crashes on a payload it did not expect is worse than none
    # THE KILL SWITCH, CHECKED BEFORE ANYTHING ELSE. `journal disable` — the user's
    # own command, never the agent's to reach for — and every hook event is inert
    # from here on: no hold, no gate, no context, nothing filed. The CLI itself is
    # untouched (this is the hook, not `journal.py`), so `journal enable` is never
    # blocked by the very switch it is turning back on.
    if not state.hooks_enabled(ROOT):
        return 0
    conf, problems = settings_mod.load(ROOT)
    for p in problems:
        print(say("problem", problem=p), file=sys.stderr)

    # THE HOOK MIGRATES TOO. A consumer whose agent never types a `journal` command still
    # fires hooks on every tool call, so this is the entry point that reaches everybody.
    with contextlib.suppress(Exception):
        migrate.ensure(ROOT)
    event = payload.get("hook_event_name") or payload.get("event") or ""
    handler = HANDLERS.get(event)
    if handler is None or (handler is on_subagent_stop and not payload.get("agent_id")):
        return 0
    state.retire_old(ROOT)
    ctx = _ctx(payload)
    if ctx is None:
        print(say("no_session", event=event), file=sys.stderr)
        return 0
    # A SUBAGENT IS TURNED AWAY AT THE DOOR, AND THAT IS THE WHOLE OF IT. It used to be let
    # in and then handled: a delegation to bind it to an environment, a rules ladder on its
    # own window, a refusal list for the verbs it may not run, a stop that had to check
    # whether it had a transcript. Nine branches, in six functions, all asking the same
    # question — and the question belongs here, once, where the answer is "no".
    #
    # A subagent's shell carries its PARENT's session id, so anything it wrote would land
    # in the parent's record under the parent's name. It reports what it found; the main
    # conversation files it. That was always the rule; now it is also the implementation.
    if payload.get("agent_id"):
        # THE ONE PLACE THAT ASKS WHETHER AN ACTOR IS A SUBAGENT, and it asks once. What it
        # decides is narrow: a subagent's journal WRITE goes through only if the dispatching
        # session lent it an environment and the command names that environment. Everything
        # else about it — its stop, its context, its registration — is nothing to the
        # journal, which is why there is no second branch anywhere below.
        #
        # THE SESSION ID IS THE DISPATCHER'S. That is the whole reason the grant exists and
        # also the reason `switch` and its kin stay refused however it is granted: they move
        # a session, and the session they would move is the one that dispatched this agent.
        # ITS OWN NAME, FROM THE ONLY THING THAT KNOWS IT. A subagent cannot identify
        # itself — nothing in its process carries `agent_id`, and two concurrent ones have
        # byte-identical environments. This does, on every call, so the first one creates
        # its ledger, stamps the heartbeat and tells it the two flags to use. Said once:
        # after that it has been told, and repeating it every call is the wall this package
        # spends its whole design avoiding.
        aid = state.slug(str(payload.get("agent_id") or ""))
        here = tracks.current(ROOT, ctx.stem if ctx else None)
        # the subagent's own id is bound to nothing; it works on the environment of the session that sent it
        where = tracks.current(ROOT, _parent_of(payload))
        if handler is on_subagent_stop:
            # A STOP ALONE IS NOT A SUBAGENT. The harness's own helpers (an away summary, a background
            # task) stop with an agent_id, call no tool and write no transcript; recorded, each showed as a
            # nameless subagent with nothing to open. Only an agent seen at work, or one that left a
            # transcript, is marked finished.
            if aid in (agents.seen(ROOT).get(where) or {}) or transcript.find(ROOT.parent, f"agent-{aid}"):
                agents.heartbeat(ROOT, where, aid, _parent_of(payload))
                agents.finish(ROOT, where, aid)
            return 0
        agents.heartbeat(ROOT, where, aid, _parent_of(payload), cwd=str(payload.get("cwd") or ""))
        lent = grants.granted(ROOT, _parent_of(payload))
        # ON THE TOOL'S RESULT, NOT BEFORE IT. `DELIVERS_CONTEXT` does not list PreToolUse
        # — the harness rejects `additionalContext` there, measured, and the reference
        # disagrees with that; where the two differ this package trusts what it watched
        # happen. PostToolUse carries it, and the first tool call is still long before the
        # subagent's first journal command, which is the only moment the name has to exist.
        if aid and lent and handler is on_post_tool:
            told = state.get(ROOT, "agents_told", [], stem=_parent_of(payload)) or []
            # `journal lent` IS THE DELIBERATE ASK, and it is answered however often it is
            # asked. The briefing on a first tool call is a rescue for an agent that never
            # thought to ask; this is the agent asking, and an answer that came once and
            # then stopped would be worse than no command at all.
            called = agents.described(ROOT.parent, _parent_of(payload), aid)
            if _asked_lent(payload):
                return _context("PostToolUse", agents.briefing(lent, aid, called))
            if aid not in told:
                state.put(ROOT, "agents_told", told + [aid], stem=_parent_of(payload))
                # THE LEDGER GOES WHERE THE AGENT ACTUALLY WRITES, and until it names an
                # environment there is nothing to create. With one grant standing that is
                # knowable now; with several it is not, and `state.use_agent` makes the
                # folder on the first write anyway.
                for env in (lent if len(lent) == 1 else ()):
                    agents.touch(ROOT, env, aid)
                    agents.dir_of(ROOT, env, aid).mkdir(parents=True, exist_ok=True)
                return _context("PostToolUse", agents.briefing(lent, aid, called))
        if handler is on_pre_tool:
            # THREE THINGS NO GRANT LETS A SUBAGENT DO: hide what it runs, close a row, or
            # decide a suggestion. Its row is reported, never closed (journal-agents); a
            # suggestion is the user's; and a line the hook cannot read cannot be allowed.
            cmds = _journal_cmds(payload)
            if cmds is None:
                return _deny(say("agent_unreadable"))
            if any(_closes_row(c, w) for _, c, w in cmds):
                return _deny(say("agent_closes_row"))
            mine = _user_only(payload)
            if mine:
                return _deny(say("user_only", verb=mine))
        verb = _journal_write(payload) if handler is on_pre_tool else ""
        if verb:
            command = str((payload.get("tool_input") or {}).get("command", ""))
            # THE GRANT LIVES ON THE DISPATCHER, and `ctx.stem` here is `agent-<id>` — the
            # subagent's own runtime name. The session that lent the environment is the one
            # whose transcript this event carries, which is the parent's: the same identity
            # collision that makes the whole grant necessary, showing up in the lookup.
            ok, why = grants.allows(ROOT, _parent_of(payload), verb, command)
            if not ok:
                return _deny(why)
            # `--as=` IS CHECKED, NEVER TRUSTED. It is the only way a subagent's ledger can
            # be named on a command line, and an unchecked one would let any subagent claim
            # another's — its work, and the to-do that is held for it.
            said = grants.acting_in(command)
            if said and said != aid:
                return _deny(say("as_denied", said=said, aid=aid))
        return 0
    _CONF[:] = [conf]
    env = _register(payload, ctx)
    if env is None:
        return _unregistered(conf, payload, handler, ctx)
    # THE SETTINGS ARE READ AGAIN ONCE THE ENVIRONMENT IS KNOWN, because a setting has a scope:
    # the project's value, and what this environment disagrees with. The first read above has to
    # happen before the environment is settled — it is what decides whether the hook runs at all —
    # so this is the same load with the answer to "where" in hand.
    if settings_mod.overrides(ROOT, env):
        conf, _ = settings_mod.load(ROOT, env)
        _CONF[:] = [conf]
    # A CRASH IS WORSE THAN SILENCE. A traceback here is rendered to the user as a hook
    # error, which teaches that the journal is broken where it was only surprised. Say
    # what happened on stderr and let the turn go on.
    try:
        state.use_track(env)
        # ALIVE, AS OF NOW. What `tracks.occupants` reads to tell a running session from a
        # terminal that was closed without a SessionEnd.
        state.put(ROOT, "seen_at", int(time.time()), stem=ctx.stem)
        # WHERE IT WAS, STAMPED AS IT GOES. SessionEnd records this too, but a session that
        # is killed never fires one — and with no default environment to fall back to, a
        # resume that has forgotten where it was starts nowhere. Written on every event, so
        # the answer survives a crash.
        if env:
            state.put(ROOT, "ended_on", env, stem=ctx.stem)
        # which event came last tells an idle session (Stop) from a working one, for the channel server
        state.put(ROOT, "last_event", event, stem=ctx.stem)
        _remember_pid(ctx.stem)
        return handler(conf, payload, ctx)
    except Exception as e:  # noqa: BLE001
        print(say("handler_failed", event=event, kind=type(e).__name__, error=e), file=sys.stderr)
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
