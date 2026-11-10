from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.setting.setting_values import SettingValues
from core.modules.settings.commands.support.setting_store import SettingStore
from core.modules.settings.support.setting_reader import SettingReader
from core.modules.skills.commands.set_required_skill.set_required_skill import SetRequiredSkill
from core.modules.skills.support.required_agents import RequiredAgents
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.skill_requirements import SkillRequirements
from core.modules.skills.support.start_skills import SESSION_START_KEY, AFTER_COMPACTION_KEY, MAIN_AGENT_KEY


class SetRequiredSkillHandler(Handler[SetRequiredSkill, SkillRequirements]):
    """Updates one skill in the project lists inside one command transaction."""

    command = SetRequiredSkill

    def __init__(self, reader: SettingReader, values: SettingValues, store: SettingStore, catalogue: SkillCatalogue) -> None:
        self.reader, self.values, self.store, self.catalogue = reader, values, store, catalogue

    def handle(self, command: SetRequiredSkill, context: Context) -> SkillRequirements:
        if not any(skill.folder == command.skill for skill in self.catalogue.skills()):
            raise Refusal(f"skill {command.skill} is not available", "choose a skill from journal skill list")
        for key, required in ((SESSION_START_KEY, command.agents is RequiredAgents.ALL),
                              (AFTER_COMPACTION_KEY, command.agents is RequiredAgents.ALL and command.after_compaction),
                              (MAIN_AGENT_KEY, command.agents is RequiredAgents.MAIN)):
            folders = [folder for folder in self.values.project.texts(key) if folder != command.skill]
            if required:
                folders.append(command.skill)
            self.store.write(key, folders, None, context)
        return SkillRequirements.read(self.reader, self.values)
