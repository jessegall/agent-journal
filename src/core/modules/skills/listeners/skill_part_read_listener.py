from pathlib import PurePath

from core.base.command.bus import Bus
from core.base.listener.save_listener import SaveListener
from engine.query.queries import Queries
from core.base.skill.skill_declaration import SKILL_FILE
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.skills.commands.load_skill.load_skill import LoadSkill
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.base.change.created import Created
from core.base.command.context import Context

SKILL_TEXT_COMMAND = ["journal", "skill", "show"]


class SkillPartReadListener(SaveListener[Created[ProcessPart]]):
    """When a part of a shell line names the SKILL.md of a skill in the catalogue, or runs journal skill show
    on it, the agent has that skill loaded in the same write, so the very next command finds it read. Each
    part counts by itself, however many others the line has, and a skill named by several parts of one line
    loads once."""

    name = "skills.part-read"

    def __init__(self, bus: Bus, queries: Queries, catalogue: SkillCatalogue) -> None:
        self.bus, self.queries, self.catalogue = bus, queries, catalogue
        self.process_id: int | None = None
        self.loaded_folders: set[str] = set()

    def handle(self, event: Created[ProcessPart], context: Context) -> None:
        part = event.row
        folders = self.unloaded_folders(part.process_id, self.skill_folders(part.text))
        if not folders:
            return
        agent_id = self.queries.query(Process).find(part.process_id).session_agent_id
        for skill in self.catalogue.skills():
            if skill.folder in folders:
                self.bus.dispatch(LoadSkill(agent_id, skill.folder, skill.digest), context)

    def unloaded_folders(self, process_id: int, folders: set[str]) -> set[str]:
        if process_id != self.process_id:
            self.process_id, self.loaded_folders = process_id, set()
        new_folders = folders - self.loaded_folders
        self.loaded_folders |= new_folders
        return new_folders

    def skill_folders(self, text: str) -> set[str]:
        tokens = [token.strip("'\"") for token in text.split()]
        folders = {PurePath(token).parent.name for token in tokens if PurePath(token).name == SKILL_FILE}
        if tokens[:len(SKILL_TEXT_COMMAND)] != SKILL_TEXT_COMMAND:
            return folders
        return {*folders, *tokens[len(SKILL_TEXT_COMMAND):len(SKILL_TEXT_COMMAND) + 1]}
