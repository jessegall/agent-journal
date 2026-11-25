<?php

declare(strict_types=1);

namespace App\Commands\Messages\ReadMessage;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Exceptions\InboxUnavailable;
use App\Models\Inboxes\InboxMember;
use App\Models\Messages\Message;
use App\Models\Messages\MessageReadEntry;
use App\Support\ActorIdentity;
use App\Support\MessageParticipants;
use App\Support\ShownMessage;

/**
 * Returns the message to a reader attached to its inbox and records that reader's read.
 */
final readonly class ReadMessageHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock, private MessageParticipants $participants) {}

    /**
     * @throws InboxUnavailable
     */
    public function handle(ReadMessageCommand $command): ShownMessage
    {
        $reader = $this->participants->reader($command->dispatchedBy());
        $message = Message::query()->findOrFail($command->messageId);

        if (! InboxMember::isAttached($message->inbox_id, ActorIdentity::of($reader))) {
            throw InboxUnavailable::forActor($message->inbox_id);
        }

        MessageReadEntry::record($message, $reader, $this->clock->now());

        return ShownMessage::of($message);
    }
}
