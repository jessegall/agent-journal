<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Agents\Contracts\CurrentSession;
use App\Agents\Models\AgentSession;
use App\Communication\Commands\SelectMessage;
use App\Communication\Models\Message;
use App\Contracts\CommandHandler;

final readonly class SelectMessageHandler implements CommandHandler
{
    public function __construct(private CurrentSession $session) {}

    public function handle(SelectMessage $command): string
    {
        $message = Message::visibleById($command->messageId);
        $this->selectMessage($this->session->sessionId(), $message->id);

        return $message->id;
    }

    private function selectMessage(string $sessionId, string $messageId): void
    {
        AgentSession::query()->whereKey($sessionId)->update(['selected_message_id' => $messageId]);
    }
}
