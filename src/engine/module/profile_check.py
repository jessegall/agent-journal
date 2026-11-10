from collections.abc import Sequence

from engine.enums.access import Access
from engine.module.module import Module
from core.base.profile.agent_profile import AgentProfile
from core.base.profile.profile_name import PROFILE_NAME
from engine.helper_type.helper_type import HelperType


class ProfileCheck:
    """Checks module profiles and refuses old suite declarations before sync writes anything."""

    def problems(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        types = {declaration.key: declaration for module in modules for declaration in module.declared_helper_types()}
        claimed: dict[str, str] = {}
        problems = [f"{suite.name}: register profiles on the module, not the suite" for module in modules for suite in module.suites
                    if hasattr(suite, "profiles") or hasattr(suite, "profile_types")]
        for module in modules:
            for profile in module.profiles:
                problems.extend(self.profile_problems(module.name, profile, types, claimed))
        return tuple(problems)

    def profile_problems(self, module: str, profile: AgentProfile, types: dict[str, HelperType], claimed: dict[str, str]) -> list[str]:
        problems: list[str] = []
        if profile.name in claimed:
            problems.append(f"the modules {claimed[profile.name]} and {module} both register the profile {profile.name}")
        claimed[profile.name] = module
        if PROFILE_NAME.fullmatch(profile.name) is None:
            problems.append(f"{profile.name} cannot name a profile: use letters, digits, dashes and underscores")
        if not profile.description.strip():
            problems.append(f"profile {profile.name} has no description")
        if not profile.body.strip():
            problems.append(f"profile {profile.name} has no body")
        if profile.agent_type not in types:
            problems.append(f"{profile.agent_type} is no agent type: no installed module registers it")
            return problems
        declared = types[profile.agent_type]
        if profile.access is Access.WRITING and declared.access is Access.READ:
            problems.append(f"profile {profile.name} asks for writing, and a {declared.label} only reads")
        return problems
