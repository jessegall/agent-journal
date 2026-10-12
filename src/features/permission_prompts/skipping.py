from dataclasses import dataclass

from resources.fields import Loaded
from controllers.features import automatic
from serving import SERVED, Providers

SETTING = "permission_prompts"


@dataclass(frozen=True)
class Relaunch(Loaded):
    """A restart of the agent, with permission prompts skipped or not."""

    skip: bool = False


@dataclass(frozen=True)
class Skipping:
    """Whether an agent of one provider can have its permission prompts skipped, and whether it was launched that way."""

    possible: bool = False
    running: bool = False


def skipped(record) -> bool:
    return bool(record.setting(SETTING, {}).get("skip", True))


def set_skipped(record, on: bool) -> None:
    record.change_setting(SETTING, {"skip": on})


def typed(driver, args: list[str]) -> bool:
    """Whether these launch arguments already carry the driver's own skip flags."""
    return bool(driver.SKIP_ARGS) and set(driver.SKIP_ARGS) <= set(args)


def typed_skip(record, driver, args: list[str]) -> None:
    if typed(driver, args) and not skipped(record):
        set_skipped(record, True)


def skipping_now(provider: str, args: list[str]) -> Skipping:
    """What the Settings page says about one running agent: a provider nobody runs here can neither skip nor be skipping."""
    providers = SERVED.given(Providers)
    if not providers.knows(provider):
        return Skipping()
    driver = providers.driver(provider)
    return Skipping(bool(driver.SKIP_ARGS), typed(driver, args))


def launch_args(record, provider: str, args: list[str]) -> list[str]:
    providers = SERVED.given(Providers)
    if not providers.knows(provider):
        return args
    driver = providers.driver(provider)
    typed_skip(record, driver, args)
    return driver.launch_args(driver.skipping(args, skipped(record) or (automatic(record) and not driver.chosen(args))), automatic(record))
