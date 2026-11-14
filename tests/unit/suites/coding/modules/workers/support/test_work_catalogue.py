from engine.enums.setting_type import SettingType
from suites.coding.modules.workers.support.work_catalogue import EDITABLE_KEYS
from suites.coding.modules.workers.support.worker_settings import MODULE_KEY, WORKER_SETTING_VALUES


def test_every_number_of_the_workers_a_person_sets_is_changed_on_the_workers_screen():
    numbers = [f"{MODULE_KEY}.{value.key}" for value in WORKER_SETTING_VALUES if value.person_set and value.type is SettingType.NUMBER]
    assert [key for key in numbers if key not in EDITABLE_KEYS] == []
