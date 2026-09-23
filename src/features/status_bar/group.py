from features.status_bar.dissect import Dissected, dissect
from features.status_bar.runs import CommandRun


def ran(commands: list[dict] | None) -> list[Dissected]:
    runs = (CommandRun.from_json(one) for one in commands or [])
    return [dissect(one) for one in runs if one.command.strip()]


def grouped(commands: list[Dissected]) -> list[list[Dissected]]:
    runs: list[list[Dissected]] = []
    for one in commands:
        if runs and runs[-1][0].kind == one.kind:
            runs[-1].append(one)
            continue
        runs.append([one])
    return runs
