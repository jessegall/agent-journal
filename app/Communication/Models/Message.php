<?php

declare(strict_types=1);

namespace App\Communication\Models;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Support\DriverReceipt;
use App\Communication\Enums\DismissalType;
use App\Communication\Enums\MessageState;
use App\Communication\Enums\MessageWorkState;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\Exceptions\MessageStateConflict;
use App\Communication\Models\Scopes\MessageVisibility;
use App\Communication\States\Support\AnsweringMessageStateReference;
use App\Communication\Support\MessageEnvelope;
use App\Communication\Support\MessageWork;
use App\Hooks\Contracts\WorkedOnStack;
use App\Hooks\Decisions\StateReference;
use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One message from one actor to another (doc 27 revision 5, section 7). Only its sender and its recipient read it;
 * each change of where it stands is one method here, and an answered or dismissed message never changes again.
 *
 * @property string $id
 * @property string $number_group_id
 * @property int $number
 * @property string $body
 * @property MessageState $state
 * @property ActorType $sender_type
 * @property string $sender_id
 * @property ActorType $recipient_type
 * @property string $recipient_id
 * @property string|null $reply_to_id
 * @property string|null $answer_message_id
 * @property CarbonImmutable|null $read_at
 * @property ActorType|null $closed_by_type
 * @property string|null $closed_by_id
 * @property CarbonImmutable|null $closed_at
 * @property DismissalType|null $dismissal_type
 * @property string|null $dismissal_reason
 * @property string|null $wake_request_id
 * @property int|null $wake_sequence
 * @property string $submission_key
 * @property string $submission_hash
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Fillable([
    'body',
    'sender_type',
    'sender_id',
    'recipient_type',
    'recipient_id',
    'reply_to_id',
    'submission_key',
    'submission_hash',
])]
final class Message extends Model implements Numbered, ReadableModel, WorkedOnStack
{
    use BoundedReads;
    use HasNumber;
    use HasUlids;
    use Linkable;

    public const string LINK_TYPE = 'communication.message';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'state' => MessageState::class,
            'sender_type' => ActorType::class,
            'recipient_type' => ActorType::class,
            'closed_by_type' => ActorType::class,
            'dismissal_type' => DismissalType::class,
            'read_at' => 'immutable_datetime',
            'closed_at' => 'immutable_datetime',
            'created_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
        ];
    }

    protected static function booted(): void
    {
        static::addGlobalScope(new MessageVisibility(
            static fn (): CurrentActor => Container::getInstance()->make(CurrentActor::class),
        ));
    }

    /**
     * A new message as its envelope describes it, sent and not yet read.
     */
    public static function record(MessageEnvelope $envelope): self
    {
        $message = new self([
            'body' => $envelope->body->text,
            'sender_type' => $envelope->sender->type,
            'sender_id' => $envelope->sender->id,
            'recipient_type' => $envelope->recipient->type,
            'recipient_id' => $envelope->recipient->id,
            'reply_to_id' => $envelope->replyToId,
            'submission_key' => $envelope->submission->key,
            'submission_hash' => $envelope->submission->hash,
        ]);
        $message->state = MessageState::Sent;
        $message->save();

        return $message;
    }

    /**
     * The message a sender stored under a submission key, if any; read past the visibility scope, since it is the
     * sender's own key that is looked up.
     */
    public static function submittedBy(ActorIdentity $sender, string $submissionKey): self|null
    {
        return self::query()
            ->withoutGlobalScope(MessageVisibility::class)
            ->where('sender_type', $sender->type->value)
            ->where('sender_id', $sender->id)
            ->where('submission_key', $submissionKey)
            ->first();
    }

    /**
     * The message read under its row lock, among those the actor may see, for a change that must happen once. A
     * message the actor may not see is missing, the same as one that does not exist.
     */
    public static function lockedById(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->first() ?? throw MessageMissing::forId($id);
    }

    /**
     * The one read that looks past the visibility scope: a user inspecting the journal reads every message. It marks
     * nothing read.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inspectedByUser(Builder $query): void
    {
        Container::getInstance()->make(CurrentActor::class)->actor()->requireUser();

        $query->withoutGlobalScope(MessageVisibility::class);
    }

    /**
     * @return BelongsTo<self, $this>
     */
    public function replyTo(): BelongsTo
    {
        return $this->belongsTo(self::class, 'reply_to_id');
    }

    /**
     * @return BelongsTo<self, $this>
     */
    public function answer(): BelongsTo
    {
        return $this->belongsTo(self::class, 'answer_message_id');
    }

    public function sender(): ActorIdentity
    {
        return new ActorIdentity($this->sender_type, $this->sender_id);
    }

    public function recipient(): ActorIdentity
    {
        return new ActorIdentity($this->recipient_type, $this->recipient_id);
    }

    /**
     * The message's first line, the only text a link card shows of it.
     */
    public function firstLine(): string
    {
        return mb_strimwidth(strtok($this->body, "\n") ?: '', 0, 80, '…');
    }

    /**
     * The recipient now owes an answer; asking again while it is owed changes nothing.
     *
     * @throws MessageStateConflict
     */
    public function requireAnswer(): void
    {
        if ($this->state === MessageState::WaitingForAnswer) {
            return;
        }
        $this->refuseWhenClosed();
        $this->state = MessageState::WaitingForAnswer;
        $this->save();
    }

    /**
     * The recipient read the message; the first read time is kept. Answers whether this read changed it.
     */
    public function markRead(CarbonInterface $at): bool
    {
        if ($this->read_at !== null) {
            return false;
        }
        $this->read_at = CarbonImmutable::instance($at);
        $this->save();

        return true;
    }

    /**
     * @throws MessageStateConflict
     */
    public function answerWith(self $reply, ActorIdentity $by): void
    {
        $this->refuseWhenClosed();
        $this->state = MessageState::Answered;
        $this->answer_message_id = $reply->id;
        $this->closeBy($by);
        $this->save();
    }

    /**
     * @throws MessageStateConflict
     */
    public function dismissBy(ActorIdentity $by, DismissalType $type, string $reason): void
    {
        $this->refuseWhenClosed();
        $this->state = MessageState::Dismissed;
        $this->dismissal_type = $type;
        $this->dismissal_reason = $reason;
        $this->closeBy($by);
        $this->save();
    }

    /**
     * Keeps the wake the message asked of its recipient's program, so its sender can read how far it got; a recipient
     * with no running program has none.
     */
    public function recordWake(DriverReceipt|null $wake): void
    {
        if ($wake === null) {
            return;
        }
        $this->wake_request_id = $wake->requestId;
        $this->wake_sequence = $wake->sequence;
        $this->save();
    }

    /**
     * The state a frame holds while the question is answered.
     */
    public function workState(): StateReference
    {
        return AnsweringMessageStateReference::forMessage($this);
    }

    public function work(): MessageWork
    {
        return new MessageWork($this->number, MessageWorkState::of($this->state));
    }

    private function closeBy(ActorIdentity $by): void
    {
        $this->closed_by_type = $by->type;
        $this->closed_by_id = $by->id;
        $this->closed_at = CarbonImmutable::now();
    }

    /**
     * @throws MessageStateConflict
     */
    private function refuseWhenClosed(): void
    {
        if ($this->state === MessageState::Answered || $this->state === MessageState::Dismissed) {
            throw MessageStateConflict::forMessage($this->number, $this->state->value);
        }
    }
}
