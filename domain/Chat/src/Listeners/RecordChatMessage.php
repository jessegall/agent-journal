<?php

declare(strict_types=1);

namespace Domain\Chat\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Events\Listener;
use App\Events\Messages\MessageSent;
use App\Models\Messages\Message;
use Domain\Chat\Commands\CreateChatMessage\CreateChatMessageCommand;
use Domain\Chat\Enums\ChatMessageType;
use Domain\Chat\Support\Emoji;

/**
 * Every message sent into an inbox shows in its chat, in the same transaction; a reply whose whole body is one emoji
 * shows as a reaction on the message it answers.
 */
#[InCommandTransaction]
final readonly class RecordChatMessage implements Listener
{
    public function __construct(private CommandBus $commands) {}

    public function handle(MessageSent $event): void
    {
        $message = Message::query()->findOrFail($event->messageId);
        $type = $event->targetMessageId !== null && Emoji::isOne($message->body)
            ? ChatMessageType::Reaction
            : ChatMessageType::Message;

        $this->commands->run(new CreateChatMessageCommand(
            $event->inboxId,
            Message::LINK_TYPE,
            $event->messageId,
            $type,
        ));
    }
}
