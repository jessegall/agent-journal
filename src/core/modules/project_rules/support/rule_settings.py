from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue

RULE_APPROVAL_SETTING = "journal.core.project-rules.agents-make-rules"
RULE_SETTINGS = [SettingValue("agents-make-rules", "Agents make rules without approval", "A rule an agent writes holds at once, with no card to approve.", SettingType.FLAG, default=False, person_set=True)]
