"""Whether an agent's permission prompts are skipped, as the project's settings say."""

SETTING = "permission_prompts"


def skipped(record) -> bool:
    return bool(record.setting(SETTING, {}).get("skip", True))


def set_skipped(record, on: bool) -> None:
    record.change_setting(SETTING, {"skip": on})
