<?php

declare(strict_types=1);

namespace App\Models\Messages;

use App\Concerns\BoundedReads;
use App\Concerns\HasNumber;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Actors\ActorVisibility;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Assignments\Assignable;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\Numbered;
use App\Contracts\Records\ReadableModel;
use App\Contracts\Sessions\CurrentSession;
use App\Data\Messages\MessageReader;
use App\Enums\ActorType;
use App\Enums\AgentInboxState;
use App\Enums\DismissalType;
use App\Enums\MessageState;
use App\Enums\MessageType;
use App\Events\ChatMessageAccepted;
use App\Events\MessageAnswered;
use App\Events\MessageAnswerRequired;
use App\Events\MessageDismissed;
use App\Events\MessageRead;
use App\Events\MessageSent;
use App\Exceptions\MessageMissing;
use App\Exceptions\MessageStateConflict;
use App\Models\Agents\AgentSession;
use App\Models\Chats\SpeechOpportunity;
use App\Models\Chats\TimelineEvent;
use App\Models\Scopes\MessageVisibility;
use App\Support\AcceptedOperation;
use App\Support\ActorIdentity;
use App\Support\ChatEnvelope;
use App\Support\InboxMembership;
use App\Support\MessageEnvelope;
use App\Support\PlacedChatEnvelope;
use App\Support\RecordIdentity;
use App\Support\RegisteredInboxes;
use App\Support\TextSearch;
use Carbon\CarbonImmutable;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Spatie\LaravelData\Optional;

/**
 * One message from one inbox to another: who wrote it, whether it waits for an answer, who first read it and how it
 * was closed. Every change that moves its state raises its state version, so a stale change is refused.
 *
 * @property string $id
 * @property MessageType $message_type
 * @property string $number_group_id
 * @property int $number
 * @property string $source_inbox_id
 * @property string $destination_inbox_id
 * @property string $sender_type
 * @property string $sender_id
 * @property string|null $sender_session_id
 * @property string $conversation_id
 * @property bool $is_question
 * @property string $body
 * @property MessageState $state
 * @property int $state_version
 * @property CarbonImmutable|null $read_at
 * @property string|null $read_by_type
 * @property string|null $read_by_id
 * @property string|null $read_participation_assignment_id
 * @property string $origin_receipt_id
 * @property string|null $reply_to_id
 * @property string|null $answer_message_id
 * @property string|null $timeline_event_id
 * @property string|null $addressee_type
 * @property string|null $addressee_id
 * @property string|null $respondent_type
 * @property string|null $respondent_id
 * @property string|null $user_root_id
 * @property string|null $request_key
 * @property string|null $request_digest
 * @property string|null $closed_by_type
 * @property string|null $closed_by_id
 * @property CarbonImmutable|null $closed_at
 * @property DismissalType|null $dismissal_type
 * @property string|null $dismissal_reason
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read int $timeline_position
 */
#[Fillable([
    'message_type',
    'source_inbox_id',
    'destination_inbox_id',
    'sender_type',
    'sender_id',
    'sender_session_id',
    'conversation_id',
    'is_question',
    'body',
    'state',
    'state_version',
    'origin_receipt_id',
    'reply_to_id',
    'timeline_event_id',
    'addressee_type',
    'addressee_id',
    'respondent_type',
    'respondent_id',
    'request_key',
    'request_digest',
])]
final class Message extends Model implements Assignable, EventSource, Numbered, ReadableModel
{
    use BoundedReads;
    use HasNumber;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    public const string LINK_TYPE = 'communication.message';

