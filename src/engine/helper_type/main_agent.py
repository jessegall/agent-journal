from typing import ClassVar

from engine.helper_type.helper_behaviours import HelperBehaviours


class MainAgent:
    """The main agent of an environment, in the shape of a helper type: its key, its label and its behaviours. It is
    no helper type, so no module registers it."""

    key: ClassVar[str] = "main"
    label: ClassVar[str] = "Main agent"
    behaviours: ClassVar[HelperBehaviours] = HelperBehaviours(
        takes_jobs=False, started_task_clears_block=False, takes_tasks=True, takes_prompts=True, takes_marks=True, runs_plugins=True, dispatches=True,
        checked_stops=True, has_private_outputs=False, requires_readers=False, queues_runs=False, watches_runs_automatically=False,
        continues_runs=False, reads_project_skills=False, retains_pause=False, has_restricted_aliases=False, runs_saved_commands=True)
