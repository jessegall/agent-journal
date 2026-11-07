import json
from dataclasses import dataclass

from core.base.driver.command_category import CommandCategory
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue
from core.modules.helpers.support import agent_field_options as options
from core.modules.helpers.support.agent_field_options import AgentFieldOptions
from core.modules.helpers.support.agent_options_value import AgentOptionsValue
from core.modules.helpers.support import helper_settings as helpers
from suites.coding.modules.workers.support import worker_settings as workers
from suites.coding.support import coding_settings as coding

AGENT_TYPES = ("worker", "helper")
ALL_COMMAND_TYPES = tuple(category.value for category in CommandCategory)
DEFAULT_COMMAND_TYPES = (CommandCategory.READ.value, CommandCategory.SEARCH.value, CommandCategory.EDIT.value, CommandCategory.TEST_RUN.value,
                         CommandCategory.BUILD.value)
SETTING_LISTS = {"coding": coding.CODING_SETTINGS, "workers": workers.WORKER_SETTINGS, "helpers": helpers.HELPER_SETTINGS}
MODULE_KEYS = {"coding": coding.MODULE_KEY, "workers": workers.MODULE_KEY, "helpers": helpers.MODULE_KEY}
RULES = {**coding.CODING_SETTING_RULES, **workers.WORKER_SETTING_RULES, **helpers.HELPER_SETTING_RULES}
MAIN_AUTO_DESCRIPTION = "The main agent may also write code itself"


@dataclass(frozen=True)
class SettingPart:
    """One existing or new setting a control reads: its owner, key, fresh default and values it must refuse."""

    owner: str
    key: str
    default: object
    malformed: tuple[object, ...] = ()


@dataclass(frozen=True)
class FieldPart:
    """One field of the agent options setting a control reads: its fresh default and lines it must refuse."""

    field: str
    default: object
    malformed: tuple[str, ...]


@dataclass(frozen=True)
class Control:
    """One numbered control of the main agent settings."""

    number: str
    parts: list[SettingPart | FieldPart]


def flag(owner: str, key: str, default: bool) -> SettingPart:
    return SettingPart(owner, key, default, ("yes", 1, "on"))


def positive_integer(owner: str, key: str, default: int) -> SettingPart:
    return SettingPart(owner, key, default, (0, -1, 1.5, "3"))


def nonnegative_integer(owner: str, key: str, default: int) -> SettingPart:
    return SettingPart(owner, key, default, (-1, 1.5, "3", float("nan")))


def commands(key: str) -> SettingPart:
    return SettingPart("workers", key, (), (["git status", " "], ["git status", "git status"], "git status"))


def option(name: str, default: object, *malformed: str) -> FieldPart:
    return FieldPart(name, default, malformed)


