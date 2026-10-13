from controllers.types import Todos
from events.agents import AgentReported
from events.close_from_commits import CommitMade, LogRead, TrailerFound
from expects import Dispatches, Given, Nudged, Refused, Remembered, Unchanged, Updated, answering, nothing
from expects.playing import checked_out
from features.close_from_commits.commands import SweepLanded
from features.close_from_commits.details import CloseFromCommitsDetails
from features.close_from_commits.handlers import CloseWhatTheCommitNames, MarkTheCommit, RememberTheLogs
from features.close_from_commits.listeners import SpotCommit, stamp_key
from features.close_from_commits.trailers import COMMIT_FORMAT, REFLOG, landing_args
from framework.base import Feature
from framework.journal import Journal
from resources.text import digest
from resources.types import AgentRow, Todo, Work

AGENT_ROW = AgentRow(n=1, title="claude-1")
MAIN = checked_out("main", landing="")
LANDING = checked_out("main", landing="origin/main")
WORKTREE = checked_out("other", top="/work/app-wt", linked=True, landing="origin/main")
HEAD_LOG, LANDING_LOG = MAIN.head_log, LANDING.landing_log
HEAD_STAMP, LANDING_STAMP = ("stamp", "HEAD"), ("stamp", "main")
REFLOG_ASK = ("git", *REFLOG)
LANDED = lambda span: ("git", *landing_args(span))
CURSOR = f"cursor|{digest(str(HEAD_LOG), 12)}"
LANDED_CURSOR = f"landed|{digest('origin/main', 12)}"
COMMITTED = AgentReported(agent=1, hook="PostToolUse")


def reflog(*entries: tuple[str, str, str, str]) -> str:
    """The reflog as git prints it with the format the journal asks for: the newest entry first."""
    return "".join(f"{sha}\x1f{action}\x1f{subject}\x1f{body}\n\x1e" for sha, action, subject, body in entries)


def landed(*entries: tuple[str, str, str]) -> str:
    return "".join(f"{sha}\x1f{subject}\x1f{body}\n\x1e" for sha, subject, body in entries)


def trailer(n: int) -> str:
    return f"A change\n\nJournal: todos done {n}"


def found(sha: str, subject: str, body: str, held_only: bool = False) -> TrailerFound:
    return TrailerFound(agent=1, sha=sha, subject=subject, body=body, held_only=held_only)


def looking(checked, asked: dict | None = None) -> dict:
    return dict(rows=[AGENT_ROW], git=answering({("checkout",): checked, **(asked or {})}))


