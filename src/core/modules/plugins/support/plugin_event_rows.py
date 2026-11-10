import os
from dataclasses import replace
from pathlib import Path

from engine.journal.journal_home import JournalHome
from core.base.model.event_form import EventForm
from core.base.registry.registry import Registry
from core.base.plugin_script_processes import PluginScriptProcesses
from core.modules.plugins.support.manifest_listener import SERVICE_PREFIX, ManifestListener
from core.modules.plugins.support.plugin_event_row import PluginEventRow
from core.modules.plugins.support.plugin_event_state import PluginEventState
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_event_entry import CEILING_SETTING
from core.modules.plugins.support.plugins_module_name import MODULE_NAME
from core.modules.settings.bindings.support.setting_values import SettingValues

READS_FORM = "reads"
FILES_FORM = "files"


class PluginEventRows:
    """What a plugin listens to and every wrong entry, worked out when it is read and never stored, so an upgrade of
    the journal that removes a key shows at once."""

    def __init__(self, registry: Registry, scripts: PluginScriptProcesses, home: JournalHome, setting_values: SettingValues) -> None:
        self.registry, self.scripts, self.home, self.setting_values = registry, scripts, home, setting_values

    def rows(self, manifest: PluginManifest, folder: Path) -> tuple[PluginEventRow, ...]:
        rows: list[PluginEventRow] = [self.row(manifest, "", "", "", PluginEventState.NEEDS_NEWER_JOURNAL)] if manifest.needs_newer_journal else []
        first_entries: set[tuple[str, str]] = set()
        for listener in manifest.listeners:
            forms = [form for form in EventForm if listener.script(form)]
            if listener.is_wrong or not forms:
                rows.append(self.row(manifest, listener.event, "", "", PluginEventState.WRONG_KEY if listener.is_wrong or not self.registry.event_name(listener.event) else PluginEventState.LISTENS))
            for form in forms:
                is_second = (listener.event, form.value) in first_entries
                first_entries.add((listener.event, form.value))
                rows.append(self.form_row(manifest, folder, listener, form, is_second))
        rows += [self.row(manifest, name, "", manifest.program, PluginEventState.WRONG_KEY) for name in manifest.event_names if name not in self.registry.declared_plugin_events]
        rows += [self.row(manifest, entry, FILES_FORM, entry, PluginEventState.WRONG_SCRIPT) for entry in manifest.wrong_files(folder)]
        readable = set(manifest.project_folders(self.home.project_folder, self.home.folder))
        rows += [self.row(manifest, entry, READS_FORM, entry, PluginEventState.WRONG_PROJECT_READ) for entry in manifest.project_reads if not self.opens(entry, readable)]
        return tuple(rows)

    def opens(self, entry: str, readable: set[Path]) -> bool:
        return not Path(entry).is_absolute() and (self.home.project_folder.resolve() / entry).resolve() in readable

    def form_row(self, manifest: PluginManifest, folder: Path, listener: ManifestListener, form: EventForm, is_second: bool) -> PluginEventRow:
        script, event = listener.script(form), self.registry.event_name(listener.event)
        entry = self.registry.event_keys[event] if event else None
        started_at = next((running.started_at.text for running in self.scripts.running(manifest.name) if running.key == listener.event and running.form is form), "")
        if is_second or not listener.allowed_script(form):
            state = PluginEventState.WRONG_SCRIPT
        elif entry is None:
            state = PluginEventState.WRONG_KEY
        elif form not in entry.forms:
            state = PluginEventState.UNSUPPORTED_FORM
        elif script.startswith(SERVICE_PREFIX):
            state = PluginEventState.LISTENS if manifest.answers_as(script) else PluginEventState.WRONG_SCRIPT
        elif not os.access(folder / script, os.X_OK):
            state = PluginEventState.WRONG_SCRIPT
        elif entry.key != listener.event:
            state = PluginEventState.RENAMED
        else:
            state = PluginEventState.LISTENS
        is_hook_guard = form is EventForm.GUARD and entry is not None and entry.module == MODULE_NAME and entry.event in self.registry.declared_plugin_events
        limit_ms = int(self.setting_values.number(CEILING_SETTING)) if is_hook_guard else 0
        row = self.row(manifest, listener.event, form.value, script, state, entry.key if state is PluginEventState.RENAMED and entry else "", started_at, limit_ms)
        if not self.scripts.has_skip(manifest.name, listener.event, form):
            return row
        skip = self.scripts.newest_skip(manifest.name, listener.event, form)
        return replace(row, last_skipped_at=skip.skipped_at.text, skip_reason=skip.reason)

    @staticmethod
    def row(manifest: PluginManifest, key: str, form: str, script: str, state: PluginEventState, current_key: str = "", started_at: str = "", limit_ms: int = 0) -> PluginEventRow:
        return PluginEventRow(f"{manifest.name}:{key}:{form}:{script}", manifest.name, key, form, script, state, current_key, started_at, limit_ms)
