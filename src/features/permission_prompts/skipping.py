from dataclasses import dataclass

from engine.fields import Loaded
from features.work_tracking.auto import automatic
from providers import DRIVERS

SETTING = "permission_prompts"


@dataclass(frozen=True)
class Relaunch(Loaded):
    """A restart of the agent, with permission prompts skipped or not."""

    skip: bool = False


def skipped(record) -> bool:
    return bool(record.setting(SETTING, {}).get("skip", True))


def set_skipped(record, on: bool) -> None:
    record.set_setting(SETTING, {**record.setting(SETTING, {}), "skip": on})


def prompted(record) -> None:
    set_skipped(record, automatic(record))


def typed_skip(record, driver, args: list[str]) -> None:
    if driver.SKIP_ARGS and set(driver.SKIP_ARGS) <= set(args) and not skipped(record):
        set_skipped(record, True)


def launch_args(record, provider: str, args: list[str]) -> list[str]:
    driver = DRIVERS.get(provider)
    if not driver:
        return args
    typed_skip(record, driver, args)
    return driver.launch_args(driver.skipping(args, skipped(record) or (automatic(record) and not driver.chosen(args))), automatic(record))
