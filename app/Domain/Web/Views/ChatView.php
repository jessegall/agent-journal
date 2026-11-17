<?php

declare(strict_types=1);

namespace App\Domain\Web\Views;

use App\Core\Agents\Models\AgentSession;
use App\Core\Hooks\Storage\StackTarget;
use App\Domain\Chat\MessageRecords;
use App\Domain\Web\Data\ChatData;
use App\Domain\Web\Data\ConversationData;
use App\Domain\Web\Data\HomeFiltersData;

/**
 * Shapes the chat pane: the running sessions to talk to, and the conversation with the chosen one through Chat.
 */
final readonly class ChatView
{
    public function __construct(private MessageRecords $messages) {}

    public function chat(HomeFiltersData $filters): ChatData
    {
        $sessions = AgentSession::query()->with('agent')->get()->filter(fn (AgentSession $session) => $session->isActive());
        $conversation = $sessions
            ->filter(fn (AgentSession $session) => $filters->choosesSession($session->id))
            ->map(fn (AgentSession $session) => $this->messages->conversationWith(new StackTarget($session->agent_id, $session->id)))
            ->first();

        return ChatData::from([
            'sessions' => $sessions->map(fn (AgentSession $session) => ['id' => (string) $session->id, 'agentName' => $session->agent->name])->values()->all(),
            'conversation' => ConversationData::optionalOrMissing($conversation),
        ]);
    }
}
