import subprocess
from datetime import datetime, timezone
import re

from journal.events.agent.ticked import Ticked
from journal.features.chart.checks import Checks
from journal.features.chart.context import Context
from journal.features.sequences.states.running_sequence import RunningSequence
from journal.features.tasks.states.expecting import Expecting
from journal.features.tasks.stop_words import ago
from journal.features.tasks.states.working import Working
from journal.models.question import Question
from journal.models.task_state import TaskState
from journal.models.worker import Worker
from journal.repositories.counts import Counts
from journal.features.registry import Registry
from journal.features.skills.requiring import Requiring
from journal.features.skills.skill_files import SkillFiles
from journal.features.voices.chosen_voice import ChosenVoice
from journal.repositories.agents import Agents
from journal.repositories.messages import Messages
from journal.models.plan_state import PlanState
from journal.repositories.plans import Plans
from journal.repositories.rules import Rules
from journal.repositories.facts import Facts
from journal.repositories.reminders import Reminders
from journal.repositories.questions import Questions
from journal.repositories.environments import Environments
from journal.repositories.task_logs import TaskLogs
from journal.config import Config
from journal.repositories.tasks import Tasks

PLACEHOLDER = re.compile(r"\{\{(\w+)\}\}")


class Fillers:
    """What a node's text may name from the rows, as {{name}}: one method per placeholder, named after it; an unknown one is left as written."""

    def __init__(self, tasks: Tasks, plans: Plans, messages: Messages, counts: Counts, agents: Agents, requiring: Requiring, files: SkillFiles, registry: Registry,
                 rules: Rules, facts: Facts, reminders: Reminders, questions: Questions, environments: Environments, chosen: ChosenVoice, checks: Checks, task_logs: TaskLogs, config: Config) -> None:
        self.tasks, self.plans, self.messages, self.counts = tasks, plans, messages, counts
        self.agents, self.requiring, self.files, self.registry = agents, requiring, files, registry
        self.rule_rows, self.fact_rows, self.reminder_rows, self.questions, self.environments = rules, facts, reminders, questions, environments
        self.chosen, self.checks, self.task_logs, self.config = chosen, checks, task_logs, config

    @classmethod
    def listed(cls) -> list[dict]:
        """Every placeholder a node's text may name, with what it stands for, for the page's insert panel."""
        return [{"key": "{{" + name + "}}", "about": method.__doc__} for name, method in vars(cls).items() if not name.startswith("_") and name not in ("fill", "listed", "state", "agent", "plan_at_checkpoint") and method.__doc__]

    def fill(self, text: str, ctx: Context) -> str:
        return PLACEHOLDER.sub(lambda m: str(getattr(self, m.group(1))(ctx)) if hasattr(self, m.group(1)) else m.group(0), text)

    def env(self, ctx: Context) -> str:
        """The environment's name."""
        return self.environments.find(ctx.environment_id).name if ctx.environment_id else ""

    def taken_over_at(self, ctx: Context) -> str:
        """The time of day the other session that worked here last did anything."""
        from journal.features.chart.checks import TAKEN_OVER_WITHIN
        others = self.agents.others_lately(ctx.session, datetime.now(timezone.utc) - TAKEN_OVER_WITHIN) if ctx.session else []
        return others[-1].updated_at.astimezone().strftime("%H:%M") if others else ""

    def rule_count(self, ctx: Context) -> str:
        """How many rules are in force."""
        return str(len(self.rule_rows.all()))

    def rules(self, ctx: Context) -> str:
        """The rules in force, numbered."""
        return self.numbered(r.text for r in self.rule_rows.all())

    def facts(self, ctx: Context) -> str:
        """The facts about this environment, numbered."""
        return self.numbered(f.text for f in self.fact_rows.in_())

    def reminders(self, ctx: Context) -> str:
        """The reminders here, numbered."""
        return self.numbered(r.text for r in self.reminder_rows.in_())

    def voice(self, ctx: Context) -> str:
        """How the agent talks to the user: the chosen voice's instruction, with the user's title and name."""
        return self.chosen.instruction()

    def waiting(self, ctx: Context) -> str:
        """What waits for the agent, by count: open tasks, unread messages, open questions."""
        counts = {"tasks": len(self.tasks.in_state(TaskState.OPEN)), "messages": len(self.messages.unread()), "questions": len(self.questions.open())}
        return ", ".join(f"{n} {name}" for name, n in counts.items() if n)

    @staticmethod
    def numbered(texts) -> str:
        return "; ".join(f"{n}. {text}" for n, text in enumerate(texts, 1))

    def plan_n(self, ctx: Context) -> str:
        """The number of the started plan standing at a checkpoint."""
        plan = self.plan_at_checkpoint()
        return str(plan.id) if plan else ""

    def checkpoint_phase(self, ctx: Context) -> str:
        """The title of the checkpoint phase a started plan stands at."""
        plan = self.plan_at_checkpoint()
        return self.plans.at_checkpoint(plan).title if plan else ""

    def plan_at_checkpoint(self):
        return next((p for p in self.plans.in_() if p.state == PlanState.STARTED and self.plans.at_checkpoint(p)), None)

    def row(self, ctx: Context) -> str:
        """The number of the row a row event is about."""
        model = getattr(ctx.event, "model", None)
        return str(model.id) if model is not None else ""

    def inbox(self, ctx: Context) -> str:
        """The inbox as the listeners name it: one message by its number, a few by theirs, more than three by their count and the command that prints them."""
        from journal.features.messages.feature import Messages as MessagesFeature
        unread = self.messages.unread()
        return MessagesFeature.inbox(unread).rendered() if unread else ""

    def unread_count(self, ctx: Context) -> str:
        """How many messages are unread."""
        return str(len(self.messages.unread()))

    def unread_numbers(self, ctx: Context) -> str:
        """The unread messages by number, comma separated."""
        return ", ".join(str(m.id) for m in self.messages.unread())

    def owed(self, ctx: Context) -> str:
        """The last three messages read and left unanswered, by number, as the answer hold names them."""
        return ", ".join(str(m.id) for m in self.messages.unanswered()[-3:])

    def task(self, ctx: Context) -> str:
        """The work in hand as the task lines name it: the task's number, with what the agent is on."""
        state = self.state(ctx)
        return state.named() if isinstance(state, Working) else ""

    def last_log(self, ctx: Context) -> str:
        """The task in hand's last log line, whole, or that nothing is logged yet."""
        state = self.state(ctx)
        if not isinstance(state, Working):
            return ""
        logs = self.task_logs.of(self.tasks.find(state.task_id))
        return f'"{logs[-1].line}"' if logs else "nothing logged yet"

    def uncommitted(self, ctx: Context) -> str:
        """The files changed in the project and not committed, as git names them, at most twenty; none when the tree is clean or no git is there."""
        try:
            done = subprocess.run(["git", "status", "--short"], cwd=self.config.root, capture_output=True, text=True, timeout=3)
        except (OSError, subprocess.SubprocessError):
            return "none"
        files = [line[3:] for line in done.stdout.splitlines() if line.strip()] if done.returncode == 0 else []
        more = f" and {len(files) - 20} more" if len(files) > 20 else ""
        return ", ".join(files[:20]) + more if files else "none"

    def logged(self, ctx: Context) -> str:
        """When the task in hand was last logged, as the stop's words say it."""
        state = self.state(ctx)
        if not isinstance(state, Working):
            return ""
        return f"last logged {ago(state.logged_at)}" if state.logged_at else "nothing logged yet"

    def task_edits(self, ctx: Context) -> str:
        """The writes since the task in hand was logged, read from the journal's own record."""
        return str(self.checks.derived_edits(ctx)) if ctx.session else "0"

    def log_command(self, ctx: Context) -> str:
        """The command that logs the task in hand."""
        state = self.state(ctx)
        return f"journal task log {state.task_id}" if isinstance(state, Working) and state.task_id else ""

    def awaited(self, ctx: Context) -> str:
        """What an expecting agent is expecting, in its own words."""
        state = self.state(ctx)
        return state.what if isinstance(state, Expecting) else ""

    def sequence_n(self, ctx: Context) -> str:
        """The number of the sequence being run."""
        state = self.state(ctx)
        return str(state.sequence_id) if isinstance(state, RunningSequence) else ""

    def sequence_step(self, ctx: Context) -> str:
        """The step in hand, counted from one, as the running state says it at a stop."""
        state = self.state(ctx)
        return str(state.step + 1) if isinstance(state, RunningSequence) else ""

    def sequence_step_text(self, ctx: Context) -> str:
        """The words of the sequence step in hand."""
        state = self.state(ctx)
        return state.text if isinstance(state, RunningSequence) else ""

    def quiet_minutes(self, ctx: Context) -> str:
        """How many minutes the agent has been quiet, at a tick."""
        return str(int(ctx.event.quiet_for // 60)) if isinstance(ctx.event, Ticked) else "0"

    def worker_n(self, ctx: Context) -> str:
        """The number of the worker a worker event is about."""
        model = getattr(ctx.event, "model", None)
        return str(model.id) if isinstance(model, Worker) else ""

    def worker_name(self, ctx: Context) -> str:
        """The name of the worker a worker event is about."""
        model = getattr(ctx.event, "model", None)
        return model.name if isinstance(model, Worker) else ""

    def question_n(self, ctx: Context) -> str:
        """The number of the question a question event is about."""
        model = getattr(ctx.event, "model", None)
        return str(model.id) if isinstance(model, Question) else ""

    def parked_n(self, ctx: Context) -> str:
        """The number of the first parked task."""
        parked = self.tasks.in_state(TaskState.PARKED)
        return str(parked[0].id) if parked else ""

    def parked_title(self, ctx: Context) -> str:
        """The title of the first parked task."""
        parked = self.tasks.in_state(TaskState.PARKED)
        return parked[0].title if parked else ""

    def parked_why(self, ctx: Context) -> str:
        """Why the first parked task was parked."""
        parked = self.tasks.in_state(TaskState.PARKED)
        return parked[0].parked_why if parked else ""

    def state(self, ctx: Context):
        return ctx.state

    def agent(self, ctx: Context):
        return self.agents.for_session(ctx.session) if ctx.session else None

    def awaiting(self, ctx: Context) -> str:
        """What the agent owes the journal, as its row says: a look at what is in flight, a decision at a context mark, a skill to be read."""
        agent = self.agent(ctx)
        if agent is None:
            return ""
        owed = (["a look at what is in flight here"] if not agent.oriented else []) + ([f"a decision at the context mark, {agent.mark_owed}% full"] if agent.mark_owed else [])
        return " and ".join(owed + [f"the {name} skill to be read" for name in self.requiring.owed_names(agent)])

    def skill_owed(self, ctx: Context) -> str:
        """The first skill the agent owes a read of, by name."""
        agent = self.agent(ctx)
        names = self.requiring.owed_names(agent) if agent else []
        return names[0] if names else ""

    def skill_path(self, ctx: Context) -> str:
        """Where the first owed skill's file is, from the project's root."""
        skill = self.registry.skill_named(self.skill_owed(ctx))
        return str(self.files.path(skill).relative_to(self.files.config.root)) if skill else ""

    def parked_tasks(self, ctx: Context) -> str:
        """The parked tasks, each with why it was parked."""
        return "; ".join(f"{t.id} {t.title} (parked because: {t.parked_why})" for t in self.tasks.in_state(TaskState.PARKED))

    def next_task(self, ctx: Context) -> str:
        """The number of the next open task of the plans."""
        free = self.plans.free()
        return str(free[0].id) if free else ""

    def next_task_title(self, ctx: Context) -> str:
        """The title of the next open task of the plans."""
        free = self.plans.free()
        return free[0].title if free else ""
