from datetime import datetime, timezone
import json
from argparse import Namespace
from dataclasses import asdict
from datetime import datetime, timedelta, timezone
from pathlib import Path
from journal.console.support.chained_line import ChainedLine

from journal.console.command import Command
from journal.support.caller import Caller
from journal.support.worktree import Worktree
from journal.config import Config
from journal.features.shell.support.shell_record import ENDED, MOVED
from journal.support.environment_row import EnvironmentRow
from journal.models.task_state import TaskState
from journal.providers.providers import Providers
from journal.repositories.agents import Agents
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.features.memory.support.memory_context import MemoryContext
from journal.features.briefing.support.overview_commands import OverviewCommands
from journal.features.tasks.active_task import ActiveTask
from journal.repositories.facts import Facts
from journal.repositories.messages import Messages
from journal.support.missing_row import MissingRow
from journal.support.rejection import Rejection
from journal.repositories.questions import Questions
from journal.repositories.reminders import Reminders
from journal.repositories.rules import Rules
from journal.repositories.scope import Scope
from journal.repositories.tasks import Tasks
from journal.repositories.workers import Workers
from journal.repositories.environment_owners import EnvironmentOwners
from journal.sync.team_account import TeamAccount

TAKEOVER_WINDOW = timedelta(hours=12)


