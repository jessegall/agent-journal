<?php

declare(strict_types=1);

namespace Domain\Chat\Listeners;

use App\Contracts\Bus\CommandBus;
use App\Contracts\Events\Listener;
use App\Events\Messages\MessageSent;
use Domain\Chat\Commands\CreateChatMessage\CreateChatMessageCommand;
use Domain\Chat\Enums\ChatMessageType;

/**
 * Every message sent into an inbox gets its chat message, so the chat of that inbox shows it.
 */
final readonly class ShowSentMessage implements Listener
{
    public function __construct(private CommandBus $commands) {}

    public function handle(MessageSent $event): void
    {
        $this->commands->run(new CreateChatMessageCommand($event->messageId, ChatMessageType::Message));
    }
}
