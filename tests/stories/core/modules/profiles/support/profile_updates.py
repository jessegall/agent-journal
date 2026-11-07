from dataclasses import replace

from core.base.agent_type import AgentType
from core.base.module.module import Module
from core.base.profile.agent_profile import AgentProfile
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.skeleton_part import SkeletonPart

BASE_PROFILE = AgentProfile("module-reader", "Reads one question", "Read the files.", model="haiku")


class ProfileVersionOne(Module):
    name = "sample.profile-updates"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.agents", "journal.core.profiles"]
    profiles = [BASE_PROFILE]
    windows = [WindowDeclaration("profile-updates.editor", "Profiles", "profile list", WindowLoading.DOCUMENT, skeleton=[SkeletonPart.line()],
                                 reads=["profile list"], runs=["profile save"])]


class ProfileVersionTwo(ProfileVersionOne):
    profiles = [replace(BASE_PROFILE, description="Reads a changed question", body="Read the new files.", model="sonnet")]


class ProfileWorkerVersion(ProfileVersionOne):
    profiles = [replace(BASE_PROFILE, agent_type="worker")]


class ProfileRemoved(ProfileVersionOne):
    profiles = []


class ProfileNameCollision(ProfileVersionOne):
    profiles = [AgentProfile("critic", "The module critic", "Read the module instructions.")]


class ProfileCustomType(ProfileVersionOne):
    agent_types = [AgentType("clerk", "Clerk", extends="helper")]
    profiles = []
