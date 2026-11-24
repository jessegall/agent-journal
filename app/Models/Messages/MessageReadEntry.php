<?php

declare(strict_types=1);

namespace App\Models\Messages;

use App\Contracts\Messages\MessageParticipant;
use App\Contracts\Messages\MessageReceiver;
use App\Contracts\Messages\MessageSender;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Messages\MessageRead;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One actor read one message: when it first read it and when it last read it.
 *
 * @property string $id
 * @property string $message_id
 * @property string $reader_type
 * @property string $reader_id
 * @property CarbonImmutable $read_at
 * @property CarbonImmutable $last_read_at
 */
#[Fillable(['message_id', 'reader_type', 'reader_id', 'read_at', 'last_read_at'])]
final class MessageReadEntry extends Model implements EventSource
{
    use HasUlids;
    use RaisesEvents;

    public $timestamps = false;

    protected $table = 'message_reads';

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['read_at' => 'immutable_datetime', 'last_read_at' => 'immutable_datetime'];
    }

    public static function record(Message $message, MessageSender&MessageReceiver $reader, CarbonImmutable $at): void
    {
        $entry = self::query()->firstOrCreate(
            [
                'message_id' => $message->id,
                'reader_type' => $reader->participantType(),
                'reader_id' => $reader->participantId(),
            ],
            ['read_at' => $at, 'last_read_at' => $at],
        );

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
        $query->whereReader($reader)->orderByDesc('last_read_at')->orderByDesc('id');
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function whereReader(Builder $query, MessageParticipant $reader): void
    {
        $query->where('reader_type', $reader->participantType())->where('reader_id', $reader->participantId());
    }
}
