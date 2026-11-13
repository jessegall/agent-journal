from dataclasses import dataclass, fields


@dataclass(frozen=True)
class HelperBehaviours:
    """What the journal does for an agent of one type: each field is a yes or no a type declares, with no default. An
    agent of a type no module registers any more is retired and does none of it."""

    takes_jobs: bool
    unblocked_by_started_task: bool
    takes_tasks: bool
    takes_prompts: bool
    takes_marks: bool
    runs_plugins: bool
    dispatches: bool
    stops_are_checked: bool
    has_private_outputs: bool
    needs_readers: bool
    queues_runs: bool
    watches_runs_automatically: bool
    keeps_runs_after_end: bool
    reads_project_skills: bool
    keeps_pause_after_end: bool
    has_restricted_aliases: bool
    runs_saved_commands: bool

    @classmethod
    def retired(cls) -> "HelperBehaviours":
        return cls(**{field.name: False for field in fields(cls)})
