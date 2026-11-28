<?php

declare(strict_types=1);

namespace App\Models\Messages;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Messages\MessageRead;
use App\Messages\Contracts\MessageParticipant;
use App\Messages\Contracts\MessageReceiver;
use App\Messages\Contracts\MessageSender;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use App\Support\ActorReference;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $message_id
 * @property string $reader_type
 * @property string $reader_id
 * @property CarbonImmutable $read_at
 * @property CarbonImmutable $last_read_at
 * @property-read Message $message
 *
 * @mixin \Eloquent
 */
final class MessageReadEntry extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    public const string CREATED_AT = 'read_at';

    public $timestamps = false;

    protected $table = 'message_reads';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'read_at' => 'immutable_datetime',
            'last_read_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Records the reader's read of the message: the first read raises MessageRead, a later one only moves its last
     * read time.
     */
    public static function create(Message $message, MessageSender&MessageReceiver $reader, CarbonImmutable $at): void
    {
        $entry = self::findOfReader($message, $reader);

        if ($entry === null) {
            $entry = new self();
            $entry->message_id = $message->id;
            $entry->reader_type = $reader->participantType();
            $entry->reader_id = $reader->participantId();
            $entry->read_at = $at;
            $entry->last_read_at = $at;
            $entry->saveAndAssert();
        }

        if ($entry->wasRecentlyCreated) {
            $entry->raise(new MessageRead($message->id, $message->inbox_id, ActorReference::of($reader)));

            return;
        }

        $entry->last_read_at = $at;
        $entry->save();
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<Message, $this>
     */
    public function message(): BelongsTo
    {
        return $this->belongsTo(Message::class);
    }

    // ----------[ Queries ]----------

    /**
     * The reader's entry for the message; none before the first read.
     */
    public static function findOfReader(Message $message, MessageSender&MessageReceiver $reader): self|null
    {
        return self::query()->ofMessages([$message->id])->ofReader($reader)->first();
    }

    // ----------[ Scopes ]----------

    /**
     * The reader's most recent read, the message it read last.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function latestOf(Builder $query, MessageParticipant $reader): void
    {
        $query->ofReader($reader)->orderByDesc('last_read_at')->orderByDesc('id');
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofReader(Builder $query, MessageParticipant $reader): void
    {
        $query->where('reader_type', $reader->participantType())->where('reader_id', $reader->participantId());
    }

    /**
     * The reads by anyone but the reader.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function notOfReader(Builder $query, MessageParticipant $reader): void
    {
        $query->whereNot(fn (Builder $read) => $read->ofReader($reader));
    }

    /**
     * The rows of any of the given messages.
     *
     * @param  Builder<self>  $query
     * @param  array<array-key, string>|Builder<covariant Model>|Closure  $ids
     */
    #[Scope]
    protected function ofMessages(Builder $query, array|Builder|Closure $ids): void
    {
        $query->whereIn('message_id', $ids);
    }

    /**
     * The rows with their message loaded.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withMessage(Builder $query): void
    {
        $query->with('message');
    }
}
