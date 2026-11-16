from core.modules.messages.effects.agent_text_effect import AgentTextEffect
from core.modules.messages.effects.message_delivery_effect import MessageDeliveryEffect
from core.modules.messages.effects.message_read_effect import MessageReadEffect
from core.modules.messages.effects.peer_message_effect import PeerMessageEffect
from core.modules.messages.effects.text_preceding_tool_effect import TextPrecedingToolEffect
from core.modules.messages.effects.transcript_sync_effect import TranscriptSyncEffect
from core.modules.messages.effects.typed_prompt_effect import TypedPromptEffect

MESSAGES_EFFECTS = [MessageDeliveryEffect, MessageReadEffect, AgentTextEffect, TextPrecedingToolEffect, TranscriptSyncEffect, TypedPromptEffect, PeerMessageEffect]
