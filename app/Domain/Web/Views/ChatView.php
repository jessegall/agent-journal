<?php

declare(strict_types=1);

namespace App\Domain\Web\Views;

use App\Core\Agents\Contracts\SessionReader;
use App\Core\Agents\SessionOption;
use App\Domain\Chat\MessageRecords;
use App\Domain\Web\Data\ChatData;
use App\Domain\Web\Data\ConversationData;
use App\Domain\Web\Data\HomeFiltersData;

/**
 * Shapes the chat pane: the running sessions to talk to, read through Core, and the conversation with the chosen one
 * through Chat.
 */
final readonly class ChatView
{
    public function __construct(
        private SessionReader $sessions,
        private MessageRecords $messages,
    ) {}

    public function chat(HomeFiltersData $filters): ChatData
    {
        $sessions = $this->sessions->active();
        $chosen = array_values(array_filter($sessions, fn (SessionOption $session) => $filters->choosesSession($session->sessionId)));

        return ChatData::from([
            'sessions' => array_map(fn (SessionOption $session) => ['id' => (string) $session->sessionId, 'agentName' => $session->agentName], $sessions),
            'conversation' => ConversationData::optionalOrMissing($chosen === [] ? null : $this->messages->conversationWith($chosen[0]->target)),
        ]);
    }
}
