from engine.viewer.window import Window
from core.modules.messages.support.skeletons import MESSAGES_AVATAR_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from core.modules.messages.windows.avatar.keys.voice_profile_key import VoiceProfileKey
from core.modules.messages.windows.avatar.keys.voice_avatar_key import VoiceAvatarKey
from core.modules.messages.windows.avatar.keys.voice_avatar_visible_key import VoiceAvatarVisibleKey
from core.modules.messages.windows.avatar.keys.tool_key import ToolKey


class AvatarWindow(Window):
    """The Avatar window."""

    name = "messages.avatar"
    title = "Avatar"
    entry = "avatar.js"
    loading = WindowLoading.COMPONENT
    skeleton = MESSAGES_AVATAR_SKELETON
    icon = WindowIcon.SPEECH
    reads = ["setting show", "usage tool", "hook-call feed", "dock-item main", "process-part list"]
    events = ["hook_call.*", "dock_item.*", "process_part.*", "setting.*"]
    keys = [VoiceProfileKey, VoiceAvatarKey, VoiceAvatarVisibleKey, ToolKey]
