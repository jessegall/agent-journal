import re
from pathlib import Path

from engine.enums.setting_component import SettingComponent

REGISTRY_FILE = Path(__file__).resolve().parents[5] / "src" / "core" / "modules" / "setting_components" / "web" / "src" / "registry.js"
REGISTRY_KEY = re.compile(r'^\s+"([a-z-]+)":', re.MULTILINE)


def test_every_setting_component_name_has_an_entry_in_the_registry_file():
    registered = set(REGISTRY_KEY.findall(REGISTRY_FILE.read_text()))
    assert {component.value for component in SettingComponent} <= registered


def test_the_registry_file_holds_no_name_the_enum_does_not_declare():
    registered = set(REGISTRY_KEY.findall(REGISTRY_FILE.read_text()))
    assert registered <= {component.value for component in SettingComponent}
