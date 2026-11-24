<?php

declare(strict_types=1);

namespace App\Models\Messages;

use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Messages\MessageSent;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * One message in one inbox: its text, and the message it replies to when it is a reply. A message knows nothing of
 * how it is shown.
 *
 * @property string $id
 * @property string $inbox_id
 * @property string $body
 * @property string|null $target_message_id
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Fillable(['inbox_id', 'body', 'target_message_id'])]
final class Message extends Model implements EventSource
{
    use HasUlids;
    use RaisesEvents;

    /**
     * Sends a message into the inbox, as a reply to the target message when one is given.
     */
    public static function send(string $inboxId, string $body, string|null $targetMessageId = null): self
    {
        $message = self::query()->create([
            'inbox_id' => $inboxId,
            'body' => $body,
            'target_message_id' => $targetMessageId,
        ]);

        $message->raise(new MessageSent($message->id, $inboxId, $targetMessageId));

        return $message;
    }

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
}
