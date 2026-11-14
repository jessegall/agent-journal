from engine.helper_type.command_allow_list import CommandAllowList

# the runner, started from the agent's own shell, reports each run's parts, sandbox and end as that agent
RUNNER_REPORTS = ("process part-start", "process part-end", "process end", "process background", "process orphan", "process sandbox")
# every agent follows a sequence, says it is stuck, asks for a protected file, reacts to a message and waits on its
# own output through output monitor, which asks output status
EVERY_AGENT_LINES = ("sequence run", "sequence follow", "sequence next", "sequence abandon", "sequence-run list", "wait stuck", "permission ask",
                     "message react", "output status")
BASE_COMMANDS = CommandAllowList(lines=("message unread", "message read", "message reply", "message send", "skill list", "skill show", "skill required",
                                        "skill requirements", "output read", *RUNNER_REPORTS, *EVERY_AGENT_LINES))
