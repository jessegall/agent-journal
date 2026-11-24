<?php

declare(strict_types=1);

namespace App\Commands\Messages\ReadUnreadMessages;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Data\Messages\MessageView;
use App\Models\Messages\Message;
use App\Models\Messages\MessageReadEntry;
use App\Support\MessageParticipants;

/**
 * Returns the reader's unread messages and records a read of each one it returns, and only of those.
 */
final readonly class ReadUnreadMessagesHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock, private MessageParticipants $participants) {}

    /**
     * @return list<MessageView>
     */
    public function handle(ReadUnreadMessagesCommand $command): array
    {
        $reader = $this->participants->reader($command->dispatchedBy());
        $messages = Message::query()->unreadBy($reader)->limit(ReadUnreadMessagesCommand::LIMIT)->get();
        $at = $this->clock->now();

        foreach ($messages as $message) {
            MessageReadEntry::record($message, $reader, $at);
        }

        return $messages->map(MessageView::of(...))->values()->all();
    }
}
