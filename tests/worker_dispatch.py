import re


def dispatched(console, argv: list[str], caller):
    """A worker dispatched as the plan has it, on a task of its own: the task is filed first with the job as its brief, which the worker is then told."""
    created = console.run(["task", "create", f"the job of {argv[0]}", "--brief", argv[1]], caller)
    return console.run(["worker", "dispatch", argv[0], *argv[2:], "--task", re.search(r"task (\d+)", created.text)[1]], caller)
