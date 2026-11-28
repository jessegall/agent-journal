<?php

declare(strict_types=1);

namespace App\Messages\Commands\RetryDelivery;

use App\Bus\Contracts\CommandHandler;
use App\Exceptions\InboxUnavailable;
use App\Messages\MessageParticipants;
use App\Models\Messages\Message;
use App\Support\ActorReference;

/**
 * Only the message's own sender may queue it again; anyone else is refused as if the message were not there.
 */
final readonly class RetryDeliveryHandler implements CommandHandler
{
    public function __construct(private MessageParticipants $participants) {}

    /**
     * @throws InboxUnavailable
     */
    public function handle(RetryDeliveryCommand $command): void
    {
        $message = Message::query()->findOrFail($command->messageId);
        $sender = ActorReference::of($this->participants->sender($command->dispatchedBy()));

        if (! $message->sender->isSameAs($sender)) {
            throw InboxUnavailable::forActor($message->inbox_id);
        }

        $message->retryDelivery();
    }
}
