from collections.abc import Sequence
from dataclasses import MISSING, fields, replace

from engine.errors.refusal import Refusal
from engine.profile.agent_profile import AgentProfile

INHERITED_FIELDS = ("access", "program", "fallback_programs", "model", "codex_model", "tier", "mcp_tools", "writable_folders", "program_models", "skills", "required_skills")
UNSET_VALUES = {field.name: field.default_factory() if field.default is MISSING else field.default for field in fields(AgentProfile) if field.name in INHERITED_FIELDS}


class ProfileBases:
    """Builds each profile on the base profile it names: the body is the body of the base followed by its own
    lines, and each setting it leaves unset is the setting of its base, unless the profile names it in
    default_fields. A base that is not registered, or bases that lead back to the profile, are refused."""

    def __init__(self, profiles: Sequence[AgentProfile]) -> None:
        self.profiles = {profile.name: profile for profile in profiles}

    def problem(self, profile: AgentProfile) -> str:
        chain = [profile.name]
        current = profile
        while current.base:
            if current.base in chain:
                return f"the bases of profile {profile.name} lead back to it: {' -> '.join([*chain, current.base])}"
            if current.base not in self.profiles:
                return f"profile {current.name} names the base {current.base}, which no module registers"
            current = self.profiles[current.base]
            chain.append(current.name)
        return ""

    def built(self) -> tuple[AgentProfile, ...]:
        for profile in self.profiles.values():
            problem = self.problem(profile)
            if problem:
                raise Refusal(problem, "name a registered profile as the base, and never let two profiles name each other")
        return tuple(self.on_base(profile) for profile in self.profiles.values())

    def on_base(self, profile: AgentProfile) -> AgentProfile:
        if not profile.base:
            return profile
        base = self.on_base(self.profiles[profile.base])
        inherited = {name: getattr(base, name) for name in INHERITED_FIELDS if name not in profile.default_fields and getattr(profile, name) == UNSET_VALUES[name]}
        body = "\n\n".join(part for part in (base.body.strip(), profile.body.strip()) if part)
        required = tuple(dict.fromkeys((*base.required_skills, *profile.required_skills)))
        return replace(profile, body=body, **{**inherited, "required_skills": required})
