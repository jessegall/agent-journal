from features.status_bar.dissect import dissect
from resources.types import COMMAND


def ran(commands: list[dict] | None) -> list[dict]:
    return [dissect(one) for one in commands or [] if (one.get(COMMAND.what) or "").strip()]


def grouped(said: list[dict]) -> list[list[dict]]:
    runs: list[list[dict]] = []
    for one in said:
        if runs and runs[-1][0]["kind"] == one["kind"]:
            runs[-1].append(one)
            continue
        runs.append([one])
    return runs
