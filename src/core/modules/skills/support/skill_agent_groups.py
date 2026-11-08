from collections import defaultdict
from collections.abc import Mapping

from core.base.registry.registry import Registry
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.profiles.support.profile_problem import ProfileProblem
from core.modules.skills.support.profile_skills import ProfileSkills


class SkillAgentGroups:
    """Which agent groups have each skill, by the skills their profiles give them."""

    def __init__(self, registry: Registry, profiles: ProfileFiles, skills: ProfileSkills) -> None:
        self.registry, self.profiles, self.skills = registry, profiles, skills

    def labels(self) -> Mapping[str, tuple[str, ...]]:
        book, found = self.registry.agent_group_book(), defaultdict(dict)
        for profile in self.profiles.listed():
            group = None if isinstance(profile, ProfileProblem) else book.group(profile.agent_type, profile.name)
            if group is None or isinstance(profile, ProfileProblem):
                continue
            for folder in self.skills.folders(profile):
                found[folder][group.label] = True
        return {folder: tuple(labels) for folder, labels in found.items()}
