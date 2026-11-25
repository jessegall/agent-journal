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
use App\Contracts\Records\ReadableModel;
use App\Events\Messages\MessageRead;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
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
final class MessageReadEntry extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    public $timestamps = false;

    public const string CREATED_AT = 'read_at';

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

    public static function create(Message $message, MessageSender&MessageReceiver $reader, CarbonImmutable $at): void
    {
        $entry = self::query()->ofMessages([$message->id])->ofReader($reader)->first();

        if ($entry === null) {
            $entry = new self();
            $entry->message_id = $message->id;
            $entry->reader_type = $reader->participantType();
            $entry->reader_id = $reader->participantId();
            $entry->read_at = $at;
            $entry->last_read_at = $at;
            $entry->assertSaved($entry->save());
        }

        if ($entry->wasRecentlyCreated) {
            $entry->raise(new MessageRead($message->id, $message->inbox_id, ActorIdentity::of($reader)));

            return;
        }

        $entry->last_read_at = $at;
        $entry->save();
    }

    // ----------[ Relations ]----------

    /**
     * Records the reader's read of the message: the first read raises MessageRead, a later one only moves its last
     * read time.
     */
    /**
     * @return BelongsTo<Message, $this>
     */
    public function message(): BelongsTo
    {
        return $this->belongsTo(Message::class);
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
