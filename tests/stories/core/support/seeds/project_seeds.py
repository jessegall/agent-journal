from itertools import accumulate

from engine.actor.actor import CORE_ACTOR_ID
from engine.testing.seeds.seed import Seed
from engine.testing.seeds.seed_facts import SeedFacts

"""The seeds of a project's everyday rows. Every text in them is made up; the shapes follow a real project: most
tasks are done, every task is assigned, plans have from three to ninety tasks over six phases."""

PLAN_SIZES = (90, 50, 5, 40, 20, 12, 90, 50, 5, 30, 8, 3)
PHASES_IN_A_PLAN = 6
PLAN_STARTS = (0, *accumulate(PLAN_SIZES))
PLACED_TASKS = PLAN_STARTS[-1]
TASK_STATES = ("completed",) * 18 + ("cancelled", "cancelled")
MESSAGE_TYPES = ("user", "agent", "agent", "journal")
HOOKS = ("pre_tool_use", "post_tool_use", "stop", "prompt")
EVENT_NAMES = (("task.update", "tasks"), ("message.create", "messages"), ("agent.update", "agents"), ("task.create", "tasks"))


class AgentActorSeed(Seed):
    """The actor of a seeded agent. Seed these before the people, so the agents take the first seeded actor ids."""

    table = "actors"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        return {"type": "agent", "name": f"seeded agent {index + 1}", "creator_id": CORE_ACTOR_ID}


class PersonSeed(Seed):
    """A made-up person."""

    table = "actors"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        return {"type": "user", "name": f"Seeded person {index + 1}", "creator_id": CORE_ACTOR_ID}


class AgentSeed(Seed):
    """A worker or a helper that has ended and is retired, numbered zero and below in its environment, so the
    agents of a story keep their numbers."""

    table = "agents"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        return {"id": facts.row_id("actors", index), "environment_id": facts.environment_id, "creator_id": CORE_ACTOR_ID, "session": f"seeded-session-{index + 1}",
                "program": "claude", "role": "worker" if index % 3 else "helper", "number": -index, "given_name": f"Seeded {index + 1}",
                "ended_at": facts.timestamp, "retired_at": facts.timestamp, "retirement_reason": "its work is done"}


class PlanSeed(Seed):
    """A finished plan."""

    table = "plans"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        return {"environment_id": facts.environment_id, "creator_id": CORE_ACTOR_ID, "title": f"Seeded plan {index + 1}", "brief": "A plan that was carried out.",
                "state": "completed", "started_at": facts.timestamp, "closed_at": facts.timestamp}


class PhaseSeed(Seed):
    """A phase of a seeded plan: six to a plan, every third one a checkpoint."""

    table = "phases"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        position = index % PHASES_IN_A_PLAN + 1
        return {"plan_id": facts.row_id("plans", index // PHASES_IN_A_PLAN), "creator_id": CORE_ACTOR_ID, "position": position, "title": f"Seeded phase {position}",
                "goal": "Its tasks are done.", "checkpoint": int(position % 3 == 0)}


class TaskSeed(Seed):
    """A finished task, which TaskAssignmentSeed assigns to a seeded agent: most are completed, some cancelled. The work still open in an
    environment is the story's own, so a story that looks at the open work of its environment sees only its own."""

    table = "tasks"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        state = TASK_STATES[index % len(TASK_STATES)]
        return {"environment_id": facts.environment_id, "creator_id": CORE_ACTOR_ID, "title": f"Seeded task {index + 1}", "brief": "A task of the seed; done when it is done.",
                "state": state, "outcome": "done" if state == "completed" else "",
                "reason": "no longer needed" if state == "cancelled" else "", "closed_at": facts.timestamp, "complexity": index % 5 + 1}


class TaskAssignmentSeed(Seed):
    """The assignment of a seeded task to the agent its row names."""

    table = "assignments"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        return {"creator_id": CORE_ACTOR_ID, "subject_model": "task", "subject_id": facts.row_id("tasks", index), "actor_id": facts.row_id("agents", index)}


class PhaseTaskSeed(Seed):
    """The place of a seeded task in a seeded plan: the plans hold ninety, fifty, five and other numbers of tasks,
    spread over their phases in order."""

    table = "phase_tasks"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        plan_index = next(number for number, start in enumerate(PLAN_STARTS[1:]) if index < start)
        place, size = index - PLAN_STARTS[plan_index], PLAN_SIZES[plan_index]
        phase_number = place * PHASES_IN_A_PLAN // size
        first_place = -(-phase_number * size // PHASES_IN_A_PLAN)
        return {"phase_id": facts.row_id("phases", plan_index * PHASES_IN_A_PLAN + phase_number), "task_id": facts.row_id("tasks", index), "creator_id": CORE_ACTOR_ID,
                "position": place - first_place + 1}


class TaskLogSeed(Seed):
    """A line of a seeded task's log."""

    table = "task_logs"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        return {"task_id": facts.row_id("tasks", index), "creator_id": facts.row_id("agents", index), "line": f"Seeded log line {index + 1}: a step was done."}


class MessageSeed(Seed):
    """A message that was read: from a person, an agent or the journal."""

    table = "messages"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        return {"environment_id": facts.environment_id, "creator_id": CORE_ACTOR_ID, "type": MESSAGE_TYPES[index % len(MESSAGE_TYPES)],
                "text": f"Seeded message {index + 1}: nothing to do here.", "session_agent_id": facts.row_id("agents", index), "read_at": facts.timestamp,
                "delivered_at": facts.timestamp}


class AgentLineSeed(Seed):
    """A line the journal typed to a seeded agent, long since entered."""

    table = "agent_lines"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        return {"session_agent_id": facts.row_id("agents", index), "creator_id": CORE_ACTOR_ID, "text": f"seeded line {index + 1}", "source": "seed", "state": "entered",
                "delivered_at": facts.timestamp}


class HookCallSeed(Seed):
    """A hook call of a seeded agent that was allowed."""

    table = "hook_calls"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        return {"session_agent_id": facts.row_id("agents", index), "environment_id": facts.environment_id, "creator_id": CORE_ACTOR_ID, "hook": HOOKS[index % len(HOOKS)],
                "firing": f"seeded-firing-{index + 1}", "answer": "allowed"}


class EventSeed(Seed):
    """A logged change of a seeded row."""

    table = "events"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        name, table = EVENT_NAMES[index % len(EVENT_NAMES)]
        return {"actor_id": CORE_ACTOR_ID, "row_id": facts.row_id(table, index), "name": name, "row_table": table, "command": "SeededChange",
                "environment_id": facts.environment_id, "data": "{}", "skipped_guards": "[]"}
