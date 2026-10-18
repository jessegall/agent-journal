import json
from argparse import Namespace
from dataclasses import asdict
from datetime import datetime, timedelta, timezone
from pathlib import Path

from journal.console.command import Command
from journal.console.where import Where
from journal.config import Config
from journal.engine.machine import Machine
from journal.features.shell.commands.shell_command import ENDED, MOVED
from journal.launcher.environment_row import EnvironmentRow
from journal.models.task_state import TaskState
from journal.providers.providers import Providers
from journal.repositories.agents import Agents
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.repositories.facts import Facts
from journal.repositories.messages import Messages
from journal.repositories.not_found import NotFound
from journal.repositories.questions import Questions
from journal.repositories.reminders import Reminders
from journal.repositories.rules import Rules
from journal.repositories.scope import Scope
from journal.repositories.tasks import Tasks
from journal.repositories.workers import Workers

TAKEN_OVER_WITHIN = timedelta(hours=12)


class EnvironmentCommand(Command):
    noun = "environment"

    def __init__(self, environments: Environments, agents: Agents, tasks: Tasks, messages: Messages, questions: Questions, workers: Workers, entries: Entries, rules: Rules, facts: Facts, reminders: Reminders, machine: Machine, providers: Providers, config: Config, scope: Scope) -> None:
        self.environments, self.agents, self.tasks, self.messages, self.questions, self.workers, self.entries = environments, agents, tasks, messages, questions, workers, entries
        self.rules, self.facts, self.reminders, self.machine, self.providers, self.config, self.scope = rules, facts, reminders, machine, providers, config, scope

    def arguments(self, verbs) -> None:
        self.verb(verbs, "here", "everything in flight in this environment: the task in hand, open tasks, messages, questions, workers, background runs, and the rules, facts and reminders; owed at every session start")
        self.verb(verbs, "list", "every environment and when it was last used")
        self.verb(verbs, "json", "the same, for the boot menu")
        self.verb(verbs, "create", "a new line of work").add_argument("name")
        self.verb(verbs, "delete", "an environment and everything recorded in it").add_argument("name")

    def rows(self) -> list[EnvironmentRow]:
        """Each environment for the boot menu: for each agent program, its newest session whose conversation it can still find, so a carry-on never names one it has lost nor one of another program."""
        rows = []
        for environment in self.environments.all() or [self.environments.named("main")]:
            with self.scope.of(environment.id):
                agents = self.agents.in_()
            last = agents[-1] if agents else None
            resumable = [a for a in agents if a.session and self.providers.named(a.provider or "claude").transcript(self.config.root, a.session)]
            rows.append(EnvironmentRow(environment.name, bool(last) and last.state != "ended", self.ago(last.updated_at) if last else "", {a.provider or "claude": a.session for a in resumable}))
        return rows

    def here(self, args: Namespace, where: Where) -> int:
        for line in self.in_flight(where.session):
            print(line)
        self.oriented(where)
        return 0

    def in_flight(self, session: str) -> list[str]:
        """What an agent must know here, one line a kind; nothing in flight says so."""
        since = datetime.now(timezone.utc) - TAKEN_OVER_WITHIN
        others = self.agents.others_lately(session, since)
        held = self.tasks.in_state(TaskState.STARTED)
        lines = [
            f"taken over from another agent, last seen {others[-1].updated_at.astimezone().strftime('%H:%M')}" if others else "",
            self.named("task in hand", [f"{t.id} {t.title}" for t in held]) or "no task in hand",
            self.named("open tasks", [f"{t.id} {t.title}" for t in self.tasks.in_state(TaskState.OPEN)]),
            self.named("parked tasks", [f"{t.id} {t.title} ({t.parked_why})" for t in self.tasks.in_state(TaskState.PARKED)]),
            self.named("blocked tasks, waiting on something outside", [f"{t.id} {t.title} (waiting on: {t.blocked_why})" for t in self.tasks.in_state(TaskState.BLOCKED)]),
            self.named("unread messages", [str(m.id) for m in self.messages.unread()]),
            self.named("messages read and unanswered", [str(m.id) for m in self.messages.unanswered()]),
            self.named("questions waiting for the user", [f"{q.id} {q.text}" for q in self.questions.open()]),
            self.named("workers out", [f"{w.id} {w.name}" for w in self.workers.out()]),
            self.named("running in the background", self.background()),
            self.named("rules in force", [f"{r.id} {r.text}" for r in self.rules.all()]),
            self.named("facts about this environment", [f"{f.id} {f.text}" for f in self.facts.in_()]),
            self.named("reminders here", [f"{r.id} {r.text}" for r in self.reminders.in_()]),
        ]
        return [line for line in lines if line]

    def background(self) -> list[str]:
        """The chains moved to the background that have not ended: not reported as ended, and their folder still there without a done mark."""
        ended = {e.data["chain"] for e in self.entries.of_kind(ENDED, 50)}
        moved = [e for e in reversed(self.entries.of_kind(MOVED, 50)) if e.data["chain"] not in ended]
        return [f"{e.data['part']} (output in {e.data['file']})" for e in moved if Path(e.data["file"]).is_dir() and not (Path(e.data["file"]) / "done").is_file()]

    @staticmethod
    def named(what: str, rows: list[str]) -> str:
        return f"{what}: " + "; ".join(rows) if rows else ""

    def oriented(self, where: Where) -> None:
        """An agent that read this has its bearings: the look it owed since its start is paid."""
        if not where.session:
            return
        try:
            self.agents.touch(self.agents.for_session(where.session), where.actor, oriented=True)
        except NotFound:
            return

    def list(self, args: Namespace, where: Where) -> int:
        for row in self.rows():
            print(f"{row.name:<20} {row.last_used}")
        return 0

    def json(self, args: Namespace, where: Where) -> int:
        print(json.dumps([asdict(row) for row in self.rows()]))
        return 0

    def create(self, args: Namespace, where: Where) -> int:
        environment = self.environments.named(args.name)
        print(f"environment {environment.id}: {environment.name}")
        return 0

    def delete(self, args: Namespace, where: Where) -> int:
        found = self.environments.where(name=args.name)
        if not found:
            print(f"no environment named {args.name}")
            return 1
        self.environments.wipe(found[0], where.actor)
        print(f"deleted environment {found[0].id}: {found[0].name}, with everything recorded in it")
        return 0

    @staticmethod
    def ago(at: datetime) -> str:
        seconds = (datetime.now(timezone.utc) - at).total_seconds()
        for unit, span in (("day", 86400), ("hour", 3600), ("minute", 60)):
            if seconds >= span:
                n = int(seconds // span)
                return f"{n} {unit}{'s' if n != 1 else ''} ago"
        return "just now"
