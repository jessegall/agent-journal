<?php

declare(strict_types=1);

namespace App\Commands\Messages\ReadUnreadMessages;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Models\Messages\Message;
use App\Models\Messages\MessageReadEntry;
use App\Support\MessageParticipants;
use App\Support\ShownMessage;
use App\Support\ShownMessages;

/**
 * Returns the reader's unread messages and records a read of each one it returns, and only of those.
 */
final readonly class ReadUnreadMessagesHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock, private MessageParticipants $participants) {}

    public function handle(ReadUnreadMessagesCommand $command): ShownMessages
    {
        $reader = $this->participants->reader($command->dispatchedBy());
        $messages = Message::query()->unreadBy($reader)->limit(ReadUnreadMessagesCommand::LIMIT)->get();
        $at = $this->clock->now();

        foreach ($messages as $message) {
            MessageReadEntry::record($message, $reader, $at);
        }

        return new ShownMessages($messages->map(ShownMessage::of(...))->values()->all());
    }
}
