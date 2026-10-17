import time
from datetime import datetime, timezone

from journal.engine.machine import Machine
from journal.features.questions.answering import Answering
from journal.features.questions.states.waiting import Waiting
from journal.features.tasks.states.working import Working
from journal.http.request import Request
from journal.http.v3.attachments import Attachments
from journal.http.v3.agent_actions import AgentActions
from journal.http.v3.secret_actions import SecretActions
from journal.models.author import Author
from journal.models.fact import Fact
from journal.models.doc import Doc
from journal.models.message import Message
from journal.models.report import Report
from journal.models.plan import Plan
from journal.models.question import Question
from journal.models.reminder import Reminder
from journal.models.rule import Rule
from journal.models.task import Task
from journal.repositories.agents import Agents
from journal.repositories.environments import Environments
from journal.repositories.facts import Facts
from journal.repositories.links import Links
from journal.models.link import Link
from journal.models.ref import Ref
from journal.http.v3.v3_row import USER, V3Row
from journal.repositories.messages import Messages
from journal.repositories.plans import Plans
from journal.repositories.questions import Questions
from journal.engine.agent_launcher import AgentLauncher
from journal.features.checks.check_runner import CheckRunner
from journal.models.trigger_action import TriggerAction
from journal.repositories.checks import Checks
from journal.repositories.docs import Docs
from journal.repositories.reactions import Reactions
from journal.repositories.notices import Notices
from journal.repositories.reports import Reports
from journal.repositories.sequences import Sequences
from journal.repositories.triggers import Triggers
from journal.repositories.reminders import Reminders
from journal.repositories.rules import Rules
from journal.repositories.tasks import Tasks
from journal.supervisor_link import SupervisorLink


