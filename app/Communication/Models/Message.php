<?php

declare(strict_types=1);

namespace App\Communication\Models;

use App\Actors\Contracts\ActorVisibility;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Models\AgentSession;
use App\Assignments\Contracts\Assignable;
use App\Communication\Data\MessageReader;
use App\Communication\Enums\AgentInboxState;
use App\Communication\Enums\DismissalType;
use App\Communication\Enums\MessageState;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\Exceptions\MessageStateConflict;
use App\Communication\Models\Scopes\MessageVisibility;
use App\Communication\Support\AcceptedOperation;
use App\Communication\Support\InboxMembership;
use App\Communication\Support\MessageEnvelope;
use App\Communication\Support\RegisteredInboxes;
use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use App\Queries\Support\TextSearch;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Spatie\LaravelData\Optional;

/**
 * One message from one inbox to another: who wrote it, whether it waits for an answer, who first read it and how it
 * was closed. Every change that moves its state raises its state version, so a stale change is refused.
 *
 * @property string $id
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
 * @property string|null $closed_by_type
 * @property string|null $closed_by_id
 * @property CarbonImmutable|null $closed_at
 * @property DismissalType|null $dismissal_type
 * @property string|null $dismissal_reason
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Fillable([
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
])]
final class Message extends Model implements Assignable, Numbered, ReadableModel
{
    use BoundedReads, HasNumber, HasUlids, Linkable;

    public const string LINK_TYPE = 'communication.message';

    // ----------[ Constructors ]----------

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
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
     * A new message from its envelope, accepted under the bus receipt of the operation that sent it.
     */
    public static function record(
        MessageEnvelope $envelope,
        AcceptedOperation $operation,
        string|null $senderSessionId = null,
    ): self {
        $author = $envelope->author;
        $message = new self([
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
        $message->save();

        return $message;
    }

    // ----------[ Queries ]----------

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
        $this->read_participation_assignment_id = $membership->seatReference->id;
        $this->save();

        return true;
    }

    /**
     * The message now waits for an answer; asking again while it waits changes nothing.
     *
     * @throws MessageStateConflict
     */
    public function requireAnswer(): void
    {
        if ($this->needsReply()) {
            return;
        }

        $this->assertOpen();
        $this->state = MessageState::WaitingForAnswer;
        $this->is_question = true;
        $this->state_version++;
        $this->save();
    }

    /**
     * @throws MessageStateConflict
     */
    public function answerWith(self $reply, ActorIdentity $actor, CarbonImmutable $at): void
    {
        if (! $this->needsReply()) {
            throw MessageStateConflict::notWaiting($this->id);
        }

        $this->state = MessageState::Answered;
        $this->state_version++;
        $this->answer_message_id = $reply->id;
        $this->closeBy($actor, $at);
        $this->save();
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
        $this->save();
    }

    // ----------[ Answers ]----------

    public function revision(): int
    {
        return $this->state_version + 1;
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::LINK_TYPE, $this->id);
    }

    /**
     * The message's first line, the only text a link card shows of it, ending in … when the message goes on.
     */
    public function firstLine(): string
    {
        $line = strtok($this->body, "\n") ?: '';
        $preview = mb_strimwidth($line, 0, 80, '…');

        return $line === trim($this->body) || str_ends_with($preview, '…') ? $preview : $preview.'…';
    }

    public function isAtStateVersion(int $expected): bool
    {
        return $this->state_version === $expected;
    }

    public function author(): ActorIdentity
    {
        return new ActorIdentity(ActorType::from($this->sender_type), $this->sender_id);
    }

    /**
     * Who first read the message, absent until someone has.
     */
    public function firstRead(): MessageReader|Optional
    {
        $reader = $this->firstReader();

        if ($reader === null || $this->read_at === null) {
            return Optional::create();
        }

        return new MessageReader($reader->type->value, $reader->id, $this->read_at->toIso8601String());
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

    /**
     * The actor that first read the message, when it was read.
     */
    public function firstReader(): ActorIdentity|null
    {
        return $this->read_by_type === null || $this->read_by_id === null
            ? null
            : new ActorIdentity(ActorType::from($this->read_by_type), $this->read_by_id);
    }

    public function needsReply(): bool
    {
        return $this->state === MessageState::WaitingForAnswer;
    }

    public function isDismissed(): bool
    {
        return $this->state === MessageState::Dismissed;
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
    protected function forInboxState(Builder $messages, AgentInboxState $state): void
    {
        match ($state) {
            AgentInboxState::Pending => $messages->where(fn (Builder $pending) => $pending
                ->where('state', MessageState::WaitingForAnswer)
                ->orWhere(fn (Builder $unread) => $unread->whereNull('read_at')->where('state', MessageState::Sent))),
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
    protected function waitingForTakeUp(Builder $query, string $inboxId, int $limit): void
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
}
