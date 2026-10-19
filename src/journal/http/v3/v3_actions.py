import time
from datetime import datetime, timezone

from journal.engine.machine import Machine
from journal.features.questions.answering import Answering
from journal.features.questions.states.waiting import Waiting
from journal.features.tasks.states.working import Working
from journal.http.request import Request
from journal.features.plans.plan_control import PlanControl
from journal.http.v3.action_body import ActionBody
from journal.http.v3.attachments import Attachments
from journal.http.v3.agent_actions import AgentActions
from journal.http.v3.plugin_actions import PluginActions
from journal.http.v3.secret_actions import SecretActions
from journal.http.v3.share_actions import ShareActions
from journal.models.author import Author
from journal.models.fact import Fact
from journal.models.doc import Doc
from journal.models.message import Message
from journal.refused import Refused
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

    WRITTEN = {"doc": "docs", "report": "reports", "todo": "tasks", "plan": "plans", "fact": "facts", "rule": "rules", "reminder": "reminders", "question": "questions"}
    """The repository behind each type the viewer may rewrite."""

    def __init__(self, tasks: Tasks, messages: Messages, questions: Questions, facts: Facts, rules: Rules, reminders: Reminders, plans: Plans, agents: Agents, environments: Environments, machine: Machine, supervisor: SupervisorLink, reactions: Reactions, links: Links, docs: Docs, reports: Reports, checks: Checks, runner: CheckRunner, sequences: Sequences, triggers: Triggers, attachments: Attachments, launcher: AgentLauncher, notices: Notices, answering: Answering, secret_actions: SecretActions, share_actions: ShareActions, agent_actions: AgentActions, plugin_actions: PluginActions, plan_control: PlanControl) -> None:
        self.tasks, self.messages, self.questions, self.facts, self.rules, self.reminders, self.plans = tasks, messages, questions, facts, rules, reminders, plans
        self.plan_control = plan_control
        self.agents, self.environments, self.machine, self.supervisor, self.reactions, self.links = agents, environments, machine, supervisor, reactions, links
        self.docs, self.reports, self.checks, self.runner, self.sequences, self.triggers, self.attachments = docs, reports, checks, runner, sequences, triggers, attachments
        self.notices, self.answering = notices, answering
        self.launcher = launcher
        self.own_types = {"secret": secret_actions, "share": share_actions, "agent": agent_actions, "plugin": plugin_actions}
        """Types whose acts live in a class of their own, by the act's name."""

    def create(self, type: str, payload: dict, request: Request):
        body = ActionBody.from_payload(payload)
        title, brief = body.title or body.brief[:80], body.brief
        by = request.actor
        if type == "message":
            reply_to = int(body.about.split(":")[1]) if body.about.startswith("message:") else None
            text = f"{title}\n\n{brief}".strip() if title and brief and not brief.startswith(title) else (brief or title)
            key = body.idempotency
            already = self.messages.sent_with(key) if key else []
            if already:
                return already[0]
            return self.messages.save(Message(author=Author.USER, text=text, reply_to=reply_to, idempotency=key), by)
        if type == "todo":
            return self.tasks.save(Task(title=title, brief=brief), by)
        if type == "question":
            return self.questions.save(Question(text=title, options=body.options), by)
        if type == "fact":
            return self.facts.save(Fact(text=title), by)
        if type == "reminder":
            return self.reminders.save(Reminder(text=title), by)
        if type == "rule":
            return self.rules.save(Rule(text=title, reason=brief), by)
        if type == "plan":
            return self.plans.save(Plan(title=title, brief=brief), by)
        if type == "doc":
            return self.docs.save(Doc(title=body.title, body=body.brief), by)
        if type == "report":
            return self.reports.save(Report(title=body.title, body=body.brief), by)
        if type == "environment":
            return self.environments.named(title)
        if type in self.own_types:
            return self.own_types[type].create(body, by)
        return None

    def act(self, type: str, n: int, action: str, payload: dict, request: Request):
        """A type's own handler first; else the acts every row answers: read, restore and priority change nothing here, update rewrites the words, section appends one."""
        by, body = request.actor, ActionBody.from_payload(payload)
        own = getattr(self.own_types[type], action, None) if type in self.own_types else getattr(self, f"{type}_{action}", None)
        if own:
            return own(n, body, by)
        shared = getattr(self, f"any_{action}", None)
        return shared(type, n, body, by) if shared else None

    def repository_of(self, type: str):
        return getattr(self, self.WRITTEN[type]) if type in self.WRITTEN else None

    def any_read(self, type: str, n: int, body: ActionBody, by):
        repository = self.repository_of(type)
        return repository.find(n) if repository else None

    any_restore = any_read
    any_priority = any_read

    def any_update(self, type: str, n: int, body: ActionBody, by):
        repository = self.repository_of(type)
        if repository is None:
            return None
        row = repository.find(n)
        words = body.changes(title="title", text="title", brief="brief", body="brief")
        return repository.save(row.with_(**{name: value for name, value in words.items() if hasattr(row, name)}), by)

    def any_comment(self, type: str, n: int, body: ActionBody, by):
        """A comment written under a row in the viewer is a message of the user's, linked to the row and shown under it; it reaches the agent as any message does."""
        repository = self.repository_of(type)
        if repository is None:
            return None
        row = repository.find(n)
        message = self.messages.save(Message(environment_id=getattr(row, "environment_id", 0), author=Author.USER, text=body.text), by)
        self.links.save(Link(source=Ref.to(message), target=Ref.to(row), kind=Messages.COMMENTS_ON), by)
        return V3Row.of("comment", message, title=message.text[:80], brief=message.text, refs=[f"{type}:{n}"], seen=[USER])

    def any_section(self, type: str, n: int, body: ActionBody, by):
        repository = self.repository_of(type)
        if repository is None or type not in ("doc", "report"):
            return None
        row = repository.find(n)
        return repository.save(row.with_(body=f"{row.body.rstrip()}\n\n## {body.title}\n\n{body.body}\n"), by)

    def doc_final(self, n: int, body: ActionBody, by):
        return self.docs.find(n)

    def report_dismiss(self, n: int, body: ActionBody, by):
        return self.reports.find(n)

    def notice_close(self, n: int, body: ActionBody, by):
        from datetime import datetime, timezone
        return self.notices.save(self.notices.find(n).closed(datetime.now(timezone.utc)), by)

    def plan_finish(self, n: int, body: ActionBody, by):
        return self.plans.save(self.plans.find(n).done(), by)

    def plan_abandon(self, n: int, body: ActionBody, by):
        self.plan_control.abandon(self.plans.find(n), self.following(), by)
        return self.plans.find(n)

    def plan_approve(self, n: int, body: ActionBody, by):
        return self.plans.approve(self.plans.find(n), by)

    def plan_start(self, n: int, body: ActionBody, by):
        """Started as journal plan start does, its task taken up for the agent here."""
        self.plan_control.start(self.plans.find(n), self.following(), by)
        return self.plans.find(n)

    def plan_park(self, n: int, body: ActionBody, by):
        return self.plan_control.park(self.plans.find(n), self.following(), by)

    plan_continue = plan_start

    def plan_dismiss(self, n: int, body: ActionBody, by):
        return self.plans.find(n)

    def following(self) -> str:
        """The session of the agent here that a plan's start or stop moves; empty when none runs."""
        live = self.agents.live()
        return live.session if live else ""

    def environment_launch(self, n: int, body: ActionBody, by):
        """An agent started from the viewer runs detached under its own supervisor; the viewer sees it once its start hook arrives."""
        environment = self.environments.find(n)
        self.launcher.start(environment.name, body.agent)
        return environment

    def environment_stop(self, n: int, body: ActionBody, by):
        self.supervisor.stop(n)
        return self.environments.find(n)

    def environment_remove(self, n: int, body: ActionBody, by):
        self.environments.wipe(self.environments.find(n), by)
        return {}

    def check_run(self, n: int, body: ActionBody, by):
        return self.runner.start(self.checks.find(n), by)

    def check_set(self, n: int, body: ActionBody, by):
        check = self.checks.find(n)
        if body.key == "command":
            return self.checks.save(check.with_(command=body.value), by)
        if body.key == "every":
            return self.checks.save(check.with_(every=int(body.value)), by)
        return check

    def sequence_set(self, n: int, body: ActionBody, by):
        """What starts a sequence: nothing but a hand, a row of a kind being created, written <kind>.created, or a trigger, written trigger:<n>, which then starts it and nothing else; a start by hand or by a row takes the sequence off its triggers."""
        sequence = self.sequences.find(n)
        value = body.value
        if body.key != "starts_on":
            return sequence
        if value.startswith("trigger:"):
            self.triggers.save(self.triggers.find(int(value.removeprefix("trigger:"))).with_(action=TriggerAction.SEQUENCE, text=sequence.title), by)
            return self.sequences.save(sequence.with_(starts_on=""), by)
        if value and not value.endswith(".created"):
            raise Refused(f"a sequence starts by hand, when a row is created, written <kind>.created, or by a trigger, written trigger:<n>; {value!r} is none of them")
        for trigger in self.triggers.starting(sequence.title):
            self.triggers.delete(trigger, by)
        return self.sequences.save(sequence.with_(starts_on=value), by)

    def sequence_steps(self, n: int, body: ActionBody, by):
        return self.sequences.save(self.sequences.find(n).with_(steps=body.steps), by)

    def trigger_update(self, n: int, body: ActionBody, by):
        trigger = self.triggers.find(n)
        action = TriggerAction(body.does) if body.does in {a.value for a in TriggerAction} else trigger.action
        return self.triggers.save(trigger.with_(action=action, **body.changes(words="words", text="text")), by)

    def report_archive(self, n: int, body: ActionBody, by):
        return self.reports.find(n)

    def comment_react(self, n: int, body: ActionBody, by):
        """A comment is a message linked to a row: a face on it is a face on that message."""
        return self.message_react(n, body, by)

    def message_react(self, n: int, body: ActionBody, by):
        made = self.reactions.toggle(self.messages.find(n), body.face, Author.USER, by)
        return made if made else {}

    def upload(self, type: str, n: int, request: Request):
        """The files a multipart request carried, stored beside the row and named on it."""
        if type != "message":
            return None
        message = self.messages.find(n)
        names = tuple(self.attachments.store(type, n, name, data) for name, data in request.files.items())
        return self.messages.save(message.with_(files=(*message.files, *names)), request.actor) if names else message

    def message_read(self, n: int, body: ActionBody, by):
        return self.messages.mark_read(self.messages.find(n), by)

    def message_reply(self, n: int, body: ActionBody, by):
        return self.messages.save(Message(environment_id=self.messages.find(n).environment_id, author=Author.USER, text=body.text, reply_to=n), by)

    def message_edit(self, n: int, body: ActionBody, by):
        return self.messages.save(self.messages.find(n).with_(text=body.text or body.brief), by)

    def message_delete(self, n: int, body: ActionBody, by):
        self.messages.delete(self.messages.find(n), by)
        return {}

    def todo_start(self, n: int, body: ActionBody, by):
        task = self.tasks.save(self.tasks.find(n).started(self._now()), by)
        live = self.agents.live()
        if live:
            self.machine.move(live.session, task.environment_id, Working(task_id=task.id, logged_at=time.time()))
        return task

    def todo_done(self, n: int, body: ActionBody, by):
        return self.tasks.save(self.tasks.find(n).finished(self._now(), body.how), by)

    def todo_complete(self, n: int, body: ActionBody, by):
        return self.todo_done(n, body, by)

    def todo_reopen(self, n: int, body: ActionBody, by):
        from journal.models.task_state import TaskState
        return self.tasks.save(self.tasks.find(n).with_(state=TaskState.OPEN, finished_at=None, outcome=""), by)

    def todo_update(self, n: int, body: ActionBody, by):
        task = self.tasks.find(n)
        return self.tasks.save(task.with_(**body.changes(title="title", brief="brief")), by)

    def todo_delete(self, n: int, body: ActionBody, by):
        self.tasks.delete(self.tasks.find(n), by)
        return {}

    def todo_read(self, n: int, body: ActionBody, by):
        return self.tasks.find(n)

    def question_answer(self, n: int, body: ActionBody, by):
        return self.answering.answer(self.questions.find(n), body.how, by)

    def question_complete(self, n: int, body: ActionBody, by):
        return self.question_answer(n, body, by)

    def question_read(self, n: int, body: ActionBody, by):
        return self.questions.find(n)

    def fact_strike(self, n: int, body: ActionBody, by):
        self.facts.delete(self.facts.find(n), by)
        return {}

    def fact_complete(self, n: int, body: ActionBody, by):
        return self.fact_strike(n, body, by)

    def rule_strike(self, n: int, body: ActionBody, by):
        self.rules.delete(self.rules.find(n), by)
        return {}

    def rule_complete(self, n: int, body: ActionBody, by):
        return self.rule_strike(n, body, by)

    def reminder_retire(self, n: int, body: ActionBody, by):
        self.reminders.delete(self.reminders.find(n), by)
        return {}

    def reminder_complete(self, n: int, body: ActionBody, by):
        return self.reminder_retire(n, body, by)

    def read_all(self, type: str, numbers: list[int], by) -> None:
        if type != "message":
            return
        for n in numbers:
            self.messages.mark_read(self.messages.find(n), by)

    @staticmethod
    def _now() -> datetime:
        return datetime.now(timezone.utc)
