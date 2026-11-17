from engine.helper_type.command_allow_list import CommandAllowList

# the runner, started from the agent's own shell, claims each run and reports its parts, sandbox and end as that agent
RUNNER_REPORTS = ("process part-start", "process part-end", "process end", "process background", "process orphan", "process sandbox", "process claim")
# the launcher of the agent's program reports its exit for that agent
LAUNCHER_REPORTS = ("agent exited",)
# every agent follows a sequence, says it is stuck, asks for a protected file, reacts to a message, waits on its own
# output through output monitor, which asks output status, and names the type of a command the journal cannot classify
COMMON_AGENT_COMMANDS = ("sequence run", "sequence follow", "sequence next", "sequence abandon", "sequence-run list", "wait stuck", "permission ask",
                     "message react", "output status", "command-type make")
BASE_COMMANDS = CommandAllowList(lines=("message unread", "message read", "message reply", "message send", "skill list", "skill show", "skill required",
                                        "skill requirements", "output read", *RUNNER_REPORTS, *LAUNCHER_REPORTS, *COMMON_AGENT_COMMANDS))
