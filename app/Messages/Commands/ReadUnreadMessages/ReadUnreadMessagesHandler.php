<?php

declare(strict_types=1);

namespace App\Messages\Commands\ReadUnreadMessages;

use App\Bus\Contracts\CommandHandler;
use App\Messages\MessageParticipants;
use App\Messages\ShownMessage;
use App\Messages\ShownMessages;
use App\Models\Messages\Message;
use App\Models\Messages\MessageReadEntry;
use App\Time\Contracts\ServerClock;

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
            MessageReadEntry::create($message, $reader, $at);
        }

        $shown = $messages->map(ShownMessage::of(...))->all();

        return new ShownMessages(array_values($shown));
    }
}
