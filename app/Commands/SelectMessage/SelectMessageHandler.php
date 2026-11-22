<?php

declare(strict_types=1);

namespace App\Commands\SelectMessage;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Sessions\CurrentSession;
use App\Exceptions\ChatMessageRefused;
use App\Models\AgentSession;
use App\Models\Message;

final readonly class SelectMessageHandler implements CommandHandler
{
    public function __construct(private CurrentSession $session) {}

    public function handle(SelectMessageCommand $command): string
    {
        $message = Message::visibleById($command->messageId);

        if ($message->isChat()) {
            throw ChatMessageRefused::notSelectable($message->id);
        }

        $this->selectMessage($this->session->sessionId(), $message->id);

        return $message->id;
    }

    private function selectMessage(string $sessionId, string $messageId): void
    {
        AgentSession::query()->whereKey($sessionId)->update(['selected_message_id' => $messageId]);
    }
}
