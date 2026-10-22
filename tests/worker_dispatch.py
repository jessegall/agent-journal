import re


def dispatched(console, argv: list[str], caller):
    """A worker dispatched as the plan has it, on a task of its own: the task is filed with the job as its brief first."""
    created = console.run(["task", "create", f"the job of {argv[0]}", "--brief", argv[1]], caller)
    return console.run(["worker", "dispatch", *argv, "--task", re.search(r"task (\d+)", created.text)[1]], caller)
