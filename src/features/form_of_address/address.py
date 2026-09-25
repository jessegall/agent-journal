import subprocess

from features.form_of_address.details import AddressDetails
from features.form_of_address.feature import FormOfAddress

GIT_NAMES: dict[str, str] = {}


def git_first_name(project) -> str:
    key = str(project)
    if key not in GIT_NAMES:
        try:
            found = subprocess.run(["git", "config", "user.name"], cwd=project, capture_output=True, text=True, timeout=2).stdout
        except (OSError, subprocess.SubprocessError):
            found = ""
        GIT_NAMES[key] = (found.split() or [""])[0]
    return GIT_NAMES[key]


def address(record) -> str:
    if not FormOfAddress.on_for(record):
        return ""
    values = AddressDetails.values(record)
    called = " ".join(part for part in (str(values.title).strip(), str(values.first_name).strip() or git_first_name(record.root.parent)) if part)
    return f"ADDRESS THE USER as \"{called}\" when you speak to them, now and after every compaction." if called else ""