    // ----------[ Constructors ]----------

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'message_type' => MessageType::class,
            'state' => MessageState::class,
            'is_question' => 'boolean',
            'state_version' => 'integer',
            'read_at' => 'immutable_datetime',
            'closed_at' => 'immutable_datetime',
            'dismissal_type' => DismissalType::class,
            'created_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
        ];
    }

    public static function booted(): void
    {
        self::addGlobalScope(new MessageVisibility(
            static fn (): ActorVisibility => Container::getInstance()->make(ActorVisibility::class),
            static fn (): CurrentActor => Container::getInstance()->make(CurrentActor::class),
            static fn (): RegisteredInboxes => Container::getInstance()->make(RegisteredInboxes::class),
            static fn (): CurrentSession => Container::getInstance()->make(CurrentSession::class),
        ));
    }

    /**
     * A new desk message from its envelope, or a chat message at its timeline event, accepted under the bus receipt of
     * the operation that sent it.
     */
    public static function create(
        MessageEnvelope|PlacedChatEnvelope $envelope,
        AcceptedOperation $operation,
        string|null $senderSessionId = null,
    ): self {
        return $envelope instanceof PlacedChatEnvelope
            ? self::createChat($envelope->envelope, $envelope->event, $operation, $senderSessionId)
            : self::createDesk($envelope, $operation, $senderSessionId);
    }

    private static function createDesk(
        MessageEnvelope $envelope,
        AcceptedOperation $operation,
        string|null $senderSessionId,
    ): self {
        $author = $envelope->author;

        $message = new self([
            'message_type' => MessageType::Desk,
            'source_inbox_id' => $envelope->source->inboxId(),
            'destination_inbox_id' => $envelope->destination->inboxId(),
            ...$author->asColumns('sender'),
            'sender_session_id' => $senderSessionId,
            'body' => $envelope->body->text,
            'state' => $envelope->state,
            'is_question' => $envelope->state === MessageState::WaitingForAnswer,
            'state_version' => 0,
            'origin_receipt_id' => $operation->receiptId,
            'reply_to_id' => $envelope->replyToId,
        ]);

        $message->id = $message->newUniqueId();

        $message->conversation_id = $envelope->replyToId === null
            ? $message->id
            : self::query()->acrossInboxes()->findOrFail($envelope->replyToId)->conversation_id;

        $message->assertSaved($message->save());

        $message->raise(new MessageSent(
            $message->id,
            $author,
            $message->source_inbox_id,
            $message->destination_inbox_id,
        ));

        return $message;
    }

    /**
     * A new chat message at its timeline position, posted in and to the one chat inbox, under the bus receipt of the
     * operation that posted it. A user's message starts its own user root; any other inherits the envelope's.
     */
    private static function createChat(
        ChatEnvelope $envelope,
        TimelineEvent $event,
        AcceptedOperation $operation,
        string|null $senderSessionId,
    ): self {
        $author = $envelope->author;
        $inboxId = $envelope->inbox->inboxId();

        $message = new self([
            'message_type' => MessageType::Chat,
            'source_inbox_id' => $inboxId,
            'destination_inbox_id' => $inboxId,
            ...$author->asColumns('sender'),
            'sender_session_id' => $senderSessionId,
            'body' => $envelope->body->text,
            'state' => $envelope->state,
            'is_question' => $envelope->state === MessageState::WaitingForAnswer,
            'state_version' => 0,
            'origin_receipt_id' => $operation->receiptId,
            'reply_to_id' => $envelope->parent?->id,
            'timeline_event_id' => $event->id,
            'addressee_type' => $envelope->addressee?->type->value,
            'addressee_id' => $envelope->addressee?->id,
            'respondent_type' => $envelope->respondent?->type->value,
            'respondent_id' => $envelope->respondent?->id,
            'request_key' => $envelope->requestKey,
            'request_digest' => $envelope->digest(),
        ]);

        $message->id = $message->newUniqueId();
        $message->conversation_id = $envelope->parent === null ? $message->id : $envelope->parent->conversation_id;
        $message->user_root_id = $author->type->isUser() ? $message->id : $envelope->userRootId;

        $message->assertSaved($message->save());

        $message->raise(new ChatMessageAccepted($message->id, $author, $inboxId));

        return $message;
    }

    // ----------[ Queries ]----------

    /**
     * The chat message the author already posted in the inbox under the request key, once there is one.
     */
    public static function postedUnderKey(string $inboxId, ActorIdentity $author, string $requestKey): self|null
    {
        return self::query()
            ->acrossInboxes()
            ->where('destination_inbox_id', $inboxId)
            ->where('sender_type', $author->type->value)
            ->where('sender_id', $author->id)
            ->where('request_key', $requestKey)
            ->first();
    }

    /**
     * @return Builder<self>
     */
    public static function sourceConversation(string $sessionId): Builder
    {
        return self::query()->acrossInboxes()
            ->whereIn('id', AgentSession::jobSourceMessageIds($sessionId))
            ->select('conversation_id');
    }

    public static function visibleById(string $messageId): self
    {
        return self::query()->whereKey($messageId)->firstOr(fn () => throw MessageMissing::forId($messageId));
    }

    /**
     * The message under its row lock, for a change that must happen once.
     *
     * @throws MessageMissing
     */
    public static function lockedById(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->firstOr(fn () => throw MessageMissing::forId($id));
    }

    /**
     * The ids of the messages sent to any inbox outside the given ones, as a query to read them by.
     *
     * @param  Builder<*>  $ids
     * @return Builder<self>
     */
    public static function idsOutsideInboxes(Builder $ids): Builder
    {
        return self::query()->acrossInboxes()->whereNotIn('destination_inbox_id', $ids)->select('id');
    }

    // ----------[ Mutations ]----------

    /**
     * Keeps the first reader of the message and the seat it read through; a later read changes nothing. Reading
     * never moves the message's state, so its state version stays.
     */
    public function acknowledge(InboxMembership $membership, CarbonImmutable $at): bool
    {
        if ($this->read_at !== null) {
            return false;
        }

        $reader = $membership->actor;
        $this->read_at = $at;
        $this->read_by_type = $reader->type->value;
        $this->read_by_id = $reader->id;
        $this->read_participation_assignment_id = $membership->deskSeat()->id;
        $this->assertSaved($this->save());
        $this->raise(new MessageRead($this->id, $this->destination_inbox_id, $reader));

        return true;
    }

    /**
     * The message now waits for an answer; asking again while it waits changes nothing.
     *
     * @throws MessageStateConflict
     */
    public function requireAnswer(): void
    {
        if ($this->awaitsReply()) {
            return;
        }

        $this->assertOpen();
        $this->state = MessageState::WaitingForAnswer;
        $this->is_question = true;
        $this->state_version++;
        $this->assertSaved($this->save());
        $this->raise(new MessageAnswerRequired($this->id, $this->destination_inbox_id));
    }

    /**
     * @throws MessageStateConflict
     */
    public function answerWith(self $reply, ActorIdentity $actor, CarbonImmutable $at): void
    {
        if (! $this->awaitsReply()) {
            throw MessageStateConflict::notWaiting($this->id);
        }

        $this->state = MessageState::Answered;
        $this->state_version++;
        $this->answer_message_id = $reply->id;
        $this->closeBy($actor, $at);
        $this->assertSaved($this->save());
        $this->raise(new MessageAnswered($this->id, $reply->id, $actor));
    }

    /**
     * @throws MessageStateConflict
     */
    public function dismissBy(ActorIdentity $actor, DismissalType $type, string $reason, CarbonImmutable $at): void
    {
        $this->assertOpen();
        $this->state = MessageState::Dismissed;
        $this->state_version++;
        $this->dismissal_type = $type;
        $this->dismissal_reason = $reason;
        $this->closeBy($actor, $at);
        $this->assertSaved($this->save());
        $this->raise(new MessageDismissed($this->id, $actor, $type));
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::LINK_TYPE, $this->id);
    }

    /**
     * Whether the actor may settle this question: anyone may when it names no respondent, else only the one it names.
     */
    public function mayBeSettledBy(ActorIdentity $actor): bool
    {
        return $this->respondent_type === null
            || ($this->respondent_type === $actor->type->value && $this->respondent_id === $actor->id);
    }

    public function isChat(): bool
    {
        return $this->message_type->isChat();
    }

    public function hasDigest(string $digest): bool
    {
        return $this->request_digest !== null && hash_equals($this->request_digest, $digest);
    }

    public function isAtStateVersion(int $expected): bool
    {
        return $this->state_version === $expected;
    }

    public function isWrittenBy(ActorIdentity $actor): bool
    {
        return $this->sender_type === $actor->type->value && $this->sender_id === $actor->id;
    }

    public function isReplyBy(self $original, ActorIdentity $actor, string|null $sessionId): bool
    {
        return $this->reply_to_id === $original->id
            && $this->isWrittenBy($actor)
            && $this->sender_session_id === $sessionId;
    }

    public function awaitsReply(): bool
    {
        return $this->state === MessageState::WaitingForAnswer;
    }

    public function isDismissed(): bool
    {
        return $this->state === MessageState::Dismissed;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<int, never>
     */
    protected function revision(): Attribute
    {
        return Attribute::get(fn () => $this->state_version + 1);
    }

    /**
     * The message's first line, the only text a link card shows of it, ending in … when the message goes on.
     *
     * @return Attribute<string, never>
     */
    protected function firstLine(): Attribute
    {
        return Attribute::get(function () {
            $line = strtok($this->body, "\n") ?: '';
            $preview = mb_strimwidth($line, 0, 80, '…');

            return $line === trim($this->body) || str_ends_with($preview, '…') ? $preview : $preview.'…';
        });
    }

    /**
     * @return Attribute<ActorIdentity, never>
     */
    protected function author(): Attribute
    {
        return Attribute::get(
            fn () => new ActorIdentity(ActorType::from($this->sender_type), $this->sender_id),
        )->withoutObjectCaching();
    }

    /**
     * Who first read the message, absent until someone has.
     *
     * @return Attribute<MessageReader|Optional, never>
     */
    protected function firstRead(): Attribute
    {
        return Attribute::get(function () {
            $reader = $this->firstReader;

            if ($reader === null || $this->read_at === null) {
                return Optional::create();
            }

            return new MessageReader($reader->type->value, $reader->id, $this->read_at->toIso8601String());
        })->withoutObjectCaching();
    }

    /**
     * The actor that first read the message, when it was read.
     *
     * @return Attribute<ActorIdentity|null, never>
     */
    protected function firstReader(): Attribute
    {
        return Attribute::get(fn () => $this->read_by_type === null || $this->read_by_id === null
            ? null
            : new ActorIdentity(ActorType::from($this->read_by_type), $this->read_by_id))->withoutObjectCaching();
    }

    /**
     * The timeline position a row read with its position carries.
     *
     * @return Attribute<int, never>
     */
    protected function timelinePosition(): Attribute
    {
        return Attribute::get(fn () => (int) $this->getAttribute('timeline_sequence'));
    }

    // ----------[ Internals ]----------

    /**
     * @throws MessageStateConflict
     */
    private function assertOpen(): void
    {
        if ($this->state->isClosed()) {
            throw MessageStateConflict::closed($this->id);
        }
    }

    private function closeBy(ActorIdentity $actor, CarbonImmutable $at): void
    {
        $this->closed_by_type = $actor->type->value;
        $this->closed_by_id = $actor->id;
        $this->closed_at = $at;
    }

    /**
     * The receipts of the outer message held by the reader's active interval, for a where-exists.
     *
     * @param  Builder<self>  $outer
     */
    private static function activeReceiptsOf(
        QueryBuilder $receipts,
        Builder $outer,
        ActorIdentity $reader,
    ): QueryBuilder {
        return $receipts->selectRaw('1')
            ->from('message_receipts')
            ->join('inbox_intervals', 'inbox_intervals.id', '=', 'message_receipts.interval_id')
            ->whereColumn('message_receipts.message_id', $outer->qualifyColumn('id'))
            ->whereNull('inbox_intervals.left_at')
            ->where('inbox_intervals.actor_type', $reader->type->value)
            ->where('inbox_intervals.actor_id', $reader->id);
    }

    // ----------[ Scopes ]----------

    /**
     * Every inbox's messages, for the journal's own work on a message it already holds: it lifts the visibility limit.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function acrossInboxes(Builder $query): void
    {
        $query->withoutGlobalScope(MessageVisibility::class);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function matchingBody(Builder $query, string $words): void
    {
        TextSearch::narrow($query, 'body', $words);
    }

    /**
     * @param  Builder<self>  $messages
     */
    #[Scope]
    protected function forInboxState(Builder $messages, AgentInboxState $state, ActorIdentity $reader): void
    {
        match ($state) {
            AgentInboxState::Pending => $messages->pendingFor($reader),
            AgentInboxState::Answered => $messages->where('state', MessageState::Answered),
            AgentInboxState::All => $messages,
        };
    }

    /**
     * The inbox's waiting messages, oldest first, locked for this transaction; rows another transaction holds are
     * skipped rather than waited for.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function waitingForClaim(Builder $query, string $inboxId, int $limit): void
    {
        $query->where('destination_inbox_id', $inboxId)
            ->where('state', MessageState::WaitingForAnswer)
            ->orderBy('created_at')
            ->orderBy('id')
            ->limit($limit)
            ->lock('for update skip locked');
    }

    /**
     * Messages either way between two inboxes.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function betweenInboxes(Builder $query, string $firstInboxId, string $secondInboxId): void
    {
        $query->where(fn (Builder $pair) => $pair
            ->where(fn (Builder $ways) => $ways->fromInbox($firstInboxId)->toInbox($secondInboxId))
            ->orWhere(fn (Builder $ways) => $ways->fromInbox($secondInboxId)->toInbox($firstInboxId)));
    }

    /**
     * Messages an inbox sent or received.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofInbox(Builder $query, string $inboxId): void
    {
        $query->where(fn (Builder $either) => $either->fromInbox($inboxId)->orWhere('destination_inbox_id', $inboxId));
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function fromInbox(Builder $query, string $inboxId): void
    {
        $query->where('source_inbox_id', $inboxId);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function toInbox(Builder $query, string $inboxId): void
    {
        $query->where('destination_inbox_id', $inboxId);
    }

    /**
     * Messages sent before the cursor message, by creation time and then id.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function olderThan(Builder $query, self $cursor): void
    {
        $query->where(fn (Builder $before) => $before
            ->where('created_at', '<', $cursor->created_at)
            ->orWhere(fn (Builder $same) => $same
                ->where('created_at', $cursor->created_at)
                ->where('id', '<', $cursor->id)));
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofType(Builder $query, MessageType $type): void
    {
        $query->where($query->qualifyColumn('message_type'), $type);
    }

    /**
     * Chat rows the reader holds a receipt of through the interval it is active in now.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function receivedNowBy(Builder $query, ActorIdentity $reader): void
    {
        $query->whereExists(fn ($receipts) => self::activeReceiptsOf($receipts, $query, $reader));
    }

    /**
     * Chat rows the reader received through its active interval and has not been shown yet.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unpresentedTo(Builder $query, ActorIdentity $reader): void
    {
        $query->whereExists(fn ($receipts) => self::activeReceiptsOf($receipts, $query, $reader)
            ->whereNull('message_receipts.presented_at'));
    }

    /**
     * Chat questions whose answer is kept as the reader's open turn to speak.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function reservedTo(Builder $query, ActorIdentity $reader): void
    {
        $query->where($query->qualifyColumn('state'), MessageState::WaitingForAnswer)
            ->whereIn($query->qualifyColumn('id'), SpeechOpportunity::query()
                ->openFor($reader)
                ->whereNotNull('reserved_question_id')
                ->select('reserved_question_id'));
    }

    /**
     * Messages the reader has not read: desk mail nobody read yet, and chat rows not yet shown to the reader.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unreadBy(Builder $query, ActorIdentity $reader): void
    {
        $query->where(fn (Builder $unread) => $unread
            ->where(fn (Builder $desk) => $desk->ofType(MessageType::Desk)->whereNull('read_at'))
            ->orWhere(fn (Builder $chat) => $chat->ofType(MessageType::Chat)->unpresentedTo($reader)));
    }

    /**
     * Questions waiting on the reader: any desk question, and chat questions kept for the reader's turn.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function waitingFor(Builder $query, ActorIdentity $reader): void
    {
        $query->where(fn (Builder $waiting) => $waiting
            ->where(fn (Builder $desk) => $desk
                ->ofType(MessageType::Desk)
                ->where('state', MessageState::WaitingForAnswer))
            ->orWhere(fn (Builder $chat) => $chat->ofType(MessageType::Chat)->reservedTo($reader)));
    }

    /**
     * What waits for the reader: what it has not read and the questions waiting on it.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function pendingFor(Builder $query, ActorIdentity $reader): void
    {
        $query->where(fn (Builder $pending) => $pending->unreadBy($reader)->orWhere(
            fn (Builder $waiting) => $waiting->waitingFor($reader),
        ));
    }

    /**
     * Chat rows with the timeline position they were accepted at, read as timeline_sequence.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withTimelinePosition(Builder $query): void
    {
        $query
            ->join('inbox_timeline_events', 'inbox_timeline_events.id', '=', $query->qualifyColumn('timeline_event_id'))
            ->select($query->qualifyColumn('*'))
            ->addSelect('inbox_timeline_events.sequence as timeline_sequence');
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function beforePosition(Builder $query, int $sequence): void
    {
        $query->where('inbox_timeline_events.sequence', '<', $sequence);
    }

    /**
     * The questions of an inbox still waiting for the named respondent.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function waitingOnRespondent(Builder $query, string $inboxId, ActorIdentity $respondent): void
    {
        $query->where('destination_inbox_id', $inboxId)
            ->where('state', MessageState::WaitingForAnswer)
            ->where('respondent_type', $respondent->type->value)
            ->where('respondent_id', $respondent->id);
    }
}