class CloseFromCommits(Feature):
    details = CloseFromCommitsDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(AgentReported, SpotCommit(), expects=[
            Given(AgentReported(agent=1, hook="PreToolUse"), **looking(MAIN)) >> Dispatches(nothing),
            Given(COMMITTED, **looking(None)) >> Dispatches(nothing),
            Given(COMMITTED, **looking(MAIN, {HEAD_STAMP: 100, REFLOG_ASK: reflog(("b" * 40, "commit: a change", "a change", trailer(1)))}))
                >> Dispatches(found("b" * 40, "a change", trailer(1))) & Dispatches(LogRead(stamps=((stamp_key(HEAD_LOG), 100),), cursors=((CURSOR, "b" * 40),))),
            Given(COMMITTED, **looking(MAIN, {HEAD_STAMP: 100, REFLOG_ASK: reflog(("c" * 40, "commit: next", "next", "plain"), ("b" * 40, "commit: a change", "a change", trailer(1)))}),
                  remembered={f"close_from_commits.{CURSOR}": "b" * 40})
                >> Dispatches(CommitMade(agent=1, sha="c" * 40, subject="next", branch="main")) & Dispatches(LogRead(stamps=((stamp_key(HEAD_LOG), 100),), cursors=((CURSOR, "c" * 40),))),
            Given(COMMITTED, **looking(MAIN, {HEAD_STAMP: 100, REFLOG_ASK: reflog(("c" * 40, "commit: tickets", "tickets", trailer(2)), ("b" * 40, "commit: a change", "a change", "plain"))}),
                  remembered={f"close_from_commits.{CURSOR}": "b" * 40})
                >> Dispatches(CommitMade(agent=1, sha="c" * 40, subject="tickets", branch="main")) & Dispatches(found("c" * 40, "tickets", trailer(2)))
                & Dispatches(LogRead(stamps=((stamp_key(HEAD_LOG), 100),), cursors=((CURSOR, "c" * 40),))),
            Given(COMMITTED, **looking(MAIN, {HEAD_STAMP: 100, REFLOG_ASK: reflog(("c" * 40, "checkout: moving from main to other", "", ""), ("b" * 40, "commit: a change", "a change", "plain"))}),
                  remembered={f"close_from_commits.{CURSOR}": "b" * 40})
                >> Dispatches(LogRead(stamps=((stamp_key(HEAD_LOG), 100),), cursors=((CURSOR, "c" * 40),))),
            Given(COMMITTED, **looking(MAIN, {HEAD_STAMP: 100, REFLOG_ASK: reflog(("c" * 40, "commit: later", "later", trailer(3)))}), remembered={f"close_from_commits.{CURSOR}": "0" * 40})
                >> Dispatches(found("c" * 40, "later", trailer(3))) & Dispatches(LogRead(stamps=((stamp_key(HEAD_LOG), 100),), cursors=((CURSOR, "c" * 40),))),
            Given(COMMITTED, **looking(MAIN, {HEAD_STAMP: 100}), remembered={f"close_from_commits.{stamp_key(HEAD_LOG)}": 100}) >> Dispatches(nothing),
            Given(COMMITTED, **looking(MAIN, {HEAD_STAMP: 0})) >> Dispatches(nothing),
            Given(COMMITTED, **looking(MAIN, {HEAD_STAMP: 100, REFLOG_ASK: ""})) >> Dispatches(LogRead(stamps=((stamp_key(HEAD_LOG), 100),), cursors=())),
            Given(COMMITTED, **looking(LANDING, {HEAD_STAMP: 0, LANDING_STAMP: 200, ("git", "rev-parse", "origin/main"): "d" * 40 + "\n", LANDED("d" * 40): landed(("d" * 40, "made in a worktree", "made in a worktree\n\nJournal: todos done 4"))}))
                >> Dispatches(found("d" * 40, "made in a worktree", "made in a worktree\n\nJournal: todos done 4", held_only=True))
                & Dispatches(LogRead(stamps=((stamp_key(LANDING_LOG), 200),), cursors=((LANDED_CURSOR, "d" * 40),))),
            Given(COMMITTED, **looking(LANDING, {HEAD_STAMP: 0, LANDING_STAMP: 200, ("git", "rev-parse", "origin/main"): "e" * 40 + "\n", LANDED("d" * 40 + ".." + "e" * 40): landed(("e" * 40, "next", "next\n\nJournal: todos done 5"))}),
                  remembered={f"close_from_commits.{LANDED_CURSOR}": "d" * 40})
                >> Dispatches(found("e" * 40, "next", "next\n\nJournal: todos done 5")) & Dispatches(LogRead(stamps=((stamp_key(LANDING_LOG), 200),), cursors=((LANDED_CURSOR, "e" * 40),))),
            Given(COMMITTED, **looking(LANDING, {HEAD_STAMP: 0, LANDING_STAMP: 200, ("git", "rev-parse", "origin/main"): "d" * 40 + "\n"}), remembered={f"close_from_commits.{LANDED_CURSOR}": "d" * 40})
                >> Dispatches(LogRead(stamps=((stamp_key(LANDING_LOG), 200),), cursors=((LANDED_CURSOR, "d" * 40),))),
            Given(COMMITTED, **looking(WORKTREE, {HEAD_STAMP: 0})) >> Dispatches(nothing),
        ])
        journal.events.handle(LogRead, RememberTheLogs(), expects=[
            Given(LogRead(stamps=(("stamp|aa", 100),), cursors=(("cursor|bb", "b" * 40),)), rows=[AGENT_ROW]) >> Remembered("stamp|aa", 100) & Remembered("cursor|bb", "b" * 40),
        ])
        journal.events.handle(CommitMade, MarkTheCommit(), expects=[
            Given(CommitMade(agent=1, sha="c" * 40, subject="next", branch="main"), rows=[AGENT_ROW])
                >> Updated(AgentRow(n=1), cards=[{"label": f"Agent committed {'c' * 8} on `main`", "icon": "branch", "tone": "commit", "title": "next"}]),
        ])
        journal.events.handle(TrailerFound, CloseWhatTheCommitNames(), expects=[
            Given(found("b" * 40, "a change", trailer(1)), rows=[AGENT_ROW, Todo(n=1, title="first")])
                >> Updated(Todo(n=1), outcome=f"a change ({'b' * 9})") & Nudged("closed", sha="b" * 9, rows="to-do 1", ended=""),
            Given(found("b" * 40, "words", "words\n\nJournal: todos done 1 the vocabulary is settled"), rows=[AGENT_ROW, Todo(n=1, title="first")])
                >> Updated(Todo(n=1), outcome="the vocabulary is settled"),
            Given(found("b" * 40, "again", "again\n\nJournal: todos done 99"), rows=[AGENT_ROW, Todo(n=1, title="first")]) >> Unchanged(),
            Given(found("b" * 40, "held", "held\n\nJournal: todos done 1, 2", held_only=True), rows=[AGENT_ROW, Todo(n=1, title="plain"), Todo(n=2, title="held", data={"assigned": "helper:1"})])
                >> Updated(Todo(n=2), outcome=f"held ({'b' * 9})") & Nudged("closed", sha="b" * 9, rows="to-do 2", ended=""),
            Given(found("b" * 40, "third", trailer(3)), rows=[AGENT_ROW, Todo(n=3, title="third"), Work(n=1, title="third", data={"todo": 3})])
                >> Nudged("closed", sha="b" * 9, rows="to-do 3", ended=" and ended work 1"),
        ])
        journal.commands.add("todo", SweepLanded(), expects=[
            Given((Todos,), rows=[Todo(n=5, title="Fix the crash")]) >> Refused("this project has no main branch from a remote to read trailers from"),
        ])
