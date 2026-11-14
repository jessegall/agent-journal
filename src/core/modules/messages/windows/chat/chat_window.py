from engine.viewer.window import Window
from core.modules.messages.support.skeletons import MESSAGES_CHAT_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_priority import WindowPriority
from engine.viewer.choice_option import ChoiceOption
from engine.viewer.toggle_option import ToggleOption
from core.modules.messages.windows.chat.keys.messages_key import MessagesKey
from core.modules.messages.windows.chat.keys.marks_key import MarksKey
from core.modules.messages.windows.chat.keys.docks_key import DocksKey
from core.modules.messages.windows.chat.keys.pins_key import PinsKey
from core.modules.messages.windows.chat.keys.mark_motion_key import MarkMotionKey
from core.modules.messages.windows.chat.keys.voice_profile_key import VoiceProfileKey
from core.modules.messages.windows.chat.keys.voice_avatar_key import VoiceAvatarKey
from core.modules.messages.windows.chat.keys.voice_avatar_shown_key import VoiceAvatarShownKey
from core.modules.messages.windows.chat.keys.tool_key import ToolKey
from core.modules.messages.windows.chat.keys.main_agent_key import MainAgentKey
from core.modules.messages.windows.chat.keys.dock_key import DockKey
from core.modules.messages.windows.chat.keys.output_key import OutputKey
from core.modules.messages.windows.chat.keys.run_key import RunKey
from core.modules.messages.windows.chat.keys.question_key import QuestionKey


class ChatWindow(Window):
    """The Chat window."""

    name = "messages.chat"
    title = "Chat"
    entry = "chat.js"
    loading = WindowLoading.COMPONENT
    request_priority = WindowPriority.FIRST
    skeleton = MESSAGES_CHAT_SKELETON
    icon = WindowIcon.SPEECH
    reads = ["question show", "link list", "link receipts", "task show", "message feed", "message show", "chat-mark main", "chat-mark show", "dock-item main", "dock-item read", "process card", "pin list", "agent main", "usage tool", "hook-call feed", "output peek", "output page", "output list", "process-part list", "setting show"]
    runs = ["message send", "message reply", "message comment", "message react", "message edit", "message delete", "link remove", "pin make", "pin close", "agent type", "dump make", "dock remove", "dock keep", "dock unkeep", "developer record-mark-motion"]
    events = ["message.*", "chat_mark.*", "dock_item.*", "pin.*", "hook_call.*", "process_part.*", "setting.*", "question.*"]
    options = [ChoiceOption("figure", "Figure", [("voice", "The voice I chose"), ("none", "None"), ("butler", "Butler"), ("homie", "Homie"), ("coach", "Coach"), ("colleague", "Colleague"), ("squire", "Squire")], "voice"),
                                          ToggleOption("floors", "Show floors")]
    keys = [MessagesKey, MarksKey, DocksKey, PinsKey, MarkMotionKey, VoiceProfileKey, VoiceAvatarKey, VoiceAvatarShownKey, ToolKey, MainAgentKey, DockKey, OutputKey, RunKey, QuestionKey]
