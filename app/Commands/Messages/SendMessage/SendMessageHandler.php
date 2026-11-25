<?php

declare(strict_types=1);

namespace App\Commands\Messages\SendMessage;

use App\Contracts\Bus\CommandHandler;
use App\Exceptions\InboxUnavailable;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Models\Messages\Message;
use App\Support\ActorIdentity;
use App\Support\InboxReceiver;
use App\Support\MessageParticipants;

/**
 * Sends the message as the actor in hand, who must be attached to the inbox unless it is the journal itself; a target
 * must be a message of the same inbox.
 */
final readonly class SendMessageHandler implements CommandHandler
{
    public function __construct(private MessageParticipants $participants) {}

    /**
     * @throws InboxUnavailable
     */
    public function handle(SendMessageCommand $command): string
    {
        $sender = $this->participants->sender($command->dispatchedBy());

        if (! InboxMember::isAttached($command->inboxId, ActorIdentity::of($sender))) {
            throw InboxUnavailable::forActor($command->inboxId);
        }

        $inbox = Inbox::findLockedById($command->inboxId);
        $target = $command->targetMessageNumber === null
            ? null
            : Message::query()->inInbox($inbox->id)->withNumber($command->targetMessageNumber)->firstOrFail();

        $number = $inbox->takeMessageNumber();

        return Message::create(new InboxReceiver($inbox), $number, $sender, $command->body, $target)->id;
    }
}