class V3Actions:
    """What the viewer writes, in version 3's words, done to version 4's rows: create a row of a type, act on one by its number, mark rows read."""

    def __init__(self, tasks: Tasks, messages: Messages, questions: Questions, facts: Facts, rules: Rules, reminders: Reminders, plans: Plans, agents: Agents, environments: Environments, machine: Machine, supervisor: SupervisorLink, reactions: Reactions, links: Links, docs: Docs, reports: Reports, checks: Checks, runner: CheckRunner, sequences: Sequences, triggers: Triggers, attachments: Attachments, launcher: AgentLauncher, notices: Notices, answering: Answering, secret_actions: SecretActions, agent_actions: AgentActions) -> None:
        self.tasks, self.messages, self.questions, self.facts, self.rules, self.reminders, self.plans = tasks, messages, questions, facts, rules, reminders, plans
        self.agents, self.environments, self.machine, self.supervisor, self.reactions, self.links = agents, environments, machine, supervisor, reactions, links
        self.docs, self.reports, self.checks, self.runner, self.sequences, self.triggers, self.attachments = docs, reports, checks, runner, sequences, triggers, attachments
        self.notices, self.answering = notices, answering
        self.launcher = launcher
        self.own_types = {"secret": secret_actions, "agent": agent_actions}
        """Types whose acts live in a class of their own, by the act's name."""

    def create(self, type: str, body: dict, request: Request):
        title, brief = body.get("title", "") or body.get("brief", "")[:80], body.get("brief", "")
        by = request.actor
        if type == "message":
            about = body.get("about", "")
            reply_to = int(about.split(":")[1]) if about.startswith("message:") else None
            text = f"{title}\n\n{brief}".strip() if title and brief and not brief.startswith(title) else (brief or title)
            key = str(body.get("idempotency", ""))
            already = [m for m in self.messages.in_() if key and m.idempotency == key]
            if already:
                return already[0]
            return self.messages.save(Message(author=Author.USER, text=text, reply_to=reply_to, idempotency=key), by)
        if type == "todo":
            return self.tasks.save(Task(title=title, brief=brief), by)
        if type == "question":
            return self.questions.save(Question(text=title, options=tuple(o.get("title", o) if isinstance(o, dict) else o for o in body.get("options", []))), by)
        if type == "fact":
            return self.facts.save(Fact(text=title), by)
        if type == "reminder":
            return self.reminders.save(Reminder(text=title), by)
        if type == "rule":
            return self.rules.save(Rule(text=title, reason=brief), by)
        if type == "plan":
            return self.plans.save(Plan(title=title, brief=brief), by)
        if type == "doc":
            return self.docs.save(Doc(title=body.get("title", ""), body=body.get("brief", "")), by)
        if type == "report":
            return self.reports.save(Report(title=body.get("title", ""), body=body.get("brief", "")), by)
        if type == "environment":
            return self.environments.named(title)
        if type in self.own_types:
            return self.own_types[type].create(body, by)
        return None

    def act(self, type: str, n: int, action: str, body: dict, request: Request):
        """A type's own handler first; else the acts every row answers: read, restore and priority change nothing here, update rewrites the words, section appends one."""
        by = request.actor
        own = getattr(self.own_types[type], action, None) if type in self.own_types else getattr(self, f"{type}_{action}", None)
        if own:
            return own(n, body, by)
        shared = getattr(self, f"any_{action}", None)
        return shared(type, n, body, by) if shared else None

    WRITTEN = {"doc": "docs", "report": "reports", "todo": "tasks", "plan": "plans", "fact": "facts", "rule": "rules", "reminder": "reminders", "question": "questions"}
    """The repository behind each type the viewer may rewrite."""

    def repository_of(self, type: str):
        return getattr(self, self.WRITTEN[type]) if type in self.WRITTEN else None

    def any_read(self, type: str, n: int, body: dict, by):
        repository = self.repository_of(type)
        return repository.find(n) if repository else None

    any_restore = any_read
    any_priority = any_read

    def any_update(self, type: str, n: int, body: dict, by):
        repository = self.repository_of(type)
        if repository is None:
            return None
        row = repository.find(n)
        words = {name: body[given] for name, given in (("title", "title"), ("text", "title"), ("brief", "brief"), ("body", "brief")) if given in body and hasattr(row, name)}
        return repository.save(row.with_(**words), by)

    def any_comment(self, type: str, n: int, body: dict, by):
        """A comment written under a row in the viewer is a message of the user's, linked to the row and shown under it; it reaches the agent as any message does."""
        repository = self.repository_of(type)
        if repository is None:
            return None
        row = repository.find(n)
        message = self.messages.save(Message(environment_id=getattr(row, "environment_id", 0), author=Author.USER, text=body.get("text", "")), by)
        self.links.save(Link(source=Ref.to(message), target=Ref.to(row), kind=Messages.COMMENTS_ON), by)
        return V3Row.of("comment", message, title=message.text[:80], brief=message.text, refs=[f"{type}:{n}"], seen=[USER])

    def any_section(self, type: str, n: int, body: dict, by):
        repository = self.repository_of(type)
        if repository is None or type not in ("doc", "report"):
            return None
        row = repository.find(n)
        return repository.save(row.with_(body=f"{row.body.rstrip()}\n\n## {body.get('title', '')}\n\n{body.get('body', '')}\n"), by)

    def doc_final(self, n: int, body: dict, by):
        return self.docs.find(n)

    def report_dismiss(self, n: int, body: dict, by):
        return self.reports.find(n)

    def notice_close(self, n: int, body: dict, by):
        from datetime import datetime, timezone
        return self.notices.save(self.notices.find(n).closed(datetime.now(timezone.utc)), by)

    def plan_finish(self, n: int, body: dict, by):
        return self.plans.save(self.plans.find(n).done(), by)

    def plan_abandon(self, n: int, body: dict, by):
        return self.plans.save(self.plans.find(n).done(), by)

    def plan_approve(self, n: int, body: dict, by):
        return self.plans.approve(self.plans.find(n), by)

    def plan_start(self, n: int, body: dict, by):
        return self.plans.save(self.plans.find(n).started(), by)

    def plan_park(self, n: int, body: dict, by):
        return self.plans.save(self.plans.find(n).parked(), by)

    def plan_continue(self, n: int, body: dict, by):
        return self.plans.find(n)

    plan_dismiss = plan_continue

    def environment_launch(self, n: int, body: dict, by):
        """An agent started from the viewer runs detached under its own supervisor; the viewer sees it once its start hook arrives."""
        environment = self.environments.find(n)
        self.launcher.start(environment.name, body.get("agent", "claude"))
        return environment

    def environment_stop(self, n: int, body: dict, by):
        self.supervisor.stop(n)
        return self.environments.find(n)

    def environment_remove(self, n: int, body: dict, by):
        self.environments.wipe(self.environments.find(n), by)
        return {}

    def check_run(self, n: int, body: dict, by):
        return self.runner.run(self.checks.find(n), by)

    def check_set(self, n: int, body: dict, by):
        check = self.checks.find(n)
        key, value = body.get("key", ""), body.get("value", "")
        if key == "command":
            return self.checks.save(check.with_(command=str(value)), by)
        if key == "every":
            return self.checks.save(check.with_(every=int(value or 0)), by)
        return check

    def sequence_steps(self, n: int, body: dict, by):
        return self.sequences.save(self.sequences.find(n).with_(steps=tuple(step.get("title", "") for step in body.get("steps", []) if step.get("title"))), by)

    def trigger_update(self, n: int, body: dict, by):
        trigger = self.triggers.find(n)
        words = body.get("words", trigger.words)
        action = TriggerAction(body["does"]) if body.get("does") in {a.value for a in TriggerAction} else trigger.action
        return self.triggers.save(trigger.with_(words=tuple(w.strip() for w in (words.split(",") if isinstance(words, str) else words) if w.strip()), action=action, text=body.get("text", trigger.text)), by)

    def report_archive(self, n: int, body: dict, by):
        return self.reports.find(n)

    def comment_react(self, n: int, body: dict, by):
        """A comment is a message linked to a row: a face on it is a face on that message."""
        return self.message_react(n, body, by)

    def message_react(self, n: int, body: dict, by):
        made = self.reactions.toggle(self.messages.find(n), body.get("face", ""), Author.USER, by)
        return made if made else {}

    def upload(self, type: str, n: int, request: Request):
        """The files a multipart request carried, stored beside the row and named on it."""
        if type != "message":
            return None
        message = self.messages.find(n)
        names = tuple(self.attachments.store(type, n, name, data) for name, data in request.files.items())
        return self.messages.save(message.with_(files=(*message.files, *names)), request.actor) if names else message

    def message_read(self, n: int, body: dict, by):
        return self.messages.mark_read(self.messages.find(n), by)

    def message_reply(self, n: int, body: dict, by):
        return self.messages.save(Message(environment_id=self.messages.find(n).environment_id, author=Author.USER, text=body.get("text", ""), reply_to=n), by)

    def message_edit(self, n: int, body: dict, by):
        return self.messages.save(self.messages.find(n).with_(text=body.get("text", body.get("brief", ""))), by)

    def message_delete(self, n: int, body: dict, by):
        self.messages.delete(self.messages.find(n), by)
        return {}

    def todo_start(self, n: int, body: dict, by):
        task = self.tasks.save(self.tasks.find(n).started(self._now()), by)
        live = self.agents.live()
        if live:
            self.machine.move(live.session, task.environment_id, Working(task_id=task.id, logged_at=time.time()))
        return task

    def todo_done(self, n: int, body: dict, by):
        return self.tasks.save(self.tasks.find(n).finished(self._now(), body.get("how", "")), by)

    def todo_complete(self, n: int, body: dict, by):
        return self.todo_done(n, body, by)

    def todo_reopen(self, n: int, body: dict, by):
        from journal.models.task_state import TaskState
        return self.tasks.save(self.tasks.find(n).with_(state=TaskState.OPEN, finished_at=None, outcome=""), by)

    def todo_update(self, n: int, body: dict, by):
        task = self.tasks.find(n)
        return self.tasks.save(task.with_(title=body.get("title", task.title), brief=body.get("brief", task.brief)), by)

    def todo_delete(self, n: int, body: dict, by):
        self.tasks.delete(self.tasks.find(n), by)
        return {}

    def todo_read(self, n: int, body: dict, by):
        return self.tasks.find(n)

    def question_answer(self, n: int, body: dict, by):
        return self.answering.answer(self.questions.find(n), body.get("how", body.get("answer", "")), by)

    def question_complete(self, n: int, body: dict, by):
        return self.question_answer(n, body, by)

    def question_read(self, n: int, body: dict, by):
        return self.questions.find(n)

    def fact_strike(self, n: int, body: dict, by):
        self.facts.delete(self.facts.find(n), by)
        return {}

    def fact_complete(self, n: int, body: dict, by):
        return self.fact_strike(n, body, by)

    def rule_strike(self, n: int, body: dict, by):
        self.rules.delete(self.rules.find(n), by)
        return {}

    def rule_complete(self, n: int, body: dict, by):
        return self.rule_strike(n, body, by)

    def reminder_retire(self, n: int, body: dict, by):
        self.reminders.delete(self.reminders.find(n), by)
        return {}

    def reminder_complete(self, n: int, body: dict, by):
        return self.reminder_retire(n, body, by)

    def plan_park(self, n: int, body: dict, by):
        return self.plans.save(self.plans.find(n).parked(), by)

    def plan_start(self, n: int, body: dict, by):
        return self.plans.save(self.plans.find(n).started(), by)

    def read_all(self, type: str, numbers: list[int], by) -> None:
        if type != "message":
            return
        for n in numbers:
            self.messages.mark_read(self.messages.find(n), by)

    @staticmethod
    def _now() -> datetime:
        return datetime.now(timezone.utc)
