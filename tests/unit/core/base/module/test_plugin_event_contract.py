import json
import os
from dataclasses import fields
from pathlib import Path

from core.base.change.change import BOOKKEEPING_FIELDS
from core.base.journal_home import JournalHome
from core.base.module.module_check import ModuleCheck
from core.base.module.module_finder import ModuleFinder

SNAPSHOT = Path("tests/snapshots/plugin_event_contract.json")
UPDATE_FLAG = "JOURNAL_UPDATE_PLUGIN_CONTRACT"


def current_contract(tmp_path) -> dict[str, dict[str, list[str]]]:
    modules = ModuleFinder(JournalHome(tmp_path)).default_modules()
    models = {declaration.model.model_name: declaration.model for module in modules for declaration in module.models}
    contract: dict[str, dict[str, list[str]]] = {}
    for entry in ModuleCheck.event_keys(modules):
        model = models.get(entry.event.partition(".")[0])
        names = sorted(field.name for field in fields(model) if field.name not in BOOKKEEPING_FIELDS and field.name not in model.hidden_fields) if model else []
        contract[entry.key] = {"forms": sorted(form.value for form in entry.forms), "fields": names}
    return dict(sorted(contract.items()))


def test_keys_forms_and_payload_fields_keep_their_contract(tmp_path):
    contract = current_contract(tmp_path)
    held = json.loads(SNAPSHOT.read_text()) if SNAPSHOT.exists() else {}
    former = {former for module in ModuleFinder(JournalHome(tmp_path)).default_modules() for former in module.former_event_keys}
    lost_keys = sorted(key for key in held if key not in contract and key not in former)
    assert not lost_keys, f"these keys are gone: {lost_keys}: add a former_event_keys line for each"
    lost_fields = sorted(f"{key}.{name}" for key, row in held.items() if key in contract for name in row["fields"] if name not in contract[key]["fields"])
    assert not lost_fields, f"these payload fields are gone: {lost_fields}: add former_event_keys, or raise v in the event line"
    lost_forms = sorted(f"{key} {form}" for key, row in held.items() if key in contract for form in row["forms"] if form not in contract[key]["forms"])
    assert not lost_forms, f"these forms are gone: {lost_forms}: a plugin's script on them stops running"
    if os.environ.get(UPDATE_FLAG):
        SNAPSHOT.write_text(json.dumps(contract, indent=2) + "\n")
        return
    assert contract == held, f"the contract grew by keys {sorted(set(contract) - set(held))} or by fields: run this test with {UPDATE_FLAG}=1 to add them to the snapshot"
