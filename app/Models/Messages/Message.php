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
use App\Enums\ActorType;
use App\Events\Messages\MessageSent;
use App\Models\Inboxes\Inbox;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * One message in one inbox: who sent it, its text, and the message it replies to when it is a reply. A message knows
 * nothing of how it is shown.
 *
 * @property string $id
 * @property string $inbox_id
 * @property string $sender_type
 * @property string $sender_id
 * @property string $body
 * @property int $number
 * @property string|null $target_message_id
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Fillable([
    'inbox_id',
    'number',
    'sender_type',
    'sender_id',
    'body',
    'target_message_id',
])]
final class Message extends Model implements AuthoredModel, EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    public const string LINK_TYPE = 'communication.message';

    // ----------[ Constructors ]----------

    /**
     * Sends a message to the receiver, stored in its inbox under the inbox's next number, as a reply to the target
     * when one is given; the inbox's row is locked, so two sends never take the same number.
     */
    public static function create(
        MessageReceiver $to,
        MessageSender $from,
        string $body,
        self|null $target = null,
    ): self {
        $inbox = Inbox::lockedById($to->inbox()->id);
        $message = self::query()->create([
            'inbox_id' => $inbox->id,
            'number' => $inbox->takeMessageNumber(),
            'sender_type' => $from->participantType(),
            'sender_id' => $from->participantId(),
            'body' => $body,
            'target_message_id' => $target?->id,
        ]);

        $message->raise(new MessageSent($message->id, $inbox->id, $message->number, $target?->id, ActorIdentity::of($from)));

        return $message;
    }

    // ----------[ Getters ]----------

    /**
     * Who sent the message.
     */
    public function sender(): ActorIdentity
    {
        return new ActorIdentity(ActorType::from($this->sender_type), $this->sender_id);
    }

    public function author(): ActorIdentity
    {
        return $this->sender();
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
        $query->sinceJoinedBy($reader)->whereNotSender($reader)->whereNotReadBy($reader)->orderBy('inbox_id')->orderBy('number');
    }

    /**
     * Messages the reader read and has not answered, sent by others into inboxes it is still attached to.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unansweredBy(Builder $query, MessageParticipant $reader): void
    {
        $query
            ->sinceJoinedBy($reader)
            ->whereNotSender($reader)
            ->whereReadBy($reader)
            ->whereNotRepliedBy($reader)
            ->orderBy('inbox_id')
            ->orderBy('number');
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
        $query->whereHas('reads', fn (Builder $read) => $read->whereReader($reader));
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function whereNotReadBy(Builder $query, MessageParticipant $reader): void
    {
        $query->whereDoesntHave('reads', fn (Builder $read) => $read->whereReader($reader));
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function whereNotRepliedBy(Builder $query, MessageParticipant $sender): void
    {
        $query->whereDoesntHave('replies', fn (Builder $reply) => $reply->whereSender($sender));
    }
}
