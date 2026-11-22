<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\AskMessage\AskMessageCommand;
use App\Commands\SendMessage\SendMessageCommand;
use App\Contracts\AgentDirectory;
use App\Contracts\CurrentSession;
use App\Contracts\Inbox;
use App\Contracts\InboxResolver;
use App\Exceptions\AnswerImpossible;
use App\Exceptions\ChatInboxRefused;
use App\Exceptions\InboxUnavailable;
use App\Exceptions\SessionOutdated;
use App\Models\InboxRecord;
use App\Models\Message;
use Closure;

/**
 * The one path every message takes: both inboxes locked in a fixed order, the author's membership of the source,
 * the message recorded under the accepted receipt, the destination's members asked to look, and the fact after
 * commit.
 */
final readonly class MessageSending
{
    public function __construct(
        private InboxResolver $inboxes,
        private AcceptedReceipt $accepted,
        private InboxAttention $attention,
        private CurrentSession $session,
        private AgentDirectory $agents,
    ) {}

    public function send(SendMessageCommand $command): string
    {
        return $this->deliver(
            $command->sourceInboxId,
            $command->destinationInboxId,
            $command->dispatchedBy(),
            fn (Inbox $source, Inbox $destination, ActorIdentity $author) => MessageEnvelope::send(
                $source,
                $destination,
                $author,
                MessageBody::from($command->body),
            ),
        )->id;
    }

    /**
     * @throws SessionOutdated when the user saw a session the agent no longer runs
     */
    public function ask(AskMessageCommand $command): string
    {
        if ($command->seenSession !== null) {
            $seen = $command->seenSession;
            $this->agents->visibleAgent($seen->agentId)->assertRuns($seen->sessionId, $seen->generation);
        }

        return $this->question(
            $command->sourceInboxId,
            $command->destinationInboxId,
            $command->body,
            $command->dispatchedBy(),
        )->id;
    }

    public function question(
        string $sourceInboxId,
        string $destinationInboxId,
        string $body,
        ActorContext $actor,
    ): Message {
        return $this->deliver(
            $sourceInboxId,
            $destinationInboxId,
            $actor,
            function (Inbox $source, Inbox $destination, ActorIdentity $author) use ($body): MessageEnvelope {
                if ($this->inboxes->membersOf($destination) === []) {
                    throw AnswerImpossible::forInbox($destination->inboxId());
                }

                return MessageEnvelope::ask($source, $destination, $author, MessageBody::from($body));
            },
        );
    }

    /**
     * Answers a message from its destination inbox back to its source inbox, written by the given author.
     */
    public function reply(Message $original, string $body, ActorContext $author): Message
    {
        return $this->deliver(
            $original->destination_inbox_id,
            $original->source_inbox_id,
            $author,
            fn (Inbox $source, Inbox $destination, ActorIdentity $author) => MessageEnvelope::reply(
                $source,
                $destination,
                $author,
                MessageBody::from($body),
                $original->id,
            ),
        );
    }

    /**
     * @param  Closure(Inbox, Inbox, ActorIdentity): MessageEnvelope  $envelope
     *
     * @throws InboxUnavailable
     * @throws ChatInboxRefused
     */
    private function deliver(
        string $sourceInboxId,
        string $destinationInboxId,
        ActorContext $author,
        Closure $envelope,
    ): Message {
        foreach ([$sourceInboxId, $destinationInboxId] as $inboxId) {
            if (InboxRecord::isChatInbox($inboxId)) {
                throw ChatInboxRefused::forDeskPosting($inboxId);
            }
        }

        $source = $this->inboxes->resolve($sourceInboxId);
        $destination = $this->inboxes->resolve($destinationInboxId);
        $this->lockShared([$source, $destination]);
        $this->assertSourceAccess($source, $author);

        $message = Message::create(
            $envelope($source, $destination, ActorIdentity::of($author)),
            new AcceptedOperation($this->accepted->requireFor(self::class)),
            $author->type->isAgent() && $this->session->hasSession() ? $this->session->sessionId() : null,
        );

        $this->attention->requestFor($destination, AttentionOrigin::message($message->id, $message->origin_receipt_id));

        return $message;
    }

    private function assertSourceAccess(Inbox $source, ActorContext $author): void
    {
        if (ActorIdentity::of($author)->isSameAs(ActorIdentity::system())
            && $source->inboxId() === $this->inboxes->named(InboxNotices::SYSTEM_INBOX)->inboxId()) {
            return;
        }

        $this->inboxes->accessFor($source)->membership($source, $author);
    }

    /**
     * Shared locks on both inboxes, always in order of their ids.
     *
     * @param  list<Inbox>  $inboxes
     */
    private function lockShared(array $inboxes): void
    {
        usort($inboxes, fn (Inbox $first, Inbox $second) => strcmp($first->inboxId(), $second->inboxId()));

        foreach ($inboxes as $inbox) {
            $this->inboxes->accessFor($inbox)->lockShared($inbox);
        }
    }
}
