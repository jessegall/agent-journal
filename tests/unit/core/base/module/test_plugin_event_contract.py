import json
import os
from dataclasses import fields
from pathlib import Path

from core.base.change.change import BOOKKEEPING_FIELDS
from core.base.journal_home import JournalHome
from core.base.module.module import Module
from core.base.module.module_check import ModuleCheck
from core.base.module.module_finder import ModuleFinder

CONTRACT_FILE = Path("tests/snapshots/plugin_event_contract.json")
UPDATE_FLAG = "JOURNAL_UPDATE_PLUGIN_CONTRACT"


def test_legacy_named_events_are_read_from_a_module():
    class LegacyModule(Module):
        plugin_timestamps = ["tool_starting"]

    assert LegacyModule.plugin_event_names() == ["tool_starting"]


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
    contract_file = json.loads(CONTRACT_FILE.read_text()) if CONTRACT_FILE.exists() else {}
    former_keys = {key for module in ModuleFinder(JournalHome(tmp_path)).default_modules() for key in module.former_event_keys}
    removed_keys = sorted(key for key in contract_file if key not in contract and key not in former_keys)
    assert not removed_keys, f"these keys are gone: {removed_keys}: add a former_event_keys line for each"
    removed_fields = sorted(f"{key}.{name}" for key, row in contract_file.items() if key in contract for name in row["fields"] if name not in contract[key]["fields"])
    assert not removed_fields, f"these payload fields are gone: {removed_fields}: add former_event_keys, or raise v in the event line"
    removed_forms = sorted(f"{key} {form}" for key, row in contract_file.items() if key in contract for form in row["forms"] if form not in contract[key]["forms"])
    assert not removed_forms, f"these forms are gone: {removed_forms}: a plugin's script on them stops running"
    if os.environ.get(UPDATE_FLAG):
        CONTRACT_FILE.write_text(json.dumps(contract, indent=2) + "\n")
        return
    assert contract == contract_file, f"the contract grew by keys {sorted(set(contract) - set(contract_file))} or by fields: run this test with {UPDATE_FLAG}=1 to add them to the snapshot"
