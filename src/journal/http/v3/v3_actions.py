from datetime import datetime, timezone

from journal.engine.machine import Machine
from journal.features.questions.states.waiting import Waiting
from journal.features.tasks.states.working import Working
from journal.http.request import Request
from journal.models.author import Author
from journal.models.environment import Environment
from journal.models.fact import Fact
from journal.models.message import Message
from journal.models.plan import Plan
from journal.models.question import Question
from journal.models.reminder import Reminder
from journal.models.rule import Rule
from journal.models.task import Task
from journal.repositories.agents import Agents
from journal.repositories.environments import Environments
from journal.repositories.facts import Facts
from journal.repositories.messages import Messages
from journal.repositories.plans import Plans
from journal.repositories.questions import Questions
from journal.repositories.reactions import Reactions
from journal.repositories.reminders import Reminders
from journal.repositories.rules import Rules
from journal.repositories.tasks import Tasks
from journal.supervisor_link import SupervisorLink


class V3Actions:
    """What the viewer writes, in version 3's words, done to version 4's rows: create a row of a type, act on one by its number, mark rows read."""

    def __init__(self, tasks: Tasks, messages: Messages, questions: Questions, facts: Facts, rules: Rules, reminders: Reminders, plans: Plans, agents: Agents, environments: Environments, machine: Machine, supervisor: SupervisorLink, reactions: Reactions) -> None:
        self.tasks, self.messages, self.questions, self.facts, self.rules, self.reminders, self.plans = tasks, messages, questions, facts, rules, reminders, plans
        self.agents, self.environments, self.machine, self.supervisor, self.reactions = agents, environments, machine, supervisor, reactions

    def create(self, type: str, environment: Environment, body: dict, request: Request):
        title, brief = body.get("title", "") or body.get("brief", "")[:80], body.get("brief", "")
        by = request.actor
        if type == "message":
            about = body.get("about", "")
            reply_to = int(about.split(":")[1]) if about.startswith("message:") else None
            text = f"{title}\n\n{brief}".strip() if title and brief and not brief.startswith(title) else (brief or title)
            key = str(body.get("idempotency", ""))
            already = [m for m in self.messages.in_(environment.id) if key and m.idempotency == key]
            if already:
                return already[0]
            return self.messages.save(Message(environment_id=environment.id, author=Author.USER, text=text, reply_to=reply_to, idempotency=key), by)
        if type == "todo":
            return self.tasks.save(Task(environment_id=environment.id, title=title, brief=brief), by)
        if type == "question":
            return self.questions.save(Question(environment_id=environment.id, text=title, options=tuple(o.get("title", o) if isinstance(o, dict) else o for o in body.get("options", []))), by)
        if type == "fact":
            return self.facts.save(Fact(environment_id=environment.id, text=title), by)
        if type == "reminder":
            return self.reminders.save(Reminder(environment_id=environment.id, text=title), by)
        if type == "rule":
            return self.rules.save(Rule(text=title, reason=brief), by)
        if type == "plan":
            return self.plans.save(Plan(environment_id=environment.id, title=title, brief=brief), by)
        if type == "environment":
            return self.environments.named(title)
        return None

    def act(self, type: str, n: int, action: str, body: dict, request: Request):
        by = request.actor
        handler = getattr(self, f"{type}_{action}", None)
        return handler(n, body, by) if handler else None

    def message_react(self, n: int, body: dict, by):
        made = self.reactions.toggle(self.messages.find(n), body.get("face", ""), Author.USER, by)
        return made if made else {}

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
        live = self.agents.live(task.environment_id)
        if live:
            self.machine.move(live.session, task.environment_id, Working(task_id=task.id))
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
        from journal.features.questions.feature import Questions as QuestionsFeature
        answered = self.questions.save(self.questions.find(n).answered(body.get("how", body.get("answer", ""))), by)
        for agent in self.agents.in_state(Waiting.name):
            state = self.machine.states.named(agent.state, agent.data)
            if state.question_id == answered.id:
                self.machine.move(agent.session, agent.environment_id, state.back().to)
                self.supervisor.type(QuestionsFeature.ANSWERED.about(n=answered.id, answer=answered.answer).rendered())
        return answered

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
