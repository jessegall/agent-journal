import re


def dispatched(console, argv: list[str], caller):
    """A worker dispatched as the plan has it, on a task of its own: the task is filed first with the job as its brief, which the worker is then told."""
    created = console.run(["task", "create", f"the job of {argv[0]}", "--brief", argv[1]], caller)
    return console.run(["worker", "dispatch", argv[0], *argv[2:], "--task", re.search(r"task (\d+)", created.text)[1]], caller)


def tokenless_run(runner, worker, command: list[str], actor) -> None:
    """A run of a worker dispatched before workers carried a token: its command run in its folder, and its end taken the way it was then."""
    import subprocess
    output, err = runner.outputs(worker)
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w") as printed, err.open("w") as faults:
        code = subprocess.run(command, cwd=runner.place(worker), stdout=printed, stderr=faults, timeout=60).returncode
    runner.finish(worker, code, actor)
