<?php

declare(strict_types=1);

namespace App\Models\Messages;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Messages\MessageDeliveryChanged;
use App\Events\Messages\MessageSent;
use App\Messages\Contracts\MessageParticipant;
use App\Messages\Contracts\MessageReceiver;
use App\Messages\Contracts\MessageSender;
use App\Models\Inboxes\Inbox;
use App\Models\Support\Accessor;
use App\Models\Support\JournalModel;
use App\Records\Contracts\AuthoredModel;
use App\Records\Contracts\ReadableModel;
use App\Support\ActorReference;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $inbox_id
 * @property string $sender_type
 * @property string $sender_id
 * @property string $body
 * @property int $number
 * @property string|null $target_message_id
 * @property CarbonImmutable|null $delivered_at
 * @property CarbonImmutable|null $delivery_failed_at
 * @property string|null $delivery_failure
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Inbox $inbox
 * @property-read Collection<int, MessageReadEntry> $reads
 * @property-read int|null $reads_count
 * @property-read Collection<int, Message> $replies
 * @property-read int|null $replies_count
 * @property-read mixed $sender
 * @property-read Message|null $target
 *
 * @mixin \Eloquent
 */
final class Message extends JournalModel implements AuthoredModel, EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'delivered_at' => 'immutable_datetime',
            'delivery_failed_at' => 'immutable_datetime',
        ];
    }

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
        $message->saveAndAssert();

        $message->raise(
            new MessageSent($message->id, $inbox->id, $message->number, $target?->id, ActorReference::of($from)),
        );

        return $message;
    }

    public function author(): ActorReference
    {
        return $this->sender;
    }

    // ----------[ Mutations ]----------

    /**
     * The message is in its agent's session now; a delivery is recorded once and never undone.
     */
    public function markDelivered(CarbonImmutable $at): void
    {
        if ($this->delivered_at !== null) {
            return;
        }

        $this->delivered_at = $at;
        $this->delivery_failed_at = null;
        $this->delivery_failure = null;
        $this->save();
        $this->raise(new MessageDeliveryChanged($this->id, $this->inbox_id));
    }

    /**
     * The delivery gave up for the reason, such as a start of the agent that was refused; a delivered message keeps
     * its delivery.
     */
    public function failDelivery(string $reason, CarbonImmutable $at): void
    {
        if ($this->delivered_at !== null) {
            return;
        }

        $this->delivery_failed_at = $at;
        $this->delivery_failure = $reason;
        $this->save();
        $this->raise(new MessageDeliveryChanged($this->id, $this->inbox_id));
    }

    /**
     * A retry queues the message again: its failure and reason are cleared.
     */
    public function retryDelivery(): void
    {
        $this->delivery_failed_at = null;
        $this->delivery_failure = null;
        $this->save();
        $this->raise(new MessageDeliveryChanged($this->id, $this->inbox_id));
    }

    // ----------[ Accessors ]----------

    /**
     * Who sent the message.
     *
     * @return Attribute<ActorReference, never>
     */
    protected function sender(): Attribute
    {
        return Accessor::get(fn () => ActorReference::fromStored($this->sender_type, $this->sender_id));
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
     * The reader's unread messages in each of the inboxes, counted in one query; an inbox with none is left out.
     *
     * @param  list<string>  $inboxIds
     * @return array<string, int>
     */
    public static function unreadCountsIn(array $inboxIds, MessageParticipant $reader): array
    {
        return self::query()->inInboxes($inboxIds)->unreadBy($reader)
            ->countUnreadPerInbox()
            ->limit(count($inboxIds))
            ->toBase()
            ->pluck('unread_count', 'inbox_id')
            ->map(fn (mixed $count): int => intval($count))
            ->all();
    }

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
    protected function inInboxesOf(Builder $query, ActorReference $actor): void
    {
        $query->whereHas('inbox.members', fn (Builder $member) => $member->active()->ofActor($actor));
    }

    /**
     * The messages that answer any of these.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $ids
     */
    #[Scope]
    protected function answering(Builder $query, array $ids): void
    {
        $query->whereIn('target_message_id', $ids);
    }

    /**
     * Messages neither delivered to their agent nor given up on yet.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function awaitingDelivery(Builder $query): void
    {
        $query->whereNull('delivered_at')->whereNull('delivery_failed_at');
    }

    /**
     * Messages stored in any of the inboxes.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $ids
     */
    #[Scope]
    protected function inInboxes(Builder $query, array $ids): void
    {
        $query->whereIn('inbox_id', $ids);
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

    /** @param  Builder<self>  $query */
    #[Scope]
    protected function countUnreadPerInbox(Builder $query): void
    {
        $query->reorder()->groupBy('inbox_id')->selectRaw('inbox_id, count(*) as unread_count');
    }
}