class EnvironmentCommand(Command):
    noun = "environment"

    def __init__(self, environments: Environments, agents: Agents, tasks: Tasks, messages: Messages, questions: Questions, workers: Workers, entries: Entries, rules: Rules, facts: Facts, reminders: Reminders, providers: Providers, config: Config, scope: Scope, memory: MemoryContext, overview_commands: OverviewCommands, taking: ActiveTask, owners: EnvironmentOwners, account: TeamAccount) -> None:
        self.owners, self.account = owners, account
        self.environments, self.agents, self.tasks, self.messages, self.questions, self.workers, self.entries = environments, agents, tasks, messages, questions, workers, entries
        self.rules, self.facts, self.reminders, self.providers, self.config, self.scope = rules, facts, reminders, providers, config, scope
        self.memory, self.overview_commands, self.taking = memory, overview_commands, taking

    def arguments(self, verbs) -> None:
        self.verb(verbs, "overview", "everything in flight in this environment: the task in hand, open tasks, messages, questions, workers, background runs, and the rules, facts and reminders, then each command the setting briefing.look_commands names, under its heading; owed at every session start")
        self.verb(verbs, "list", "every environment and when it was last used")
        self.verb(verbs, "json", "the same, for the boot menu")
        self.verb(verbs, "create", "a new line of work").add_argument("name")
        self.verb(verbs, "delete", "an environment and everything recorded in it").add_argument("name")
        rename = self.verb(verbs, "rename", "give an environment a new name; everything recorded in it stays")
        rename.add_argument("name")
        rename.add_argument("new")

    def rows(self) -> list[EnvironmentRow]:
        rows = []
        for environment in self.environments.all() or [self.environments.lookup("main")]:
            with self.scope.environment(environment.row_id):
                agents = self.agents.scoped()
            last = max(agents, key=lambda item: item.update_time) if agents else None
            resumable = [item for item in agents if item.session and self.providers.lookup(item.provider).transcript(self.config.root, item.session)]
            rows.append(EnvironmentRow(environment.name, last is not None and last.state != "ended", self.age(last.update_time) if last else "", {item.provider: item.session for item in resumable}, self.owners.start_refusal(environment, self.account.user_number())))
        return rows

    def overview(self, args: Namespace, caller: Caller) -> int:
        for line in self.current_work(caller):
            print(line)
        self.overview_record(caller)
        self.memory.admit_all(caller.actor)
        return 0

    def overview_chain(self, args: Namespace, caller: Caller) -> list[ChainedLine]:
        return self.overview_commands.lines()

    def current_work(self, caller: Caller) -> list[str]:
        start = datetime.now(timezone.utc) - TAKEOVER_WINDOW
        peers = self.agents.recent_peers(caller.session, start)
        holder = self.taking.holder(caller)
        current = None if holder is None else self.tasks.holder_task(holder)
        peer_tasks = self.tasks.other_started_tasks(current)
        lines = [
            f"taken over from another agent, last seen {peers[-1].update_time.astimezone().strftime('%H:%M')}" if peers else "",
            f"task in hand: {current.id} {current.title}" if current else "no task in hand",
            self.matching_rows("started by other agents", [f"{t.id} {t.title}" for t in peer_tasks]),
            self.matching_rows("open tasks", [f"{t.id} {t.title}" for t in self.tasks.open_tasks()]),
            self.matching_rows("parked tasks", [f"{t.id} {t.title} ({t.suspension_reason})" for t in self.tasks.with_state(TaskState.SUSPENDED)]),
            self.matching_rows("blocked tasks", [f"{t.id} {t.title} (waiting on: {self.tasks.reason(t)})" for t in self.tasks.blocked_tasks()]),
            self.matching_rows("unread messages", [str(m.id) for m in self.messages.unread()]),
            self.matching_rows("messages read and unanswered", [str(m.id) for m in self.messages.unanswered()]),
            self.matching_rows("questions waiting for the user", [f"{q.id} {q.text}" for q in self.questions.open()]),
            self.matching_rows("workers out", [f"{w.id} {w.name}" for w in self.workers.active()]),
            self.matching_rows("running in the background", self.background()),
            self.matching_rows("rules in force", [f"{r.id} {r.text}" for r in self.rules.all()]),
            self.matching_rows("facts about this environment", [f"{f.id} {f.text}" for f in self.facts.scoped()]),
            self.matching_rows("reminders here", [f"{r.id} {r.text}" for r in self.reminders.scoped()]),
        ]
        return [line for line in lines if line]

    def background(self) -> list[str]:
        moved = self.entries.open_moves(MOVED, ENDED)
        return [f"{e.data['part']} (output in {e.data['file']})" for e in moved if Path(e.data["file"]).is_dir() and not (Path(e.data["file"]) / "done").is_file()]

    @staticmethod
    def matching_rows(subject: str, rows: list[str]) -> str:
        return f"{subject}: " + "; ".join(rows) if rows else ""

    def overview_record(self, caller: Caller) -> None:
        if caller.session is None:
            return
        try:
            self.agents.save(self.agents.session_agent(caller.session).overview_read(datetime.now(timezone.utc).timestamp()), caller.actor)
        except MissingRow:
            return

    def list(self, args: Namespace, caller: Caller) -> int:
        for row in self.rows():
            print(f"{row.name:<20} {row.last_used}")
        return 0

    def json(self, args: Namespace, caller: Caller) -> int:
        print(json.dumps([asdict(row) for row in self.rows()]))
        return 0

    def create(self, args: Namespace, caller: Caller) -> int:
        environment = self.environments.lookup(self.account.personal_name(args.name))
        print(f"environment {environment.id}: {environment.name}")
        return 0

    def delete(self, args: Namespace, caller: Caller) -> int:
        rows = self.environments.matching(name=args.name)
        if not rows:
            print(f"no environment named {args.name}")
            return 1
        self.environments.wipe(rows[0], caller.actor)
        dropped = Worktree(self.config.root, rows[0].name).dropped()
        print(f"deleted environment {rows[0].id}: {rows[0].name}, with everything recorded in it" + (f"; {dropped}" if dropped else ""))
        return 0

    def rename(self, args: Namespace, caller: Caller) -> int:
        rows = self.environments.existing(args.name)
        if self.environments.matching(name=args.new):
            raise Rejection(f"an environment named {args.new} exists already")
        with self.scope.environment(rows.row_id):
            if self.agents.current() is not None:
                raise Rejection(f"an agent works in {rows.name}: stop it first, then rename")
        if Worktree(self.config.root, rows.name).path.is_dir():
            raise Rejection(f"{rows.name} has a worktree named after it: an environment with a worktree keeps its name")
        renamed = self.environments.save(rows.with_(name=args.new), caller.actor)
        print(f"environment {renamed.id} renamed: {args.name} is now {renamed.name}")
        return 0

    @staticmethod
    def age(time: datetime) -> str:
        seconds = (datetime.now(timezone.utc) - time).total_seconds()
        for unit, span in (("day", 86400), ("hour", 3600), ("minute", 60)):
            if seconds >= span:
                n = int(seconds // span)
                return f"{n} {unit}{'s' if n != 1 else ''} ago"
        return "just now"
