from dataclasses import dataclass, fields


@dataclass(frozen=True)
class HelperBehaviours:
    """What the journal does for an agent of one type: each field is a yes or no a type declares, with no default. An
    agent whose stored type no installed module registers does none of it."""

    takes_jobs: bool
    started_task_clears_block: bool
    takes_tasks: bool
    takes_prompts: bool
    takes_marks: bool
    runs_plugins: bool
    dispatches: bool
    checked_stops: bool
    has_private_outputs: bool
    requires_readers: bool
    queues_runs: bool
    watches_runs_automatically: bool
    continues_runs: bool
    reads_project_skills: bool
    retains_pause: bool
    has_restricted_aliases: bool
    runs_saved_commands: bool

    @classmethod
    def retired(cls) -> "HelperBehaviours":
        return cls(**{field.name: False for field in fields(cls)})
