from pathlib import Path

from engine.proc import ran, streamed
from engine.wording import fill
from features.plugins.declared import Manifest, command_text, shell_args
from resources.base import Refused

SETUP_SECONDS = 900
CHECK_SECONDS = 60
SHOWN_LINES = 40


def checked(manifest: Manifest, where: Path, env: dict) -> None:
    for wanted in manifest.requires:
        done = ran(shell_args(wanted.check), where, CHECK_SECONDS, env=env)
        if done is None or done.returncode:
            raise Refused(f"{manifest.name} needs {wanted.tool}: {wanted.hint_text}")


def prepared(manifest: Manifest, where: Path, env: dict, record_log: Path) -> None:
    record_log.parent.mkdir(parents=True, exist_ok=True)
    for step in manifest.setup:
        command = fill(step.run, env)
        with record_log.open("a") as f:
            f.write(f"$ {command_text(command)}\n")
        written = [0]

        def append(output: str) -> None:
            with record_log.open("a") as f:
                f.write(output[written[0]:])
            written[0] = len(output)
        code, out = streamed(shell_args(command), where / step.cwd,
                             SETUP_SECONDS, append, env)
        append(f"{out}\n")
        if code != 0:
            tail = "\n".join(out.strip().splitlines()[-SHOWN_LINES:])
            raise Refused(f"setup step {step.name!r} failed ({code}): {command_text(command)}\n{tail}\nthe whole output is in {record_log}")