CONTROLS = [
    Control("C01", [flag("coding", coding.AUTO_MODE_SETTING, True)]),
    Control("C02", [flag("workers", workers.DISPATCHES_WORKERS_SETTING, True)]),
    Control("C03", [flag("coding", coding.KEEP_RUNNING_SETTING, False)]),
    Control("C05", [flag("workers", workers.MERGER_ENABLED, True)]),
    Control("C06", [flag("coding", coding.STARTS_HELPERS_SETTING, True)]),
    Control("C07", [flag("coding", coding.DESIGNER_ENABLED_SETTING, False)]),
    Control("C09", [flag("workers", workers.MAIN_MERGES_WORKERS, True)]),
    Control("C10", [positive_integer("workers", workers.WORKER_BATCH_SIZE, 3)]),
    Control("C11", [option(options.ALLOW_NEW, True, "worker allow_new=maybe", "worker allow_new=1")]),
    Control("C12", [option(options.ALLOW_RESUME, True, "worker allow_resume=maybe", "helper:journal-merger allow_resume=0")]),
    Control("C13", [option(options.ALLOWED_PROFILES, None, "worker allowed_profiles=two words", "worker allowed_profiles=a,a", "pilot allowed_profiles=a")]),
    Control("C14", [option(options.ALLOWED_PROVIDERS, None, "worker allowed_providers=cl aude", "worker allowed_providers=claude,claude")]),
    Control("C16", [SettingPart("helpers", helpers.PROGRAM_SPLIT, (), (["claude 60", "codex 30"], ["claude"], ["claude 50", "claude 50"], ["claude 120"]))]),
    Control("C17", [option(options.ALLOWED_MODELS, None, "worker allowed_models=claude", "worker allowed_providers=codex\nworker allowed_models=claude:opus"),
                    SettingPart("helpers", helpers.ALLOWED_MODELS, (), (["claude"], ["claude opus", "claude opus"], "claude opus"))]),
    Control("C18", [option(options.MODEL_DEFAULTS, None, "worker model_defaults=claude:a,claude:b", "worker model_defaults=claude")]),
    Control("C20", [nonnegative_integer("workers", workers.WORKER_RUN_LIMIT, 2), nonnegative_integer("helpers", helpers.HELPER_RUN_LIMIT, 4),
                    SettingPart("helpers", helpers.HELPER_PROFILE_LIMITS, (), (["journal-merger:4"], ["journal-merger:x:8"], ["a:1:2", "a:1:2"]))]),
    Control("C21", [nonnegative_integer("workers", workers.WORKER_KEPT_LIMIT, 8), nonnegative_integer("helpers", helpers.HELPER_KEPT_LIMIT, 8)]),
    Control("C22", [nonnegative_integer("helpers", helpers.HELPER_MAX_MINUTES, 60),
                    option(options.MAX_MINUTES, None, "helper max_minutes=1.5", "helper max_minutes=-1", "helper max_minutes=soon")]),
    Control("C23", [SettingPart("helpers", helpers.HELPER_MAX_COST, 0, (-0.5, "1", float("nan"), float("inf"))),
                    option(options.MAX_COST, None, "helper max_cost=nan", "helper max_cost=inf", "helper max_cost=-1")]),
    Control("C24", [flag("workers", workers.RESUME_SILENT_AGENTS, True)]),
    Control("C25", [positive_integer("workers", workers.SILENT_AGENT_MINUTES, 3)]),
    Control("C26", [SettingPart("workers", workers.WORKER_IDLE_HOURS, 6, (0, -1, "6", float("nan"), float("inf")))]),
    Control("C27", [positive_integer("workers", workers.IDLE_WORKER_MINUTES, 15)]),
    Control("C28", [positive_integer("workers", workers.IDLE_WORKER_REPEAT_MINUTES, 5)]),
    Control("C29", [positive_integer("workers", workers.INACTIVE_HELPER_GRACE_MINUTES, 15)]),
    Control("C30", [positive_integer("workers", workers.INACTIVE_HELPER_MINUTES, 5)]),
    Control("C31", [SettingPart("helpers", helpers.PROGRAM_WINDOW_PERCENT, 95, (-1, 101, 95.5, "95"))]),
    Control("C32", [flag("workers", workers.PHASE_TESTS_ENABLED, True)]),
    Control("C33", [positive_integer("workers", workers.TEST_BATCH_SIZE, 1)]),
    Control("C34", [nonnegative_integer("workers", workers.WORKER_PHASE_TEST_RUNS, 3)]),
    Control("C35", [nonnegative_integer("workers", workers.WORKER_TEST_LIMIT, 25)]),
    Control("C36", [SettingPart("coding", coding.COMMAND_TYPES, DEFAULT_COMMAND_TYPES, (["deploy"], ["read", "read"], ["read", " "], "read"))]),
    Control("C37", [SettingPart("workers", workers.AFFECTED_TESTS_COMMAND, "")]),
    Control("C38", [SettingPart("workers", workers.PROJECT_TEST_COMMAND, "")]),
    Control("C39", [commands(workers.MERGER_COMMANDS)]),
    Control("C40", [commands(workers.MERGE_COMMANDS)]),
    Control("C41", [positive_integer("workers", workers.DELIVERY_FAILURE_LIMIT, 3)]),
    Control("C42", [positive_integer("workers", workers.WORKER_RUN_FAILURE_LIMIT, 5)]),
    Control("C43", [flag("workers", workers.WORKERS_START_HELPERS, True)]),
]
SETTING_PARTS = [(control.number, part) for control in CONTROLS for part in control.parts if isinstance(part, SettingPart)]
FIELD_PARTS = [(control.number, part) for control in CONTROLS for part in control.parts if isinstance(part, FieldPart)]
DECLARED = {f"{MODULE_KEYS[owner]}.{value.key}": (owner, value) for owner, values in SETTING_LISTS.items() for value in values}
UNTESTED_COMMANDS = (workers.AFFECTED_TESTS_COMMAND, workers.PROJECT_TEST_COMMAND)


def refusals(part: SettingPart, value: object) -> list[str]:
    declared = DECLARED[part.key][1]
    if declared.type is SettingType.FLAG:
        return [] if declared.accepts(value) else [f"{part.key} is a flag"]
    return list(RULES[part.key].problems(part.key, value))


def owner_problems() -> list[str]:
    problems = []
    for number, part in SETTING_PARTS:
        owners = [owner for owner, values in SETTING_LISTS.items() for value in values if f"{MODULE_KEYS[owner]}.{value.key}" == part.key]
        declared = DECLARED[part.key][1]
        problems += [f"{number} {part.key} is declared by {owners}"] * (owners != [part.owner])
        problems += [f"{number} {part.key} can be set by an agent"] * (not declared.person_set)
        problems += [f"{number} {part.key} defaults to {declared.default!r}"] * (declared.default != part.default)
        problems += list(declared.problems(part.key))
    return problems


def malformed_value_problems() -> list[str]:
    problems = []
    for number, part in SETTING_PARTS:
        if part.key in UNTESTED_COMMANDS:
            continue
        problems += [f"{number} refuses its own default {part.default!r}"] * bool(refusals(part, part.default))
        problems += [f"{number} {part.key} accepts {value!r}" for value in part.malformed if not refusals(part, value)]
        problems += [f"{number} {part.key} names no malformed value"] * (not part.malformed)
    return problems


def option_problems() -> list[str]:
    problems = [f"{number} {part.field} defaults to another value" for number, part in FIELD_PARTS if getattr(AgentFieldOptions(), part.field) != part.default]
    problems += [f"{number} accepts {line!r}" for number, part in FIELD_PARTS for line in part.malformed if not AgentOptionsValue.problems(line.split("\n"), AGENT_TYPES)]
    problems += [f"{number} names no malformed line" for number, part in FIELD_PARTS if not part.malformed]
    return problems


def saved_text(value: SettingValue) -> str:
    match value.type:
        case SettingType.FLAG:
            return "on" if value.default else "off"
        case SettingType.LIST:
            return json.dumps(list(value.default))
        case _:
            return str(value.default)


CONTROL_CASES = ("default", "changed")
REGRESSION_STORIES = ("S04", "S08", "S15", "S19")
REGRESSION_CASES = ("kept", "changed")
TRANSITION_STORIES = [f"S{number}" for number in range(44, 62)]


def matrix_cases() -> list[str]:
    controls = [f"{control.number}-{case}" for control in CONTROLS for case in CONTROL_CASES]
    regressions = [f"{story}-{case}" for story in REGRESSION_STORIES for case in REGRESSION_CASES]
    return controls + regressions + TRANSITION_STORIES
