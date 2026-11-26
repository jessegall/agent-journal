<?php

declare(strict_types=1);

namespace App\Commands\Messages\SendMessage;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Messages\MessageSender;
use App\Exceptions\CrossProjectEdge;
use App\Exceptions\InboxUnavailable;
use App\Models\Agents\Agent;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Models\Messages\Message;
use App\Support\ActorReference;
use App\Support\InboxReceiver;
use App\Support\MessageParticipants;
use App\Support\Projects\ProjectEdges;

/**
 * Sends the message as the actor in hand, who must be attached to the inbox unless it is the journal itself; a target
 * must be a message of the same inbox, and an agent writes only to its own project's agents' personal inboxes.
 */
final readonly class SendMessageHandler implements CommandHandler
{
    public function __construct(private MessageParticipants $participants, private ProjectEdges $edges) {}

    /**
     * @throws InboxUnavailable
     * @throws CrossProjectEdge when an agent writes to the personal inbox of an agent of another project
     */
    public function handle(SendMessageCommand $command): string
    {
        $sender = $this->participants->sender($command->dispatchedBy());

        if (! InboxMember::isAttached($command->inboxId, ActorReference::of($sender))) {
            throw InboxUnavailable::forActor($command->inboxId);
        }

        $inbox = Inbox::findLockedById($command->inboxId);
        $this->assertSameProjectAsOwner($sender, $inbox);

        $target = $command->targetMessageNumber === null
            ? null
            : Message::query()->inInbox($inbox->id)->withNumber($command->targetMessageNumber)->firstOrFail();

        $number = $inbox->takeMessageNumber();

        return Message::create(new InboxReceiver($inbox), $number, $sender, $command->body, $target)->getKey();
    }

    /**
     * An agent writes only to the personal inbox of an agent of its own project; a user or a shared inbox is not
     * checked.
     *
     * @throws CrossProjectEdge
     */
    private function assertSameProjectAsOwner(MessageSender $sender, Inbox $inbox): void
    {
        $owner = $inbox->personalActor()->filter(fn (ActorReference $actor): bool => $actor->isAgent());

        if (! $sender instanceof Agent || $owner->isEmpty()) {
            return;
        }

        $ownerAgent = Agent::query()->findOrFail($owner->get()->id);
        $this->edges->assertJoinable($ownerAgent, $sender);
    }
}
