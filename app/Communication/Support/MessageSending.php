<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Actors\Support\AttentionOrigin;
use App\Agents\Contracts\CurrentSession;
use App\Bus\Support\AcceptedReceipt;
use App\Communication\Commands\AskMessage;
use App\Communication\Commands\SendMessage;
use App\Communication\Contracts\Inbox;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Events\MessageSent;
use App\Communication\Exceptions\AnswerImpossible;
use App\Communication\Exceptions\InboxUnavailable;
use App\Communication\Models\Message;
use Closure;
use Illuminate\Contracts\Events\Dispatcher;

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
        private Dispatcher $events,
        private CurrentSession $session,
    ) {}

    public function send(SendMessage $command): string
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

    public function ask(AskMessage $command): string
    {
        return $this->question(
            $command->sourceInboxId,
            $command->destinationInboxId,
            $command->body,
            $command->dispatchedBy(),
        )->id;
    }

    public function question(string $sourceInboxId, string $destinationInboxId, string $body, ActorContext $actor): Message
    {
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
     */
    private function deliver(
        string $sourceInboxId,
        string $destinationInboxId,
        ActorContext $author,
        Closure $envelope,
    ): Message {
        $source = $this->inboxes->resolve($sourceInboxId);
        $destination = $this->inboxes->resolve($destinationInboxId);
        $this->lockShared([$source, $destination]);
        $this->requireSource($source, $author);
        $message = Message::record(
            $envelope($source, $destination, ActorIdentity::of($author)),
            new AcceptedOperation($this->accepted->requireFor(self::class)),
            $author->type->isAgent() && $this->session->hasSession() ? $this->session->sessionId() : null,
        );
        $this->attention->requestFor($destination, AttentionOrigin::message($message->id, $message->origin_receipt_id));
        $this->events->dispatch(new MessageSent(
            $message->id,
            ActorIdentity::of($author),
            $source->inboxId(),
            $destination->inboxId(),
        ));

        return $message;
    }

    private function requireSource(Inbox $source, ActorContext $author): void
    {
        if ($author->type === ActorType::System
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
