<?php

declare(strict_types=1);

namespace App\Models\Messages;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Messages\MessageParticipant;
use App\Contracts\Messages\MessageReceiver;
use App\Contracts\Messages\MessageSender;
use App\Contracts\Records\AuthoredModel;
use App\Contracts\Records\ReadableModel;
use App\Events\Messages\MessageSent;
use App\Models\Inboxes\Inbox;
use App\Models\Support\Accessor;
use App\Support\ActorIdentity;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $inbox_id
 * @property string $sender_type
 * @property string $sender_id
 * @property string $body
 * @property int $number
 * @property ?string $target_message_id
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property mixed $sender attribute
 * @property Inbox $inbox
 * @property Collection<int, MessageReadEntry>|MessageReadEntry[] $reads
 * @property Collection<int, Message>|Message[] $replies
 * @property ?Message $target
 */
final class Message extends Model implements AuthoredModel, EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    // ----------[ Constructors ]----------

    /**
     * Sends a message to the receiver, stored in its inbox under the number the sender took from the locked inbox, as
     * a reply to the target when one is given.
     */
    public static function create(
        MessageReceiver $to,
        int $number,
        MessageSender $from,
        string $body,
        self|null $target = null,
    ): self {
        $inbox = $to->inbox();

        $message = new self();
        $message->inbox_id = $inbox->id;
        $message->number = $number;
        $message->sender_type = $from->participantType();
        $message->sender_id = $from->participantId();
        $message->body = $body;
        $message->target_message_id = $target?->id;
        $message->assertSaved($message->save());

        $message->raise(
            new MessageSent($message->id, $inbox->id, $message->number, $target?->id, ActorIdentity::of($from)),
        );

        return $message;
    }

    public function author(): ActorIdentity
    {
        return $this->sender;
    }

    // ----------[ Accessors ]----------

    /**
     * Who sent the message.
     *
     * @return Attribute<ActorIdentity, never>
     */
    protected function sender(): Attribute
    {
        return Accessor::get(fn () => ActorIdentity::fromStored($this->sender_type, $this->sender_id));
    }

    // ----------[ Relations ]----------

    /**
     * The message this one replies to.
     *
     * @return BelongsTo<self, $this>
     */
    public function target(): BelongsTo
    {
        return $this->belongsTo(self::class, 'target_message_id');
    }

    /**
     * Every message that replies to this one.
     *
     * @return HasMany<self, $this>
     */
    public function replies(): HasMany
    {
        return $this->hasMany(self::class, 'target_message_id');
    }

    /**
     * The inbox the message is stored in.
     *
     * @return BelongsTo<Inbox, $this>
     */
    public function inbox(): BelongsTo
    {
        return $this->belongsTo(Inbox::class);
    }

    /**
     * Every read of the message.
     *
     * @return HasMany<MessageReadEntry, $this>
     */
    public function reads(): HasMany
    {
        return $this->hasMany(MessageReadEntry::class);
    }

    // ----------[ Scopes ]----------

    /**
     * Messages the reader has not read, sent by others into its inboxes since it joined them, in number order.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unreadBy(Builder $query, MessageParticipant $reader): void
    {
        $query->sinceJoinedBy($reader)
            ->whereNotSender($reader)
            ->whereNotReadBy($reader)
            ->orderBy('inbox_id')
            ->orderBy('number');
    }

    /**
     * Messages the reader read and has not answered, sent by others into inboxes it is still attached to.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unansweredBy(Builder $query, MessageParticipant $reader): void
    {
        $query->sinceJoinedBy($reader)
            ->whereNotSender($reader)
            ->whereReadBy($reader)
            ->whereNotRepliedBy($reader)
            ->orderBy('inbox_id')
            ->orderBy('number');
    }

    /**
     * Messages stored in one inbox.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inInbox(Builder $query, string $inboxId): void
    {
        $query->where('inbox_id', $inboxId);
    }

    /**
     * Messages of every inbox the actor is attached to now, its whole history included.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inInboxesOf(Builder $query, ActorIdentity $actor): void
    {
        $query->whereHas('inbox.members', fn (Builder $member) => $member->active()->ofActor($actor));
    }

    /**
     * Messages stored in an inbox the participant is attached to now, sent at or after it joined.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function sinceJoinedBy(Builder $query, MessageParticipant $participant): void
    {
        $query->whereHas('inbox.members', fn (Builder $member) => $member
            ->active()
            ->ofParticipant($participant)
            ->whereColumn('inbox_members.joined_at', '<=', 'messages.created_at'));
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function whereSender(Builder $query, MessageParticipant $sender): void
    {
        $query->where('sender_type', $sender->participantType())->where('sender_id', $sender->participantId());
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function whereNotSender(Builder $query, MessageParticipant $sender): void
    {
        $query->whereNot(fn (Builder $sent) => $sent->whereSender($sender));
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function whereReadBy(Builder $query, MessageParticipant $reader): void
    {
        $query->whereHas('reads', fn (Builder $read) => $read->ofReader($reader));
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function whereNotReadBy(Builder $query, MessageParticipant $reader): void
    {
        $query->whereDoesntHave('reads', fn (Builder $read) => $read->ofReader($reader));
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function whereNotRepliedBy(Builder $query, MessageParticipant $sender): void
    {
        $query->whereDoesntHave('replies', fn (Builder $reply) => $reply->whereSender($sender));
    }

    /**
     * The rows of the given number.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withNumber(Builder $query, int $number): void
    {
        $query->where('number', $number);
    }
}
