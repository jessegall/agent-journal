<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Agents\Contracts\CurrentSession;
use App\Agents\Models\MessageSelection;
use App\Communication\Commands\SelectMessage;
use App\Communication\Models\Message;
use App\Contracts\CommandHandler;

final readonly class SelectMessageHandler implements CommandHandler
{
    public function __construct(private CurrentSession $session) {}

    public function handle(SelectMessage $command): string
    {
        $message = Message::visibleById($command->messageId);
        MessageSelection::select($this->session->sessionId(), $message->id);

        return $message->id;
    }
}
