<?php

declare(strict_types=1);

namespace App\Messages\Commands\ReadMessage;

use App\Bus\Contracts\CommandHandler;
use App\Exceptions\InboxUnavailable;
use App\Messages\MessageParticipants;
use App\Messages\ShownMessage;
use App\Models\Inboxes\InboxMember;
use App\Models\Messages\Message;
use App\Models\Messages\MessageReadEntry;
use App\Support\ActorReference;
use App\Time\Contracts\ServerClock;

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

        if (! InboxMember::isAttached($message->inbox_id, ActorReference::of($reader))) {
            throw InboxUnavailable::forActor($message->inbox_id);
        }

        MessageReadEntry::create($message, $reader, $this->clock->now());

        return ShownMessage::of($message);
    }
}
