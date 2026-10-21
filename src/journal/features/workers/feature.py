from journal.support.entry import Entry
from journal.features.feature import Feature
from journal.features.workers.support.workers_conduct import WorkersConduct
from journal.features.workers.support.workers_standing_reader import WorkersStandingReader
from journal.features.workers.seeds.workers_at_boot import WorkersAtBoot
from journal.engine.nudge import Nudge
from journal.support.option import Option
from journal.models.node_kind import NodeKind
from journal.support.skill import Skill
from journal.features.workers.commands.worker_command import WorkerCommand
from journal.features.workers.states.awaiting import Awaiting
from journal.features.workers.listeners.mark_subagents import MarkSubagents


class Workers(Feature):
    """A worker is an agent sent to write: code in a worktree of its own, a document, a change. A subagent only reads; a worker is the one that writes."""

    name = "workers"
    title = "Workers"
    help = "Agents sent to write one bounded job; the agent waits for their reports."
    TIMEOUT = Option("workers.timeout_minutes", "Time limit of a worker run", "Minutes a worker may run before it is stopped and its report says so; 0 sets no limit", 60, unit="min")
    MODE = Option("workers.mode", "Work mode", "Builder: the agent builds it itself and sends workers when a job is better done beside it. Orchestrator: it plans, hands the work to workers, then reviews and merges it. Solo: it does everything itself, with no workers", "builder", kind="choice", choices=("builder", "orchestrator", "solo"))
    MOST_OUT = Option("workers.most_out", "Workers out at once", "The most workers out at a time; a dispatch past it is refused until one reports. 0 is no limit", 3, unit="workers")
    MOST_SUBAGENTS = Option("workers.most_subagents", "Subagents running at once", "The most subagents running at a time; one more is held until one finishes. 0 is no limit", 5, unit="subagents")
    options = (TIMEOUT, MODE, MOST_OUT, MOST_SUBAGENTS)
    states = (Awaiting,)
    commands = (WorkerCommand,)
    seeds = (WorkersAtBoot,)
    listeners = (MarkSubagents,)
    standing = (WorkersStandingReader,)
    conduct = (WorkersConduct,)
    checks = (
        Entry(NodeKind.CHECK, 'worker_reported', 'Worker reported?', 'the row is a worker that just reported'),
        Entry(NodeKind.CHECK, 'worker_stopped', 'Worker stopped?', 'the row is a worker that just stopped before reporting'),
        Entry(NodeKind.CHECK, 'agent_awaits_the_worker', 'Agent awaits this worker?', 'the agent waits on the worker of this row'),
        Entry(NodeKind.CHECK, 'last_worker_back', 'Last worker back?', 'every worker the agent waits on has reported or stopped'),
        Entry(NodeKind.CHECK, 'worker_report_waiting', 'Has a worker report not acted on?', 'a worker here reported and the agent has not given it its next job, stopped it or marked it done'),
    )

    WORKER_REPORTED = Nudge(name, "worker_reported", "worker {{n}}, {{name}}, reported in the chat", repeat_after=0)
    WORKER_STOPPED_UNREPORTED = Nudge(name, "worker_stopped_unreported", "worker {{n}}, {{name}}, stopped before it reported", repeat_after=0)
    WAITED_ON_CAME_BACK = Nudge(name, "waited_on_came_back", "what you waited on came back: carry on", repeat_after=0)
    TOO_MANY_SUBAGENTS = Nudge(name, "too_many_subagents", "{{running}} subagents are running, the most at once", "wait for one to finish, or keep the work yourself", repeat_after=0)
    TOO_MANY_WORKERS = Nudge(name, "too_many_workers", "{{out}} workers are out, the most at once", "wait for one to report with `journal worker wait`, or give the job to one that reported with `journal worker say`", repeat_after=0)
    FILE_IS_THE_WORKERS = Nudge(name, "file_is_the_workers", "that file is in worker {{n}}'s worktree", "{{name}} writes there: `journal worker say {{n}} \"<job>\"`, or wait for its report and merge", repeat_after=0)
    ACT_ON_THE_REPORTS = Nudge(name, "act_on_the_reports", "{{reports_waiting}} reported and you have not acted on it yet", "read its report, then give it its next job, stop it, or mark it done once its work is merged or used", repeat_after=180, held_whatever_its_values=True)
    SEND_THE_JOB_TO_THE_SUBAGENT = Nudge(name, "send_the_job_to_the_subagent", "subagent {{session}} ({{task}}) already worked on the files this job names", "send it the job with SendMessage({to: \"{{session}}\", message: \"<job>\"}), so it goes on with what it knows", repeat_after=0)
    nudges = (WORKER_REPORTED, WORKER_STOPPED_UNREPORTED, WAITED_ON_CAME_BACK, ACT_ON_THE_REPORTS, TOO_MANY_SUBAGENTS, TOO_MANY_WORKERS, FILE_IS_THE_WORKERS, SEND_THE_JOB_TO_THE_SUBAGENT)

    skill = Skill("workers", 'Send a worker to write a bounded job and wait for its report; load it before dispatching one', """
# Workers

A subagent only reads. A worker writes: code in a worktree of its own, a document, a change.

- `journal worker dispatch "<Name>" "<bounded brief>" --profile journal-senior|journal-medior [--provider claude|codex] [--worktree]`: name it
  after a distinguished figure with a twist on their trade and give it one job. The profile sets its model and what it is told:
  medior, on Sonnet, for a job whose shape is settled; senior, on Opus, only for one that needs judgement. `--model` overrides it.
- `journal worker wait <n> [<n>...]` waits until they have reported; stopping is fine while you wait.
- A worker reports with `journal worker report <n> "<what it found or did>"`; you are told, and told again when
  the last one is back. `journal worker list` shows who is out.
- A report is acted on once you give the worker its next job, `journal worker stop <n>` it, or `journal worker done <n>`
  when its work is merged or used; until then you are told again at once and every three minutes.
- A worker that runs past 60 minutes is stopped and its report says so (setting workers.timeout_minutes, 0 for no limit).
- Related work goes back to the worker that knows it: `journal worker say <n> "<next job>"` sends a worker that
  reported out again with its memory of the last job, in the same worktree. Never dispatch a fresh worker for
  work one already out has done part of.
""", keywords=('worker', 'workers', 'helper', 'dispatch', 'worktree', 'say'), required_in=('awaiting',))
