<?php

declare(strict_types=1);

namespace Domain\Chat\Readers;

use App\Agents\Contracts\SessionReader;
use App\Agents\Support\SessionOption;
use App\Ui\Contracts\PageReader;
use Domain\Chat\Contracts\ConversationReader;
use Domain\Chat\Data\ChatData;
use Domain\Chat\Data\ConversationData;
use Domain\Chat\Http\Requests\ConversationRequest;
use PhpOption\Option;
use Spatie\LaravelData\Optional;

/**
 * The chat window, on Home and on its own page: the agent sessions the user can talk to now, and the conversation
 * with the chosen one when it is still active.
 */
final readonly class ChatWindowReader implements PageReader
{
    public function __construct(
        private ConversationRequest $request,
        private SessionReader $sessions,
        private ConversationReader $messages,
    ) {}

    public function read(): ChatData
    {
        $sessions = $this->sessions->active();
        $chosen = $this->request->chosenSession()->flatMap(
            fn (string $sessionId) => Option::fromArraysValue(array_values(array_filter($sessions, fn (SessionOption $session) => $session->sessionId === $sessionId)), 0),
        );

        return ChatData::from([
            'sessions' => array_map(fn (SessionOption $session) => ['id' => (string) $session->sessionId, 'agentName' => $session->agentName], $sessions),
            'conversation' => $chosen->map(fn (SessionOption $session) => ConversationData::fromConversation($this->messages->conversationWith($session->target)))->getOrElse(Optional::create()),
        ]);
    }
}
